import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/tailwind.css'
import './style.css'
import App from './App.vue'
import router from './router';

const pinia = createPinia()
createApp(App).use(pinia).use(router).mount('#app')
