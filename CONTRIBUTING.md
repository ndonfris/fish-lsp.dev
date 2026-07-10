# Contributing

> [!IMPORTANT]
> This repo is **only the fish-lsp website/docs**. Most contribution to the project _(features, bug fixes, and the detailed contribution guidelines)_ happens at [**`ndonfris/fish-lsp`**](https://github.com/ndonfris/fish-lsp). **<sub><sup><-- Open issues and PRs for the language server there.</sup></sub>**
>
> <ins>**Use THIS repo for changes to the documentation site.**</ins>

This guide covers building and testing the site locally. For the layout of the codebase and how the pieces fit together, see [README.md](./README.md).

## Prerequisites

- **Node.js 22.12+** (required by Astro 6) and **[pnpm](https://pnpm.io)** — this project pins `pnpm@9`. Use pnpm, not npm/yarn (there's a `pnpm-lock.yaml`).
- Optional, only for regenerating the terminal screenshots in `public/*.svg`:
  - **[fish](https://fishshell.com)**, **[tmux](https://github.com/tmux/tmux)**, and **[freeze](https://github.com/charmbracelet/freeze)** (the `build-*.fish` scripts use them).

```sh
pnpm install
```

## Everyday workflow

```sh
pnpm dev          # dev server → http://localhost:4321
pnpm build        # production build (astro build + pagefind) → dist/
pnpm preview      # serve the built dist/ locally
pnpm check        # astro check (diagnostics on .astro + content)
pnpm typecheck    # tsc --noEmit
```

Before pushing, run `pnpm typecheck` and `pnpm build` — the build catches broken content references and schema/type errors that `dev` won't.

> [!NOTE]
> **Search needs a build first.** Pagefind can only index built HTML. Run `pnpm build`
> once to generate `dist/pagefind/`, then `pnpm dev` serves that index so search works
> locally. Re-run `pnpm build` after adding/renaming pages to refresh it.

## Editing the docs

Docs pages are Markdown/MDX files in `src/content/`. To add one, create a new `*.md` / `*.mdx` file with frontmatter:

```yaml
---
title:       Page Title          # required — shown in <title>, sidebar, and header
description: One-line summary     # required — used for <meta description> and social cards
slug:        page-title           # required — the URL becomes /docs/page-title
order:       5                    # optional — sidebar ordering
section:     Guides               # optional — sidebar group label
permalink:   /docs/legacy-path    # optional
---
```

It shows up at `/docs/<slug>` and in the sidebar automatically — no route wiring needed.

### Custom code fences

Beyond normal fenced code, these are available (implemented in `src/plugins/`):

- **File card** — first meta token is a path:

  ~~~
  ```fish /tmp/config.fish  optional description
  set -gx fish_lsp_enabled yes
  ```
  ~~~

- **Command + output** — tag the fence `prompt`, split the command and its output with `---`:

  ~~~
  ```fish prompt
  fish-lsp --help
  ---
  usage: fish-lsp [options]...
  ```
  ~~~

- **Mermaid** — ` ```mermaid ` fences render client-side.
- **GitHub alerts** — `> [!NOTE]`, `> [!WARNING]`, etc.

## Icons

Icons are local SVGs under `src/icons/`, rendered by [astro-icon](https://www.astroicon.dev/).

1. Find an icon at **[icones.js.org](https://icones.js.org/)**.
2. Download/copy the SVG into `src/icons/` with a clear, kebab-case name.
3. Use it: `<Icon name="my-icon" />` (the `name` is the filename without `.svg`).

## Regenerating screenshots

The terminal screenshots in `public/*.svg` are generated with `freeze` (+ tmux/fish), not hand-edited. Re-run the relevant script after the underlying `fish-lsp` output changes:

```sh
./build-dump-screenshots.fish     # public/dump-*.svg  (used on /docs/debugging)
./build-comment-svg.fish          # public/comment.svg
./build-output-screenshot.fish    # public/help-msg.svg + public/help-msg-new.png
```

<!-- ## Updating the published JSON schemas -->
<!---->
<!-- The `/schema/*` endpoints are generated from `src/lib/config-schema.ts`, which is a manual transcription of the `fish_lsp_*` configuration from the **fish-lsp repo** (`src/config.ts` + `src/snippets/fishlspEnvVariables.json`). When upstream config changes, update `config-schema.ts` here to match — the endpoints and their schemas derive from it. -->
<!---->
## Deployment

The site is deployed to **Vercel** as a static build (Vercel serves `dist/`). Merges to the production branch deploy automatically.
Notable config:

- `vercel.json` — cache/security headers, `cleanUrls`, `trailingSlash: false`, and the
  `/page/:path+` wildcard redirect.
- On Vercel, the project **Root Directory must be the repo root** (`.`), framework preset Astro, build command `pnpm build`.
