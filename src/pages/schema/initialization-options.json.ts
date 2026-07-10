import type { APIRoute } from 'astro';
import { buildConfigSchema } from '../../lib/config-schema';

const schema = buildConfigSchema({
  id: '/schema/initialization-options.json',
  title: 'fish-lsp LSP initializationOptions',
  description:
    'JSON Schema for the `initializationOptions` object passed to fish-lsp by a ' +
    'language client during `initialize`. Each key is a `fish_lsp_*` setting; ' +
    'unknown keys are ignored by the server.',
});

export const GET: APIRoute = () =>
  new Response(JSON.stringify(schema, null, 2) + '\n', {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    },
  });
