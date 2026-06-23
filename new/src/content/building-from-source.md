---
title: Building from Source
description: Clone the repo and build fish-lsp locally with yarn or pnpm
slug: building-from-source
order: 3
section: Getting Started
---

# Building from Source

```fish
git clone https://github.com/ndonfris/fish-lsp
cd fish-lsp
yarn install
yarn dev
```

`yarn dev` compiles the source and attempts to globally link the language server.

Confirm which binary is active:

```fish
fish-lsp info
```

## Manual Linking

If `yarn dev` fails to link but compilation succeeds, test the local binary first:

```fish
./bin/fish-lsp info
```

Then manually link:

```fish
# from the fish-lsp repo root
yarn unlink -g fish-lsp
yarn link -g .
```

## Re-linking for VSCode

```fish
cd ~/.vscode/extensions/ndonfris.fish-lsp-*/
yarn unlink fish-lsp && yarn link fish-lsp
```

## tree-sitter WASM

If compilation fails due to a missing `.wasm` file:

```fish
# using tree-sitter-cli
tree-sitter build-wasm /path/to/tree-sitter-fish/

# or use the bundled script
fish scripts/build-fish-wasm.fish
```

Place `tree-sitter-fish.wasm` in the project root before re-running the build.
