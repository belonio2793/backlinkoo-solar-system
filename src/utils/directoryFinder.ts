import MASS_DB from '@/data/massPlatformDatabase.json';
import MASS_LIST from '@/data/massivePlatformList.json';
import { DIRECTORY_BLUEPRINTS } from '@/data/directoryTargets';

export type FinderOptions = {
  query?: string;
  minDA?: number;
  requireBacklinks?: boolean;
  preferNoAuth?: boolean;
  preferInstantPublish?: boolean;
  limit?: number;
};

export type PlatformCandidate = {
  domain: string;
  name: string;
  url: string;
  category: string;
  type?: string;
  da?: number;
  backlinksAllowed?: boolean;
  auth?: 'none' | 'optional' | 'account';
  difficulty?: 'easy' | 'medium' | 'hard';
  source: string;
  score: number;
};

export type BusinessProfileLite = {
  name: string;
  website: string;
  categories: string[];
  keywords: string[];
};

function normalizeDomain(input: string): string {
  try {
    const url = input.includes('://') ? new URL(input) : new URL(`https://${input}`);
    let host = url.hostname.toLowerCase();
    if (host.startsWith('www.')) host = host.slice(4);
    return host;
  } catch {
    return input.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0].toLowerCase();
  }
}

function parseDAFromLabel(label: string): number | undefined {
  const match = label.match(/\(DA\s*(\d+)\)/i);
  return match ? Number(match[1]) : undefined;
}

function scoreCandidate(c: Omit<PlatformCandidate, 'score'>, profile: BusinessProfileLite, query?: string): number {
  let s = 0;
  if (typeof c.da === 'number') s += Math.min(100, c.da);
  if (c.backlinksAllowed) s += 20;
  if (c.auth === 'none') s += 15; else if (c.auth === 'optional') s += 8;
  if (c.difficulty === 'easy') s += 10; else if (c.difficulty === 'medium') s += 4;
  const hay = `${c.name} ${c.domain} ${c.category} ${c.type ?? ''}`.toLowerCase();
  profile.categories.forEach((cat) => { if (hay.includes(cat.toLowerCase())) s += 6; });
  profile.keywords.forEach((k) => { if (hay.includes(k.toLowerCase())) s += 2; });
  if (query) query.split(/\s+/).forEach((q) => { if (q && hay.includes(q.toLowerCase())) s += 5; });
  if (/directory|business|listing/.test(hay)) s += 8;
  return s;
}

function candidateUrl(domain: string): string {
  return domain.startsWith('http') ? domain : `https://${domain}`;
}

export function findDirectoryCandidates(profile: BusinessProfileLite, opts: FinderOptions = {}): PlatformCandidate[] {
  const { query, minDA = 0, requireBacklinks = false, preferNoAuth = false, preferInstantPublish = false, limit = 100 } = opts;

  const results: Omit<PlatformCandidate, 'score'>[] = [];

  // massPlatformDatabase.json
  const cats = MASS_DB.platformCategories as Record<string, any>;
  Object.entries(cats).forEach(([catKey, catVal]: [string, any]) => {
    (catVal.platforms || []).forEach((p: any) => {
      results.push({
        domain: normalizeDomain(p.domain || p.url || ''),
        name: (p.domain || p.url || '').replace(/^www\./, ''),
        url: candidateUrl(p.domain || p.url || ''),
        category: catKey,
        type: p.type,
        da: typeof p.da === 'number' ? p.da : undefined,
        backlinksAllowed: Boolean(p.backlinks),
        auth: (p.auth as any) ?? undefined,
        source: 'massPlatformDatabase.json',
        difficulty: undefined,
      });
    });
  });

  // massivePlatformList.json quickStartPlatforms
  (MASS_LIST.quickStartPlatforms || []).forEach((p: any) => {
    results.push({
      domain: normalizeDomain(p.url || p.name),
      name: p.name,
      url: p.url || candidateUrl(p.name),
      category: 'quick_start',
      type: 'platform',
      da: typeof p.domainAuthority === 'number' ? p.domainAuthority : undefined,
      backlinksAllowed: Boolean(p.backlinksAllowed ?? p.linksAllowed),
      auth: p.accountRequired ? 'account' : 'none',
      difficulty: p.difficulty,
      source: 'massivePlatformList.json:quickStart',
    });
  });

  // massivePlatformList.json platformCategories (strings)
  const pc = MASS_LIST.platformCategories as Record<string, any>;
  Object.entries(pc).forEach(([catKey, catVal]: [string, any]) => {
    (catVal.platforms || []).forEach((label: string) => {
      const domain = normalizeDomain(label.split(' ')[0]);
      results.push({
        domain,
        name: domain,
        url: candidateUrl(domain),
        category: catKey,
        type: 'listing',
        da: parseDAFromLabel(label),
        backlinksAllowed: undefined,
        auth: undefined,
        difficulty: undefined,
        source: 'massivePlatformList.json:categories',
      });
    });
  });

  // DIRECTORY_BLUEPRINTS as high-priority targets
  DIRECTORY_BLUEPRINTS.forEach((b) => {
    results.push({
      domain: normalizeDomain(b.url),
      name: b.name,
      url: b.url,
      category: 'blueprint',
      type: b.submissionMethod,
      da: undefined,
      backlinksAllowed: true,
      auth: 'account',
      difficulty: 'medium',
      source: 'directoryTargets',
    });
  });

  // Filter
  let filtered = results.filter((r) => {
    if (requireBacklinks && r.backlinksAllowed === false) return false;
    if (typeof r.da === 'number' && r.da < minDA) return false;
    if (query) {
      const hay = `${r.name} ${r.domain} ${r.category} ${r.type ?? ''}`.toLowerCase();
      const ok = query.toLowerCase().split(/\s+/).every((q) => hay.includes(q));
      if (!ok) return false;
    }
    return true;
  });

  // Dedupe by root domain
  const seen = new Set<string>();
  filtered = filtered.filter((r) => {
    const root = normalizeDomain(r.domain);
    if (seen.has(root)) return false;
    seen.add(root);
    return true;
  });

  // Score and sort
  const withScore: PlatformCandidate[] = filtered.map((c) => ({ ...c, score: scoreCandidate(c, profile, query) }));

  // Preference weighting
  withScore.forEach((c) => {
    if (preferNoAuth && c.auth === 'none') c.score += 12;
    if (preferInstantPublish && (c.difficulty === 'easy' || /telegraph|paste|instant/.test(`${c.name} ${c.domain}`))) c.score += 10;
  });

  withScore.sort((a, b) => b.score - a.score);
  return withScore.slice(0, limit);
}

export function parseManualUrls(input: string): string[] {
  return Array.from(new Set((input || '')
    .split(/\r?\n|,|\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map(normalizeDomain)));
}
