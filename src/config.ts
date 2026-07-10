/**
 * Canonical site root used to build cross-page links.
 *
 * - `pnpm dev`   → import.meta.env.PROD is false → origin is '' (empty),
 *                  so links like `/docs/installation` resolve against the
 *                  local dev server (http://localhost:4321).
 * - `pnpm build` → import.meta.env.PROD is true  → origin is the production
 *                  root, so links become https://fish-lsp.dev/docs/*.
 *
 * Change SITE_ORIGIN below if the production root domain ever moves.
 */
export const SITE_ORIGIN = 'https://fish-lsp.dev';

/** Origin to prefix onto absolute in-site links. Empty during local dev. */
export const DOCS_ORIGIN = import.meta.env.PROD ? SITE_ORIGIN : '';
