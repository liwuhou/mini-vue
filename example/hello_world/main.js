import { createApp } from '../../lib/guide-mini-vue-esm.js'
import { App } from './app.js'

const res = createApp(App)
console.log('res', res)
res.mounted('#app')