import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// We don't need tsconfigPaths or path if not using aliases

export default defineConfig({
  plugins: [
    react(),
  ],
  // No resolve.alias needed if not using '@/'
  server: {
    port: 3000,
    proxy: {
      // Proxy requests starting with /api
      '/api': {
        target: 'http://localhost:5000', // <-- CORRECT: Backend base URL ONLY
        changeOrigin: true,
        // --- CORRECT: Rewrite /api/* to /api/v1/* ---
        rewrite: (path) => path.replace(/^\/api/, '/api/v1') 
        // ---------------------------------------------
      },
    },
  },
  // Keep define config if needed by libraries, otherwise remove
  define: {
    'process.env': {} 
  }
});

