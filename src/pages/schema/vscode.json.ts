import type { APIRoute } from 'astro';
import { buildVscodeConfiguration } from '../../lib/config-schema';

const schema = buildVscodeConfiguration();

export const GET: APIRoute = () =>
  new Response(JSON.stringify(schema, null, 2) + '\n', {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    },
  });
