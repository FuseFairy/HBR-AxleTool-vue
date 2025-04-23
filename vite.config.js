import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { visualizer } from "rollup-plugin-visualizer";
import externalGlobals from "rollup-plugin-external-globals";

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    include: ['lodash-es']
  },
  plugins: [
    vue(),
    vueDevTools(),
    visualizer({
      emitFile: true,
      filename: "stats.html",
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      external: ['vue', 'axios'],
      plugins: [ 
        externalGlobals({
          vue: "Vue",
          axios: 'axios',
        })
      ],
    },
    minify: "terser",
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
    }
  }
})
