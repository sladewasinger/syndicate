import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src/', import.meta.url)),
    },
  },
  build: {
    // Vite (file watching) does not work with WSL 2 terminal -- use any other terminal instead.
    outDir: '../dist/app',
    emptyOutDir: true,
  },
  server: {
    port: 3001,
  },
});
