/**
 * Inlined in <head>. Marks the document as JS-capable, which is what opts
 * scroll-reveal elements into starting hidden — without it, all content
 * renders visible, which is the correct no-JS fallback.
 */
export const jsFlagScript = `document.documentElement.classList.add('js');`;
