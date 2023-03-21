#!/usr/bin/env node

import * as fs from "fs";
import * as path from "path";
import prompts from "prompts";
import { red, green, bold } from "kolorist";
import {emptyDir} from './utils/emptyDir.mjs'
import * as banners from "./utils/banners.mjs";
import { copyFolderWithReplacement } from "./utils/copyFolderWithReplacement.mjs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
let targetDir = process.argv.slice(2)[0]
function isValidPackageName(projectName) {
  return /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(
    projectName
  );
}
function toValidPackageName(projectName) {
  return projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/^[._]/, "")
    .replace(/[^a-z0-9-~]+/g, "-");
}

function canSkipEmptying(dir) {
  if (!fs.existsSync(dir)) {
    return true;
  }

  const files = fs.readdirSync(dir);
  if (files.length === 0) {
    return true;
  }
  if (files.length === 1 && files[0] === ".git") {
    return true;
  }

  return false;
}

async function init() {
  console.log();
  console.log(
    process.stdout.isTTY && process.stdout.getColorDepth() > 8
      ? banners.gradientBanner
      : banners.defaultBanner
  );
  console.log();

  const cwd = process.cwd();
  // possible options:
  // --default
  // --typescript / --ts
  // --jsx
  // --router / --vue-router
  // --pinia
  // --with-tests / --tests (equals to `--vitest --cypress`)
  // --vitest
  // --cypress
  // --playwright
  // --eslint
  // --eslint-with-prettier (only support prettier through eslint for simplicity)
  // --force (for force overwriting)


  const defaultProjectName = "project-template";

  // const forceOverwrite = argv.force;
  const forceOverwrite = false

  let result = {};

  try {
    result = await prompts(
      [
        {
          name: "projectName",
          type: targetDir ? null : "text",
          message: "Project name:",
          initial: defaultProjectName,
          // 项目名输入
          onState: (state) =>
            (targetDir = String(state.value).trim() || defaultProjectName),
          validate: (dir) =>
            isValidPackageName(dir) || "Invalid package.json name",
        },
        {
          // 文件夹非空白
          name: "shouldOverwrite",
          type: () =>
            canSkipEmptying(targetDir) || forceOverwrite ? null : "confirm",
          message: () => {
            const dirForPrompt =
              targetDir === "."
                ? "Current directory"
                : `Target directory "${targetDir}"`;

            return `${dirForPrompt} is not empty. Remove existing files and continue?`;
          },
        },
        // 这个配置定义了一个名为 overwriteChecker 的提示，它的类型是一个函数。这个函数接收两个参数 prev 和 values，分别表示上一个提示的值和所有提示的值。这个函数的作用是检查 shouldOverwrite 的值是否为 false，如果是，则抛出一个错误并取消操作。如果 shouldOverwrite 的值不是 false，则返回 null。
        {
          name: "overwriteChecker",
          type: (prev, values) => {
            if (values.shouldOverwrite === false) {
              throw new Error(red("✖") + " Operation cancelled");
            }
            return null;
          },
        },
      ],
      {
        onCancel: () => {
          throw new Error(red("✖") + " Operation cancelled");
        },
      }
    );
  } catch (cancelled) {
    console.log(cancelled.message);
    process.exit(1);
  }

  // `initial` won't take effect if the prompt type is null
  // so we still have to assign the default values here
  const {
    projectName,
    shouldOverwrite
  } = result;

  const root = path.join(cwd, projectName);
  if (fs.existsSync(root) && shouldOverwrite) {
    emptyDir(root)
  } else if (!fs.existsSync(root)) {
    fs.mkdirSync(root)
  }

  await copyFolderWithReplacement(
    path.join(__dirname, "templates"),
    root,
    projectName
  );

  console.log(`\nScaffolding project in ${root}...`);
  console.log(`\nDone. Now run:\n`);
  if (root !== cwd) {
    const cdProjectName = path.relative(cwd, root);
    console.log(
      `  ${bold(
        green(
          `cd ${
            cdProjectName.includes(" ") ? `"${cdProjectName}"` : cdProjectName
          }`
        )
      )}`
    );
  }
  console.log(`  ${bold(green(`pnpm install`))}`);
  console.log();
}

init().catch((e) => {
  console.error(e);
});
