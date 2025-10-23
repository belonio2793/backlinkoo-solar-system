/**
 * Automation Domain Blog Publishing Service
 * Comprehensive service that coordinates template assignment, content formatting, and publishing
 * for automation_domains table workflow
 */

import { AutomationTemplateService, TemplateAssignmentOptions } from './automationTemplateService';
import { AutomationTemplateRotationService, RotationConfig } from './automationTemplateRotationService';
import { AutomationBlogFormatterService, BlogPostData, FormattingOptions } from './automationBlogFormatterService';
import { AutomationUrlGenerationService, UrlGenerationOptions } from './automationUrlGenerationService';
import { openAIContentGenerator } from './openAIContentGenerator';
import { supabase } from '@/integrations/supabase/client';
import { normalizeContent as formatNormalize, titleCase as formatTitleCase, extractTitleFromContent } from '@/lib/autoPostFormatter';

export interface AutomationDomainBlogRequest {
  campaignId: string;
  domainIds: string[];
  keyword: string;
  targetUrl: string;
  anchorText: string;
  contentPrompt?: string;
  rotationConfig?: RotationConfig;
  formattingOptions?: Partial<FormattingOptions>;
  urlOptions?: UrlGenerationOptions;
  publishingOptions?: {
    generateContent?: boolean;
    autoPublish?: boolean;
    schedulePublish?: Date;
    notifyOnCompletion?: boolean;
  };
}

export interface AutomationDomainBlogResult {
  success: boolean;
  campaignId: string;
  totalDomains: number;
  successfulPublications: AutomationDomainPublication[];
  failedPublications: AutomationDomainFailure[];
  summary: {
    templatesUsed: { [templateId: number]: number };
    averageProcessingTime: number;
    totalWordCount: number;
    seoScore: number;
  };
}

export interface AutomationDomainPublication {
  automationDomainId: string;
  domainId: string;
  domain: string;
  templateId: number;
  templateName: string;
  publishedUrl: string;
  slug: string;
  title: string;
  wordCount: number;
  processingTime: number;
  seoMetrics: {
    keywordDensity: number;
    readabilityScore: number;
    metaOptimization: number;
  };
}

export interface AutomationDomainFailure {
  automationDomainId: string;
  domainId: string;
  domain: string;
  error: string;
  stage: 'template_assignment' | 'content_generation' | 'formatting' | 'url_generation' | 'publishing';
  retryable: boolean;
}

export interface AutomationDomainEntry {
  id: string;
  domain_id: string;
  campaign_id: string;
  keyword: string;
  url: string;
  anchor_text: string;
  prompt?: string;
  generated_content?: string;
  formatted_post?: string;
  theme_template: number;
  post_title?: string;
  post_excerpt?: string;
  status: 'pending' | 'generating' | 'published' | 'failed';
  published_url?: string;
  created_at: string;
  updated_at: string;
}

export class AutomationDomainBlogPublishingService {

