import { defineConfig } from 'vitepress'
import { enConfig } from './en'
import { sharedConfig } from './shared'
import { zhConfig } from './zh'
import { fileURLToPath} from 'node:url'

export default defineConfig({
  ...sharedConfig,
  base:'/${template---name}/',
  vite:{
    resolve: {
      alias: {
        // '@': fileURLToPath(new URL('./src', import.meta.url)),
        '${template---name}': fileURLToPath(new URL('../../../${template---name}/src', import.meta.url)),
      },
    },
  },
  locales: {
    root: { label: '简体中文', lang: 'zh-CN', link: '/', ...zhConfig },
  },
})
