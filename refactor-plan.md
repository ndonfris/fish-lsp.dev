# Plan: Vercel cleanup, schema usage docs, and curl install script

## Context

`fish-lsp.dev/new` is a **pure static** Astro site (no adapter, `output` defaults to `static`; build = `astro build && pagefind --site dist`). During the rewrite, three platform configs were shipped as a hedge before a host was chosen (documented in `fish-lsp-handoff.md`): Vercel (`vercel.json`), Cloudflare Pages (`public/_redirects` + `public/_headers`), and Fly.io (`fly.toml` + `Caddyfile`). The original fish-lsp.dev is hosted on **Vercel**, so the Cloudflare/Fly files are dead weight and should be removed — but a few redirect rules live *only* in the Cloudflare `_redirects` file and must be preserved first.

Separately, two advertised-but-incomplete features need finishing:
- The docs already **serve** `/schema/initialization-options.json` (via `src/lib/config-schema.ts`), but there's no guidance on how a JSON editor client actually uses it for `initializationOptions` autocomplete.
- `installation.mdx` advertises `curl -fsSL https://fish-lsp.dev/install.sh | fish`, but **no install script exists**.

This plan: (1) delete the non-Vercel host files and relocate their redirects, (2) add client-usage docs for the existing JSON schema, (3) create the missing curl install script (standalone-binary, fish).

---

## 1. Remove non-Vercel deploy files + relocate redirects

**Delete** (all Cloudflare/Fly-only; the site is static and Vercel-only):
- `fly.toml`, `Caddyfile` (Fly.io + its Caddy static server)
- `public/_headers` (Cloudflare headers — duplicates `vercel.json` headers)
- `public/_redirects` (Cloudflare redirects — the only source of the `/docs` and `/page/*` rules)

**Before deleting**, relocate the redirects. `public/_redirects` has:
`/docs → /docs/installation` (302), `/page → /docs/installation` (301), `/page/* → /docs/:splat` (301).
`vercel.json` currently has **stale** `/page → /page/installation` redirect + `/page/:slug` rewrite (points at the pre-rename `/page` routes — broken).

- **`astro.config.ts`** — add to the existing `redirects` map (host-agnostic, works in dev; the map already has `/docs/man`):
  ```ts
  redirects: {
    '/docs/man': '/docs/commands',
    '/docs': '/docs/installation',
    '/page': '/docs/installation',
  }
  ```
  (Bare single-route redirects that Astro can emit as static redirect pages.)
- **`vercel.json`** — remove the stale `rewrites` block and the stale `/page → /page/installation` redirect; replace with the wildcard (which Astro *cannot* statically enumerate, so it must stay host-level):
  ```json
  "redirects": [
    { "source": "/page/:path+", "destination": "/docs/:path+", "permanent": true }
  ]
  ```
  Keep everything else in `vercel.json` (headers, `cleanUrls`, `trailingSlash`).

**Note the split:** the `/page/*` wildcard can't be a static Astro redirect, so it lives in `vercel.json` while the bare routes live host-agnostically in `astro.config.ts`. Verify no real `src/pages/docs/index.*` route exists that would collide with the `/docs` redirect.

**Files:** `astro.config.ts`, `vercel.json`; delete `fly.toml`, `Caddyfile`, `public/_headers`, `public/_redirects`.

---

## 2. JSON schema — keep manual, add client-usage docs

Keep `src/lib/config-schema.ts` as the single hand-maintained source (its header already says "keep in sync with the fish-lsp release"). The endpoints under `src/pages/schema/*.json.ts` already emit the schemas with `Access-Control-Allow-Origin: *`, so they're consumable cross-origin as-is.

**Add a short "Editor autocomplete via JSON Schema" section** to the configuration docs page (locate the client/config doc under `src/content/` — likely `client-configuration.mdx` or the config reference) showing the two ways a JSON client consumes `https://fish-lsp.dev/schema/initialization-options.json`:
- **Inline `$schema`** in a JSON config file the client reads:
  ```json
  { "$schema": "https://fish-lsp.dev/schema/initialization-options.json", "fish_lsp_log_level": "info" }
  ```
