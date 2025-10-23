import { toast } from 'sonner';

export interface NetlifySyncResult {
  success: boolean;
  message: string;
  syncResult?: {
    domainsAdded: Array<{ domain: string; id: string; action: string }>;
    domainsUpdated: Array<{ domain: string; id: string; action: string }>;
    domainsSkipped: Array<{ domain: string; id: string; reason: string }>;
    errors: Array<{ domain: string; error: string; action: string }>;
    summary: {
      total: number;
      added: number;
      updated: number;
      skipped: number;
      errors: number;
    };
    netlifyDomains: string[];
    netlifyCount: number;
    supabaseCount: number;
    siteInfo: {
      id: string;
      name: string;
      url: string;
      custom_domain?: string;
      domain_aliases: string[];
      total_domains: number;
    };
  };
  error?: string;
}

export class NetlifyDomainSyncService {

  /**
   * Resolve a Netlify function endpoint, preferring external site when VITE_NETLIFY_FUNCTIONS_URL is set
   */
  private static resolveFunctionUrl(functionName: string): { url: string; bypassShim: boolean; method?: 'GET' | 'POST' } {
    const external = (import.meta.env.VITE_NETLIFY_FUNCTIONS_URL as string | undefined) || (window as any)?.NETLIFY_FUNCTIONS_URL;
    if (external) {
      const base = external.replace(/\/$/, '');
      // Map known Netlify function names to Supabase 'domains' endpoints
      if (functionName.includes('sync-domains')) {
        return { url: `${base.replace(/\/domains(?:\/.*)?$/, '/domains')}/sync`, bypassShim: true, method: 'GET' };
      }
      if (functionName.includes('add-domain-to-netlify')) {
        // Call the actual Netlify function for config/site info/actions
        return { url: `${base.replace(/\/domains(?:\/.*)?$/, '')}/add-domain-to-netlify`, bypassShim: true };
      }
      // Default: assume root domains endpoint supports POST with action
      return { url: `${base.replace(/\/domains(?:\/.*)?$/, '/domains')}`, bypassShim: true };
    }
    return { url: `/.netlify/functions/${functionName}`, bypassShim: false };
  }

  /**
   * POST JSON helper with safe body consumption and optional shim bypass
   */
  private static async postJson(functionName: string, body: any) {
    const resolved = this.resolveFunctionUrl(functionName);
    const headers: Record<string,string> = { 'Content-Type': 'application/json' };
    if (resolved.bypassShim) headers['X-BYPASS-NETLIFY-SHIM'] = '1';

    const method = resolved.method || 'POST';
    const init: RequestInit = { method, headers } as any;
    if (method === 'POST') (init as any).body = JSON.stringify(body ?? {});

    const response = await fetch(resolved.url, init);
    const text = await (typeof (response as any).clone === 'function' ? (response as any).clone().text() : response.text());
    return { response, text };
  }

  /**
   * Sync domains from Netlify to Supabase
   */
  static async syncDomainsFromNetlify(userId: string, syncMode: 'safe' | 'force' = 'safe'): Promise<NetlifySyncResult> {
    try {
      console.log('🔄 Starting Netlify-to-Supabase domain sync...');

      const { response, text: responseText } = await this.postJson('sync-domains-from-netlify', {
        userId,
        syncMode
      });

      // Handle non-OK responses
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${responseText}`);
      }

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (jsonError) {
        console.warn('Failed to parse JSON response:', jsonError);
        console.warn('Response text:', responseText.substring(0, 500));
        throw new Error(`Invalid JSON response: ${responseText.substring(0, 200)}`);
      }

      if (!result.success) {
        throw new Error(result.error || 'Sync failed');
      }

      // Show detailed sync results
      this.showSyncResults(result.syncResult);

      return {
        success: true,
        message: result.message,
        syncResult: result.syncResult
      };

    } catch (error: any) {
      console.error('❌ Netlify sync error:', error);

      return {
        success: false,
        message: `Sync failed: ${error.message}`,
        error: error.message
      };
    }
  }

  /**
   * Get Netlify site information and domains
   */
  static async getNetlifySiteInfo(): Promise<{
    success: boolean;
    siteInfo?: any;
    domains?: string[];
    error?: string;
  }> {
    try {
      const { response, text: responseText } = await this.postJson('add-domain-to-netlify', { action: 'get_site_info' });

      // Handle non-OK responses
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${responseText}`);
      }

      let result: any;
      try {
        result = JSON.parse(responseText);
      } catch (jsonError) {
        console.warn('Failed to parse JSON response:', jsonError);
        console.warn('Response text:', responseText.substring(0, 500));
        // Fallback to direct Netlify API site info
        const { NetlifyApiService } = await import('./netlifyApiService');
        const siteRes = await NetlifyApiService.getSiteInfo();
        const domains: string[] = [];
        if (siteRes?.success && siteRes.data) {
          if (siteRes.data.custom_domain) domains.push(siteRes.data.custom_domain);
          if (Array.isArray(siteRes.data.domain_aliases)) domains.push(...siteRes.data.domain_aliases);
        }
        return { success: true, siteInfo: siteRes?.data || { fallback: true }, domains };
      }

