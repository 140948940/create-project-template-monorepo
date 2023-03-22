import fs from "fs-extra";
import {replaceTextInDirAndFiles} from './replaceTextInDirAndFiles.mjs'
// const fs = require('');

// async function copyDir(source, destination) {
//   try {
//     await fs.copy(source, destination);
//     console.log(`Successfully copied ${source} to ${destination}`);
//   } catch (err) {
//     console.error(`Error copying ${source} to ${destination}: ${err}`);
//   }
// }

async function copyDir(source, destination) {
  try {
    await fs.copy(source, destination);
    console.log(`Successfully copied ${source} to ${destination}`);
  } catch (err) {
    console.error(`Error copying ${source} to ${destination}: ${err}`);
  }
}
/**
 * 读取文件夹并替换其内容，然后将其复制到指定路径
 * @param {string} sourceFolderPath - 源文件夹路径
 * @param {string} destinationFolderPath - 目标文件夹路径
 * @param {string} replacementText - 替换后的目录名和文字
 */
 export const copyFolderWithReplacement = async (sourceFolderPath, destinationFolderPath, replacementText) => {
  console.log('replacementText',replacementText)  
  const flag=/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(replacementText)
    if(!flag){
      return console.error('项目名请以字母、数字、下划线和连字符组成')
    }
    try {
      //   await fs.copyFile(sourceFolderPath, destinationFolderPath).catch(err => {
      //   if (err.code === 'ENOENT') {
      //     // 如果目标文件夹不存在，则创建目标文件夹
      //     return fs.mkdir(destinationFolderPath, { recursive: true })
      //       .then(() => fs.copyFile(sourceFolderPath, destinationFolderPath));
      //   }
  
      //   throw err;
      // });
      await copyDir(sourceFolderPath, destinationFolderPath)
      await replaceTextInDirAndFiles(destinationFolderPath,'${template---name}',replacementText)
    } catch (err) {
      console.error(err);
    }
  };