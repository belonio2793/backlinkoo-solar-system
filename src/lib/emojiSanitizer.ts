// Global sanitizer to remove emojis and problematic special characters that may render as the Unicode replacement character (U+FFFD)
// Keeps the infinity sign (U+221E)

// Strip emojis, pictographs, dingbats, symbols, flags, variation selectors and ZWJ
export function stripEmojis(input: string): string {
  if (!input) return input;
  // Remove replacement char, variation selectors, zero width joiner/spaces
  let out = input
    .replace(/\uFFFD/g, '')
    .replace(/[\uFE0E\uFE0F]/g, '')
    .replace(/[\u200B-\u200F\u2028\u2029\u2060\u2061\u2062\u2063\u2064]/g, '')
    .replace(/\u200D/g, '');

  // Remove surrogate pair emojis (common emoji encoding)
  out = out.replace(/[\uD83C-\uDBFF][\uDC00-\uDFFF]/g, '');

  // Remove miscellaneous symbols and dingbats (keep infinity U+221E which is not in these ranges anyway)
  out = out
    .replace(/[\u2600-\u26FF]/g, '') // Misc symbols
    .replace(/[\u2700-\u27BF]/g, '') // Dingbats
    .replace(/[\u{1F300}-\u{1FAFF}]/gu, ''); // Emoji ranges

  return out;
}

// Recursively sanitize React children
function sanitizeChildren(children: any): any {
  if (children == null) return children;
  if (typeof children === 'string') return stripEmojis(children);
  if (Array.isArray(children)) return children.map(sanitizeChildren);
  return children;
}

// Patch React.createElement once
let patched = false;
export function patchReactCreateElement(React: any) {
  if (patched || !React?.createElement) return;
  const original = React.createElement;
  React.createElement = function patchedCreateElement(type: any, props: any, ...children: any[]) {
    const newProps = props ? { ...props, children: sanitizeChildren(props.children) } : props;
    const newChildren = children.map(sanitizeChildren);
    return original.apply(React, [type, newProps, ...newChildren]);
  } as any;
  patched = true;
}

// Lightweight sanitizer that ONLY strips the Unicode replacement character (U+FFFD) and zero-width chars
export function stripReplacementChars(input: string): string {
  if (!input) return input;
  return input
    .replace(/\uFFFD/g, '')
    .replace(/[\u200B-\u200F\u2028\u2029\u2060\u2061\u2062\u2063\u2064]/g, '')
    .replace(/\u200D/g, '');
}

function sanitizeChildrenReplacement(children: any): any {
  if (children == null) return children;
  if (typeof children === 'string') return stripReplacementChars(children);
  if (Array.isArray(children)) return children.map(sanitizeChildrenReplacement);
  return children;
}

let patchedReplacement = false;
export function patchReactStripReplacement(React: any) {
  if (patchedReplacement || !React?.createElement) return;
  const original = React.createElement;
  React.createElement = function patchedCreateElement(type: any, props: any, ...children: any[]) {
    const newProps = props ? { ...props, children: sanitizeChildrenReplacement(props.children) } : props;
    const newChildren = children.map(sanitizeChildrenReplacement);
    return original.apply(React, [type, newProps, ...newChildren]);
  } as any;
  patchedReplacement = true;
}
