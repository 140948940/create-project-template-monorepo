import { postOrderDirectoryTraverse, preOrderDirectoryTraverse } from './directoryTraverse.mjs'
import   fs  from 'fs'
export function emptyDir(dir) {
    if (!fs.existsSync(dir)) {
      return
    }
  
    postOrderDirectoryTraverse(
      dir,
      (dir) => fs.rmdirSync(dir),
      (file) => fs.unlinkSync(file)
    )
  }