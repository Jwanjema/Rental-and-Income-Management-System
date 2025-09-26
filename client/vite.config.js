import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode (e.g., 'production')
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    
    // CRITICAL FIX: Set the base path for production to the API URL
    // If VITE_APP_API_URL is set on Netlify/Vercel, use it. Otherwise, default to '/'.
    base: env.VITE_APP_API_URL || '/', 

    server: {
      // Keep your proxy settings for local development only
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:5555', // Adjust to your Flask local port if needed
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  };
});