/**
 * remark plugin: turn a fenced code block tagged `prompt` into the
 * <CommandPrompt> component. A `---` line splits the command from its output.
 *
 *   ```fish prompt
 *   fish-lsp --help
 *   ---
 *   usage: fish-lsp [options]...
 *   ```
 *
 * becomes:
 *
 *   <CommandPrompt command={"fish-lsp --help"} lang="fish">
 *     <Fragment slot="output">
 *       ```text
 *       usage: fish-lsp [options]...
 *       ```
 *     </Fragment>
 *   </CommandPrompt>
 *
 * - Trigger: the first meta token is `prompt`. Extra tokens are flags:
 *     open       → start expanded (open={true})
 *     out=<lang> → language for the output code block (default "text")
 * - No `---` line → command only (no output slot, non-expandable).
 * - Only runs on `.mdx` files (it emits JSX) and auto-injects the import.
 */

const COMPONENT = 'CommandPrompt';
const IMPORT_PATH = '@components/CommandPrompt.astro';

const stringLiteral = (value) => ({ type: 'Literal', value, raw: JSON.stringify(value) });

const strAttr = (name, value) => ({ type: 'mdxJsxAttribute', name, value });

// name={<literal>} — string literals preserve newlines/quotes; booleans render true/false.
const litExprAttr = (name, value) => ({
  type: 'mdxJsxAttribute',
  name,
  value: {
    type: 'mdxJsxAttributeValueExpression',
    value: typeof value === 'string' ? JSON.stringify(value) : String(value),
    data: {
      estree: {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'Literal',
              value,
              raw: typeof value === 'string' ? JSON.stringify(value) : String(value),
            },
          },
        ],
      },
    },
  },
});

export default function remarkCommandPrompt() {
  return (tree, file) => {
    const path = file?.path ?? file?.history?.[file.history.length - 1] ?? '';
    if (!path.endsWith('.mdx')) return; // only MDX can render components

    let used = false;

    const walk = (node) => {
      if (!node || !Array.isArray(node.children)) return;
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        if (child.type === 'code' && child.meta) {
          const [tag, ...flags] = child.meta.trim().split(/\s+/);
          if (tag === 'prompt') {
            const open = flags.includes('open');
            const outLang = (flags.find((f) => f.startsWith('out=')) ?? 'out=text').slice(4);

            // Split the body on the first `---` line into command / output.
            const lines = (child.value ?? '').split('\n');
            const sep = lines.findIndex((l) => /^-{3,}\s*$/.test(l.trim()));
            const command =
              (sep >= 0 ? lines.slice(0, sep).join('\n') : child.value ?? '').trim();
            const output =
              sep >= 0
                ? lines.slice(sep + 1).join('\n').replace(/^\n+/, '').replace(/\s+$/, '')
                : null;

            const attributes = [
              litExprAttr('command', command),
              ...(child.lang ? [strAttr('lang', child.lang)] : []),
              ...(open ? [litExprAttr('open', true)] : []),
            ];

            const children =
              output != null
                ? [
                    {
                      type: 'mdxJsxFlowElement',
                      name: 'Fragment',
                      attributes: [strAttr('slot', 'output')],
                      children: [{ type: 'code', lang: outLang, meta: null, value: output }],
                    },
                  ]
                : [];

            node.children[i] = {
              type: 'mdxJsxFlowElement',
              name: COMPONENT,
              attributes,
              children,
            };
            used = true;
            continue;
          }
        }
        walk(child);
      }
    };
    walk(tree);

    if (!used) return;

    const hasImport = tree.children.some(
      (n) => n.type === 'mdxjsEsm' && typeof n.value === 'string' && n.value.includes(COMPONENT),
    );
    if (hasImport) return;

    const insertAt = tree.children.findIndex((n) => n.type !== 'yaml' && n.type !== 'toml');
    tree.children.splice(insertAt < 0 ? 0 : insertAt, 0, {
      type: 'mdxjsEsm',
      value: `import ${COMPONENT} from '${IMPORT_PATH}';`,
      data: {
        estree: {
          type: 'Program',
          sourceType: 'module',
          body: [
            {
              type: 'ImportDeclaration',
              specifiers: [
                { type: 'ImportDefaultSpecifier', local: { type: 'Identifier', name: COMPONENT } },
              ],
              source: stringLiteral(IMPORT_PATH),
            },
          ],
        },
      },
    });
  };
}