- **Editor association** (e.g. VS Code `json.schemas`, or any `yaml`/`json` LSP `schemas` setting) mapping a file glob → the schema URL, for editors that don't support inline `$schema`.
- Mention the sibling schemas from the catalog at `/schema.json` (`config.json`, `vscode.json`, `env-defaults.json`) and that they're CORS-enabled.

Optionally add one line to `src/lib/config-schema.ts`'s header pointing at `fish-lsp`'s real source-of-truth for future syncing: Zod `ConfigSchema` (`src/config.ts`) + `src/snippets/fishlspEnvVariables.json`.

**Files:** one docs page under `src/content/` (new section); no code/endpoint changes.

---

## 3. Curl install script — standalone binary, `install.fish`

Create **`public/install.fish`** (served at `https://fish-lsp.dev/install.fish`). Written in fish; it downloads the prebuilt standalone from GitHub releases:

Script behavior:
1. `set -l bindir` = `$fish_lsp_install_dir` or default `~/.local/bin`; `mkdir -p`.
2. Download `https://github.com/ndonfris/fish-lsp/releases/latest/download/fish-lsp.standalone` → `$bindir/fish-lsp` (via `curl -fL`), with a clear error if the download 404s.
3. `chmod +x $bindir/fish-lsp`.
4. Ensure `$bindir` is on `$PATH` — if missing, `fish_add_path $bindir` (persists in fish) and tell the user.
5. Write completions: `fish-lsp complete > ~/.config/fish/completions/fish-lsp.fish` (guard on the binary running).
6. Verify with `fish-lsp info`; print success.

**Update docs:** `src/content/installation.mdx:36` — change the curl tab command from `.../install.sh | fish` to `curl -fsSL https://fish-lsp.dev/install.fish | fish` (matches the new filename; `curl | fish` pipes raw bytes so the `.fish` content-type / `nosniff` header is irrelevant).

**Prerequisites / caveats to flag to the user (blockers outside this repo):**
- The **`fish-lsp.standalone` release asset is not published yet** — it's built manually via `scripts/build-assets.fish` (`gh release upload <tag> ./release-assets/*`) and there's no release automation in the fish-lsp repo. The install script 404s until an asset is uploaded to `releases/latest`.
- The standalone is a **Node bundle, not a native binary** — it needs a Node ≥20 runtime and must carry a `#!/usr/bin/env node` shebang to be directly executable. Verify the esbuild `binary` config emits a shebang; if not, either add one in fish-lsp or have the script install a `node`-invoking wrapper. (The docs' "no Node.js required" claim for the standalone is inaccurate and should be corrected in a follow-up.)

**Files:** new `public/install.fish`; `src/content/installation.mdx`.

---

## Verification

- **Build:** `pnpm astro build` — confirm 0 errors. Check `dist/` no longer contains `_headers`/`_redirects`; confirm `dist/install.fish` exists; confirm static redirect pages exist for `/docs` and `/page` (e.g. `dist/docs/index.html` / `dist/page/index.html` with a meta-refresh to `/docs/installation`).
- **Redirects:** `pnpm astro dev` and hit `/docs`, `/page` (should 302/redirect to `/docs/installation`). The `/page/*` wildcard is Vercel-only — verify on a Vercel preview deploy.
- **Schema:** `curl -s http://localhost:4321/schema/initialization-options.json | head` returns the JSON Schema; sanity-check a JSON file with the `$schema` line autocompletes in an editor.
- **Install script:** `fish -n public/install.fish` (syntax check). Full run requires the release asset to exist; once published, `curl -fsSL https://fish-lsp.dev/install.fish | fish` then `fish-lsp info`.
- **Docs:** grep `installation.mdx` for the updated `install.fish` command; visually confirm the new schema-usage section renders.
