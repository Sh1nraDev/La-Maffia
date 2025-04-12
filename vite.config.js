import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  base: '/la-maffia/', // Set the base path for GitHub Pages
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
