import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { visualizer } from "rollup-plugin-visualizer";
import externalGlobals from "rollup-plugin-external-globals";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    cors: true,
  },
  preview: {
    cors: true,
  },
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
      external: ['vue', 'axios', 'marked', 'dompurify'],
      output: {
        manualChunks(id) {
          const extensions = ['.js', '.ts', '.mjs'];
          if (id.includes('node_modules') && extensions.some(ext => id.endsWith(ext))) {
            return 'packages';
          }
        }
      },
      plugins: [ 
        externalGlobals({
          vue: "Vue",
          axios: 'axios',
          marked: 'marked',
          dompurify: 'DOMPurify'
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
