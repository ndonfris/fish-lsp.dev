---
title: Features
description: Complete list of fish-lsp LSP handler status and planned work
slug: features
order: 4
section: Reference
---

# Features

`fish-lsp` implements the [Language Server Protocol](https://microsoft.github.io/language-server-protocol/)
for the [fish shell](https://fishshell.com).

## Completions

`onComplete` and `onCompleteResolve` are both active.

- Chained short options (e.g. `ls -la`)
- Local symbol completions unique to the current file
- Documentation lookup on resolve

## Hover

`onHover` resolves documentation for:

- Chained short options: `ls -la`
- Commands with subcommands: `git commit`
- Local symbols in `~/.config/fish/`
- Nearest reference: `set var "1"; set var "2";`

## Navigation

| Handler             | Status                                   |
|---------------------|------------------------------------------|
| `onDefinition`      | ✅                                       |
| `onReferences`      | ✅ — strips locally-shadowed globals     |
| `onDocumentSymbol`  | ✅                                       |
| `onWorkspaceSymbol` | ✅                                       |

## Editing

| Handler          | Status                                      |
|------------------|---------------------------------------------|
| `onRename`       | ✅ — does not rename autoloaded files        |
| `onFormat`       | ✅                                           |
| `onFormatRange`  | ✅                                           |
| `onFold`         | ✅                                           |

## Diagnostics

Infrastructure is wired; individual rules are a work in progress.

## Planned

- `onCodeAction`
- `onInlayHints` — previous impl too slow; being reworked
- `onIncomingCallHierarchy` / `onOutgoingCallHierarchy`
- Pipe, status, escape char, wildcard completions
- Completion sort by short/long options first

## Background Analysis

`initiateBackgroundAnalysis()` runs non-blocking workspace analysis on startup,
warming symbol caches before your first keypress.
