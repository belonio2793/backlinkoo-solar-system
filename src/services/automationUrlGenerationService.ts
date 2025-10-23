/**
 * Automation URL Generation Service
 * Handles URL generation and slug propagation for automation domain blog posts
 */

import { slugGenerationService } from './slugGenerationService';
import { supabase } from '@/integrations/supabase/client';

export interface DomainInfo {
  id: string;
  domain: string;
  blog_subdirectory?: string;
  blog_enabled: boolean;
  dns_verified: boolean;
  netlify_verified: boolean;
  ssl_enabled?: boolean;
  custom_subdomain?: string;
  selected_theme?: string | null;
  blog_theme_template_key?: string | null;
}

export interface UrlGenerationOptions {
  includeDate?: boolean;
  includeCategory?: boolean;
  useCustomPath?: string;
  addUtmParameters?: boolean;
  campaignId?: string;
  trackingEnabled?: boolean;
  randomizeSlug?: boolean;
}

export interface GeneratedUrl {
  fullUrl: string;
  slug: string;
  path: string;
  domain: string;
  isSecure: boolean;
  trackingParams?: string;
  publishedAt: string;
}

export interface UrlValidationResult {
  isValid: boolean;
  isReachable: boolean;
  httpStatus?: number;
  errors: string[];
  warnings: string[];
}

export class AutomationUrlGenerationService {

  /**
   * Generate published URL for automation domain blog post
   */
  static async generatePublishedUrl(
    domainId: string,
    title: string,
    keyword: string,
    options: UrlGenerationOptions = {}
  ): Promise<GeneratedUrl> {
    try {
      console.log(`🔗 Generating URL for domain ${domainId} with title: "${title}"`);
      
      // Get domain information
      const domainInfo = await this.getDomainInfo(domainId);
      if (!domainInfo) {
        throw new Error(`Domain ${domainId} not found`);
      }
      
      if (!domainInfo.blog_enabled) {
        throw new Error(`Blog not enabled for domain ${domainInfo.domain}`);
      }
      
      // Generate slug
      const slug = await this.generateSlugForDomain(title, keyword, domainId, options);
      
      // Build URL path
      const path = this.buildUrlPath(slug, domainInfo, options);
      
      // Construct full URL
      const protocol = domainInfo.ssl_enabled !== false ? 'https' : 'http';
      const subdomain = domainInfo.custom_subdomain || '';
      const domainName = subdomain ? `${subdomain}.${domainInfo.domain}` : domainInfo.domain;
      const fullUrl = `${protocol}://${domainName}${path}`;
      
      // Add tracking parameters if enabled
      let trackingParams = '';
      if (options.addUtmParameters && options.campaignId) {
        trackingParams = this.generateTrackingParameters(options.campaignId);
        const separator = fullUrl.includes('?') ? '&' : '?';
        const finalUrl = fullUrl + separator + trackingParams;
      }
      
      const result: GeneratedUrl = {
        fullUrl: options.addUtmParameters ? fullUrl + (fullUrl.includes('?') ? '&' : '?') + trackingParams : fullUrl,
        slug,
        path,
        domain: domainName,
        isSecure: protocol === 'https',
        trackingParams: trackingParams || undefined,
        publishedAt: new Date().toISOString()
      };
      
      console.log(`✅ Generated URL: ${result.fullUrl}`);
      return result;
      
    } catch (error) {
      console.error('❌ URL generation failed:', error);
      throw error;
    }
  }

  /**
   * Generate slug specifically for a domain
   */
  private static async generateSlugForDomain(
    title: string,
    keyword: string,
    domainId: string,
    options: UrlGenerationOptions
  ): Promise<string> {
    // Check for existing slugs in this domain to avoid conflicts
    const existingSlugs = await this.getExistingSlugsByDomain(domainId);
    
    let baseSlug = await slugGenerationService.generateUniqueSlug({
      title,
      keywords: [keyword],
      includeDate: options.includeDate,
      includeKeyword: true,
      maxLength: 50
    });

    // Optional randomization to reduce predictable collisions
    if (options.randomizeSlug) {
      const rand = Math.random().toString(36).slice(2, 8);
      baseSlug = `${baseSlug}-${rand}`;
    }

    // Ensure uniqueness within domain
    let finalSlug = baseSlug;
    let counter = 1;

    while (existingSlugs.includes(finalSlug)) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    return finalSlug;
  }

