import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'dev',
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'dev/popup.html'),
        index: resolve(__dirname, 'dev/index.html'),
        background: resolve(__dirname, 'dev/background.js')
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name].[hash].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    },
    outDir: '../dist',
    emptyOutDir: true,
    sourcemap: false,
    cssCodeSplit: false
  },
  server: {
    port: 3000,
    strictPort: true
  }
});