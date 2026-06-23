/**
 * Adds an icon copy-to-clipboard button to code blocks. The copy icon is read
 * from a `<template id="copy-icon-tmpl">` rendered server-side (astro-icon), so
 * pages using this must include that template.
 */
export interface CopyButtonOptions {
  /** Elements to attach a copy button to. */
  selector: string;
  /**
   * true  → wrap each element in a positioned `.code-block` (for <pre>).
   * false → use the element itself as the host (e.g. a toggled tab panel, so
   *         the button hides with it).
   */
  wrap?: boolean;
}

export function addCopyButtons({ selector, wrap = true }: CopyButtonOptions): void {
  const tmpl = document.getElementById('copy-icon-tmpl') as HTMLTemplateElement | null;
  const icon = tmpl?.innerHTML ?? '';

  document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
    let host: HTMLElement;

    if (wrap) {
      if (el.parentElement?.classList.contains('code-block')) return;
      host = document.createElement('div');
      host.className = 'code-block';
      el.replaceWith(host);
      host.appendChild(el);
    } else {
      if (el.querySelector(':scope > .copy-btn')) return;
      el.classList.add('code-block');
      host = el;
    }

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'copy-btn';
    btn.innerHTML = icon;
    btn.setAttribute('aria-label', 'Copy code to clipboard');
    host.appendChild(btn);

    btn.addEventListener('click', async () => {
      const code = el.querySelector('code');
      // <pre> keeps newlines in textContent; other blocks need innerText.
      const text = (code ? code.textContent ?? '' : el.innerText).replace(/\s+$/, '');
      try {
        await navigator.clipboard.writeText(text);
        btn.classList.add('is-copied');
        window.setTimeout(() => btn.classList.remove('is-copied'), 1500);
      } catch {
        /* clipboard unavailable */
      }
    });
  });
}
