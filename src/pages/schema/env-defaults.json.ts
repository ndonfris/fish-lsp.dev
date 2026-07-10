import type { APIRoute } from 'astro';
import { configDefaults } from '../../lib/config-schema';

// The default values for every `fish_lsp_*` setting — equivalent to the output
// of `fish-lsp env --show-default --json`.
export const GET: APIRoute = () =>
  new Response(JSON.stringify(configDefaults, null, 2) + '\n', {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    },
  });
