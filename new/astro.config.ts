// @ts-check
import { defineConfig } from 'astro/config';
import react    from '@astrojs/react';
import alpinejs from '@astrojs/alpinejs';
import icon     from 'astro-icon';
import mdx      from '@astrojs/mdx';
import remarkGithubAlerts from 'remark-github-alerts';
import tailwindcss from '@tailwindcss/vite';

/**
 * Turn ```mermaid fences into `<pre class="mermaid">…</pre>` before Shiki runs,
 * so Shiki leaves them alone and mermaid.js can render them client-side.
 */
function remarkMermaid() {
  return (tree: any) => {
    const walk = (node: any) => {
      if (!node.children) return;
      for (const child of node.children) {
        if (child.type === 'code' && child.lang === 'mermaid') {
          const escaped = String(child.value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
          child.type = 'html';
          child.value = `<pre class="mermaid">${escaped}</pre>`;
          delete child.lang;
          delete child.meta;
        } else {
          walk(child);
        }
      }
    };
    walk(tree);
  };
}

export default defineConfig({
  // Canonical production root. The dev server still serves from localhost:4321;
  // in-site links are relative in dev and absolute in prod (see src/config.ts).
  site: 'https://fish-lsp.dev',

  // pnpm astro build writes to dist/ (gitignored)
  outDir: 'dist',

  integrations: [react(), alpinejs(), icon(), mdx()],

  vite: {
    plugins: [tailwindcss()],
  },

  markdown: {
    remarkPlugins: [remarkMermaid, remarkGithubAlerts],
    shikiConfig: {
      theme: 'material-theme-ocean',
    },
  },
});
