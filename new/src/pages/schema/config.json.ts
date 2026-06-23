import type { APIRoute } from 'astro';
import { buildConfigSchema } from '../../lib/config-schema';

const schema = buildConfigSchema({
  id: '/schema/config.json',
  title: 'fish-lsp configuration',
  description:
    'JSON Schema for the fish-lsp `fish_lsp_*` configuration object, shared by ' +
    'environment variables, LSP initializationOptions, and `fish-lsp env --json`.',
});

export const GET: APIRoute = () =>
  new Response(JSON.stringify(schema, null, 2) + '\n', {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    },
  });
