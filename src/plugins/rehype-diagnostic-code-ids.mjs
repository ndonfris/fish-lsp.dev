/**
 * rehype plugin: give each diagnostic code cell an `id` so the page can be
 * deep-linked to a single row, e.g. `/docs/diagnostic-codes#1001`.
 *
 *   | Severity | Code       | ... |
 *   | ...      | **`1001`** | ... |
 *
 * becomes:
 *
 *   <td id="1001"><strong><code>1001</code></strong></td>
 *
 * - Only runs on `diagnostic-codes.mdx`.
 * - Only touches the column whose header text is `Code`, and only cells whose
 *   text is exactly 4 digits. Other cells and tables are left alone.
 * - The sticky-header offset lives in global.css (`.prose td[id]`).
 */

const FILE = 'diagnostic-codes.mdx';
const HEADER = 'Code';
const CODE_RE = /^\d{4}$/;

/** Concatenated text of a hast node. */
const textOf = (node) =>
  node.type === 'text' ? node.value : (node.children ?? []).map(textOf).join('');

/** Direct element children with the given tag name. */
const childrenByTag = (node, tag) =>
  (node.children ?? []).filter((c) => c.type === 'element' && c.tagName === tag);

/** All descendant elements with the given tag name. */
function findAll(node, tag, out = []) {
  for (const child of node.children ?? []) {
    if (child.type !== 'element') continue;
    if (child.tagName === tag) out.push(child);
    findAll(child, tag, out);
  }
  return out;
}

export default function rehypeDiagnosticCodeIds() {
  return (tree, file) => {
    const path = file?.path ?? file?.history?.[file.history.length - 1] ?? '';
    if (path.split(/[\\/]/).pop() !== FILE) return; // exact basename, not a suffix match

    for (const table of findAll(tree, 'table')) {
      const rows = findAll(table, 'tr');
      const header = rows.find((tr) => childrenByTag(tr, 'th').length);
      if (!header) continue;

      const col = childrenByTag(header, 'th').findIndex((th) => textOf(th).trim() === HEADER);
      if (col === -1) continue;

      for (const tr of rows) {
        const td = childrenByTag(tr, 'td')[col];
        const code = td && textOf(td).trim();
        if (code && CODE_RE.test(code)) {
          td.properties = { ...td.properties, id: code };
        }
      }
    }
  };
}
