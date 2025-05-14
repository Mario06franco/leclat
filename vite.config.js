import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0', // Permite conexiones desde cualquier IP
      port: 5174,      // Puerto fijo
      strictPort: true, // No buscar otros puertos si este está ocupado
      proxy: {
        '/api': {
          target: env.VITE_BACKEND_URL,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      },
      // Configuración adicional para HMR (Hot Module Replacement)
      hmr: {
        clientPort: 5174, // Usa el mismo puerto para HMR
        protocol: 'ws'    // Protocolo WebSocket
      }
    },
    // Opcional: Configuración para el build de producción
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: true
    }
  };
});