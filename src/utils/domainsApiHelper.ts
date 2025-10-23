/**
 * Domains API Helper
 * 
 * Frontend integration helper for the enhanced domains function
 * Based on the ChatGPT conversation implementation
 */

import { supabase } from '@/integrations/supabase/client';
import { safeFetch } from '@/utils/fullstoryWorkaround';

export interface Domain {
  id?: string;
  name: string;
  site_id?: string;
  source?: 'manual' | 'netlify';
  status?: 'active' | 'pending' | 'verified' | 'unverified' | 'error';
  created_at?: string;
  updated_at?: string;
}

/**
 * Map database domain status to UI-friendly status
 */
function mapDomainStatus(
  dbStatus: string,
  netlifyVerified: boolean,
  dnsVerified: boolean
): 'active' | 'pending' | 'verified' | 'unverified' | 'error' {
  if (dbStatus === 'error') return 'error';
  if (dbStatus === 'verified' || (netlifyVerified && dnsVerified)) return 'verified';
  if (dbStatus === 'dns_ready' || netlifyVerified) return 'pending';
  if (dbStatus === 'active') return 'active';
  return 'unverified';
}

export interface NetlifyDomain {
  id: string;
  name: string;
  state: string;
  created_at: string;
  updated_at: string;
}

export class DomainsApiHelper {
  /**
   * Fetch domains from Netlify and sync with Supabase database
   * This calls the enhanced domains function (GET)
   */
  // Helper: invoke an edge function - Netlify-only (no Supabase fallback)
  static async invokeEdgeFunction(functionName: string, body: any) {
    const payload = body || {};
    const targetName = functionName || 'domains';

    const netlifyBaseRaw = (
      (import.meta as any).env?.VITE_NETLIFY_FUNCTIONS_URL ||
      (import.meta as any).env?.NETLIFY_FUNCTIONS_URL ||
      (window as any)?.VITE_NETLIFY_FUNCTIONS_URL ||
      (window as any)?.NETLIFY_FUNCTIONS_URL ||
      ''
    ) as string;
    const netlifyToken = (import.meta as any).env?.VITE_NETLIFY_ACCESS_TOKEN as string | undefined || (window as any)?.VITE_NETLIFY_ACCESS_TOKEN || '';
    const hasNetlify = !!(netlifyBaseRaw && netlifyBaseRaw.trim());

    const netlifyBase = (hasNetlify ? netlifyBaseRaw : 'https://backlinkoo.netlify.app/.netlify/functions').replace(/\/$/, '');

    // Special-case: validate should avoid cross-origin POSTs. Fetch list via GET and compute locally.
    if (payload && payload.action === 'validate' && payload.domain) {
      const listUrl = `${netlifyBase}/${targetName}/list`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      try {
        // Avoid custom headers on GET to prevent CORS preflight
        const res = await safeFetch(listUrl, { method: 'GET', signal: controller.signal });
        clearTimeout(timeout);
        const text = await res.text().catch(() => '');
        if (!res.ok) throw new Error(`Netlify list returned ${res.status}: ${text}`);
        let aliases: string[] = [];
        try {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed)) {
            aliases = parsed as string[];
          } else if (parsed && Array.isArray((parsed as any).aliases)) {
            aliases = (parsed as any).aliases as string[];
          }
        } catch {
          aliases = [];
        }
        const norm = (s: string) => String(s || '').toLowerCase().replace(/^https?:\/\//,'').replace(/^www\./,'').replace(/\/$/,'');
        const target = norm(payload.domain);
        const present = aliases.map(norm).includes(target);
        return { validated: present, validation: { validation_status: present ? 'valid' : 'invalid' }, aliases };
      } catch (e) {
        clearTimeout(timeout);
        console.error('[DomainsApiHelper] Validate via list failed:', (e as any)?.message || e);
        throw e;
      }
    }

    // Default mapping
    let url = `${netlifyBase}/${targetName}`;
    let method = 'POST';
    let sendBody: any = payload;

    if (!payload || payload.action === 'list' || payload.action === 'sync') {
      url = `${netlifyBase}/${targetName}/list`;
      method = 'GET';
      sendBody = undefined;
    }

    if (payload && payload.action === 'add' && payload.domain) {
      url = `${netlifyBase}/${targetName}/add`;
      method = 'PATCH';
      sendBody = { domains: [payload.domain] };
      if (payload.user_id) (sendBody as any).user_id = payload.user_id;
    }

    if (payload && payload.action === 'remove' && payload.domain) {
      url = `${netlifyBase}/${targetName}/remove`;
      method = 'POST';
      sendBody = { domain: payload.domain };
    }

