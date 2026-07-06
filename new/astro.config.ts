// @ts-check
import { defineConfig } from 'astro/config';
import react    from '@astrojs/react';
import alpinejs from '@astrojs/alpinejs';
import icon     from 'astro-icon';
import mdx      from '@astrojs/mdx';
import remarkGithubAlerts from 'remark-github-alerts';
import tailwindcss from '@tailwindcss/vite';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

/**
 * Dev-only: serve the built Pagefind index (`dist/pagefind/`) at `/pagefind/*`
 * so search works under `astro dev`. Pagefind can only index built HTML, so run
 * `pnpm build` once to generate the index; the dev server then serves it.
 */
function pagefindDev() {
  const MIME: Record<string, string> = {
    '.js': 'text/javascript', '.css': 'text/css',
    '.json': 'application/json', '.wasm': 'application/wasm',
  };
  return {
    name: 'pagefind-dev',
    hooks: {
      'astro:server:setup': ({ server }: any) => {
        server.middlewares.use(async (req: any, res: any, next: any) => {
          const url = (req.url ?? '').split('?')[0];
          if (!url.startsWith('/pagefind/')) return next();
          try {
            const data = await readFile(join(process.cwd(), 'dist', url));
            res.setHeader('Content-Type', MIME[url.slice(url.lastIndexOf('.'))] ?? 'application/octet-stream');
            res.end(data);
          } catch {
            next();
          }
        });
      },
    },
  };
}

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
          child.value = `<pre class="mermaid" data-pagefind-ignore>${escaped}</pre>`;
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

  // Alias `/docs/man` → `/docs/commands` (the CLI reference doubles as the
  // man-page docs). Works in dev and static build, unlike a vercel.json-only rule.
  redirects: {
    '/docs/man': '/docs/commands',
  },

  integrations: [react(), alpinejs(), icon(), mdx(), pagefindDev()],

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
