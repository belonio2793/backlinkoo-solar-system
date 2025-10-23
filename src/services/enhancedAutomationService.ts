/**
 * Enhanced Automation Service for Link Building
 * 
 * Integrates domain management with automated link building campaigns
 * and content distribution across multiple domains
 */

import { supabase } from '@/integrations/supabase/client';

export interface LinkBuildingCampaign {
  id: string;
  user_id: string;
  name: string;
  target_url: string;
  anchor_texts: string[];
  keywords: string[];
  domains: string[]; // Associated domains for this campaign
  status: 'draft' | 'active' | 'paused' | 'completed';
  posts_created: number;
  links_built: number;
  rotation_strategy: 'round_robin' | 'random' | 'manual';
  content_quality: 'standard' | 'premium' | 'enterprise';
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface DomainLinkProfile {
  domain_id: string;
  domain_name: string;
  posts_published: number;
  last_post_date?: string;
  authority_score: number;
  niche_relevance: string[];
  link_capacity: number; // Max links per month
  current_month_links: number;
  quality_rating: 'high' | 'medium' | 'low';
  status: 'active' | 'cooling_down' | 'inactive';
}

export interface ContentDistributionPlan {
  campaign_id: string;
  domain_assignments: Array<{
    domain_id: string;
    domain_name: string;
    content_type: 'blog_post' | 'guest_article' | 'resource_page';
    anchor_text: string;
    target_keyword: string;
    scheduled_date: string;
    priority: number;
  }>;
  estimated_completion: string;
  total_posts: number;
  domains_count: number;
}

export class EnhancedAutomationService {
  
