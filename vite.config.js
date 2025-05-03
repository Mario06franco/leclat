import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
const backendUrl = import.meta.env.VITE_BACKEND_URL;


export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: backendUrl,
        changeOrigin: true,
        secure: false,
        
      },
    },
  },
})