  /**
   * Build URL path based on domain configuration
   */
  private static buildUrlPath(
    slug: string,
    domainInfo: DomainInfo,
    options: UrlGenerationOptions
  ): string {
    let themeKey = (domainInfo.selected_theme || domainInfo.blog_theme_template_key || 'minimal').toString();
    themeKey = String(themeKey).toLowerCase().replace(/_/g,'-').trim() === 'random-ai-generated' ? 'random' : themeKey;
    // Build path without the '/themes' prefix, use theme key as first segment
    let path = `/${encodeURIComponent(themeKey)}`;

    if (options.includeDate) {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      path += `/${year}/${month}`;
    }

    if (options.includeCategory) {
      path += '/articles';
    }

    if (options.useCustomPath) {
      path += `/${options.useCustomPath.replace(/^\/|\/$/g, '')}`;
    }

    path += `/${slug}`;
    return path;
  }

  /**
   * Generate tracking parameters for campaign
   */
  private static generateTrackingParameters(campaignId: string): string {
    const params = new URLSearchParams({
      utm_source: 'automation',
      utm_medium: 'blog',
      utm_campaign: `campaign-${campaignId}`,
      utm_content: 'automated-post',
      tracking_id: campaignId
    });
    
    return params.toString();
  }

  /**
   * Get existing slugs for a domain to avoid conflicts
   */
  private static async getExistingSlugsByDomain(domainId: string): Promise<string[]> {
    try {
      // Check automation_domains table
      const { data: automationSlugs, error: automationError } = await supabase
        .from('automation_domains')
        .select('published_url')
        .eq('domain_id', domainId)
        .not('published_url', 'is', null);
      
      if (automationError && automationError.code !== 'PGRST116') {
        console.warn('Error fetching automation domain slugs:', automationError);
      }
      
      // Check domain_blog_posts table
      const { data: blogSlugs, error: blogError } = await supabase
        .from('domain_blog_posts')
        .select('slug')
        .eq('domain_id', domainId);
      
      if (blogError && blogError.code !== 'PGRST116') {
        console.warn('Error fetching blog post slugs:', blogError);
      }
      
      // Extract slugs from URLs and combine
      const automationSlugList = automationSlugs?.map(item => {
        const url = item.published_url;
        if (url) {
          const parts = url.split('/');
          return parts[parts.length - 1];
        }
        return null;
      }).filter(Boolean) || [];
      
      const blogSlugList = blogSlugs?.map(item => item.slug).filter(Boolean) || [];
      
      return [...new Set([...automationSlugList, ...blogSlugList])];
    } catch (error) {
      console.warn('Error checking existing slugs:', error);
      return [];
    }
  }

