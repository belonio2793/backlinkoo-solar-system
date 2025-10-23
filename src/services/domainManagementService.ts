import { supabase } from '@/integrations/supabase/client';
import { DomainsApiHelper, syncNetlifyAliases } from '@/utils/domainsApiHelper';

export interface DomainManagementResponse {
  success: boolean;
  domain?: any;
  netlify_verified?: boolean;
  netlify_removed?: boolean;
  error?: string;
  message?: string;
  sync_results?: {
    total_netlify: number;
    total_supabase: number;
    in_sync: number;
    added_to_supabase: number;
    updated_in_supabase: number;
  };
  netlify_domains?: string[];
  supabase_domains?: string[];
}

export class DomainManagementService {
  /**
   * Add a domain to both Supabase and Netlify
   */
  static async addDomain(domain: string, userId?: string): Promise<DomainManagementResponse> {
    const clean = domain.trim().toLowerCase();

    try {
      console.log(`🔄 Adding domain (service): ${clean}`);

      // Use the shared DomainsApiHelper.addDomain which implements the
      // same flow as the add-leadpages-test.js script: call edge function
      // and upsert into Supabase. This centralizes logic and keeps UI usage simple.
      try {
        const netlifyResult: any = await DomainsApiHelper.addDomain(clean);
        // netlifyResult is expected to be { netlify, supabase }
        const domainRow = netlifyResult?.supabase || netlifyResult?.data || netlifyResult;
        return {
          success: true,
          domain: Array.isArray(domainRow) ? domainRow[0] : domainRow,
          netlify_verified: true,
          message: `Added domain and synced with Cloudflare KV: ${clean}`
        };
      } catch (edgeErr: any) {
        console.error('❌ Edge function add error (service):', edgeErr?.message || edgeErr);

        const errMsg = edgeErr?.message || String(edgeErr || 'Unknown error');
        const shouldFallback = errMsg.includes('Netlify configuration') ||
          errMsg.includes('Missing Supabase configuration') ||
          errMsg.includes('Site not found') ||
          errMsg.includes('token') ||
          errMsg.includes('Edge function');

        if (shouldFallback) {
          console.warn('⚠️ Falling back to DB insert for domain due to edge function failure:', errMsg);
          const fallback = await this.addDomainToDatabase(clean, userId);
          if (fallback.success) {
            return { success: true, domain: fallback.domain, netlify_verified: false, message: 'Added to database only (host not configured)' };
          }
          return { success: false, error: fallback.error || errMsg };
        }

        // Last-resort fallback to DB insert for any other error
        const fb = await this.addDomainToDatabase(clean, userId);
        if (fb.success) {
          return { success: true, domain: fb.domain, netlify_verified: false, message: 'Added to database only (edge function unavailable)' };
        }

        return { success: false, error: errMsg };
      }

    } catch (error: any) {
      console.error('Add domain service error:', error?.message || error);
      // Final fallback to DB insert
      try {
        const fb = await this.addDomainToDatabase(clean, userId);
        if (fb.success) {
          return { success: true, domain: fb.domain, netlify_verified: false, message: 'Added to database only (edge function unavailable)' };
        }
        return { success: false, error: fb.error || error?.message || 'Failed to add domain' };
      } catch (e: any) {
        return { success: false, error: e?.message || 'Failed to add domain' };
      }
    }
  }

