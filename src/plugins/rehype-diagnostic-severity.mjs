/**
 * rehype plugin: colour each diagnostic severity cell, so the table source can
 * use the bare label instead of a hand-written `<span class="...">`.
 *
 *   | Severity | Code       | ... |
 *   | ERROR    | **`1001`** | ... |
 *
 * becomes:
 *
 *   <td><span class="text-red-400">ERROR</span></td>
 *
 * - Only runs on `diagnostic-codes.mdx`.
 * - Only touches the column whose header text is `Severity`, and only cells
 *   whose text is exactly one of the labels below. Other cells and tables are
 *   left alone.
 */

const FILE = 'diagnostic-codes.mdx';
const HEADER = 'Severity';
const COLORS = {
  ERROR:   'text-red-400',
  WARNING: 'text-yellow-400',
  INFO:    'text-blue-600',
  HINT:    'text-gray-400',
};

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

export default function rehypeDiagnosticSeverity() {
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
        const label = td && textOf(td).trim();
        if (label && Object.hasOwn(COLORS, label)) {
          td.children = [{
            type: 'element',
            tagName: 'span',
            properties: { className: [COLORS[label]] },
            children: [{ type: 'text', value: label }],
          }];
        }
      }
    }
  };
}
