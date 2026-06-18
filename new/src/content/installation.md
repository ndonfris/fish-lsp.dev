---
title: Installation
description: Install fish-lsp via npm, yarn, pnpm, system packages, or from source
slug: installation
order: 1
section: Getting Started
---

# Installation

`fish-lsp` can be installed through several package managers. Some language
clients (e.g., [VSCode](https://marketplace.visualstudio.com/items?itemName=ndonfris.fish-lsp))
will automatically install the language server for you. For manual installation,
follow the steps below.

## Node Package Manager

```fish
# pnpm (recommended)
pnpm add -g fish-lsp

# npm
npm install -g fish-lsp

# yarn
yarn global add fish-lsp
```

## System Package Manager

> **Note:** Package availability varies by distro.

```fish
# Homebrew (macOS / Linux)
brew install fish-lsp

# Arch Linux
pacman -S fish-lsp

# Nix
nix-env -iA nixpkgs.fish-lsp
```

## Verify the Installation

```fish
fish-lsp --help
fish-lsp info
```

## Install Shell Completions

```fish
fish-lsp complete > ~/.config/fish/completions/fish-lsp.fish
```

> **Note:** Required for node-based installs. Source builds write completions automatically.

## Building from Source

See [Building from Source](/page/building-from-source) for full instructions.