    if (payload && payload.action === 'sync_aliases' && Array.isArray(payload.domains)) {
      url = `${netlifyBase}/${targetName}/sync_aliases`;
      method = 'POST';
      sendBody = { domains: payload.domains, user_id: payload.user_id };
    }

    const controller = new AbortController();
    const timeoutMs = 15000;
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const headers: Record<string, string> = {};
      // Only set JSON headers when sending a body (avoids preflight on GET)
      if (sendBody) headers['Content-Type'] = 'application/json';
      // Do NOT attach auth headers for public domains endpoints to avoid preflight/CORS noise

      console.debug('[DomainsApiHelper] Netlify function call', { url, method, sendBody });
      const res = await safeFetch(url, {
        method,
        headers,
        body: sendBody ? JSON.stringify(sendBody) : undefined,
        signal: controller.signal,
      });
      clearTimeout(timeout);

      const text = await res.text().catch(() => '');
      console.debug(`[DomainsApiHelper] Netlify response ${res.status} ->`, text?.slice ? text.slice(0, 1000) : text);

      if (!res.ok) {
        throw new Error(`Netlify function returned ${res.status}: ${text}`);
      }

      try {
        return JSON.parse(text);
      } catch {
        return text;
      }
    } catch (e) {
      clearTimeout(timeout);
      console.error('[DomainsApiHelper] Netlify function call failed:', (e as any)?.message || e);
      throw e;
    }
  }

  static async syncDomains(): Promise<any[]> {
    try {
      console.log('🔄 Syncing domains from Netlify...');
      const { NetlifyApiService } = await import('@/services/netlifyApiService');
      const res = await NetlifyApiService.getSiteInfo();
      if (!res?.success || !res?.data) return [];
      const list: string[] = [];
      if (res.data.custom_domain) list.push(res.data.custom_domain);
      if (Array.isArray(res.data.domain_aliases)) list.push(...res.data.domain_aliases);
      const unique = [...new Set(list)];
      console.log(`✅ Synced ${unique.length} domains from Netlify`);
      return unique;
    } catch (error) {
      console.error('❌ Sync domains failed:', error);
      return [];
    }
  }

  /**
   * Add a new domain to Netlify and sync with Supabase
   * This calls the enhanced domains function (POST)
   */
  static async addDomain(domainName: string): Promise<any> {
    const { data: sessionData } = await supabase.auth.getSession().catch(() => ({ data: null } as any));
    const userId = (sessionData as any)?.session?.user?.id || null;

    // Step 1: Ensure DB row via server-side domainsSupabase function (CNAME guidance handled in UI)
    let supabaseResult: any = null;
    try {
      const { safeNetlifyFetch } = await import('@/utils/netlifyFunctionHelper');
      const sf = await safeNetlifyFetch('domainsSupabase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: domainName, user_id: userId })
      });
      if (!sf.success) throw new Error(sf.error || 'domainsSupabase failed');
      supabaseResult = sf.data;
    } catch (e) {
      console.error('domainsSupabase failed:', (e as any)?.message || e);
      throw new Error('Failed to sync domain to Supabase');
    }

    // Step 2: Best-effort push to Cloudflare KV (domain => origin)
    try {
      const { safeNetlifyFetch } = await import('@/utils/netlifyFunctionHelper');
      await safeNetlifyFetch('domainsCloudflare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: domainName, target: 'domains.backlinkoo.com' })
      });
    } catch (e) {
      console.warn('[DomainsApiHelper] Cloudflare KV mapping failed (non-blocking):', (e as any)?.message || e);
    }

    // Step 3: Best-effort create Cloudflare Custom Hostname for SSL + routing
    try {
      const { safeNetlifyFetch } = await import('@/utils/netlifyFunctionHelper');
      await safeNetlifyFetch('domainsCloudflare?op=ch_create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hostname: domainName, origin: 'domains.backlinkoo.com', ssl: { method: 'http', type: 'dv' } })
      });
    } catch (e) {
      console.warn('[DomainsApiHelper] Cloudflare custom hostname create failed (non-blocking):', (e as any)?.message || e);
    }

    return { supabase: supabaseResult };
  }

  /**
   * Remove a domain from Netlify and Supabase
   * This calls the enhanced domains function (DELETE)
   */
  static async deleteDomain(domainName: string): Promise<boolean> {
    try {
      console.log(`🗑️ Deleting domain: ${domainName}`);

      // Remove alias from Netlify by patching domain_aliases
      const token = (import.meta as any)?.env?.VITE_NETLIFY_ACCESS_TOKEN as string | undefined;
      const siteId = (import.meta as any)?.env?.VITE_NETLIFY_SITE_ID as string | undefined;
      if (!token || !siteId) throw new Error('Netlify env not configured');
      const { NetlifyApiService } = await import('@/services/netlifyApiService');
      const info = await NetlifyApiService.getSiteInfo();
      const aliases = Array.isArray(info?.data?.domain_aliases) ? info.data.domain_aliases : [];
      const next = aliases.filter((d: string) => String(d).toLowerCase() !== String(domainName).toLowerCase());
      const res = await (await import('@/utils/fullstoryWorkaround')).safeFetch(`https://api.netlify.com/api/v1/sites/${siteId}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain_aliases: next })
      });
      if (!res.ok) {
        const t = await res.text().catch(()=>'');
        throw new Error(`Netlify patch failed: ${res.status} ${t}`);
      }
      console.log(`✅ Deleted domain alias on Netlify: ${domainName}`);
      return true;

    } catch (error) {
      console.error('❌ Delete domain failed:', error);
      throw error;
    }
  }

  /**
   * Fetch domains directly from Supabase database
   * Use this to display the current domain list in the UI
   */
  static async fetchDomainsFromDatabase(): Promise<Domain[]> {
    try {
      console.log('📋 Fetching domains from database...');

      const { data, error } = await supabase
        .from('domains')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching domains from database:', error);
        throw new Error(`Failed to fetch domains: ${error.message}`);
      }

      console.log(`📊 Found ${data?.length || 0} domains in database`);

      // Map database rows to Domain interface (domain column → name property)
      return (data || []).map(row => ({
        id: row.id,
        name: row.domain, // Map DB column 'domain' to interface property 'name'
        site_id: row.netlify_site_id,
        source: row.is_global ? 'netlify' : 'manual',
        status: mapDomainStatus(row.status, row.netlify_verified, row.dns_verified),
        created_at: row.created_at,
        updated_at: row.updated_at
      }));

    } catch (error) {
      console.error('❌ Fetch domains from database failed:', error);
      throw error;
    }
  }

  /**
   * Add a domain manually to the database (without Netlify)
   * Use this for domains that are managed outside of Netlify
   */
  static async addManualDomain(domainName: string): Promise<Domain> {
    try {
      console.log(`➕ Adding manual domain via server function: ${domainName}`);
      const { safeNetlifyFetch } = await import('@/utils/netlifyFunctionHelper');
      const sf = await safeNetlifyFetch('domainsSupabase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: domainName, status: 'pending' })
      });
      if (!sf.success) throw new Error(sf.error || 'domainsSupabase failed');
      return sf.data;
    } catch (error) {
      console.error('❌ Add manual domain failed:', error);
      throw error;
    }
  }

  /**
   * Update domain status in the database
   * Use this to mark domains as verified, error, etc.
   */
  static async updateDomainStatus(domainName: string, status: Domain['status']): Promise<Domain> {
    try {
      console.log(`🔄 Updating domain ${domainName} status to: ${status}`);

      const { data, error } = await supabase
        .from('domains')
        .update({ status })
        .eq('name', domainName)
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating domain status:', error);
        throw new Error(`Failed to update domain status: ${error.message}`);
      }

      console.log(`✅ Updated domain ${domainName} status to: ${status}`);
      return data;

    } catch (error) {
      console.error('❌ Update domain status failed:', error);
      throw error;
    }
  }

  /**
   * Test the domains function connectivity
   * Use this for debugging and health checks
   */
  static async testConnection(): Promise<boolean> {
    try {
      console.log('🧪 Testing Netlify connectivity...');
      const { NetlifyApiService } = await import('@/services/netlifyApiService');
      await NetlifyApiService.getSiteInfo();
      console.log('✅ Connection test successful');
      return true;
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      return false;
    }
  }
}

// Export individual functions for convenience
export const {
  syncDomains,
  addDomain,
  deleteDomain,
  fetchDomainsFromDatabase,
  addManualDomain,
  updateDomainStatus,
  testConnection
} = DomainsApiHelper;

// Extra helpers
export async function syncNetlifyAliases(domains: string[]): Promise<{ success: boolean; updatedAliases?: string[]; error?: string }>{
  try {
    const token = (import.meta as any)?.env?.VITE_NETLIFY_ACCESS_TOKEN as string | undefined;
    const siteId = (import.meta as any)?.env?.VITE_NETLIFY_SITE_ID as string | undefined;
    if (!token || !siteId) return { success: false, error: 'Netlify env not configured' };
    const res = await (await import('@/utils/fullstoryWorkaround')).safeFetch(`https://api.netlify.com/api/v1/sites/${siteId}`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain_aliases: domains })
    });
    const text = await res.text().catch(()=> '');
    if (!res.ok) return { success: false, error: text || `HTTP ${res.status}` };
    return { success: true, updatedAliases: domains };
  } catch (e:any) {
    return { success: false, error: e?.message || 'Failed to sync aliases' };
  }
}

export default DomainsApiHelper;
