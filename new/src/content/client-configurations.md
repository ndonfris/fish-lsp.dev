---
title: Client Configurations
description: Configure fish-lsp with Neovim, VSCode, coc.nvim, and other LSP clients
slug: client-configurations
order: 3
section: Configuration
---

# Client Configurations

`fish-lsp` works with any LSP-compatible editor. The general pattern:

1. **command** → `fish-lsp`
2. **arguments** → `start`
3. **filetype** → `fish`

## Pre-Built Examples

The [`fish-lsp-language-clients`](https://github.com/ndonfris/fish-lsp-language-clients)
repo has ready-to-use configs:

- [kickstart.nvim](https://github.com/ndonfris/fish-lsp-language-clients/tree/kickstart)
- [native neovim LSP](https://github.com/ndonfris/fish-lsp-language-clients/tree/native-nvim)
- [coc.nvim (complete)](https://github.com/ndonfris/fish-lsp-language-clients/tree/coc_example)
- [coc.nvim (minimal)](https://github.com/ndonfris/fish-lsp-language-clients/tree/coc_minimal)

## Neovim (native LSP)

```lua
require('lspconfig').fish_lsp.setup({
  cmd        = { 'fish-lsp', 'start' },
  filetypes  = { 'fish' },
  autostart  = true,
})
```

## coc.nvim — minimal `coc-settings.json`

```json
{
  "languageserver": {
    "fish-lsp": {
      "command":   "fish-lsp",
      "arguments": ["start"],
      "filetypes": ["fish"]
    }
  }
}
```

## coc.nvim — full config with workspace paths

```json
{
  "languageserver": {
    "fishlsp": {
      "command":   "fish-lsp",
      "filetypes": ["fish"],
      "arguments": ["start"],
      "revealOutputChannelOn": "info",
      "initializationOptions": {
        "workspaces": {
          "paths": {
            "defaults": ["$HOME/.config/fish", "/usr/share/fish"]
          }
        }
      }
    }
  }
}
```

## Testing in Isolation

```fish
# 1. Clone an example config under a separate Neovim appname
git clone https://github.com/ndonfris/fish-lsp-language-clients \
  -b coc_example ~/.config/nvim-fish-lsp

# 2. Aliases in config.fish
alias nvimfish 'NVIM_APPNAME=nvim-fish-lsp nvim'
alias nfl      'nvimfish ~/.config/fish/config.fish'

# 3. Launch
nfl
```
