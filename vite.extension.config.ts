import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist/extension',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'extension/popup.html'),
        sidepanel: resolve(__dirname, 'extension/sidepanel.html'),
        fullpage: resolve(__dirname, 'extension/fullpage.html'),
        background: resolve(__dirname, 'src/hosts/extension/entry/background.ts'),
        content: resolve(__dirname, 'src/hosts/extension/entry/content.ts'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'background') return 'background.js';
          if (chunkInfo.name === 'content') return 'content.js';
          return '[name].js';
        },
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          qr: ['qrcode', 'jsqr'],
        },
      },
    },
  },
});
