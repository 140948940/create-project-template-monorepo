// 轻量级的命令行参数解析引擎
import minimist from "minimist";

/** nodejs模块——fs模块：fs模块用于对系统文件及目录进行读写操作 */
import _fs from "fs";
/* nodejs模块：提供文件路径相关api */
import { join, resolve, dirname } from "path";
// url解析
import { fileURLToPath } from "url";
// console样式
import chalk from "chalk";

/**
 * Semantic Version 版本命名规范，提供以下等功能
 * 1. 比较两个版本号的大小
 * 2. 验证某个版本号是否合法
 * 3. 提取版本号，例如从“=v1.2.1”体取出"1.2.1"
 * 4.分析版本号是否属于某个范围或符合一系列条件
 */
import semver from "semver";
/**
 * enquirer: 用户友好、直观且易于创建的时尚CLI提示。
 * CLI（command-line interface，命令行界面）是指可在用户提示符下键入可执行指令的界面
 */
import enquirer from "enquirer";

/* 用于执行外部程序 例如：git */
import { execa } from "execa";
// 串联执行promise
import pSeries from "p-series";
//
import { globby } from "globby";

const { prompt } = enquirer;
const fs = _fs.promises;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const args = minimist(process.argv.slice(2));
let {
  skipBuild,
  tag: optionTag,
  dry: isDryRun,
  skipCleanCheck: skipCleanGitCheck,
} = args;

const EXPECTED_BRANCH = "main";

const incrementVersion = (increment) =>
  semver.inc(currentVersion, increment, preId);
/**
 * @param bin {string}
 * @param args {string}
 * @param opts {import('execa').CommonOptions<string>}
 * @returns
 */
const run = (bin, args, opts = {}) =>
  execa(bin, args, { stdio: "inherit", ...opts });
const dryRun = (bin, args, opts = {}) =>
  console.log(chalk.blue(`[dryrun] ${bin} ${args.join(" ")}`), opts);
const runIfNotDry = isDryRun ? dryRun : run;
const step = (msg) => console.log(chalk.cyan(msg));

