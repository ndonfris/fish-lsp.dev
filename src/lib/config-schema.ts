/**
 * Single source of truth for the `fish_lsp_*` configuration, transcribed from
 * the fish-lsp source: `src/config.ts` (`ConfigSchema` / `ConfigHandlerSchema`
 * → keys, types, defaults) + `src/snippets/fishlspEnvVariables.json`
 * (descriptions, option enums, value types).
 *
 * Used to generate the JSON Schemas served under `/schema/*`:
 *   - /schema/config.json                  the fish_lsp_* config object schema
 *   - /schema/initialization-options.json  the LSP `initializationOptions` schema (canonical)
 *   - /schema/vscode.json                  VSCode `fish-lsp.*` settings ($ref → init-options)
 *   - /schema/vscode-contributes.json      self-contained VSCode contributes.configuration
 *   - /schema/coc.json                     coc.nvim languageserver entry ($ref → init-options)
 *   - /schema/env-defaults.json            the default values (fish-lsp env --json)
 *
 * Keep this in sync with the fish-lsp release the site documents.
 */

export const SITE = 'https://fish-lsp.dev';

/** Language-server handlers (from `ConfigHandlerSchema`). */
export const HANDLERS = [
  'complete', 'hover', 'rename', 'definition', 'implementation', 'reference',
  'logger', 'formatting', 'formatRange', 'typeFormatting', 'codeAction',
  'codeLens', 'folding', 'selectionRange', 'signature', 'executeCommand',
  'inlayHint', 'highlight', 'diagnostic', 'popups', 'semanticTokens',
] as const;

export const LOG_LEVELS = ['debug', 'info', 'warning', 'error', 'log'] as const;

/** Diagnostic error codes that can be disabled. */
export const DIAGNOSTIC_CODES = [
  1001, 1002, 1003, 1004, 1005, 2001, 2002, 2003, 2004, 3001, 3002, 3003,
  4001, 4002, 4003, 4004, 4005, 4006, 4007, 4008, 4009, 5001, 5555, 6001,
  7001, 8001, 9999,
] as const;

type JSONSchema = Record<string, unknown>;

/**
 * JSON Schema fragment + default for every `fish_lsp_*` property. The order
 * matches `ConfigSchema` in the fish-lsp source.
 */
export const configProperties: Record<string, JSONSchema & { default: unknown }> = {
  fish_lsp_enabled_handlers: {
    type: 'array',
    items: { type: 'string', enum: [...HANDLERS] },
    uniqueItems: true,
    default: [],
    description: 'Handlers to explicitly enable. By default all stable handlers are enabled.',
  },
  fish_lsp_disabled_handlers: {
    type: 'array',
    items: { type: 'string', enum: [...HANDLERS] },
    uniqueItems: true,
    default: [],
    description: 'Handlers to disable. By default non-stable handlers are disabled.',
  },
  fish_lsp_commit_characters: {
    type: 'array',
    items: { type: 'string' },
    default: ['\t', ';', ' '],
    description: 'Single-character strings that accept the selected completion item.',
  },
  fish_lsp_log_file: {
    type: 'string',
    default: '',
    description: "Path to the log file. An empty string disables logging. e.g. '/tmp/fish_lsp.log'.",
  },
  fish_lsp_log_level: {
    type: 'string',
    enum: ['', ...LOG_LEVELS],
    default: '',
    description: 'Logging severity level written to the log file.',
  },
  fish_lsp_all_indexed_paths: {
    type: 'array',
    items: { type: 'string' },
    default: ['$__fish_config_dir', '$__fish_data_dir'],
    description: 'Fish paths to index as workspaces on startup. Order matters (config dir before data dir).',
  },
  fish_lsp_modifiable_paths: {
    type: 'array',
    items: { type: 'string' },
    default: ['$__fish_config_dir'],
    description: 'Workspaces where global symbols may be renamed by the user.',
  },
  fish_lsp_diagnostic_disable_error_codes: {
    type: 'array',
    items: { type: 'integer', enum: [...DIAGNOSTIC_CODES] },
    uniqueItems: true,
    default: [],
    description: 'Diagnostic error codes to disable. See https://fish-lsp.dev/docs/diagnostic-codes.',
  },
  fish_lsp_max_diagnostics: {
    type: 'integer',
    minimum: 0,
    default: 0,
    description: 'Maximum diagnostics returned per file. 0 means unlimited.',
  },
  fish_lsp_enable_experimental_diagnostics: {
    type: 'boolean',
    default: false,
    description: 'Enable experimental diagnostics using `fish --no-execute` (enables code 9999).',
  },
  fish_lsp_strict_conditional_command_warnings: {
    type: 'boolean',
    default: false,
    description: 'Diagnostic 3002: also flag conditionally-chained commands that should check existence.',
  },
  fish_lsp_prefer_builtin_fish_commands: {
    type: 'boolean',
    default: false,
    description: 'Diagnostic 2004: warn when an external command could be replaced by a fish builtin.',
  },
  fish_lsp_allow_fish_wrapper_functions: {
    type: 'boolean',
    default: true,
    description: 'Diagnostic 2002: when false, warn on `alias`/`export` etc. instead of fish builtins.',
  },
  fish_lsp_require_autoloaded_functions_to_have_description: {
    type: 'boolean',
    default: true,
    description: 'Diagnostic 4008: warn when an autoloaded function has no description.',
  },
  fish_lsp_max_background_files: {
    type: 'integer',
    minimum: 0,
    default: 10000,
    description: 'Maximum number of background files read into the buffer on startup.',
  },
  fish_lsp_show_client_popups: {
    type: 'boolean',
    default: true,
    description: 'Whether the client should receive pop-up window notification requests.',
  },
  fish_lsp_single_workspace_support: {
    type: 'boolean',
    default: true,
    description: 'Limit the server to only the currently open workspace.',
  },
  fish_lsp_ignore_paths: {
    type: 'array',
    items: { type: 'string' },
    default: ['**/.git/**', '**/node_modules/**', '**/containerized/**', '**/docker/**'],
    description: 'Glob paths to never index when searching a parent folder.',
  },
  fish_lsp_max_workspace_depth: {
    type: 'integer',
    minimum: 1,
    default: 3,
    description: 'Maximum directory depth to search when indexing a workspace on startup.',
  },
  fish_lsp_fish_path: {
    type: 'string',
    default: 'fish',
    description: 'Path to the fish executable used for the server\'s spawned child processes. Typically set via `initializationOptions`, not as an environment variable.',
  },
  fish_lsp_tree_sitter_wasm_path: {
    type: 'string',
    default: '',
    description: 'Path to a custom `tree-sitter-fish.wasm` for the parser to use.',
  },
  fish_lsp_show_subcommand_semantic_tokens: {
    type: 'boolean',
    default: true,
    description: 'Highlight `COMMAND SUBCOMMAND` tokens together (e.g. `string collect`, `path resolve`).',
  },
};

