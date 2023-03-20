import {replaceTextInDirAndFiles} from './utils/replaceTextInDirAndFiles.mjs'
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
replaceTextInDirAndFiles(path.join(__dirname,'templates'),'add-page-watermark','${template---name}')
console.log(path.join(__dirname,'templates'))
