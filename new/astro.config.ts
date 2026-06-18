// @ts-check
import { defineConfig } from 'astro/config';
import react    from '@astrojs/react';
import alpinejs from '@astrojs/alpinejs';
import icon     from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Canonical production root. The dev server still serves from localhost:4321;
  // in-site links are relative in dev and absolute in prod (see src/config.ts).
  site: 'https://fish-lsp.dev',

  // pnpm astro build writes to dist/ (gitignored)
  outDir: 'dist',

  integrations: [react(), alpinejs(), icon()],

  vite: {
    plugins: [tailwindcss()],
  },

  markdown: {
    shikiConfig: {
      theme: 'material-theme-ocean',
    },
  },
});
