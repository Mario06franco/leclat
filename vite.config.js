import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const env = loadEnv(mode, process.cwd());


export default defineConfig({

  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: env.VITE_BACKEND_URL,
        changeOrigin: true,
        secure: false,
        
      },
    },
  },
})
