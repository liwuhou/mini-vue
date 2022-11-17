import { createApp } from './core/index.js'
import App from './App.js'


console.log('trigger')
createApp(App).mounted(document.querySelector('#app'))