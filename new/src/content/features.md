---
title: Features
description: Complete list of fish-lsp LSP capabilities and their status
slug: features
order: 6
section: Reference
---

# Features

`fish-lsp` implements the [Language Server Protocol](https://microsoft.github.io/language-server-protocol/)
for the [fish shell](https://fishshell.com). The table below tracks the status of
each capability.

| Feature | Description | Status |
| --- | --- | --- |
| **Completion** | Completions for commands, variables, functions, and `--flags` | ✅ |
| **Hover** | Documentation for commands, flags, functions, and variables | ✅ |
| **Signature Help** | Shows the signature of a command or function | ✅ |
| **Goto Definition** | Jump to a command, variable, function, or `--flag` definition | ✅ |
| **Goto Implementation** | Jump between symbol definitions and completion definitions | ✅ |
| **Find References** | All references to a symbol — strips locally-shadowed globals | ✅ |
| **Rename** | Workspace-wide rename across matching global & local scope | ✅ |
| **Document Symbols** | All commands, variables, and functions in a document | ✅ |
| **Workspace Symbols** | All commands, variables, and functions in a workspace | ✅ |
| **Document Formatting** | Format a whole document or a selection | ✅ |
| **On-Type Formatting** | Format while typing | ✅ |
| **Document Highlight** | Highlight all references to the symbol at the cursor | ✅ |
| **Code Action** | Automated code generation / refactors | ✅ |
| **Quick Fix** | Auto-fix lint issues from diagnostics | ✅ |
| **Inlay Hint** | Virtual text / inlay hints | ✅ |
| **Diagnostics** | Linting with [error codes](/docs/diagnostic-codes) | ✅ |
| **Folding Range** | Collapsible regions | ✅ |
| **Selection Range** | Smart range expansion when selecting | ✅ |
| **Semantic Tokens** | Extra context-aware syntax highlighting | ✅ |
| **Command Execution** | Run a server command from the client | ✅ |
| **CLI Interactivity** | A CLI for server interaction, built via `fish-lsp complete` | ✅ |
| **Indexing** | Indexes commands, variables, functions, and sourced files | ✅ |
| **Logger** | Logs all server activity | ✅ |
| **Code Lens** | Inline actionable lenses | ✖ |

## Completions

`onComplete` and `onCompleteResolve` are both active:

- Chained short options (e.g. `ls -la`)
- Local symbol completions unique to the current file
- Documentation lookup on resolve
- Subcommand-aware completions (e.g. `string`, `path`, `status`)

## Hover

`onHover` resolves documentation for:

- Chained short options: `ls -la`
- Commands with subcommands: `git commit`
- Local symbols in `~/.config/fish/`
- Nearest reference: `set var "1"; set var "2";`

The hover fallback order is: symbol → prebuilt snippet → global symbol → man page → multi-reference.

## Prebuilt Snippets

The server ships curated, prebuilt documentation/completion data for fish
concepts that aren't discoverable from your workspace alone:

- Special fish variables (`$status`, `$pipestatus`, `$argv`, …)
- `$status` exit-code meanings (including `>128` signal codes)
- Environment & locale variables
- `fish_lsp_*` configuration variables
- Pipes and redirections
- Syntax-highlighting / theme variables and helper commands

These power hover and completion for shell features that have no definition in
your files.

## Diagnostics

Diagnostics are enabled by default and surface as lint warnings/errors, many with
quick fixes. Each rule has a stable code — see the full
[Diagnostic Error Codes](/docs/diagnostic-codes) reference. Codes can be disabled
individually via `fish_lsp_diagnostic_disable_error_codes` (see
[Server Configurations](/docs/server-configurations)) or with disable comments in
a file.

## Background Analysis

`initiateBackgroundAnalysis()` runs non-blocking workspace analysis on startup,
warming symbol caches before your first keypress so cross-file navigation and
references work immediately.
