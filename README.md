<div align="center">
    <h1>
        <span><a href="fish-lsp.dev">:fish::tropical_fish::fish: <ins>fish-lsp.dev</ins> :fish::tropical_fish::fish: </a></span><br/>
    </h1>
</div>

This repo contains the source for the [fish-lsp.dev](https://fish-lsp.dev) website, which serves as the documentation to the [`@ndonfris/fish-lsp`](https://github.com/ndonfris/fish-lsp) project. Eventually, we will remove the main repo's [wiki](https://github.com/ndonfris/fish-lsp/wiki) and rely entirely on this site for documentation.

<!-- The docs are a static site built with [astro](https://astro.build) and hosted on [vercel](https://vercel.com). Aside from the docs, the site also exposes an embedded playground for testing the fish-lsp server in the browser which is excluded from the static build and hosted separately on [fly.io](https://fly.io) in its own docker container. -->

Overall, this repo is a pretty standard astro static site and should be easy to comprehend & maintain.
<!-- Overall, this repo is a pretty standard astro static site with content-driven docs, and shouldn't be too hard to get up and running locally. See the [CONTRIBUTING.md](./CONTRIBUTING.md) file for more information on how to build/run this site locally. -->

## Tech stack

- **[pnpm](https://pnpm.io)** - package manager (`pnpm@9`)
- **[Astro 6](https://astro.build)** - static site (no SSR adapter; builds to `dist/`)
- **[Tailwind CSS v4](https://tailwindcss.com)** - via `@tailwindcss/vite`, brand palette in `@theme`
- **[React](https://reactjs.org)** / **[Alpine.js](https://alpinejs.dev)** - integrations installed and island-ready
- **[Pagefind](https://pagefind.app)** - static full-text search over the built HTML
- **[Vercel](https://vercel.com)** - hosting (static; config in `vercel.json`)
- **[Fly.io](https://fly.io)** - hosting for the playground container *(<ins>separate</ins> from the static site included in this repo)*

<!-- The site is hosted on Vercel ATM, with the playground published separately in a docker container on fly.io -->
<!-- The docs are a content collection of Markdown/MDX files in `src/content/`, rendered through `DocsLayout.astro` with a sidebar, pager, and "edit on GitHub" links. -->

## Commands

| Command          | What it does                                              |
| ---------------- | -------------------------------------------------------- |
| `pnpm dev`       | Dev server at `localhost:4321` (search needs a prior build) |
| `pnpm build`     | `astro build` + Pagefind index → `dist/`                 |
| `pnpm preview`   | Serve the built `dist/` locally                          |
| `pnpm check`     | `astro check` (diagnostics on `.astro`/content)          |
| `pnpm typecheck` | `tsc --noEmit`                                            |

## Building

Once the repo is cloned, you can build and run the site locally with the following commands:

```bash
pnpm install    # installs dependencies
pnpm build      # builds dist/ + pagefind index
pnpm dev --open # http://localhost:4321
```

<sup>

> [!TIP]
> See [CONTRIBUTING.md](./CONTRIBUTING.md) for more info detailing how to build/run this site locally.

</sup>

<!-- > [!NOTE] -->
<!-- > See [CONTRIBUTING.md](./CONTRIBUTING.md) for how to build/run this site locally. -->

## Project layout

```fish
> tree -I 'node_modules|dist|.astro' -L 3 # output below is truncated for brevity
```

```sh
./
├── astro.config.ts              # Integrations, custom remark plugins, redirects, Shiki theme, trailingSlash
├── vercel.json                  # Host rules: security/cache headers, cleanUrls, /page/* wildcard redirect
├── tsconfig.json                # Strict TS + path aliases (@components, @layouts, @theme, @typedefs, …)
├── package.json                 # pnpm scripts (dev/build/preview/check/typecheck) + deps
├── build-*.fish                 # Regenerate public/*.svg screenshots with `freeze` (see CONTRIBUTING)
├── public/                      # Served as-is: screenshots (svg/png/gif), fonts/, install.fish, favicon.svg
└── src/
    ├── config.ts                # SITE_ORIGIN + DOCS_ORIGIN — links go absolute in prod, relative in dev
    ├── content.config.ts        # `pages` collection: globs src/content/*.{md,mdx} + zod frontmatter schema
    ├── content/                 # ← THE DOCS. One .md/.mdx per page (installation, commands, features, …)
    ├── pages/
    │   ├── index.astro          # Homepage
    │   ├── playground.astro     # /playground — embeds the browser playground (playground.fish-lsp.dev)
    │   ├── 404.astro
    │   ├── robots.txt.ts        # Dynamic robots.txt (home+docs allowed; playground+schema disallowed)
    │   ├── docs/
    │   │   ├── index.astro      # /docs → redirect to /docs/installation
    │   │   └── [slug].astro     # Renders every content/ page from the `pages` collection
    │   └── schema/…             # /schema/*.json API endpoints (generated — see src/lib/config-schema.ts)
    ├── layouts/
    │   ├── Layout.astro         # Base HTML shell (homepage, standalone pages)
    │   └── DocsLayout.astro     # Docs shell: sidebar nav + prev/next pager + "edit on GitHub" link
    ├── components/              # UI pieces: Header, Footer, BaseHead, Terminal, CodeFile, CommandPrompt, Search, …
    ├── plugins/
    │   ├── remark-codefile.mjs        # fence ```fish /path  desc → <CodeFile>
    │   └── remark-command-prompt.mjs  # fence ```fish prompt (--- splits cmd/output) → <CommandPrompt>
    ├── lib/
    │   ├── config-schema.ts     # SINGLE SOURCE OF TRUTH for fish_lsp_* → builds all /schema/* JSON Schemas
    │   └── fish-info.ts         # Fetches playground container /api/info (6h cache in node_modules/.cache)
    ├── scripts/
    │   └── copy-code.ts         # Client-side copy-to-clipboard buttons for code blocks
    ├── styles/
    │   └── global.css           # Tailwind v4 entry + @theme brand palette/animations (import as @theme/global.css)
    ├── icons/                   # Local SVGs for astro-icon — source new ones from https://icones.js.org
    └── types/
        └── content.ts           # Frontmatter / nav-section / download-option TypeScript interfaces
```

<!-- Generated (`.gitignore` not shown): `dist/` (build output), `.astro/` (generated types), `node_modules/`. -->

## About the docs

- Most of the content is in Markdown/MDX files under [`src/content/`](src/content/). 
  The frontmatter schema is defined in [`src/content.config.ts`](src/content.config.ts) and validated with Zod.
- The docs are rendered through [`DocsLayout.astro`](src/layouts/DocsLayout.astro), which builds the sidebar, the prev/next pager, and the `"edit on GitHub"` link from `filePath`.
- The [`src/components`](/src/components) folder contains the UI pieces used in the docs 
  > *including:* `<Header>`, `<Footer>`, `<Terminal>`, `<CodeFile>`, `<CommandPrompt>`, and `<Search>`
- Some custom remark plugins are used to render special fenced code blocks, in [`src/plugins`](src/plugins).
  <!-- - [`remark-codefile.mjs`](src/plugins/remark-codefile.mjs) - renders a titled file card ([`<CodeFile>`](src/components/CodeFile.astro)) -->
  <!--    <ins>codeblock header used:</ins> ` ```fish /path/to/file.fish  description ` -->
  <!-- - [`remark-command-prompt.mjs`](src/plugins/remark-command-prompt.mjs) - renders a terminal prompt ([`<CommandPrompt>`](src/components/CommandPrompt.astro)) -->
  <!--    <ins>codeblock header used:</ins> ` ```fish prompt ` -->
  <!--    a `---` line separates the command from its output (after the header) -->
- Codeblock highlighting is done with Shiki using the `material-theme-ocean` theme.
- Mermaid diagrams are rendered client-side with mermaid.js
- Playground page is embedded from a separate container on [playground.fish-lsp.dev](https://playground.fish-lsp.dev)

<!-- ## How the important pieces fit together -->
<!---->
<!-- ### Docs are a content collection -->
<!---->
<!-- Every docs page is a Markdown/MDX file in `src/content/`. `content.config.ts` defines the `pages` collection and its frontmatter schema (`title`, `description`, `slug`; optional `order`, `section`, `permalink`). `src/pages/docs/[slug].astro` reads the whole collection in `getStaticPaths()` and renders each one through `DocsLayout.astro`, which builds the sidebar, the prev/next pager, and the "edit on GitHub" link from `filePath`. -->
<!---->
<!-- **To add a docs page:** drop a new `.md`/`.mdx` in `src/content/` with valid frontmatter — it appears at `/docs/<slug>` and in the sidebar automatically. No route wiring needed. -->
<!---->
<!-- ### Custom Markdown (remark plugins + fences) -->
<!---->
<!-- Configured in `astro.config.ts` under `markdown.processor`: -->
<!---->
<!-- - **`remark-codefile.mjs`** — ` ```fish /path/to/file.fish  description ` renders a titled file card (`<CodeFile>`). -->
<!-- - **`remark-command-prompt.mjs`** — ` ```fish prompt ` renders a terminal prompt (`<CommandPrompt>`); a `---` line separates the command from its output. -->
<!-- - **`remarkMermaid`** (inline in the config) — rewrites ` ```mermaid ` fences to `<pre class="mermaid">` so Shiki skips them and mermaid.js renders them client-side. -->
<!-- - **`remark-github-alerts`** — GitHub-style `> [!NOTE]` / `> [!WARNING]` callouts. -->
<!---->
<!-- Code highlighting is Shiki with the `material-theme-ocean` theme. -->
<!---->
<!-- ### JSON schemas (`/schema/*`) -->
<!---->
<!-- `src/lib/config-schema.ts` is the single source of truth for the `fish_lsp_*` settings, **transcribed from the fish-lsp repo** (`src/config.ts` + `fishlspEnvVariables.json`). The endpoints in `src/pages/schema/*.json.ts` build the various published schemas from it (config, LSP `initializationOptions`, VSCode settings, coc.nvim, env defaults). Keep this file in sync when the upstream config changes. -->
<!---->
<!-- ### Search (Pagefind) -->
<!---->
<!-- Pagefind indexes the built HTML, so search only works **after a build**. `pnpm build` runs `astro build && pagefind --site dist`. A small dev-only Vite plugin (`pagefindDev()` in `astro.config.ts`) serves the existing `dist/pagefind/` index during `astro dev` — so run `pnpm build` once, then `pnpm dev`, to get working search locally. -->
<!---->
<!-- ### SEO / crawling -->
<!---->
<!-- - `src/pages/robots.txt.ts` — dynamic robots.txt. Home + `/docs/*` are crawlable; `/playground` and `/schema/*` are disallowed. -->
<!-- - `@astrojs/sitemap` — emits `sitemap-index.xml`, filtered to exclude playground + schema (kept in sync with robots.txt). -->
<!-- - `BaseHead.astro` — per-page `<title>`, description, **canonical**, and OpenGraph/Twitter tags. -->
<!-- - `trailingSlash: 'never'` (astro) + `trailingSlash: false` (vercel) + non-slash in-site links all agree, so canonical/sitemap URLs match exactly what Vercel serves. -->
<!---->
<!-- ### Redirects & hosting -->
<!---->
<!-- - Simple redirects live in `astro.config.ts` (`/docs/man → /docs/commands`, `/page → /docs/installation`) so they work in dev and in the static build. -->
<!-- - The `/page/:path+` **wildcard** redirect and all response headers (cache/security) can't be expressed statically, so they live in `vercel.json`. -->
<!-- - Deployed as a **static** site — Vercel serves `dist/` (no adapter/SSR). -->
<!---->
<!-- > [!IMPORTANT] -->
<!-- > On Vercel, the project's **Root Directory must be the repo root** (`.`). Framework preset -->
<!-- > is Astro, output directory `dist`, build command `pnpm build`. -->

## Contributing

All contributions are welcome!

Feel free to submit pull requests for typo corrections, formatting fixes, or any other improvements to the documentation.

<sup>

> [!TIP]
> For more information on contributing to these web docs, please see the [CONTRIBUTING.md](./CONTRIBUTING.md) file.

</sup>

## License

See [MIT License](/LICENSE.md) for details.