  // Helper: direct DB insert fallback
  private static async addDomainToDatabase(cleanDomain: string, userId?: string): Promise<{ success: boolean; domain?: any; error?: string }>{
    try {
      // Check if domain exists
      let existsQuery = supabase.from('domains').select('id').eq('domain', cleanDomain).limit(1);
      if (userId) existsQuery = existsQuery.eq('user_id', userId);
      const { data: existsData, error: existsError } = await existsQuery;
      if (existsError) throw existsError;
      if (existsData && existsData.length > 0) {
        return { success: false, error: 'Domain already exists' };
      }

      const record = {
        domain: cleanDomain,
        user_id: userId || null,
        status: 'pending',
        netlify_verified: false,
        dns_verified: false,
        custom_domain: true,
        ssl_status: 'none',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as any;

      const { data, error } = await supabase.from('domains').insert(record).select('*').single();
      if (error) throw error;
      return { success: true, domain: data };
    } catch (e: any) {
      return { success: false, error: e.message || 'Database insert failed' };
    }
  }

  /**
   * Remove a domain from both Supabase and Netlify
   */
  static async removeDomain(domain: string, userId?: string): Promise<DomainManagementResponse> {
    const clean = domain.trim().toLowerCase();

    try {
      console.log(`🔄 Removing domain (service): ${clean}`);

      // 1) Detect presence in Supabase and Netlify
      let inDb = false;
      try {
        let q = supabase.from('domains').select('id').eq('domain', clean).limit(1);
        if (userId) q = q.eq('user_id', userId);
        const { data, error } = await q;
        if (!error && Array.isArray(data) && data.length > 0) inDb = true;
      } catch (_) {
        // Supabase may be unconfigured in client; ignore
      }

      let inNetlify = false;
      try {
        const { NetlifyApiService } = await import('@/services/netlifyApiService');
        const siteRes = await NetlifyApiService.getSiteInfo();
        const aliases: string[] = [];
        if (siteRes?.success && siteRes.data) {
          if (siteRes.data.custom_domain) aliases.push(siteRes.data.custom_domain);
          if (Array.isArray(siteRes.data.domain_aliases)) aliases.push(...siteRes.data.domain_aliases);
        }
        inNetlify = aliases.map((d: any) => String(d).toLowerCase()).includes(clean);
      } catch (_) {
        // Listing may fail (env). We'll still attempt targeted removals below
      }

      // 2) Remove from Netlify if present or unknown
      let netlifyRemoved = false;
      try {
        if (inNetlify || !inDb) {
          const ok = await DomainsApiHelper.deleteDomain(clean);
          netlifyRemoved = !!ok;
        }
      } catch (e) {
        console.warn('⚠️ Netlify removal step skipped/failed:', (e as any)?.message || e);
      }

      // 3) Remove KV mapping in Cloudflare
      let kvRemoved = false;
      try {
        const { safeNetlifyFetch } = await import('@/utils/netlifyFunctionHelper');
        const kv = await safeNetlifyFetch(`domainsCloudflare?domain=${encodeURIComponent(clean)}`, { method: 'DELETE' });
        kvRemoved = !!kv.success;
      } catch (e) {
        console.warn('⚠️ Cloudflare KV removal failed:', (e as any)?.message || e);
      }

      // 4) Ensure deletion from Supabase via server function (service role)
      let dbRemoved = false;
      try {
        const { safeNetlifyFetch } = await import('@/utils/netlifyFunctionHelper');
        const resp = await safeNetlifyFetch(`domainsSupabase?domain=${encodeURIComponent(clean)}`, { method: 'DELETE' });
        dbRemoved = !!resp.success;
      } catch (e) {
        // If function fails, attempt client delete as fallback
        try {
          let del = supabase.from('domains').delete().eq('domain', clean);
          if (userId) del = del.eq('user_id', userId);
          const { error } = await del;
          if (!error) dbRemoved = true; else dbRemoved = !inDb;
        } catch (_) {
          dbRemoved = !inDb;
        }
      }

      const success = netlifyRemoved || dbRemoved || kvRemoved;
      const parts: string[] = [];
      parts.push(dbRemoved ? 'database' : 'database skipped');
      parts.push(netlifyRemoved ? 'netlify' : 'netlify skipped');
      parts.push(kvRemoved ? 'cloudflare kv' : 'cloudflare kv skipped');

      return {
        success,
        netlify_removed: netlifyRemoved,
        message: `Removed (${parts.join(' + ')}) for ${clean}`
      };
    } catch (error: any) {
      console.error('Remove domain service error:', error);
      return {
        success: false,
        error: error?.message || 'Failed to remove domain'
      };
    }
  }

  /**
   * Sync domains between Supabase and Netlify
   */
  static async syncDomains(userId?: string): Promise<DomainManagementResponse> {
    try {
      console.log('🔄 Syncing domains between Supabase and Netlify');
      
      try {
        const { NetlifyApiService } = await import('@/services/netlifyApiService');
        const info = await NetlifyApiService.getSiteInfo();
        if (!info?.success) return { success: false, error: info?.error || 'Failed to load Netlify info' };
        const domains: string[] = [];
        if (info.data?.custom_domain) domains.push(info.data.custom_domain);
        if (Array.isArray(info.data?.domain_aliases)) domains.push(...info.data.domain_aliases);
        return {
          success: true,
          netlify_domains: domains,
          sync_results: {
            total_netlify: domains.length,
            total_supabase: 0,
            in_sync: 0,
            added_to_supabase: 0,
            updated_in_supabase: 0
          }
        };
      } catch (invokeErr: any) {
        console.error('Netlify info error:', invokeErr);
        return { success: false, error: invokeErr.message || 'Failed to sync domains' };
      }

    } catch (error: any) {
      console.error('Sync domains service error:', error);
      return {
        success: false,
        error: error.message || 'Failed to sync domains'
      };
    }
  }

  /**
   * Sync Netlify domain_aliases with active Supabase domains via dedicated edge function
   */
  static async syncAliasesToNetlify(userId?: string): Promise<{ success: boolean; updatedAliases?: string[]; count?: number; error?: string }>{
    try {
      // Build aliases from current Supabase domains
      const { data } = await supabase.from('domains').select('domain');
      const aliases = (data || []).map((r: any) => String(r.domain || ''));
      const res = await syncNetlifyAliases(aliases);
      if (!res.success) return { success: false, error: res.error || 'Failed to sync aliases' };
      return { success: true, updatedAliases: res.updatedAliases || [], count: (res.updatedAliases || []).length };
    } catch (invokeErr: any) {
      return { success: false, error: invokeErr?.message || 'Failed to sync aliases' };
    }
  }

  /**
   * Get all domains from Supabase
   */
  static async getDomains(userId?: string): Promise<{ domains: any[]; error: string | null }> {
    try {
      let query = supabase
        .from('domains')
        .select('*')
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Failed to load domains:', error);
        return { domains: [], error: error.message };
      }

      const rows = data || [];

      // Live Netlify alias check to avoid stale UI/status
      let aliasSet = new Set<string>();
      try {
        const { NetlifyApiService } = await import('@/services/netlifyApiService');
        const siteRes = await NetlifyApiService.getSiteInfo();
        const aliasesRaw: string[] = [];
        if (siteRes?.success && siteRes.data) {
          if (siteRes.data.custom_domain) aliasesRaw.push(siteRes.data.custom_domain);
          if (Array.isArray(siteRes.data.domain_aliases)) aliasesRaw.push(...siteRes.data.domain_aliases);
        }
        const norm = (s: string) => String(s || '').toLowerCase().replace(/^https?:\/\//, '').replace(/\.$/, '').replace(/^www\./, '');
        aliasesRaw.forEach((a: string) => { const n = norm(a); if (n) { aliasSet.add(n); aliasSet.add(`www.${n}`); }});
      } catch (e) {
        // Ignore alias fetch failures; fall back to DB flags
      }

      const enriched = rows.map((d: any) => {
        const norm = String(d.domain || '').toLowerCase();
        const inNetlify = aliasSet.size ? (aliasSet.has(norm) || aliasSet.has(`www.${norm}`)) : d.netlify_verified;
        return {
          ...d,
          netlify_verified: !!inNetlify,
          // If aliased but status pending/none, set optimistic transitional values for UI
          ssl_status: inNetlify && (!d.ssl_status || d.ssl_status === 'none') ? 'pending' : d.ssl_status,
          status: inNetlify && d.status !== 'active' && d.status !== 'error' ? 'active' : d.status,
        };
      });

      return { domains: enriched, error: null };

    } catch (error: any) {
      console.error('Get domains service error:', error);
      return { domains: [], error: error.message };
    }
  }

  /**
   * Test Netlify connection
   */
  static async testNetlifyConnection(): Promise<{ success: boolean; message: string; responseTime?: number }> {
    const startTime = Date.now();
    
    try {
      const result = await this.syncDomains();
      const responseTime = Date.now() - startTime;
      
      if (result.success) {
        return {
          success: true,
          message: 'Netlify connection successful',
          responseTime
        };
      } else {
        return {
          success: false,
          message: result.error || 'Netlify connection failed',
          responseTime
        };
      }

    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      return {
        success: false,
        message: error.message || 'Netlify connection test failed',
        responseTime
      };
    }
  }

  /**
   * Validate domain format
   */
  static validateDomain(domain: string): { isValid: boolean; error?: string } {
    if (!domain || !domain.trim()) {
      return { isValid: false, error: 'Domain cannot be empty' };
    }

    const cleanDomain = domain.trim().toLowerCase();

    // Remove protocol and www
    const normalizedDomain = cleanDomain
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/$/, '');

    // Check for valid domain format
    const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/;
    
    if (!domainRegex.test(normalizedDomain)) {
      return { 
        isValid: false, 
        error: 'Invalid domain format. Use format: example.com' 
      };
    }

    // Check length
    if (normalizedDomain.length > 253) {
      return { 
        isValid: false, 
        error: 'Domain name too long' 
      };
    }

    return { isValid: true };
  }

