import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true, // listen on 0.0.0.0 so LAN devices can connect
    proxy: {
      // Any request to /api on port 3000 is forwarded to the backend on port 5000
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
