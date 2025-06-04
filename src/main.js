import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import 'vue-loading-overlay/dist/css/index.css'
import FloatingVue from 'floating-vue'
import 'floating-vue/dist/style.css'
import versionControlPlugin from '@/plugins/storeVersionControl'
import 'vue3-toastify/dist/index.css'
import directives from './directives'

const app = createApp(App)
const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)

app.use(versionControlPlugin)
app.use(pinia)
app.use(FloatingVue)
app.use(directives)

app.mount('#app')
