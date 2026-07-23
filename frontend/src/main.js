import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { initProtection } from './protection'

// Activer les protections du contenu avant le montage de l'app
initProtection()

const app = createApp(App)
app.use(router)
app.mount('#app')