async function main() {
  if (!skipCleanGitCheck) {
    const isDirtyGit = !!(
      await run("git", ["status", "--porcelain"], { stdio: "pipe" })
    ).stdout;

    if (isDirtyGit) {
      console.log(chalk.red(`Git repo isn't clean.`));
      return;
    }

    const currentBranch = (
      await run("git", ["branch", "--show-current"], { stdio: "pipe" })
    ).stdout;

    if (currentBranch !== EXPECTED_BRANCH) {
      console.log(
        chalk.red(
          `You should be on branch "${EXPECTED_BRANCH}" but are on "${currentBranch}"`
        )
      );
      return;
    }
  } else {
    console.log(chalk.bold.white(`Skipping git checks...`));
  }

  if (!skipCleanGitCheck) {
    const isOutdatedRE = new RegExp(
      `\\W${EXPECTED_BRANCH}\\W.*(?:fast-forwardable|local out of date)`,
      "i"
    );

    const isOutdatedGit = isOutdatedRE.test(
      (await run("git", ["remote", "show", "origin"], { stdio: "pipe" })).stdout
    );

    if (isOutdatedGit) {
      console.log(chalk.red(`Git branch is not in sync with remote`));
      return;
    }
  }

  const changedPackages = await getChangedPackages();
  if (!changedPackages.length) {
    console.log(chalk.red(`No packages have changed since last release`));
    return;
  }

  if (isDryRun) {
    console.log("\n" + chalk.bold.blue("This is a dry run") + "\n");
  }

  // NOTE: I'm unsure if this would mess up the changelog
  // const { pickedPackages } = await prompt({
  //   type: 'multiselect',
  //   name: 'pickedPackages',
  //   messages: 'What packages do you want to release?',
  //   choices: changedPackages.map((pkg) => pkg.name),
  // })

  const packagesToRelease = changedPackages;
  // const packagesToRelease = changedPackages.filter((pkg) =>
  //   pickedPackages.includes(pkg.name)
  // )

  step(
    `Ready to release ${packagesToRelease
      .map(({ name }) => chalk.bold.white(name))
      .join(", ")}`
  );

  const pkgWithVersions = await pSeries(
    packagesToRelease.map(({ name, path, pkg }) => async () => {
      let { version } = pkg;

      const prerelease = semver.prerelease(version);
      const preId = prerelease && prerelease[0];

      const versionIncrements = [
        "patch",
        "minor",
        "major",
        ...(preId ? ["prepatch", "preminor", "premajor", "prerelease"] : []),
      ];

      const { release } = await prompt({
        type: "select",
        name: "release",
        message: `Select release type for ${chalk.bold.white(name)}`,
        choices: versionIncrements
          .map((i) => `${i}: ${name} (${semver.inc(version, i, preId)})`)
          .concat(["custom"]),
      });

      if (release === "custom") {
        version = (
          await prompt({
            type: "input",
            name: "version",
            message: `Input custom version (${chalk.bold.white(name)})`,
            initial: version,
          })
        ).version;
      } else {
        version = release.match(/\((.*)\)/)[1];
      }

      if (!semver.valid(version)) {
        throw new Error(`invalid target version: ${version}`);
      }

      return { name, path, version, pkg };
    })
  );

  const { yes: isReleaseConfirmed } = await prompt({
    type: "confirm",
    name: "yes",
    message: `Releasing \n${pkgWithVersions
      .map(
        ({ name, version }) =>
          `  · ${chalk.white(name)}: ${chalk.yellow.bold("v" + version)}`
      )
      .join("\n")}\nConfirm?`,
  });

  if (!isReleaseConfirmed) {
    return;
  }

  step("\nUpdating versions in package.json files...");
  await updateVersions(pkgWithVersions);

  step("\nGenerating changelogs...");
  for (const pkg of pkgWithVersions) {
    step(` -> ${pkg.name} (${pkg.path})`);
    await runIfNotDry(`pnpm`, ["run", "changelog"], { cwd: pkg.path });
    await runIfNotDry(`pnpm`, ["exec", "prettier", "--write", "CHANGELOG.md"], {
      cwd: pkg.path,
    });
    await fs.copyFile(
      resolve(__dirname, "../LICENSE"),
      resolve(pkg.path, "LICENSE")
    );
  }

  const { yes: isChangelogCorrect } = await prompt({
    type: "confirm",
    name: "yes",
    message: "Are the changelogs correct?",
  });

  if (!isChangelogCorrect) {
    return;
  }

  step("\nBuilding all packages...");
  if (!skipBuild && !isDryRun) {
    await run("pnpm", ["run", "build"]);
    await run("pnpm", ["run", "build:dts"]);
  } else {
    console.log(`(skipped)`);
  }

  const { stdout } = await run("git", ["diff"], { stdio: "pipe" });
  if (stdout) {
    step("\nCommitting changes...");
    await runIfNotDry("git", [
      "add",
      "packages/*/CHANGELOG.md",
      "packages/*/package.json",
    ]);
    await runIfNotDry("git", [
      "commit",
      "-m",
      `release: ${pkgWithVersions
        .map(({ name, version }) => `${name}@${version}`)
        .join(" ")}`,
    ]);
  } else {
    console.log("No changes to commit.");
  }

  step("\nCreating tags...");
  let versionsToPush = [];
  for (const pkg of pkgWithVersions) {
    const tagName =
      pkg.name === "${template---name}"
        ? `v${pkg.version}`
        : `${pkg.name}@${pkg.version}`;
    versionsToPush.push(`refs/tags/${tagName}`);
    await runIfNotDry("git", ["tag", `${tagName}`]);
  }

  step("\nPublishing packages...");
  for (const pkg of pkgWithVersions) {
    await publishPackage(pkg);
  }

  step("\nPushing to Github...");
  await runIfNotDry("git", ["push", "origin", ...versionsToPush]);
  await runIfNotDry("git", ["push"]);
}

/**
 *
 * @param packageList {{ name: string; path: string; version: string, pkg: any }}
 */
