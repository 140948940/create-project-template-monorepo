import { promises as fs } from "fs";
import { join } from "path";

// const targetDir = '';
// const oldText = 'oldText';
// const newText = 'newText';
/**
 *
 * @typedef {Object} optionsType
 * @property {Array<string>} allowedDirs - 允许处理的目录名单。只有在此名单中的目录才会被处理。如果此名单为空，则表示允许处理所有目录（除非它们在 blockedDirs 中）。
 * @property {Array<string>} blockedDirs - 不允许处理的目录名单。在此名单中的目录将被跳过，不会被处理。
 * @property {Array<string>}  allowedFiles -  允许处理的文件名单。只有在此名单中的文件才会被处理。如果此名单为空，则表示允许处理所有文件（除非它们在 blockedFiles 中）。
 * @property {Array<string>}  blockedFiles -  不允许处理的文件名单。在此名单中的文件将被跳过，不会被处理。
 * @param {string} dir  - 需要处理的目录
 * @param {string} oldText - 替换前的目录名和文字
 * @param {string} newText - 替换后的目录名和文字
 * @param {optionsType} option - 配置黑白名单
 */
//  export async function replaceTextInDirAndFiles(dir,oldText,newText,option) {
//   const {allowedDirs = [], blockedDirs = [], allowedFiles = [], blockedFiles = []}=(option||{})
//   try {
//     const files = await fs.readdir(dir);

//     for (const file of files) {
//       const oldFilePath = join(dir, file);
//       const newFilePath = join(dir, file.replace(oldText, newText));

//       const stats = await fs.stat(oldFilePath);

//       if (stats.isDirectory()) {
//         // 检查目录是否在黑白名单中
//         if (blockedDirs.includes(file) || (!allowedDirs.includes(file) && allowedDirs.length > 0)) {
//           continue;
//         }

//         // 如果是目录，先重命名目录
//         // await fs.rename(oldFilePath, newFilePath);
//         // 递归处理子目录
//         await replaceTextInDirAndFiles(newFilePath, allowedDirs, blockedDirs, allowedFiles, blockedFiles);
//       } else if (stats.isFile()) {
//         // 检查文件是否在黑白名单中
//         if (blockedFiles.includes(file) || (!allowedFiles.includes(file) && allowedFiles.length > 0)) {
//           continue;
//         }
//         // 如果是文件，先重命名文件
//         await fs.rename(oldFilePath, newFilePath);
//         // 替换文件内容中的文字
//         const data = await fs.readFile(newFilePath, 'utf8');
//         const updatedData = data.replace(new RegExp(oldText, 'g'), newText);
//         await fs.writeFile(newFilePath, updatedData, 'utf8');
//         console.log(`Replaced text in file: ${newFilePath}`);
//       }
//     }
//   } catch (err) {
//     console.error(`Error processing directory: ${err}`);
//   }
// }
export async function replaceTextInDirAndFiles(dir, oldText, newText, option) {
  try {
    await replaceTextInFilesInDir(dir, oldText, newText, option);
    await renameDirsInDir(dir, oldText, newText, option);
  } catch (err) {
    console.error(
      `Error processing directory in replaceTextInDirAndFiles: ${err}`
    );
  }
}
export async function renameDirsInDir(dir, oldText, newText, option) {
  const { allowedDirs = [], blockedDirs = [] } = option || {};

  try {
    const files = await fs.readdir(dir);
    for (const file of files) {
      const oldFilePath = join(dir, file);
      const stats = await fs.stat(oldFilePath);

      if (stats.isDirectory()) {
        // 检查目录是否在黑白名单中
        if (
          blockedDirs.includes(file) ||
          (!allowedDirs.includes(file) && allowedDirs.length > 0)
        ) {
          continue;
        }
        // 如果是目录，重命名目录
        const newFilePath = join(dir, file.replaceAll(oldText, newText));
        await fs.rename(oldFilePath, newFilePath);
        console.log(`Replaced Dir: ${oldFilePath} ==> ${newFilePath}`);
        // 递归处理子目录
        await renameDirsInDir(oldFilePath, oldText, newText, option);
      }
    }
  } catch (err) {
    console.error(`Error processing directory in renameDirsInDir: ${err}`);
  }
}
export async function replaceTextInFilesInDir(dir, oldText, newText, option) {
  const { allowedFiles = [], blockedFiles = [] } = option || {};
  try {
    const files = await fs.readdir(dir);

    for (const file of files) {
      const oldFilePath = join(dir, file);
      const stats = await fs.stat(oldFilePath);

      if (stats.isDirectory()) {
        // 递归处理子目录
        await replaceTextInFilesInDir(oldFilePath, oldText, newText, option);
      } else if (stats.isFile()) {
        // 检查文件是否在黑白名单中
        if (
          blockedFiles.includes(file) ||
          (!allowedFiles.includes(file) && allowedFiles.length > 0)
        ) {
          continue;
        }

        // 替换文件内容中的文字
        const data = await fs.readFile(oldFilePath, "utf8");
        const updatedData = data.replaceAll(oldText, newText);
        await fs.writeFile(oldFilePath, updatedData, "utf8");
        console.log(`Replaced text in file: ${oldFilePath}`);
      }
    }
  } catch (err) {
    console.error(
      `Error processing directory in replaceTextInFilesInDir: ${err}`
    );
  }
}
