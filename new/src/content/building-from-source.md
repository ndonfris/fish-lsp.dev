---
title: Building from Source
description: Clone the repo and build fish-lsp locally with yarn
slug: building-from-source
order: 3
section: Getting Started
---

# Building from Source

Building from source is the most portable installation method.

**Recommended toolchain:** `yarn@1.22.22`, `node@22.14.0`, `fish@4.0.8`
(Node.js `>= 20` is required).

```fish
git clone https://github.com/ndonfris/fish-lsp
cd fish-lsp

yarn install
yarn build
```

`yarn build` compiles the source and links `./dist/fish-lsp` into your
`yarn global bin` `$PATH`. Confirm which binary is active:

```fish
fish-lsp info
```

## Manual Linking

If `yarn build` compiles but fails to link, test the local binary first:

```fish
./dist/fish-lsp info
```

Then link it manually from the repo root:

```fish
yarn unlink -g fish-lsp
yarn link -g .
```

## Re-linking for VSCode

```fish
cd ~/.vscode/extensions/ndonfris.fish-lsp-*/
yarn unlink fish-lsp && yarn link fish-lsp
```

## tree-sitter WASM

The build needs `tree-sitter-fish.wasm`. The asset build script fetches/links it:

```fish
fish scripts/build-assets.fish
```

If you already have a `.wasm` elsewhere (or built your own from
[tree-sitter-fish](https://github.com/ram02z/tree-sitter-fish)), point the server
at it instead of rebuilding:

```fish
set -gx fish_lsp_tree_sitter_wasm_path ~/path/to/tree-sitter-fish.wasm
```

## Development

```fish
yarn dev      # watch + rebuild while developing
yarn test     # run the test suite
yarn typecheck
```

See the [Contributing guide](https://github.com/ndonfris/fish-lsp/blob/master/docs/CONTRIBUTING.md)
for the full development workflow.
