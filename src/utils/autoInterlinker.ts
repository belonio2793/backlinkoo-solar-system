import { interlinkTargets } from '@/data/interlinkTargets';

export type AutoInterlinkOptions = {
  maxPerLinkPerPage?: number;
  containerSelector?: string;
};

const DEFAULT_OPTIONS: Required<AutoInterlinkOptions> = {
  maxPerLinkPerPage: 2,
  containerSelector: 'main, #cyrus-content, .prose, [data-interlink-root], .content, .blog-post, article'
};

const LEADING_SPACE_EXCEPTIONS = new Set(['(', '/', '-', '–', '—', '[', '{']);
const TRAILING_SPACE_EXCEPTIONS = new Set([',', '.', ';', ':', '?', '!', ')', '/', '-', '–', '—', ']', '}']);

function findTextualNode(start: Node | null, direction: 'previous' | 'next'): Node | null {
  let current: Node | null = start;
  while (current) {
    if (current.nodeType === Node.TEXT_NODE) {
      const value = current.nodeValue ?? '';
      if (value.length) return current;
    } else if (current.nodeType === Node.ELEMENT_NODE) {
      const text = (current as Element).textContent ?? '';
      if (text.length) return current;
    }
    current = direction === 'previous' ? current.previousSibling : current.nextSibling;
  }
  return null;
}

function extractBoundaryChar(node: Node, edge: 'start' | 'end'): string | null {
  const raw = node.nodeType === Node.TEXT_NODE ? node.nodeValue ?? '' : (node as Element).textContent ?? '';
  const normalized = edge === 'start' ? raw.replace(/^\s+/, '') : raw.replace(/\s+$/, '');
  if (!normalized) return null;
  return edge === 'start' ? normalized.charAt(0) : normalized.charAt(normalized.length - 1);
}

function hasBoundaryWhitespace(node: Node, edge: 'start' | 'end'): boolean {
  const raw = node.nodeType === Node.TEXT_NODE ? node.nodeValue ?? '' : (node as Element).textContent ?? '';
  return edge === 'start' ? /^\s/.test(raw) : /\s$/.test(raw);
}

function ensureAnchorSpacing(anchor: HTMLAnchorElement) {
  const prevNode = findTextualNode(anchor.previousSibling, 'previous');
  const prevChar = prevNode ? extractBoundaryChar(prevNode, 'end') : null;
  const hasSpaceBefore = prevNode ? hasBoundaryWhitespace(prevNode, 'end') : false;
  if (!hasSpaceBefore && prevChar && !/\s/.test(prevChar) && !LEADING_SPACE_EXCEPTIONS.has(prevChar)) {
    anchor.insertAdjacentText('beforebegin', ' ');
  }

  const nextNode = findTextualNode(anchor.nextSibling, 'next');
  const nextChar = nextNode ? extractBoundaryChar(nextNode, 'start') : null;
  const hasSpaceAfter = nextNode ? hasBoundaryWhitespace(nextNode, 'start') : false;
  if (!hasSpaceAfter && nextChar && !/\s/.test(nextChar) && !TRAILING_SPACE_EXCEPTIONS.has(nextChar)) {
    anchor.insertAdjacentText('afterend', ' ');
  }
}

function buildAliasList(anchor: string, aliases?: string[]): string[] {
  const base = [anchor];
  const extra = aliases || [];
  const merged = [...new Set([...base, ...extra])];
  return merged
    .map(a => a.trim())
    .filter(Boolean)
    .map(a => a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
}

function findTextNodes(root: Element): Text[] {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.textContent || !node.textContent.trim()) return NodeFilter.FILTER_REJECT;
      const parent = node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      const tag = parent.tagName.toLowerCase();
      if (['a','script','style','code','pre','noscript','button','input','select','textarea','svg'].includes(tag)) return NodeFilter.FILTER_REJECT;
      if (parent.closest('[data-no-interlinks]')) return NodeFilter.FILTER_REJECT;
      if (parent.closest('nav, header, footer, aside')) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  } as any, false);
  const nodes: Text[] = [];
  let n: Node | null;
  while ((n = walker.nextNode())) nodes.push(n as Text);
  return nodes;
}

function replaceOnceInTextNode(textNode: Text, pattern: RegExp, url: string): boolean {
  const text = textNode.nodeValue || '';
  const match = pattern.exec(text);
  if (!match) return false;

  const start = match.index;
  const end = start + match[0].length;
  const matchedText = match[0];

  const prefix = text.slice(0, start);
  const suffix = text.slice(end);

  const prevChar = prefix.slice(-1);
  const nextChar = suffix.charAt(0);
  const firstChar = matchedText.charAt(0);
  const lastChar = matchedText.charAt(matchedText.length - 1);

  const needsLeadingSpace =
    matchedText && /\w/.test(firstChar) && (!prevChar || (!/\s/.test(prevChar) && !LEADING_SPACE_EXCEPTIONS.has(prevChar)));
  const needsTrailingSpace =
    matchedText && /\w/.test(lastChar) && (!nextChar || (!/\s/.test(nextChar) && !TRAILING_SPACE_EXCEPTIONS.has(nextChar)));

  const fragment = document.createDocumentFragment();

  if (prefix) {
    fragment.appendChild(document.createTextNode(prefix));
  }

  if (needsLeadingSpace && !/\s$/.test(prefix)) {
    fragment.appendChild(document.createTextNode(' '));
  }

  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.textContent = matchedText;
  anchor.rel = 'nofollow noopener noreferrer';
  anchor.target = '_blank';
  fragment.appendChild(anchor);

  if (needsTrailingSpace && !/^\s/.test(suffix)) {
    fragment.appendChild(document.createTextNode(' '));
  }

  if (suffix) {
    fragment.appendChild(document.createTextNode(suffix));
  }

  const parent = textNode.parentNode as Node;
  parent.insertBefore(fragment, textNode);
  parent.removeChild(textNode);
  ensureAnchorSpacing(anchor);
  return true;
}

export function applyAutoInterlinks(doc: Document = document, opts?: AutoInterlinkOptions) {
  if (typeof window === 'undefined') return;
  const options = { ...DEFAULT_OPTIONS, ...(opts || {}) };
  const used = new Map<string, number>();

  let containers = Array.from(doc.querySelectorAll(options.containerSelector)) as Element[];
  if (!containers.length && doc.body) containers = [doc.body as unknown as Element];
  const primaryContainer = containers[0] ?? (doc.body ? (doc.body as unknown as Element) : null);

  const textNodes = containers.flatMap((c) => findTextNodes(c));

  // Build patterns per target
  const targets = interlinkTargets.map(t => {
    const aliases = buildAliasList(t.anchor, (t as any).aliases);
    // Word boundary, case-insensitive, prefer longer tokens
    const pattern = new RegExp(`\\b(${aliases.join('|')})\\b`, 'i');
    return { ...t, pattern } as { anchor: string; url: string; pattern: RegExp };
  }).sort((a, b) => b.anchor.length - a.anchor.length);

  // Shuffle targets for distribution
  const shuffled = targets.map(v => ({ v, r: Math.random() })).sort((a,b)=>a.r-b.r).map(x=>x.v);

  for (const node of textNodes) {
    for (const t of shuffled) {
      const count = used.get(t.url) || 0;
      if (count >= options.maxPerLinkPerPage) continue;
      if (node.parentElement?.closest('a')) continue;
      try {
        if (replaceOnceInTextNode(node, t.pattern, t.url)) {
          used.set(t.url, count + 1);
          break; // move to next text node
        }
      } catch {}
    }
  }

}