/** Plain object of every property's default value (= `fish-lsp env --json`). */
export const configDefaults: Record<string, unknown> = Object.fromEntries(
  Object.entries(configProperties).map(([k, v]) => [k, v.default]),
);

/** The canonical schema every client schema reuses via `$ref`. */
export const INIT_OPTIONS_URL = `${SITE}/schema/initialization-options.json`;

/** JSON Schema for the `fish_lsp_*` configuration object. */
export function buildConfigSchema(opts: { id: string; title: string; description: string }): JSONSchema {
  return {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: `${SITE}${opts.id}`,
    title: opts.title,
    description: opts.description,
    type: 'object',
    additionalProperties: false,
    properties: Object.fromEntries(
      Object.entries(configProperties).map(([k, v]) => [k, v]),
    ),
  };
}

/**
 * VSCode `fish-lsp.*` settings schema. Rather than re-declaring every option,
 * each property `$ref`s the matching sub-schema in initialization-options.json,
 * so the definitions stay in one place. (draft-2020-12 lets `$ref` sit beside
 * the VSCode-specific `scope`/`default` keywords; the JSON language service
 * resolves the external URL for settings.json autocomplete.)
 */
export function buildVscodeConfiguration(): JSONSchema {
  const properties = Object.fromEntries(
    Object.entries(configProperties).map(([k, v]) => [
      `fish-lsp.${k}`,
      { $ref: `${INIT_OPTIONS_URL}#/properties/${k}`, default: v.default, scope: 'resource' },
    ]),
  );
  return {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: `${SITE}/schema/vscode.json`,
    title: 'fish-lsp VSCode configuration',
    description:
      'VSCode `fish-lsp.*` settings. Each property $refs the shared ' +
      'initialization-options schema so option definitions stay in one place.',
    type: 'object',
    properties,
  };
}

/**
 * Self-contained VSCode `contributes.configuration` — the same `fish-lsp.*`
 * settings with every definition *inlined* (no external `$ref`). Use this when
 * embedding in an extension's package.json, where the extension host does not
 * resolve external `$ref`s (unlike vscode.json, which is for the JSON language
 * service). Kept in sync automatically since both derive from configProperties.
 */
export function buildVscodeContributes(): JSONSchema {
  const properties = Object.fromEntries(
    Object.entries(configProperties).map(([k, { default: def, ...rest }]) => [
      `fish-lsp.${k}`,
      { ...rest, default: def, scope: 'resource' },
    ]),
  );
  return {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: `${SITE}/schema/vscode-contributes.json`,
    title: 'fish-lsp VSCode contributes.configuration',
    description:
      'Self-contained VSCode `contributes.configuration` properties (fish-lsp.* ' +
      'settings) for embedding in an extension package.json — no external $ref.',
    type: 'object',
    properties,
  };
}

/**
 * coc.nvim `coc-settings.json` fragment: the `languageserver.fish-lsp` entry.
 * `initializationOptions` `$ref`s initialization-options.json whole, so coc
 * gets the same autocomplete/validation from the single shared schema.
 */
export function buildCocConfiguration(): JSONSchema {
  return {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: `${SITE}/schema/coc.json`,
    title: 'fish-lsp coc.nvim configuration',
    description:
      "coc-settings.json fragment registering fish-lsp under coc.nvim's " +
      '`languageserver` key. `initializationOptions` $refs the shared ' +
      'initialization-options schema.',
    type: 'object',
    properties: {
      languageserver: {
        type: 'object',
        properties: {
          'fish-lsp': {
            type: 'object',
            description: 'fish-lsp language server registration.',
            properties: {
              command: { type: 'string', default: 'fish-lsp' },
              args: { type: 'array', items: { type: 'string' }, default: ['start'] },
              filetypes: { type: 'array', items: { type: 'string' }, default: ['fish'] },
              rootPatterns: { type: 'array', items: { type: 'string' } },
              initializationOptions: { $ref: INIT_OPTIONS_URL },
            },
          },
        },
      },
    },
  };
}
