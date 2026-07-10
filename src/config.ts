/**
 * Canonical production root. Used only where an *absolute* URL is genuinely
 * required (canonical/OG tags in BaseHead.astro) — those must always point at
 * the real domain regardless of which host built the page.
 *
 * Change this if the production root domain ever moves.
 */
export const SITE_ORIGIN = 'https://fish-lsp.dev';
