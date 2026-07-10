import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
// `z` re-exported from 'astro:content' is deprecated (removed in Astro 7); import zod directly.
import { z } from 'astro/zod';

const pages = defineCollection({
  loader: glob({ pattern: '*.{md,mdx}', base: './src/content' }),
  schema: z.object({
    title:       z.string(),
    description: z.string(),
    slug:        z.string(),
    order:       z.number().optional(),
    section:     z.string().optional(),
    permalink:   z.string().optional(),
  }),
});

export const collections = { pages };
