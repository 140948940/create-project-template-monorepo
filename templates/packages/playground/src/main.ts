// necessary for webpack
import { createApp } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import App from './App.vue'


const app = createApp(App).mount('#app')

window.vm = app
declare global {
  interface Window {
    vm: ComponentPublicInstance
  }
}