import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // 👈 necesitas importar 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // 👈 define el alias '@'
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
