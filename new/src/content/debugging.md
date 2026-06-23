---
title: Debugging
description: Troubleshoot fish-lsp installation and editor connection issues
slug: debugging
order: 7
section: Reference
---

# Debugging

## `yarn install` Fails

Check which scripts run during install via `package.json`:

```json
{
  "scripts": {
    "postinstall": "..."
  }
}
```

Run each script in [`scripts/`](https://github.com/ndonfris/fish-lsp/tree/master/scripts)
individually:

```fish
fish scripts/<script-name>.fish
```

## `yarn compile` Throws an Error

Usually a missing or misplaced `tree-sitter-fish.wasm`:

```fish
# Option 1 — tree-sitter-cli
tree-sitter build-wasm /path/to/tree-sitter-fish/

# Option 2 — bundled script
fish scripts/build-fish-wasm.fish
```

Place the `.wasm` file in the **project root** before retrying.

## `fish-lsp` Not Found

Verify the binary was built:

```fish
~/path/to/fish-lsp/bin/fish-lsp --help
```

Link it if missing from `$PATH`:

```fish
cd ~/path/to/fish-lsp
yarn link
```

Or alias it directly:

```fish
alias fish-lsp ~/path/to/fish-lsp/out/cli.js
```

## Server Connects But Nothing Works

Check `fish-lsp info` — confirm you're on the expected version.

Verify your client config passes `start` as the argument:

```json
{
  "command":   "fish-lsp",
  "arguments": ["start"],
  "filetypes": ["fish"]
}
```

See [Client Configurations](/docs/client-configurations) for editor-specific examples.

## Logging

The server writes to `./logs.txt` by default. Point your client's `rootDir` or
`workspaceFolder` accordingly, or pass a custom log path via startup options.
