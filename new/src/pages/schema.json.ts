import type { APIRoute } from 'astro';
import { SITE } from '../lib/config-schema';

// Catalog of the JSON schemas served under /schema/*.
const catalog = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  title: 'fish-lsp schemas',
  description: 'Machine-readable schemas for configuring fish-lsp.',
  schemas: [
    {
      name: 'config',
      url: `${SITE}/schema/config.json`,
      description: 'The fish_lsp_* configuration object (shared base schema).',
    },
    {
      name: 'initialization-options',
      url: `${SITE}/schema/initialization-options.json`,
      description: 'LSP `initializationOptions` passed to fish-lsp during `initialize`.',
    },
    {
      name: 'vscode',
      url: `${SITE}/schema/vscode.json`,
      description: 'VSCode `contributes.configuration` properties (fish-lsp.* settings).',
    },
    {
      name: 'env-defaults',
      url: `${SITE}/schema/env-defaults.json`,
      description: 'Default values for every setting (= `fish-lsp env --show-default --json`).',
    },
  ],
};

export const GET: APIRoute = () =>
  new Response(JSON.stringify(catalog, null, 2) + '\n', {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    },
  });
