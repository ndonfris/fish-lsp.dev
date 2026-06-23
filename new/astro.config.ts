// @ts-check
import { defineConfig } from 'astro/config';
import react    from '@astrojs/react';
import alpinejs from '@astrojs/alpinejs';
import icon     from 'astro-icon';
import mdx      from '@astrojs/mdx';
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

/**
 * GitHub-style admonitions: a blockquote whose first line is `[!NOTE]`,
 * `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]` or `[!CAUTION]` becomes a styled
 * callout `<div class="callout callout-<kind>" data-alert="<kind>">`.
 */
const ALERT_KINDS: Record<string, string> = {
  NOTE: 'note', TIP: 'tip', IMPORTANT: 'important',
  WARNING: 'warning', CAUTION: 'caution',
};
function remarkAlerts() {
  return (tree: any) => {
    const walk = (node: any) => {
      if (!node.children) return;
      for (const child of node.children) {
        if (child.type === 'blockquote') {
          const para = child.children?.[0];
          const first = para?.children?.[0];
          const m = first?.type === 'text' && first.value.match(/^\[!(\w+)\][ \t]*\r?\n?/);
          const kind = m && ALERT_KINDS[m[1].toUpperCase()];
          if (kind) {
            first.value = first.value.slice(m[0].length);
            if (first.value === '') para.children.shift();
            child.data = {
              hName: 'div',
              hProperties: { className: ['callout', `callout-${kind}`], 'data-alert': kind },
            };
          }
        }
        walk(child);
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
    remarkPlugins: [remarkMermaid],
    shikiConfig: {
      theme: 'material-theme-ocean',
    },
  },
});