  /**
   * Main publishing workflow for automation domains
   */
  static async publishAutomationDomainBlogs(
    request: AutomationDomainBlogRequest
  ): Promise<AutomationDomainBlogResult> {
    const startTime = Date.now();
    console.log(`🚀 Starting automation domain blog publishing for campaign ${request.campaignId}`);
    
    const result: AutomationDomainBlogResult = {
      success: false,
      campaignId: request.campaignId,
      totalDomains: request.domainIds.length,
      successfulPublications: [],
      failedPublications: [],
      summary: {
        templatesUsed: {},
        averageProcessingTime: 0,
        totalWordCount: 0,
        seoScore: 0
      }
    };

    try {
      // Step 1: Create automation domain entries
      const automationDomains = await this.createAutomationDomainEntries(request);
      console.log(`📝 Created ${automationDomains.length} automation domain entries`);

      // Step 2: Assign templates using rotation logic
      const templateAssignments = await AutomationTemplateRotationService.assignTemplatesWithRotation(
        request.domainIds,
        request.campaignId,
        request.rotationConfig || { strategy: 'sequential' }
      );
      console.log(`🎨 Assigned templates:`, templateAssignments.map(t => `Domain ${t.domainId}: Template ${t.assignedTemplate}`));

      // Step 3: Update automation domains with template assignments
      await this.updateAutomationDomainsWithTemplates(automationDomains, templateAssignments);

      // Step 4: Process each domain (generate content, format, create URLs, publish)
      for (let i = 0; i < automationDomains.length; i++) {
        const domainEntry = automationDomains[i];
        const assignment = templateAssignments.find(t => t.domainId === domainEntry.domain_id);
        
        if (!assignment) {
          result.failedPublications.push({
            automationDomainId: domainEntry.id,
            domainId: domainEntry.domain_id,
            domain: 'Unknown',
            error: 'Template assignment not found',
            stage: 'template_assignment',
            retryable: true
          });
          continue;
        }

        const publicationResult = await this.processSingleDomain(
          domainEntry,
          assignment.assignedTemplate,
          request
        );

        if (publicationResult.success) {
          result.successfulPublications.push(publicationResult.publication!);
          
          // Update template usage count
          result.summary.templatesUsed[assignment.assignedTemplate] = 
            (result.summary.templatesUsed[assignment.assignedTemplate] || 0) + 1;
          
          result.summary.totalWordCount += publicationResult.publication!.wordCount;
        } else {
          result.failedPublications.push(publicationResult.failure!);
        }

        // Progress logging
        const processed = i + 1;
        const percentage = Math.round((processed / automationDomains.length) * 100);
        console.log(`📊 Progress: ${processed}/${automationDomains.length} (${percentage}%) domains processed`);

        // Rate limiting between domains
        if (i < automationDomains.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // Step 5: Calculate summary metrics
      result.summary.averageProcessingTime = result.successfulPublications.length > 0 
        ? result.successfulPublications.reduce((sum, p) => sum + p.processingTime, 0) / result.successfulPublications.length
        : 0;

      result.summary.seoScore = result.successfulPublications.length > 0
        ? result.successfulPublications.reduce((sum, p) => sum + p.seoMetrics.metaOptimization, 0) / result.successfulPublications.length
        : 0;

      result.success = result.successfulPublications.length > 0;

      const totalTime = Date.now() - startTime;
      console.log(`✅ Publishing completed in ${totalTime}ms. Success: ${result.successfulPublications.length}/${result.totalDomains}`);
      
      // Step 6: Send completion notification if requested
      if (request.publishingOptions?.notifyOnCompletion) {
        await this.sendCompletionNotification(result);
      }

      return result;

    } catch (error) {
      console.error('❌ Automation domain blog publishing failed:', error);
      
      // Mark all as failed if we couldn't even start
      result.failedPublications = request.domainIds.map(domainId => ({
        automationDomainId: 'unknown',
        domainId,
        domain: 'Unknown',
        error: error instanceof Error ? error.message : String(error),
        stage: 'template_assignment',
        retryable: true
      }));

      return result;
    }
  }

  /**
   * Process a single domain through the complete workflow
   */
  private static async processSingleDomain(
    domainEntry: AutomationDomainEntry,
    templateId: number,
    request: AutomationDomainBlogRequest
  ): Promise<{
    success: boolean;
    publication?: AutomationDomainPublication;
    failure?: AutomationDomainFailure;
  }> {
    const startTime = Date.now();
    
    try {
      // Update status to generating
      await this.updateAutomationDomainStatus(domainEntry.id, 'generating');

      // Step 1: Generate content if needed
      let generatedContent = domainEntry.generated_content;
      let postTitle = domainEntry.post_title;
      
      if (request.publishingOptions?.generateContent !== false && !generatedContent) {
        console.log(`🤖 Generating content for domain ${domainEntry.domain_id}`);
        
        const contentResult = await this.generateContentForDomain(domainEntry, request);
        generatedContent = contentResult.content;
        postTitle = contentResult.title;
        
        // Save generated content
        await this.updateAutomationDomainContent(domainEntry.id, generatedContent, postTitle);
      }

      if (!generatedContent || !postTitle) {
        throw new Error('No content available for formatting');
      }

      // Step 2: Format content according to template
      console.log(`Formatting content with template ${templateId}`);
      
      const blogPostData: BlogPostData = {
        title: postTitle,
        content: generatedContent,
        keyword: domainEntry.keyword,
        targetUrl: domainEntry.url,
        anchorText: domainEntry.anchor_text,
        category: 'Automation'
      };

      const formattingOptions: FormattingOptions = {
        templateId,
        includeBacklink: true,
        backlinkPosition: 'natural',
        optimizeForSEO: true,
        generateExcerpt: true,
        ...request.formattingOptions
      };

      const formattedPost = await AutomationBlogFormatterService.formatBlogPost(
        blogPostData,
        formattingOptions
      );

      // Save formatted content
      await this.updateAutomationDomainFormatted(domainEntry.id, formattedPost);

      // Step 3: Generate published URL
      console.log(`🔗 Generating URL for domain ${domainEntry.domain_id}`);
      
      const generatedUrl = await AutomationUrlGenerationService.generatePublishedUrl(
        domainEntry.domain_id,
        postTitle,
        domainEntry.keyword,
        request.urlOptions || {}
      );

      // Step 4: Update automation domain with published URL
      await AutomationUrlGenerationService.updateAutomationDomainUrl(domainEntry.id, generatedUrl);

      // Step 5: Publish via Supabase Edge Function to ensure immediate dynamic rendering
    try {
      const domainInfo = await this.getDomainInfo(domainEntry.domain_id);
      if (!domainInfo) throw new Error('Domain not found for publishing');

      // Propose a randomized, theme-prefixed slug; edge function will enforce uniqueness
      const themeKey = String(domainInfo.selected_theme || 'minimal');
      const rand = Math.random().toString(36).slice(2, 8);
      const baseSlug = `${postTitle}`;
      const proposedSlug = `${baseSlug}`
        .toLowerCase()
        .replace(/<[^>]*>/g, '')
        .replace(/[^a-z0-9\-\_ ]+/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '') + `-${rand}`;

      let inserted: any = null;

      // Dev-mode: use a mocked publish response instead of invoking remote functions
      if (import.meta.env.DEV) {
        console.log('🔧 DEV mode: performing rotational mock publish for user domains');

        try {
          // Find all domains for this user to simulate rotational publishing
          const { data: userDomains } = await supabase
            .from('domains')
            .select('id, domain, selected_theme, user_id, dns_verified')
            .eq('user_id', (domainInfo as any).user_id)
            .order('id', { ascending: true });

          const domainsToPublish = (userDomains || []).length > 0 ? userDomains : [{ id: domainInfo.id, domain: domainInfo.domain, selected_theme: domainInfo.selected_theme, blog_theme_id: domainInfo.blog_theme_id, user_id: domainInfo.user_id }];

          for (const targetDomain of domainsToPublish) {
            const themeKey = String(targetDomain.selected_theme || 'minimal');

            // Choose template id based on theme mapping when possible
            const templateForTheme = AutomationTemplateService.getAllTemplates().find(t => t.themeId === themeKey);
            const targetTemplateId = templateForTheme ? templateForTheme.id : templateId;

            // Generate slug using format: slug-only (no theme path), words separated by commas
            const words = (postTitle || 'post').replace(/<[^>]*>/g, '').trim().split(/\s+/).map(w => w.toLowerCase().replace(/[^a-z0-9]/g, ''));
            const commaSlug = words.filter(Boolean).join(',');
            const targetSlug = `${commaSlug}-${Math.random().toString(36).slice(2,6)}`;

            const mockInserted = {
              id: `mock-${Math.random().toString(36).slice(2,9)}`,
              slug: targetSlug,
              title: postTitle || `Post on ${domainEntry.keyword}`
            };

            const finalUrl = `https://${String(targetDomain.domain).replace(/^https?:\/\//, '').replace(/\/$/, '')}/${mockInserted.slug}`;

            // Record a mock 'automation_posts' entry to simulate post storage (DEV only)
            try {
              const payload: any = {
                campaign_id: domainEntry.campaign_id || request.campaignId,
                domain_id: targetDomain.id,
                slug: mockInserted.slug,
                title: mockInserted.title,
                content: formattedPost.htmlContent,
                generated_content: generatedContent,
                template_id: targetTemplateId,
                created_at: new Date().toISOString(),
                published_at: new Date().toISOString()
              };
              // Normalize content if present
              if (payload.content) {
                try {
                  const bestTitle = formatTitleCase(extractTitleFromContent(String(payload.content)) || payload.title || '');
                  payload.title = bestTitle;
                  payload.content = formatNormalize(bestTitle, String(payload.content));
                } catch (e) { /* ignore */ }
              }

              await supabase
                .from('automation_posts')
                .insert(payload);
            } catch (postErr) {
              console.warn('DEV: failed to insert automation_posts mock (ok to ignore in dev):', postErr);
            }
          }

          // Report single inserted object for backward compatibility
          inserted = { id: `mock-batch-${Math.random().toString(36).slice(2,9)}`, slug: proposedSlug, title: postTitle };

        } catch (devErr) {
          console.warn('DEV: rotational mock publishing failed:', devErr);
          inserted = { id: `mock-${Math.random().toString(36).slice(2,9)}`, slug: proposedSlug, title: postTitle };
        }

      } else {
        const { data: edgeRes, error: edgeErr } = await supabase.functions.invoke('publish-domain-post', {
          body: {
            automation_id: domainEntry.campaign_id || request.campaignId,
            domain_id: domainEntry.domain_id,
            user_id: (domainInfo as any).user_id || null,
            title: postTitle,
            content: formattedPost.htmlContent,
            slug: proposedSlug,
            static_only: false,
            publish_static: false
          }
        });

        if (edgeErr || !(edgeRes as any)?.success) {
          const msg = (edgeErr && (edgeErr as any).message) || (edgeRes as any)?.error || 'Edge publish failed';
          throw new Error(msg);
        }

        inserted = (edgeRes as any)?.post;
      }

      const finalSlug = inserted?.slug || proposedSlug;
      const finalUrl = `https://${domainInfo.domain.replace(/^https?:\/\//, '').replace(/\/$/, '')}/${finalSlug}`;

      // In DEV, still update DB row to simulate publish state; if DB is not writable, ignore errors
      try {
        await supabase
          .from('automation_domains')
          .update({ published_url: finalUrl, status: 'published', updated_at: new Date().toISOString() })
          .eq('id', domainEntry.id);
      } catch (dbErr) {
        console.warn('DEV: failed to update automation_domains (ok to ignore in dev):', dbErr);
      }
    } catch (pubErr) {

      main
    }

      // Step 6: Calculate SEO metrics
      const seoMetrics = this.calculateSEOMetrics(formattedPost, domainEntry.keyword);

      // Step 7: Get domain information for final result
      const domainInfo = await this.getDomainInfo(domainEntry.domain_id);
      const template = AutomationTemplateService.getTemplate(templateId);

      const processingTime = Date.now() - startTime;

      const publication: AutomationDomainPublication = {
        automationDomainId: domainEntry.id,
        domainId: domainEntry.domain_id,
        domain: domainInfo?.domain || 'Unknown',
        templateId,
        templateName: template?.name || `Template ${templateId}`,
        publishedUrl: generatedUrl.fullUrl,
        slug: generatedUrl.slug,
        title: postTitle,
        wordCount: formattedPost.publishingData.wordCount,
        processingTime,
        seoMetrics
      };

      console.log(`Successfully processed domain ${domainEntry.domain_id}: ${generatedUrl.fullUrl}`);

      return { success: true, publication };

    } catch (error) {
      console.error(`❌ Failed to process domain ${domainEntry.domain_id}:`, error);
      
      // Update status to failed
      await this.updateAutomationDomainStatus(domainEntry.id, 'failed');

      const domainInfo = await this.getDomainInfo(domainEntry.domain_id);
      
      const failure: AutomationDomainFailure = {
        automationDomainId: domainEntry.id,
        domainId: domainEntry.domain_id,
        domain: domainInfo?.domain || 'Unknown',
        error: error instanceof Error ? error.message : String(error),
        stage: this.determineFailureStage(error),
        retryable: this.isRetryableError(error)
      };

      return { success: false, failure };
    }
  }

  /**
   * Create automation domain entries in database
   */
  private static async createAutomationDomainEntries(
    request: AutomationDomainBlogRequest
  ): Promise<AutomationDomainEntry[]> {
    const entries: Omit<AutomationDomainEntry, 'id' | 'created_at' | 'updated_at'>[] = 
      request.domainIds.map(domainId => ({
        domain_id: domainId,
        campaign_id: request.campaignId,
        keyword: request.keyword,
        url: request.targetUrl,
        anchor_text: request.anchorText,
        prompt: request.contentPrompt,
        theme_template: 1, // Will be updated with rotation logic
        status: 'pending' as const
      }));

    const { data, error } = await supabase
      .from('automation_domains')
      .insert(entries)
      .select('*');

    if (error) {
      throw new Error(`Failed to create automation domain entries: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Update automation domains with template assignments
   */
  private static async updateAutomationDomainsWithTemplates(
    automationDomains: AutomationDomainEntry[],
    templateAssignments: Array<{ domainId: string; assignedTemplate: number }>
  ): Promise<void> {
    for (const domain of automationDomains) {
      const assignment = templateAssignments.find(t => t.domainId === domain.domain_id);
      if (assignment) {
        await AutomationTemplateService.updateDomainTemplate(domain.id, assignment.assignedTemplate);
      }
    }
  }

  /**
   * Generate content for a domain
   */
  private static async generateContentForDomain(
    domainEntry: AutomationDomainEntry,
    request: AutomationDomainBlogRequest
  ): Promise<{ content: string; title: string }> {
    const prompt = request.contentPrompt || `Write a comprehensive blog post about "${domainEntry.keyword}". 
      The post should be informative, engaging, and naturally incorporate the keyword throughout. 
      Include practical tips and insights that would be valuable to readers interested in ${domainEntry.keyword}.
      Target length: 800-1200 words.`;

    try {
      const result = await openAIContentGenerator.generateBlogPost({
        keyword: domainEntry.keyword,
        targetUrl: domainEntry.url,
        anchorText: domainEntry.anchor_text,
        customPrompt: prompt,
        wordCount: 1000
      });

      return {
        content: result.content,
        title: result.title
      };
    } catch (error) {
      console.error('Content generation failed, using fallback:', error);
      
      // Fallback content generation
      const title = `The Complete Guide to ${domainEntry.keyword}`;
      const content = `
        <h2>Introduction to ${domainEntry.keyword}</h2>
        <p>Understanding ${domainEntry.keyword} is essential for anyone looking to improve their knowledge in this area. This comprehensive guide will walk you through everything you need to know.</p>
        
        <h2>Key Benefits of ${domainEntry.keyword}</h2>
        <p>There are numerous advantages to understanding and implementing ${domainEntry.keyword} strategies. Here are the most important benefits:</p>
        <ul>
          <li>Improved understanding and knowledge</li>
          <li>Better decision-making capabilities</li>
          <li>Enhanced problem-solving skills</li>
          <li>Increased efficiency and effectiveness</li>
        </ul>
        
        <h2>Best Practices for ${domainEntry.keyword}</h2>
        <p>To get the most out of ${domainEntry.keyword}, it's important to follow proven best practices that have been developed through experience and research.</p>
        
        <h2>Conclusion</h2>
        <p>In conclusion, ${domainEntry.keyword} represents an important area of focus that can provide significant benefits when properly understood and implemented. By following the guidelines outlined in this post, you'll be well on your way to success.</p>
      `;

      return { content, title };
    }
  }

  /**
   * Calculate SEO metrics for formatted post
   */
  private static calculateSEOMetrics(formattedPost: any, keyword: string): {
    keywordDensity: number;
    readabilityScore: number;
    metaOptimization: number;
  } {
    const content = formattedPost.plainTextContent || '';
    const words = content.split(/\s+/).length;
    const keywordOccurrences = (content.toLowerCase().match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;
    
    const keywordDensity = words > 0 ? (keywordOccurrences / words) * 100 : 0;
    
    // Simple readability score based on sentence and word length
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgWordsPerSentence = sentences.length > 0 ? words / sentences.length : 0;
    const readabilityScore = Math.max(0, 100 - (avgWordsPerSentence * 2)); // Simpler = higher score
    
    // Meta optimization score based on title, description, keywords
    let metaScore = 0;
    if (formattedPost.metaData.title?.includes(keyword)) metaScore += 30;
    if (formattedPost.metaData.description?.includes(keyword)) metaScore += 25;
    if (formattedPost.metaData.keywords?.includes(keyword)) metaScore += 25;
    if (formattedPost.title?.includes(keyword)) metaScore += 20;
    
    return {
      keywordDensity: Math.round(keywordDensity * 100) / 100,
      readabilityScore: Math.round(readabilityScore),
      metaOptimization: Math.min(100, metaScore)
    };
  }

  /**
   * Update automation domain status
   */
  private static async updateAutomationDomainStatus(
    automationDomainId: string,
    status: 'pending' | 'generating' | 'published' | 'failed'
  ): Promise<void> {
    await supabase
      .from('automation_domains')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', automationDomainId);
  }

  /**
   * Update automation domain with generated content
   */
  private static async updateAutomationDomainContent(
    automationDomainId: string,
    content: string,
    title: string
  ): Promise<void> {
    await supabase
      .from('automation_domains')
      .update({
        generated_content: content,
        post_title: title,
        updated_at: new Date().toISOString()
      })
      .eq('id', automationDomainId);
  }

  /**
   * Update automation domain with formatted content
   */
  private static async updateAutomationDomainFormatted(
    automationDomainId: string,
    formattedPost: any
  ): Promise<void> {
    await supabase
      .from('automation_domains')
      .update({
        formatted_post: formattedPost.htmlContent,
        post_excerpt: formattedPost.excerpt,
        updated_at: new Date().toISOString()
      })
      .eq('id', automationDomainId);
  }

  /**
   * Get domain info
   */
  private static async getDomainInfo(domainId: string): Promise<{ id: string; domain: string; user_id?: string | null; selected_theme?: string | null } | null> {
    const { data } = await supabase
      .from('domains')
      .select('id, domain, user_id, selected_theme')
      .eq('id', domainId)
      .single();

    return data as any;
  }

  /**
   * Determine failure stage from error
   */
  private static determineFailureStage(error: unknown): AutomationDomainFailure['stage'] {
    const errorMessage = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
    
    if (errorMessage.includes('template')) return 'template_assignment';
    if (errorMessage.includes('content') || errorMessage.includes('generate')) return 'content_generation';
    if (errorMessage.includes('format')) return 'formatting';
    if (errorMessage.includes('url') || errorMessage.includes('slug')) return 'url_generation';
    
    return 'publishing';
  }

  /**
   * Check if error is retryable
   */
  private static isRetryableError(error: unknown): boolean {
    const errorMessage = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
    
    // Network, rate limiting, and temporary service errors are retryable
    const retryableKeywords = ['timeout', 'rate limit', 'service unavailable', 'network', 'temporary'];
    
    return retryableKeywords.some(keyword => errorMessage.includes(keyword));
  }

  /**
   * Send completion notification
   */
  private static async sendCompletionNotification(result: AutomationDomainBlogResult): Promise<void> {
    console.log(`📧 Sending completion notification for campaign ${result.campaignId}`);
    
    // In a real implementation, this would send email/webhook notifications
    console.log(`Campaign ${result.campaignId} completed:`, {
      successful: result.successfulPublications.length,
      failed: result.failedPublications.length,
      templates: result.summary.templatesUsed,
      avgTime: result.summary.averageProcessingTime,
      totalWords: result.summary.totalWordCount
    });
  }

  /**
   * Get publishing analytics for a campaign
   */
  static async getCampaignPublishingAnalytics(campaignId: string): Promise<{
    totalDomains: number;
    publishedDomains: number;
    failedDomains: number;
    templateDistribution: { [templateId: number]: number };
    avgWordCount: number;
    avgSeoScore: number;
    recentPublications: Array<{
      domain: string;
      url: string;
      publishedAt: string;
      template: string;
    }>;
  }> {
    try {
      const { data: domains } = await supabase
        .from('automation_domains')
        .select(`
          domain_id,
          theme_template,
          status,
          published_url,
          post_title,
          created_at,
          domains(domain)
        `)
        .eq('campaign_id', campaignId);

      const totalDomains = domains?.length || 0;
      const publishedDomains = domains?.filter(d => d.status === 'published').length || 0;
      const failedDomains = domains?.filter(d => d.status === 'failed').length || 0;

      const templateDistribution: { [templateId: number]: number } = {};
      domains?.forEach(d => {
        if (d.theme_template) {
          templateDistribution[d.theme_template] = (templateDistribution[d.theme_template] || 0) + 1;
        }
      });

      const recentPublications = domains
        ?.filter(d => d.status === 'published' && d.published_url)
        .slice(0, 10)
        .map(d => ({
          domain: (d.domains as any)?.domain || 'Unknown',
          url: d.published_url || '',
          publishedAt: d.created_at || '',
          template: AutomationTemplateService.getTemplate(d.theme_template)?.name || `Template ${d.theme_template}`
        })) || [];

      return {
        totalDomains,
        publishedDomains,
        failedDomains,
        templateDistribution,
        avgWordCount: 0, // Would need word count data
        avgSeoScore: 0, // Would need SEO metrics data
        recentPublications
      };
    } catch (error) {
      console.error('Error getting campaign analytics:', error);
      return {
        totalDomains: 0,
        publishedDomains: 0,
        failedDomains: 0,
        templateDistribution: {},
        avgWordCount: 0,
        avgSeoScore: 0,
        recentPublications: []
      };
    }
  }

  /**
   * Retry failed publications
   */
  static async retryFailedPublications(
    campaignId: string,
    retryOptions?: {
      maxRetries?: number;
      onlyRetryableErrors?: boolean;
    }
  ): Promise<AutomationDomainBlogResult> {
    // Get failed automation domains
    const { data: failedDomains } = await supabase
      .from('automation_domains')
      .select('*')
      .eq('campaign_id', campaignId)
      .eq('status', 'failed');

    if (!failedDomains || failedDomains.length === 0) {
      throw new Error('No failed publications found for retry');
    }

    // Reset status to pending
    await supabase
      .from('automation_domains')
      .update({ status: 'pending' })
      .eq('campaign_id', campaignId)
      .eq('status', 'failed');

    // Create retry request
    const retryRequest: AutomationDomainBlogRequest = {
      campaignId,
      domainIds: failedDomains.map(d => d.domain_id),
      keyword: failedDomains[0].keyword,
      targetUrl: failedDomains[0].url,
      anchorText: failedDomains[0].anchor_text,
      publishingOptions: {
        generateContent: true,
        autoPublish: true
      }
    };

    return await this.publishAutomationDomainBlogs(retryRequest);
  }
}

export default AutomationDomainBlogPublishingService;
