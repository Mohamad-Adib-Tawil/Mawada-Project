import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const pagesBase = process.env.GITHUB_PAGES === 'true' ? '/Mawada-Project/' : '/';

export default defineConfig({
  base: pagesBase,
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsInlineLimit: 4096,
    rollupOptions: {
      input: {
        home: resolve(import.meta.dirname, 'index.html'),
        templates: resolve(import.meta.dirname, 'templates/index.html'),
        admin: resolve(import.meta.dirname, 'admin/index.html'),
        editor: resolve(import.meta.dirname, 'admin/editor/index.html'),
        invitation: resolve(import.meta.dirname, 'invite/index.html'),
      },
    },
  },
});
