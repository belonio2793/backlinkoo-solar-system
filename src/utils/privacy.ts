export function maskName(name?: string): string {
  const n = (name || '').trim();
  if (!n) return 'Anonymous';
  return n
    .split(/\s+/)
    .map(part => {
      const first = part.charAt(0);
      if (part.length <= 2) return first + '*';
      const maskedLen = Math.min(Math.max(part.length - 1, 1), 6);
      return first + '*'.repeat(maskedLen);
    })
    .join(' ');
}

export function maskEmail(email?: string): string {
  const e = (email || '').trim();
  if (!e || !e.includes('@')) return 'hidden@****.***';
  const [local, domain] = e.split('@');
  const [host, ...rest] = domain.split('.');
  const tld = rest.join('.') || '***';
  const maskedLocal = local ? local.charAt(0) + '*'.repeat(Math.min(Math.max(local.length - 1, 1), 6)) : '***';
  const maskedHost = host ? host.charAt(0) + '*'.repeat(Math.min(Math.max(host.length - 1, 1), 6)) : '***';
  return `${maskedLocal}@${maskedHost}.${tld}`;
}

export function getDisplayIdentity(options: { name?: string; email?: string }): string {
  const nameMasked = maskName(options.name);
  if (nameMasked !== 'Anonymous') return nameMasked;
  return maskEmail(options.email);
}
