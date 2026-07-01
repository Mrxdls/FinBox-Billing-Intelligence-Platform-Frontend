import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Dev server runs on 3000 to match the backend's default CLIENT_URL, so the
// OAuth redirect and CORS origin line up with no backend change in local dev.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
  },
  preview: {
    port: 3000,
    host: true,
  },
  build: {
    rollupOptions: {
      output: {
        // Split the heavy charting lib and core vendor code into their own
        // chunks so the initial bundle stays lean.
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          charts: ['recharts'],
          query: ['@tanstack/react-query', 'axios'],
        },
      },
    },
  },
});
