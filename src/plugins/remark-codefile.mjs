/**
 * remark plugin: turn a fenced code block whose meta names a file path into the
 * <CodeFile> component.
 *
 *   ```fish /tmp/filename.fish  short description
 *   # code in file
 *   ```
 *
 * becomes:
 *
 *   <CodeFile file="/tmp/filename.fish" lang="fish" info="short description"
 *             code={"# code in file"} />
 *
 * - The first whitespace-delimited meta token must look like a path (contains
 *   "/" or ends in ".ext"); everything after it becomes the optional `info`.
 * - An `icon=…` token controls the code-type icon:
 *     (none)         → icon={true}  (auto-infer from the extension, e.g. .fish)
 *     icon=vscode    → icon="vscode" (explicit astro-icon name)
 *     icon=false     → icon={false}  (no icon)
 * - Only runs on `.mdx` files (it emits JSX) and auto-injects the import.
 * - Non-matching fences (```fish, ```fish {1,2}, ```mermaid, …) are untouched.
 */

const COMPONENT = 'CodeFile';
const IMPORT_PATH = '@components/CodeFile.astro';

const looksLikePath = (tok) => tok.includes('/') || /\.\w+$/.test(tok);

const stringLiteral = (value) => ({ type: 'Literal', value, raw: JSON.stringify(value) });

// A plain string attribute: name="value"
const strAttr = (name, value) => ({ type: 'mdxJsxAttribute', name, value });

// An expression attribute holding a literal: name={expr}. `raw` is the source
// text; for strings it preserves newlines/quotes exactly (used for the code
// body), for booleans it's true/false.
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

export default function remarkCodeFile() {
  return (tree, file) => {
    const path = file?.path ?? file?.history?.[file.history.length - 1] ?? '';
    if (!path.endsWith('.mdx')) return; // only MDX can render components

    let used = false;

    const walk = (node) => {
      if (!node || !Array.isArray(node.children)) return;
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        if (child.type === 'code' && child.meta) {
          const [fileTok, ...rest] = child.meta.trim().split(/\s+/);
          if (fileTok && looksLikePath(fileTok)) {
            // Pull an optional `icon=…` token out of the remaining meta; the
            // rest becomes the description. Default: auto-infer (icon={true}).
            let iconAttr = litExprAttr('icon', true);
            const infoTokens = [];
            for (const tok of rest) {
              const m = /^icon=(.+)$/.exec(tok);
              if (m) {
                const v = m[1];
                iconAttr =
                  v === 'true' || v === 'false'
                    ? litExprAttr('icon', v === 'true')
                    : strAttr('icon', v);
              } else {
                infoTokens.push(tok);
              }
            }
            const info = infoTokens.join(' ');
            node.children[i] = {
              type: 'mdxJsxFlowElement',
              name: COMPONENT,
              attributes: [
                strAttr('file', fileTok),
                ...(child.lang ? [strAttr('lang', child.lang)] : []),
                iconAttr,
                ...(info ? [strAttr('info', info)] : []),
                litExprAttr('code', child.value ?? ''),
              ],
              children: [],
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

    // Auto-inject `import CodeFile from '…'` if the file doesn't already have it.
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
