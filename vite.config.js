import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    watch: {
      usePolling: true, // Fixes issues in some OS
    },
    hmr: {
      overlay: true, // Shows errors in the browser
    }
  }
})
