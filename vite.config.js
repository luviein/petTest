// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/petTest/', // <-- IMPORTANT: Replace 'your-repo-name' with your actual repo name
  build: {
    outDir: 'dist', // Default, but good to be explicit
  },
});