  /**
   * Create a new link building campaign with domain integration
   */
  static async createLinkBuildingCampaign(
    userId: string,
    campaignData: {
      name: string;
      target_url: string;
      anchor_texts: string[];
      keywords: string[];
      preferred_domains?: string[];
      rotation_strategy?: 'round_robin' | 'random' | 'manual';
      content_quality?: 'standard' | 'premium' | 'enterprise';
      posts_per_domain?: number;
    }
  ): Promise<{ success: boolean; campaign?: LinkBuildingCampaign; error?: string }> {
    try {
      // Get available domains for the user
      const availableDomains = await this.getAvailableDomainsForCampaign(userId);
      
      if (availableDomains.length === 0) {
        return {
          success: false,
          error: 'No verified domains available for link building. Please add and verify domains first.'
        };
      }

      // Select domains for the campaign
      const selectedDomains = campaignData.preferred_domains?.length 
        ? availableDomains.filter(d => campaignData.preferred_domains!.includes(d.domain_name))
        : availableDomains.slice(0, Math.min(5, availableDomains.length)); // Max 5 domains per campaign

      // Create the campaign
      const { data: campaign, error: campaignError } = await supabase
        .from('link_building_campaigns')
        .insert({
          user_id: userId,
          name: campaignData.name,
          target_url: campaignData.target_url,
          anchor_texts: campaignData.anchor_texts,
          keywords: campaignData.keywords,
          domains: selectedDomains.map(d => d.domain_name),
          status: 'draft',
          posts_created: 0,
          links_built: 0,
          rotation_strategy: campaignData.rotation_strategy || 'round_robin',
          content_quality: campaignData.content_quality || 'standard',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (campaignError) {
        return {
          success: false,
          error: `Failed to create campaign: ${campaignError.message}`
        };
      }

      // Create content distribution plan
      await this.createContentDistributionPlan(
        campaign.id, 
        selectedDomains, 
        campaignData.anchor_texts,
        campaignData.keywords,
        campaignData.posts_per_domain || 2
      );

      return {
        success: true,
        campaign
      };

    } catch (error) {
      console.error('Error creating link building campaign:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Get available domains for link building campaigns
   */
  static async getAvailableDomainsForCampaign(userId: string): Promise<DomainLinkProfile[]> {
    try {
      // Get verified domains with blog capability
      const { data: domains, error } = await supabase
        .from('domains')
        .select(`
          id,
          domain,
          netlify_verified,
          dns_verified,
          blog_enabled,
          status,
          created_at
        `)
        .eq('user_id', userId)
        .eq('netlify_verified', true)
        .eq('blog_enabled', true)
        .in('status', ['active', 'verified']);

      if (error) {
        throw new Error(`Failed to fetch domains: ${error.message}`);
      }

      // Calculate domain profiles for link building
      const domainProfiles: DomainLinkProfile[] = [];
      
      for (const domain of domains || []) {
        // Get existing posts count for this domain
        const { count: postsCount } = await supabase
          .from('blog_posts')
          .select('*', { count: 'exact' })
          .eq('domain_id', domain.id);

        // Calculate authority score based on age and activity
        const domainAge = Math.floor(
          (Date.now() - new Date(domain.created_at).getTime()) / (1000 * 60 * 60 * 24)
        );
        const authorityScore = Math.min(100, Math.max(10, domainAge * 2 + (postsCount || 0) * 5));

        // Get current month links count
        const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
        const { count: currentMonthLinks } = await supabase
          .from('blog_posts')
          .select('*', { count: 'exact' })
          .eq('domain_id', domain.id)
          .gte('created_at', `${currentMonth}-01`)
          .lt('created_at', `${currentMonth}-32`);

        domainProfiles.push({
          domain_id: domain.id,
          domain_name: domain.domain,
          posts_published: postsCount || 0,
          authority_score: authorityScore,
          niche_relevance: ['general', 'business'], // Could be enhanced with AI categorization
          link_capacity: this.calculateLinkCapacity(authorityScore),
          current_month_links: currentMonthLinks || 0,
          quality_rating: this.getQualityRating(authorityScore, domainAge),
          status: 'active'
        });
      }

      // Sort by authority score and availability
      return domainProfiles
        .filter(profile => profile.current_month_links < profile.link_capacity)
        .sort((a, b) => b.authority_score - a.authority_score);

    } catch (error) {
      console.error('Error getting available domains:', error);
      return [];
    }
  }

  /**
   * Create content distribution plan for a campaign
   */
  static async createContentDistributionPlan(
    campaignId: string,
    domains: DomainLinkProfile[],
    anchorTexts: string[],
    keywords: string[],
    postsPerDomain: number = 2
  ): Promise<ContentDistributionPlan> {
    const assignments = [];
    
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1); // Start tomorrow

    for (const domain of domains) {
      for (let i = 0; i < Math.min(postsPerDomain, domain.link_capacity - domain.current_month_links); i++) {
        const anchorText = anchorTexts[Math.floor(Math.random() * anchorTexts.length)];
        const keyword = keywords[Math.floor(Math.random() * keywords.length)];
        
        assignments.push({
          domain_id: domain.domain_id,
          domain_name: domain.domain_name,
          content_type: 'blog_post' as const,
          anchor_text: anchorText,
          target_keyword: keyword,
          scheduled_date: new Date(currentDate).toISOString(),
          priority: domain.authority_score
        });

        // Space out posts (2-3 days between posts on same domain)
        currentDate.setDate(currentDate.getDate() + Math.floor(Math.random() * 2) + 2);
      }
    }

    const plan: ContentDistributionPlan = {
      campaign_id: campaignId,
      domain_assignments: assignments,
      estimated_completion: new Date(currentDate).toISOString(),
      total_posts: assignments.length,
      domains_count: domains.length
    };

    // Save the distribution plan
    await supabase
      .from('content_distribution_plans')
      .insert(plan);

    return plan;
  }

  /**
   * Execute campaign - create and publish content across domains
   */
  static async executeCampaign(campaignId: string): Promise<{
    success: boolean;
    posts_created: number;
    domains_used: number;
    error?: string;
  }> {
    try {
      // Get campaign details
      const { data: campaign, error: campaignError } = await supabase
        .from('link_building_campaigns')
        .select('*')
        .eq('id', campaignId)
        .single();

      if (campaignError || !campaign) {
        return {
          success: false,
          posts_created: 0,
          domains_used: 0,
          error: 'Campaign not found'
        };
      }

      // Get distribution plan
      const { data: plan, error: planError } = await supabase
        .from('content_distribution_plans')
        .select('*')
        .eq('campaign_id', campaignId)
        .single();

      if (planError || !plan) {
        return {
          success: false,
          posts_created: 0,
          domains_used: 0,
          error: 'Distribution plan not found'
        };
      }

      let postsCreated = 0;
      const domainsUsed = new Set<string>();

      // Create content for each assignment
      for (const assignment of plan.domain_assignments) {
        try {
          const postContent = await this.generateLinkBuildingContent(
            campaign.target_url,
            assignment.anchor_text,
            assignment.target_keyword,
            campaign.content_quality
          );

          // Create blog post
          const { error: postError } = await supabase
            .from('blog_posts')
            .insert({
              domain_id: assignment.domain_id,
              user_id: campaign.user_id,
              title: postContent.title,
              slug: this.generateSlug(postContent.title),
              content: postContent.content,
              excerpt: postContent.excerpt,
              meta_description: postContent.meta_description,
              keywords: [assignment.target_keyword],
              tags: campaign.keywords,
              category: 'link-building',
              target_url: campaign.target_url,
              anchor_text: assignment.anchor_text,
              status: 'published',
              campaign_id: campaignId,
              created_at: new Date().toISOString(),
              published_at: new Date().toISOString()
            });

          if (!postError) {
            postsCreated++;
            domainsUsed.add(assignment.domain_name);
          }

        } catch (error) {
          console.error(`Failed to create post for domain ${assignment.domain_name}:`, error);
        }
      }

      // Update campaign status
      await supabase
        .from('link_building_campaigns')
        .update({
          status: 'active',
          posts_created: postsCreated,
          links_built: postsCreated,
          updated_at: new Date().toISOString()
        })
        .eq('id', campaignId);

      return {
        success: true,
        posts_created: postsCreated,
        domains_used: domainsUsed.size
      };

    } catch (error) {
      console.error('Error executing campaign:', error);
      return {
        success: false,
        posts_created: 0,
        domains_used: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Generate high-quality content for link building
   */
  private static async generateLinkBuildingContent(
    targetUrl: string,
    anchorText: string,
    keyword: string,
    quality: string
  ): Promise<{
    title: string;
    content: string;
    excerpt: string;
    meta_description: string;
  }> {
    // Enhanced content generation with quality tiers
    const contentTemplates = {
      standard: {
        wordCount: 800,
        sections: 4,
        linkDensity: 0.02
      },
      premium: {
        wordCount: 1200,
        sections: 6,
        linkDensity: 0.015
      },
      enterprise: {
        wordCount: 1500,
        sections: 8,
        linkDensity: 0.01
      }
    };

    const template = contentTemplates[quality as keyof typeof contentTemplates] || contentTemplates.standard;

    return {
      title: `${keyword.charAt(0).toUpperCase() + keyword.slice(1)}: Expert Insights and Best Practices`,
      content: this.generateStructuredContent(targetUrl, anchorText, keyword, template),
      excerpt: `Discover expert insights about ${keyword} and learn industry best practices from leading professionals.`,
      meta_description: `Comprehensive guide to ${keyword}. Expert insights, best practices, and actionable strategies for success.`
    };
  }

  /**
   * Generate structured, high-quality content
   */
  private static generateStructuredContent(
    targetUrl: string,
    anchorText: string,
    keyword: string,
    template: { wordCount: number; sections: number; linkDensity: number }
  ): string {
    const sections = [
      `# ${keyword.charAt(0).toUpperCase() + keyword.slice(1)}: A Comprehensive Guide

In today's competitive landscape, understanding ${keyword} has become crucial for businesses and professionals alike. This comprehensive guide explores the key aspects, best practices, and strategies that can help you succeed.`,

      `## Understanding the Fundamentals

${keyword} encompasses various elements that work together to create successful outcomes. Industry experts consistently emphasize the importance of taking a strategic approach when implementing these practices.`,

      `## Best Practices and Implementation

When it comes to ${keyword}, following proven methodologies can significantly improve your results. Professional services and expert guidance, such as those offered by <a href="${targetUrl}" rel="noopener">${anchorText}</a>, can provide valuable insights and support throughout the process.`,

      `## Industry Trends and Insights

The landscape of ${keyword} continues to evolve rapidly. Staying informed about current trends and emerging technologies ensures that your strategies remain effective and competitive in the market.`,

      `## Measuring Success and ROI

Implementing proper tracking and measurement systems is essential for evaluating the effectiveness of your ${keyword} initiatives. Regular analysis and optimization based on data-driven insights lead to continuous improvement.`,

      `## Future Considerations

As the industry continues to develop, staying ahead of upcoming changes and innovations in ${keyword} will be crucial for long-term success. Building relationships with industry leaders and maintaining continuous learning are key factors.`,

      `## Conclusion

Mastering ${keyword} requires dedication, proper strategy, and often professional guidance. By implementing the practices outlined in this guide and working with experienced professionals, you can achieve significant improvements in your results.

For personalized assistance and expert consultation on ${keyword}, consider exploring <a href="${targetUrl}" rel="noopener">${anchorText}</a> to learn more about professional services tailored to your specific needs.`
    ];

    return sections.slice(0, template.sections).join('\n\n');
  }

  /**
   * Calculate link building capacity based on domain authority
   */
  private static calculateLinkCapacity(authorityScore: number): number {
    if (authorityScore >= 80) return 8; // High authority domains
    if (authorityScore >= 60) return 5; // Medium authority domains
    if (authorityScore >= 40) return 3; // Lower authority domains
    return 1; // New/low authority domains
  }

  /**
   * Get quality rating for a domain
   */
  private static getQualityRating(authorityScore: number, domainAge: number): 'high' | 'medium' | 'low' {
    if (authorityScore >= 70 && domainAge >= 90) return 'high';
    if (authorityScore >= 50 && domainAge >= 30) return 'medium';
    return 'low';
  }

  /**
   * Generate SEO-friendly slug from title
   */
  private static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50);
  }

  /**
   * Get campaign statistics and performance metrics
   */
  static async getCampaignStats(campaignId: string): Promise<{
    total_posts: number;
    domains_used: number;
    average_authority: number;
    completion_rate: number;
    estimated_traffic: number;
  }> {
    try {
      const { data: posts } = await supabase
        .from('blog_posts')
        .select('domain_id, view_count')
        .eq('campaign_id', campaignId);

      const uniqueDomains = new Set(posts?.map(p => p.domain_id) || []);
      const totalViews = posts?.reduce((sum, post) => sum + (post.view_count || 0), 0) || 0;

      return {
        total_posts: posts?.length || 0,
        domains_used: uniqueDomains.size,
        average_authority: 0, // Would calculate from domain authority scores
        completion_rate: 100, // Would calculate based on planned vs actual posts
        estimated_traffic: totalViews
      };
    } catch (error) {
      console.error('Error getting campaign stats:', error);
      return {
        total_posts: 0,
        domains_used: 0,
        average_authority: 0,
        completion_rate: 0,
        estimated_traffic: 0
      };
    }
  }
}

export default EnhancedAutomationService;
