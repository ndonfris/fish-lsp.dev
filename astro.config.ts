// @ts-check
import { defineConfig } from 'astro/config';
import react    from '@astrojs/react';
import alpinejs from '@astrojs/alpinejs';
import icon     from 'astro-icon';
import mdx      from '@astrojs/mdx';
import sitemap  from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import remarkGithubAlerts from 'remark-github-alerts';
import remarkCodeFile from './src/plugins/remark-codefile.mjs';
import remarkCommandPrompt from './src/plugins/remark-command-prompt.mjs';
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

  // Canonical URLs have no trailing slash, matching vercel.json's
  // `trailingSlash: false` and the non-slash in-site links (see src/config.ts).
  // Keeps sitemap `<loc>`s aligned with what Vercel actually serves, so crawlers
  // don't hit a 308 redirect on every entry.
  trailingSlash: 'never',

  // Host-agnostic redirects (work in dev + static build, unlike a host-only rule).
  //   /docs/man → /docs/commands  (CLI reference doubles as the man-page docs)
  //   /page     → /docs/installation  (legacy bare path; the /page/* wildcard
  //               can't be a static redirect, so it lives in vercel.json)
  // Note: bare `/docs` is already redirected by src/pages/docs/index.astro.
  redirects: {
    '/docs/man': '/docs/commands',
    '/page': '/docs/installation',
  },

  integrations: [
    react(),
    alpinejs(),
    icon(),
    mdx(),
    // Emits sitemap-index.xml (referenced by /robots.txt). Keep the excluded
    // paths in sync with DISALLOW in src/pages/robots.txt.ts: the playground
    // and JSON schema endpoints shouldn't appear in the sitemap either.
    sitemap({
      filter: (page) => {
        // Normalize away the trailing slash the sitemap appends (/playground/).
        const path = new URL(page).pathname.replace(/\/+$/, '') || '/';
        return path !== '/playground' && !path.startsWith('/schema');
      },
    }),
    pagefindDev(),
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  markdown: {
    // Off: smartypants rewrites `--` → en/em-dash and straight quotes → curly
    // ones in prose text nodes (it skips backtick code spans, but NOT text
    // inside raw-HTML blocks like the <pre class="plain"> samples). For CLI docs
    // that's a hazard — any `--flag` or copy-pasteable quote in prose gets
    // mangled — so we render punctuation literally.
    smartypants: false,

    // Astro 6 deprecated top-level `markdown.remarkPlugins`; pass them to
    // `unified({...})` instead. Everything else in `markdown` (shikiConfig,
    // heading IDs, gfm) is still applied by createMarkdownProcessor.
    processor: unified({
      remarkPlugins: [remarkMermaid, remarkGithubAlerts, remarkCodeFile, remarkCommandPrompt],
    }),
    shikiConfig: {
      theme: 'material-theme-ocean',
    },
  },
});
