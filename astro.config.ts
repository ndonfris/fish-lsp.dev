import { defineConfig } from 'astro/config';
import icon from "astro-icon";
import tailwind from "@astrojs/tailwind";
import robotsTxt from "astro-robots-txt";

import sitemap from "@astrojs/sitemap";
import robotsConfig from './robots-txt.config'

// https://astro.build/config
export default defineConfig({
  site: "https://fish-lsp.dev",
  integrations: [
    icon(),
    tailwind({nesting: true}),
    robotsTxt(robotsConfig),
    sitemap(),
  ],
});
