import type { APIRoute } from 'astro';
import { buildVscodeContributes } from '../../lib/config-schema';

const schema = buildVscodeContributes();

export const GET: APIRoute = () =>
  new Response(JSON.stringify(schema, null, 2) + '\n', {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    },
  });
