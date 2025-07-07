import { createApp } from 'vue'
import App from './App.vue'

// Pinia state management imports
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import versionControlPlugin from '@/plugins/storeVersionControl'

// Third-party UI/utility library imports and their styles
import FloatingVue from 'floating-vue'
import 'floating-vue/dist/style.css'

import 'vue-loading-overlay/dist/css/index.css'
import 'vue3-toastify/dist/index.css'

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

app.use(FloatingVue)
app.use(directives)

app.mount('#app')