async function updateVersions(packageList) {
  return Promise.all(
    packageList.map(({ pkg, version, path, name }) => {
      pkg.version = version;
      updateDeps(pkg, "dependencies", packageList);
      updateDeps(pkg, "peerDependencies", packageList);
      const content = JSON.stringify(pkg, null, 2) + "\n";
      return isDryRun
        ? dryRun("write", [name], {
            dependencies: pkg.dependencies,
            peerDependencies: pkg.peerDependencies,
          })
        : fs.writeFile(join(path, "package.json"), content);
    })
  );
}

function updateDeps(pkg, depType, updatedPackages) {
  const deps = pkg[depType];
  if (!deps) return;
  step(`Updating ${chalk.bold(depType)} for ${chalk.bold.white(pkg.name)}...`);
  Object.keys(deps).forEach((dep) => {
    const updatedDep = updatedPackages.find((pkg) => pkg.name === dep);
    // avoid updated peer deps that are external like @vue/devtools-api
    if (dep && updatedDep) {
      console.log(
        chalk.yellow(
          `${pkg.name} -> ${depType} -> ${dep}@~${updatedDep.version}`
        )
      );
      deps[dep] = ">=" + updatedDep.version;
    }
  });
}

async function publishPackage(pkg) {
  step(`Publishing ${pkg.name}...`);

  try {
    await runIfNotDry(
      "pnpm",
      [
        "publish",
        ...(optionTag ? ["--tag", optionTag] : []),
        "--access",
        "public",
        "--publish-branch",
        EXPECTED_BRANCH,
        ...(skipCleanGitCheck ? ["--no-git-checks"] : []),
      ],
      {
        cwd: pkg.path,
        stdio: "pipe",
      }
    );
    console.log(
      chalk.green(`Successfully published ${pkg.name}@${pkg.version}`)
    );
  } catch (e) {
    if (e.stderr.match(/previously published/)) {
      console.log(chalk.red(`Skipping already published: ${pkg.name}`));
    } else {
      throw e;
    }
  }
}

/**
 * Get the packages that have changed. Based on `lerna changed` but without lerna.
 *
 * @returns {Promise<{ name: string; path: string; pkg: any; version: string }[]}
 */
// 获取有过变化的Package
// async function getChangedPackages() {
//   let lastTag

//   try {
//     const { stdout } = await run('git', ['describe', '--tags', '--abbrev=0'], {
//       stdio: 'pipe',
//     })
//     lastTag = stdout
//   } catch (error) {
//     // maybe there are no tags
//     console.error(`Couldn't get the last tag, using first commit...`)
//     const { stdout } = await run(
//       'git',
//       ['rev-list', '--max-parents=0', 'HEAD'],
//       { stdio: 'pipe' }
//     )
//     lastTag = stdout
//   }
//   const folders = await globby((join(__dirname, '../index.mjs').replace(/\\/g,'/')), {
//     onlyFiles: false,
//   })

//   const pkgs = await Promise.all(
//     folders.map(async folder => {
//       if (!(await fs.lstat(folder)).isDirectory()) return null

//     })
//   )

//   return pkgs.filter(p => p)
// }
async function getChangedPackages() {
  let lastTag

  try {
    const { stdout } = await run('git', ['describe', '--tags', '--abbrev=0'], {
      stdio: 'pipe',
    })
    lastTag = stdout
  } catch (error) {
    // maybe there are no tags
    console.error(`Couldn't get the last tag, using first commit...`)
    const { stdout } = await run(
      'git',
      ['rev-list', '--max-parents=0', 'HEAD'],
      { stdio: 'pipe' }
    )
    lastTag = stdout
  }
  const pkg = JSON.parse(await fs.readFile(join("../", "package.json")));
  // 如果包不是私有包
  if (!pkg.private) {
    const { stdout: hasChanges } = await run(
      "git",
      [
        "diff",
        lastTag,
        // 
        "--",
        // // apparently {src,package.json} doesn't work
        join("../templates"),
        join("../utils"),
        join("../index.mjs"),
      ],
      { stdio: "pipe" }
    );

    if (hasChanges) {
      return {
        path: '../',
        name: pkg.name,
        version: pkg.version,
        pkg,
      };
    } else {
      return null;
    }
  }
  return [pkg];
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
