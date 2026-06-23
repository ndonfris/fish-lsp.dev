---
title: Client Configurations
description: Configure fish-lsp with Neovim, VSCode, Emacs, Helix, and other LSP clients
slug: client-configurations
order: 4
section: Configuration
---

# Client Configurations

`fish-lsp` works with any LSP-compatible editor. In almost every client the
configuration boils down to translating one shell command for `fish` files:

1. **command** → `fish-lsp`
2. **arguments** → `start`
3. **filetype** → `fish`

> [!NOTE]
> Editors like VSCode/VSCodium install and wire up the server automatically via
> their extension — no client configuration required. A
> [server configuration](/docs/server-configurations) can still be applied.

## Pre-Built Examples

The [`fish-lsp-language-clients`](https://github.com/ndonfris/fish-lsp-language-clients)
repo has ready-to-use, testable configs:

- [kickstart.nvim](https://github.com/ndonfris/fish-lsp-language-clients/tree/kickstart)
- [native neovim LSP](https://github.com/ndonfris/fish-lsp-language-clients/tree/native-nvim)
- [coc.nvim (complete)](https://github.com/ndonfris/fish-lsp-language-clients/tree/coc_example)
- [coc.nvim (minimal)](https://github.com/ndonfris/fish-lsp-language-clients/tree/coc_minimal)

## Neovim (native LSP, `>= 0.8`)

```lua
vim.api.nvim_create_autocmd('FileType', {
  pattern = 'fish',
  callback = function()
    vim.lsp.start({
      name = 'fish-lsp',
      cmd = { 'fish-lsp', 'start' },
    })
  end,
})
```

Or use [nvim-lspconfig](https://github.com/neovim/nvim-lspconfig/blob/master/doc/configs.md#fish_lsp):

```lua
require('lspconfig').fish_lsp.setup({})
```

## mason.nvim

```vim
:MasonInstall fish-lsp
```

## coc.nvim

Minimal `coc-settings.json`:

```json
{
  "languageserver": {
    "fish-lsp": {
      "command": "fish-lsp",
      "filetypes": ["fish"],
      "args": ["start"]
    }
  }
}
```

Full config with workspace paths:

```json
{
  "languageserver": {
    "fishlsp": {
      "command": "fish-lsp",
      "filetypes": ["fish"],
      "args": ["start"],
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

## YouCompleteMe

```vim
let g:ycm_language_server =
      \ [
      \   {
      \       'name': 'fish',
      \       'cmdline': [ 'fish-lsp', 'start' ],
      \       'filetypes': [ 'fish' ],
      \   }
      \ ]
```

## vim-lsp

```vim
if executable('fish-lsp')
  au User lsp_setup call lsp#register_server({
      \ 'name': 'fish-lsp',
      \ 'cmd': {server_info->['fish-lsp', 'start']},
      \ 'allowlist': ['fish'],
      \ })
endif
```

## Helix

In `~/.config/helix/languages.toml`:

```toml
[[language]]
name = "fish"
language-servers = [ "fish-lsp" ]

[language-server.fish-lsp]
command = "fish-lsp"
args = ["start"]
environment = { "fish_lsp_show_client_popups" = "false" }
```

## Kakoune

For [kakoune-lsp](https://github.com/kakoune-lsp/kakoune-lsp), in `~/.config/kak-lsp/kak-lsp.toml`:

```toml
[language.fish]
filetypes = ["fish"]
command = "fish-lsp"
args = ["start"]
```

## Kate

```json
{
  "servers": {
    "fish": {
      "command": ["fish-lsp", "start"],
      "url": "https://github.com/ndonfris/fish-lsp",
      "highlightingModeRegex": "^fish$"
    }
  }
}
```

## Emacs

Using [eglot](https://github.com/joaotavora/eglot) (built into Emacs 29+):

```elisp
(require 'eglot)
(add-to-list 'eglot-server-programs
  '(fish-mode . ("fish-lsp" "start")))
(add-hook 'fish-mode-hook 'eglot-ensure)
```

Using [lsp-mode](https://github.com/emacs-lsp/lsp-mode):

```elisp
(require 'lsp-mode)
(lsp-register-client
 (make-lsp-client
  :new-connection (lsp-stdio-connection '("fish-lsp" "start"))
  :activation-fn (lsp-activate-on "fish")
  :server-id 'fish-lsp))
(add-hook 'fish-mode-hook #'lsp)
```

## VSCode / VSCodium

Install the extension and the server works out-of-the-box — no client config:

- [VSCode Marketplace](https://marketplace.visualstudio.com/items?itemName=ndonfris.fish-lsp)
- [Open VSX (VSCodium)](https://open-vsx.org/extension/ndonfris/fish-lsp)
- [Extension source](https://github.com/ndonfris/vscode-fish-lsp)

## BBEdit / IntelliJ

- **BBEdit** — follow the [`bbedit` branch instructions](https://github.com/ndonfris/fish-lsp-language-clients/blob/bbedit/BBEdit%20Install.md) (includes a `Fish.plist` for highlighting).
- **IntelliJ** — see [jetbrains-fish](https://github.com/tox-dev/jetbrains-fish?tab=readme-ov-file#installation).

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

> [!TIP]
> Missing a client? [Open a PR](https://github.com/ndonfris/fish-lsp-language-clients/pulls)
> with your configuration.
