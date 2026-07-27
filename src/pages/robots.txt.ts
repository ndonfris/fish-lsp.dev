import type { APIRoute } from 'astro';

/**
 * Dynamic `/robots.txt`.
 *
 * The homepage and the documentation (`/docs/*`) are open to crawlers so the
 * docs are discoverable/scrapable. The interactive playground and the JSON
 * schema/API endpoints (`/schema/*`, `/schema.json`) are disallowed — they're
 * either heavy client apps or machine-readable data, not content we want indexed.
 *
 * A denylist (rather than an allowlist) keeps everything else — including future
 * pages — crawlable by default, which is what we want for a docs site.
 */
const DISALLOW = ['/playground', '/schema/', '/schema.json'];

export const GET: APIRoute = ({ site }) => {
  // `site` comes from `site:` in astro.config.ts (https://www.fish-lsp.dev).
  const sitemap = site ? new URL('sitemap-index.xml', site).href : '';

  const lines = [
    '# fish-lsp — a language server for the fish shell.',
    '# Docs (/docs/*) and the homepage are open to crawlers;',
    '# the playground and JSON schema endpoints are not.',
    '',
    'User-agent: *',
    ...DISALLOW.map((path) => `Disallow: ${path}`),
  ];

  if (sitemap) lines.push('', `Sitemap: ${sitemap}`);
  lines.push('');

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
