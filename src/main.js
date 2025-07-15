import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

console.log('Creating Vue app...');
const app = createApp(App)

console.log('Using router...');
app.use(router)

console.log('Mounting app to #app...');
app.mount('#app')
console.log('App mounted.');
