---
title: CLI Commands
description: Reference for the fish-lsp command, its subcommands, and common flags
slug: commands
order: 7
section: Reference
---

# CLI Commands

```
fish-lsp [OPTIONS]
fish-lsp [SUBCOMMAND] [OPTIONS]
```

`fish-lsp` is driven by a small set of subcommands. The most important is
`start` (used by editors); the rest help you configure, inspect, and debug the
server.

## Global Options

```fish
fish-lsp --version        # version information
fish-lsp --help           # help message
fish-lsp --help-all       # every subcommand and flag
fish-lsp --help-short     # shortened help
fish-lsp --help-man       # manpage-style output
```

## `start`

Start the language server. This is the command your editor runs.

```fish
fish-lsp start
```

| Flag | Description |
| --- | --- |
| `--enable <handler...>` | Enable specific handlers |
| `--disable <handler...>` | Disable specific handlers |
| `--dump` | Print the resolved/enabled features as JSON and exit |
| `--stdio` | Use stdin/stdout for communication (default) |
| `--node-ipc` | Use Node IPC for communication |
| `--socket <port>` | Use a TCP socket |
| `--memory-limit <mb>` | Set a memory usage limit (MB) |
| `--max-files <number>` | Override the max number of files to analyze |
| `--web` | Web mode (used by the [playground](https://fish-lsp.dev/playground)) |

```fish
# inspect which handlers are enabled, without actually running the server
fish-lsp start --disable complete signature --dump
```

> Flags override their corresponding [environment variables](/docs/server-configurations#environment-variables).

## `env`

Generate the `fish_lsp_*` [environment variables](/docs/server-configurations).

```fish
fish-lsp env --create                 # full template (commented)
fish-lsp env --show-default           # template with default values
fish-lsp env --show-default --confd   # conf.d-ready (sourced only if installed)
fish-lsp env --show-default --json    # JSON (for a VSCode settings.json)
```

| Flag | Description |
| --- | --- |
| `-c`, `--create` | Create the environment variables |
| `-s`, `--show` | Show the current environment variables |
| `--show-default` | Show default values |
| `--only <VAR>` | Limit output to specific variables |
| `--confd` | Output for `conf.d/fish-lsp.fish` |
| `--json` | Output as a JSON object |
| `--no-comments` | Omit explanatory comments |
| `--no-global` / `--no-local` / `--no-export` | Control variable scope/export |

## `info`

Show build info and run diagnostics. See [Debugging](/docs/debugging) for usage.

| Flag | Description |
| --- | --- |
| `--bin` / `--path` | Path of the executable / installation |
| `--version` / `--lsp-version` | fish-lsp / vscode-languageserver version |
| `--build-time` / `--build-type` | Build metadata |
| `--capabilities` | LSP capabilities |
| `--check-health` | Run diagnostics and report health |
| `--time-startup` / `--time-only` | Time the startup/indexing |
| `--use-workspace <PATH>` | Scope `--time-startup` to a folder |
| `--log-file` / `--man-file` | Path of the log / man file (`--show` to print contents) |
| `--dump-parse-tree <FILE>` | tree-sitter AST for a file |
| `--dump-symbol-tree <FILE>` | fish-lsp symbol tree for a file |
| `--dump-semantic-tokens <FILE>` | Semantic tokens for a file |
| `--short` / `--json` | Compact / JSON output |

```fish
fish-lsp info --check-health
fish-lsp info --short --json
```

## `complete`

Generate completions for the `fish-lsp` command itself.

```fish
fish-lsp complete > ~/.config/fish/completions/fish-lsp.fish
```

| Flag | Description |
| --- | --- |
| `--names` / `--names-with-summary` | Feature names (optionally with summaries) |
| `--fish` | Output the fish completion script |
| `--env-variables` / `--env-variable-names` | `fish_lsp_*` completions |
| `--abbreviations` | Subcommand [abbreviations](/docs/abbreviations) |

## `url`

Print a helpful project URL.

```fish
fish-lsp url --repo          # GitHub repo
fish-lsp url --npm           # npm package
fish-lsp url --wiki          # GitHub wiki
fish-lsp url --discussions   # discussions
fish-lsp url --clients-repo  # client configuration examples
```

## Man Page

```fish
# install the manpage on your system
fish-lsp info --man-file --show > $MANPATH[1]/man1/fish-lsp.1
```

You can also download `fish-lsp.1` from the
[latest GitHub release](https://github.com/ndonfris/fish-lsp/releases/latest).
