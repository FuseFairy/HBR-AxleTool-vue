import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { LoadingPlugin } from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'
import FloatingVue from 'floating-vue'
import 'floating-vue/dist/style.css'
import versionControlPlugin from '@/plugins/storeVersionControl'
import "vue3-toastify/dist/index.css"


const app = createApp(App)
app.use(versionControlPlugin);

const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(LoadingPlugin)
app.use(FloatingVue)

app.mount('#app')