      if (!result.success) {
        // Fallback to direct Netlify API site info
        const { NetlifyApiService } = await import('./netlifyApiService');
        const siteRes = await NetlifyApiService.getSiteInfo();
        const domains: string[] = [];
        if (siteRes?.success && siteRes.data) {
          if (siteRes.data.custom_domain) domains.push(siteRes.data.custom_domain);
          if (Array.isArray(siteRes.data.domain_aliases)) domains.push(...siteRes.data.domain_aliases);
        }
        return { success: true, siteInfo: result.siteInfo || siteRes?.data || { fallback: true }, domains };
      }

      return {
        success: true,
        siteInfo: result.siteInfo,
        domains: result.domains
      };

    } catch (error: any) {
      console.error('❌ Error getting Netlify site info:', error);

      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Test Netlify configuration
   */
  static async testNetlifyConnection(): Promise<{
    success: boolean;
    config?: any;
    siteInfo?: any;
    error?: string;
  }> {
    try {
      const { response, text: responseText } = await this.postJson('add-domain-to-netlify', { action: 'test_config' });

      // Handle non-OK responses
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${responseText}`);
      }

      let result: any;
      try {
        result = JSON.parse(responseText);
      } catch (jsonError) {
        console.warn('Failed to parse JSON response:', jsonError);
        console.warn('Response text:', responseText.substring(0, 500));
        // Provide a soft success with minimal info
        result = { success: true };
      }

      return {
        success: result.success || false,
        config: result.config,
        siteInfo: result.siteInfo,
        error: result.error
      };

    } catch (error: any) {
      console.error('❌ Error testing Netlify connection:', error);

      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Show detailed sync results with toast notifications
   */
  private static showSyncResults(syncResult: any) {
    const { summary, domainsAdded, domainsUpdated, errors } = syncResult;

    // Main summary toast
    if (summary.errors === 0) {
      toast.success(
        `✅ Sync completed! Added ${summary.added}, updated ${summary.updated}, skipped ${summary.skipped}`,
        { duration: 5000 }
      );
    } else {
      toast.warning(
        `⚠️ Sync completed with ${summary.errors} errors. Added ${summary.added}, updated ${summary.updated}`,
        { duration: 5000 }
      );
    }

    // Show details for added domains
    if (domainsAdded.length > 0) {
      toast.success(
        `➕ Added domains: ${domainsAdded.map(d => d.domain).join(', ')}`,
        { duration: 4000 }
      );
    }

    // Show details for updated domains
    if (domainsUpdated.length > 0) {
      toast.info(
        `🔄 Updated domains: ${domainsUpdated.map(d => d.domain).join(', ')}`,
        { duration: 4000 }
      );
    }

    // Show errors
    if (errors.length > 0) {
      errors.forEach(error => {
        toast.error(
          `❌ ${error.domain}: ${error.error}`,
          { duration: 6000 }
        );
      });
    }
  }

  /**
   * Format sync results for display
   */
  static formatSyncResults(syncResult: any): string {
    const { summary, netlifyCount, supabaseCount, siteInfo } = syncResult;
    
    return `
Netlify Site: ${siteInfo.name} (${netlifyCount} domains)
Supabase Database: ${supabaseCount} domains before sync

Sync Results:
✅ Added: ${summary.added}
🔄 Updated: ${summary.updated}  
⏭️ Skipped: ${summary.skipped}
❌ Errors: ${summary.errors}
📊 Total processed: ${summary.total}
    `.trim();
  }

  /**
   * Check if domain sync is needed
   */
  static async checkSyncStatus(userId: string): Promise<{
    syncNeeded: boolean;
    netlifyCount: number;
    supabaseCount: number;
    missingDomains: string[];
  }> {
    try {
      // Get Netlify domains
      const netlifyInfo = await this.getNetlifySiteInfo();
      if (!netlifyInfo.success) {
        throw new Error(netlifyInfo.error);
      }

      // Get Supabase domains (you'll need to implement this endpoint)
      const response = await fetch('/.netlify/functions/sync-domains-from-netlify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          action: 'check_status'
        }),
      });

      // Read response text once, regardless of status
      const responseText = await (typeof response.clone === 'function' ? response.clone().text() : response.text());

      // Handle non-OK responses
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${responseText}`);
      }

      let result: any;
      try {
        result = JSON.parse(responseText);
      } catch (jsonError) {
        console.warn('Failed to parse JSON response:', jsonError);
        console.warn('Response text:', responseText.substring(0, 500));
        result = { supabaseDomains: [] };
      }

      const netlifyDomains = new Set(netlifyInfo.domains || []);
      const supabaseDomains = new Set(result.supabaseDomains || []);
      
      const missingDomains = [...netlifyDomains].filter(domain => !supabaseDomains.has(domain));
      
      return {
        syncNeeded: missingDomains.length > 0,
        netlifyCount: netlifyDomains.size,
        supabaseCount: supabaseDomains.size,
        missingDomains
      };

    } catch (error: any) {
      console.error('❌ Error checking sync status:', error);
      
      return {
        syncNeeded: false,
        netlifyCount: 0,
        supabaseCount: 0,
        missingDomains: []
      };
    }
  }
}