  /**
   * Clean and normalize domain input
   */
  static cleanDomain(domain: string): string {
    return domain
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/$/, '');
  }

  /**
   * Setup real-time subscription for domains table
   */
  static setupRealtimeSubscription(
    callback: (payload: any) => void,
    userId?: string
  ): (() => void) {
    const subscriptionConfig = {
      event: '*' as const,
      schema: 'public',
      table: 'domains',
      ...(userId && { filter: `user_id=eq.${userId}` })
    };

    const channel = supabase
      .channel('domains-realtime')
      .on('postgres_changes', subscriptionConfig, callback)
      .subscribe();

    // Return cleanup function
    return () => {
      supabase.removeChannel(channel);
    };
  }

  /**
   * Get domain statistics
   */
  static async getDomainStats(userId?: string): Promise<{
    total: number;
    verified: number;
    pending: number;
    errors: number;
    netlifyVerified: number;
  }> {
    try {
      const { domains } = await this.getDomains(userId);
      
      const stats = domains.reduce((acc, domain) => {
        acc.total++;
        
        if (domain.status === 'verified') acc.verified++;
        else if (domain.status === 'pending') acc.pending++;
        else if (domain.status === 'error') acc.errors++;
        
        if (domain.netlify_verified) acc.netlifyVerified++;
        
        return acc;
      }, {
        total: 0,
        verified: 0,
        pending: 0,
        errors: 0,
        netlifyVerified: 0
      });

      return stats;

    } catch (error) {
      console.error('Failed to get domain stats:', error);
      return {
        total: 0,
        verified: 0,
        pending: 0,
        errors: 0,
        netlifyVerified: 0
      };
    }
  }
}

export default DomainManagementService;
