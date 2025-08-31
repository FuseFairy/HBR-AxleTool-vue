import { createApp } from 'vue'
import App from './App.vue'

// Pinia state management imports
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import versionControlPlugin from '@/plugins/storeVersionControl'
import nonPassiveTouchPlugin from '@/plugins/nonPassiveTouch'

// Third-party libraries imports
import 'vue3-toastify/dist/index.css'
import 'overlayscrollbars/overlayscrollbars.css'

// Custom directives import
import directives from './directives'

// Global styles
import '@/style/main.css'

// --- Application Initialization ---
const app = createApp(App)
const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(versionControlPlugin)
app.use(nonPassiveTouchPlugin)
app.use(directives)

app.mount('#app')
