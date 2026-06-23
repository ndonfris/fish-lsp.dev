---
title: Sources
description: Sources and references that were used to help build the project.
slug: sources
order: 11
section: Reference
---

## Sources

> The following sources were major influences on the project's overall design and structure.

- __Official Documentation__ 
  - [__LSP__](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#headerPart)
  - [__LSIF__](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#headerPart)
  - [__vscode-extension-samples__](https://github.com/microsoft/vscode-extension-samples/tree/main)
  - [__Tree-Sitter__](https://tree-sitter.github.io/tree-sitter/)
  - [__Tree-Sitter-Fish__](https://github.com/ram02z/tree-sitter-fish)

- __Related/Similar projects__
  - [vscode-languageserver-node/testbed](https://github.com/microsoft/vscode-languageserver-node/tree/main/testbed)
  - [awk-language-server](https://github.com/Beaglefoot/awk-language-server/tree/master/server)
  - [bash-language-server](https://github.com/bash-lsp/bash-language-server/tree/main/server/src)
  - [coc.fish](https://github.com/oncomouse/coc-fish)
  - [typescript-language-server](https://github.com/typescript-language-server/typescript-language-server#running-the-language-server)
  - [coc-tsserver](https://github.com/neoclide/coc-tsserver)
  - [json-language-server-release.xz](https://github.com/zed-industries/json-language-server) && [json-language-server](https://github.com/microsoft/vscode-json-languageservice/blob/main/README.md)

- __Important Packages__
  - [vscode-jsonrpc](https://www.npmjs.com/package/vscode-jsonrpc)
  - [vscode-languageserver](https://github.com/Microsoft/vscode-languageserver-node)
  - [vscode-languageserver-textdocument](https://github.com/Microsoft/vscode-languageserver-node)

- __Default Implementation Git Repos__
  - [client implementation](https://github.com/microsoft/vscode-languageserver-node/blob/main/client/src/common)
  - [server implementation](https://github.com/microsoft/vscode-languageserver-node/tree/main/server/src/common)  

---

## [VSCODE EXTENSION EXAMPLES](https://github.com/microsoft/vscode-extension-samples/tree/main)

> _helpful guides provided by the vscode-languge-server package, as guides._ __Typically__ these are
> very helpful for getting an initial understanding of how the language-service could be used in the
> client.  

- [Diagnostic](https://github.com/microsoft/vscode-extension-samples/blob/main/diagnostic-related-information-sample/src/extension.ts)
- [Code Actions](https://github.com/microsoft/vscode-extension-samples/tree/main/code-actions-sample)
- [Code Lens](https://github.com/microsoft/vscode-extension-samples/tree/main/codelens-sample)
- [Command](https://github.com/microsoft/vscode-extension-samples/tree/main/helloworld-test-cli-sample)
- [Notification](https://github.com/microsoft/vscode-extension-samples/tree/main/notifications-sample)
- [Progress Notification](https://github.com/microsoft/vscode-extension-samples/tree/main/progress-sample)
- [Semantic Tokens](https://github.com/microsoft/vscode-extension-samples/tree/main/semantic-tokens-sample)
- [Quick Fix](https://github.com/microsoft/vscode-extension-samples/tree/main/task-provider-sample)
- [Simpler Quick Fix](https://github.com/microsoft/vscode-extension-samples/blob/main/lsp-user-input-sample/server/src/sampleServer.ts#L58)
- [Simple Client](https://github.com/microsoft/vscode-extension-samples/blob/main/lsp-embedded-language-service/client/src/extension.ts)
