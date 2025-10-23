export interface DomainsEnv {
  VITE_NETLIFY_ACCESS_TOKEN?: string;
  VITE_NETLIFY_SITE_ID?: string;
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_ANON_KEY?: string;
}

export function getDomainsEnv(): DomainsEnv {
  return {
    VITE_NETLIFY_ACCESS_TOKEN: import.meta.env.VITE_NETLIFY_ACCESS_TOKEN,
    VITE_NETLIFY_SITE_ID: import.meta.env.VITE_NETLIFY_SITE_ID,
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  };
}

export function getFunctionsBase(): string | undefined {
  const isNetlify = typeof window !== 'undefined' && /\.netlify\.app$/.test(window.location.hostname);
  return isNetlify ? window.location.origin : undefined;
}

export function resolveFunctionUrl(name: string): string | undefined {
  const base = getFunctionsBase();
  return base ? `${base}/.netlify/functions/${name}` : undefined;
}

export function hasSupabaseClientConfig(): boolean {
  const env = getDomainsEnv();
  return !!(env.VITE_SUPABASE_URL && env.VITE_SUPABASE_ANON_KEY);
}