  /**
   * Get domain information
   */
  private static async getDomainInfo(domainId: string): Promise<DomainInfo | null> {
    try {
      const { data, error } = await supabase
        .from('domains')
        .select(`
          id,
          domain,
          blog_subdirectory,
          blog_enabled,
          dns_verified,
          netlify_verified,
          ssl_enabled,
          custom_subdomain,
          selected_theme,
          blog_theme_template_key
        `)
        .eq('id', domainId)
        .single();
      
      if (error) {
        console.error('Error fetching domain info:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error getting domain info:', error);
      return null;
    }
  }

  /**
   * Validate generated URL
   */
  static async validateUrl(url: string): Promise<UrlValidationResult> {
    const result: UrlValidationResult = {
      isValid: false,
      isReachable: false,
      errors: [],
      warnings: []
    };
    
    try {
      // Basic URL validation
      const urlObj = new URL(url);
      result.isValid = true;
      
      // Check for HTTPS
      if (urlObj.protocol !== 'https:') {
        result.warnings.push('URL is not secure (HTTPS recommended)');
      }
      
      // Check for reasonable path length
      if (urlObj.pathname.length > 100) {
        result.warnings.push('URL path is quite long, consider shortening');
      }
      
      // Check for URL-unfriendly characters
      if (urlObj.pathname.includes(' ') || urlObj.pathname.includes('%20')) {
        result.errors.push('URL contains spaces that may cause issues');
      }
      
      // In a real implementation, you might check reachability here
      // For now, we'll assume it's reachable if valid
      result.isReachable = result.isValid && result.errors.length === 0;
      
    } catch (error) {
      result.errors.push('Invalid URL format');
    }
    
    return result;
  }

  /**
   * Bulk generate URLs for multiple automation domains
   */
  static async bulkGenerateUrls(
    domainEntries: Array<{
      id: string;
      domainId: string;
      title: string;
      keyword: string;
    }>,
    options: UrlGenerationOptions = {}
  ): Promise<Array<{
    entryId: string;
    url: GeneratedUrl | null;
    error?: string;
  }>> {
    const results: Array<{
      entryId: string;
      url: GeneratedUrl | null;
      error?: string;
    }> = [];
    
    for (const entry of domainEntries) {
      try {
        const url = await this.generatePublishedUrl(
          entry.domainId,
          entry.title,
          entry.keyword,
          options
        );
        
        results.push({
          entryId: entry.id,
          url,
        });
      } catch (error) {
        results.push({
          entryId: entry.id,
          url: null,
          error: error instanceof Error ? error.message : String(error)
        });
      }
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return results;
  }

  /**
   * Update automation domain with published URL
   */
  static async updateAutomationDomainUrl(
    automationDomainId: string,
    generatedUrl: GeneratedUrl
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('automation_domains')
        .update({
          published_url: generatedUrl.fullUrl,
          status: 'published',
          updated_at: new Date().toISOString()
        })
        .eq('id', automationDomainId);
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get URL analytics for a domain
   */
  static async getUrlAnalytics(domainId: string): Promise<{
    totalUrls: number;
    publishedUrls: number;
    averageSlugLength: number;
    mostCommonPaths: string[];
    recentUrls: GeneratedUrl[];
  }> {
    try {
      const { data: automationDomains } = await supabase
        .from('automation_domains')
        .select('published_url, post_title, created_at')
        .eq('domain_id', domainId)
        .not('published_url', 'is', null)
        .order('created_at', { ascending: false })
        .limit(50);
      
      const urls = automationDomains || [];
      const totalUrls = urls.length;
      const publishedUrls = urls.filter(u => u.published_url).length;
      
      // Calculate average slug length
      const slugs = urls.map(u => {
        if (u.published_url) {
          const parts = u.published_url.split('/');
          return parts[parts.length - 1];
        }
        return '';
      }).filter(Boolean);
      
      const averageSlugLength = slugs.length > 0 
        ? Math.round(slugs.reduce((sum, slug) => sum + slug.length, 0) / slugs.length)
        : 0;
      
      // Find most common paths
      const paths = urls.map(u => {
        if (u.published_url) {
          const urlObj = new URL(u.published_url);
          const pathParts = urlObj.pathname.split('/').slice(0, -1); // Remove slug
          return pathParts.join('/');
        }
        return '';
      }).filter(Boolean);
      
      const pathCounts: { [path: string]: number } = {};
      paths.forEach(path => {
        pathCounts[path] = (pathCounts[path] || 0) + 1;
      });
      
      const mostCommonPaths = Object.entries(pathCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([path]) => path);
      
      // Convert recent URLs to GeneratedUrl format
      const recentUrls: GeneratedUrl[] = urls.slice(0, 10).map(u => ({
        fullUrl: u.published_url || '',
        slug: u.published_url ? u.published_url.split('/').pop() || '' : '',
        path: u.published_url ? new URL(u.published_url).pathname : '',
        domain: u.published_url ? new URL(u.published_url).hostname : '',
        isSecure: u.published_url ? u.published_url.startsWith('https') : false,
        publishedAt: u.created_at || new Date().toISOString()
      }));
      
      return {
        totalUrls,
        publishedUrls,
        averageSlugLength,
        mostCommonPaths,
        recentUrls
      };
    } catch (error) {
      console.error('Error getting URL analytics:', error);
      return {
        totalUrls: 0,
        publishedUrls: 0,
        averageSlugLength: 0,
        mostCommonPaths: [],
        recentUrls: []
      };
    }
  }

  /**
   * Generate SEO-friendly URL variations
   */
  static async generateUrlVariations(
    title: string,
    keyword: string,
    domain: string
  ): Promise<Array<{
    url: string;
    slug: string;
    seoScore: number;
    description: string;
  }>> {
    const suggestions = await slugGenerationService.generateSlugSuggestions({
      title,
      keywords: [keyword],
      includeKeyword: true
    });
    
    return suggestions.map(suggestion => ({
      url: `https://${domain}/blog/${suggestion.slug}`,
      slug: suggestion.slug,
      seoScore: suggestion.score,
      description: suggestion.description
    }));
  }

  /**
   * Check URL availability across all domains
   */
  static async checkGlobalUrlAvailability(slug: string): Promise<{
    isAvailable: boolean;
    conflictingDomains: string[];
    suggestions: string[];
  }> {
    try {
      const { data: conflicts } = await supabase
        .from('automation_domains')
        .select('published_url, domain_id')
        .like('published_url', `%/${slug}`)
        .not('published_url', 'is', null);
      
      const conflictingDomains = conflicts?.map(c => c.domain_id) || [];
      const isAvailable = conflictingDomains.length === 0;
      
      let suggestions: string[] = [];
      if (!isAvailable) {
        // Generate alternative suggestions
        for (let i = 1; i <= 5; i++) {
          suggestions.push(`${slug}-${i}`);
        }
        suggestions.push(`${slug}-${new Date().getFullYear()}`);
        suggestions.push(`${slug}-guide`);
      }
      
      return {
        isAvailable,
        conflictingDomains,
        suggestions
      };
    } catch (error) {
      console.error('Error checking global URL availability:', error);
      return {
        isAvailable: true,
        conflictingDomains: [],
        suggestions: []
      };
    }
  }
}

export default AutomationUrlGenerationService;
