import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Generate proper index.html for SPA routing
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  server: {
    // Enable history API fallback for development
    historyApiFallback: true
  }
})
