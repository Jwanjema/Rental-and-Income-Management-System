// client/vite.config.js
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode (e.g., 'production')
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    
    // FIX: Set the base path to '/' so Vercel serves its own static assets.
    // The VITE_APP_API_URL should NOT be used here.
    base: '/', 

    server: {
      // Keep your proxy settings for local development only
      proxy: {
        // All local fetch calls must start with '/api' for this to work
        '/api': {
          target: 'http://127.0.0.1:5000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  };
});