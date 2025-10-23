/**
 * Automation Template Service
 * Maps numerical template IDs to existing blog templates for automation_domains table
 * Handles rotation and template selection for automated campaign publishing
 */

import { ImprovedBlogThemesService } from './improvedBlogThemesService';
import { slugGenerationService } from './slugGenerationService';
import { supabase } from '@/integrations/supabase/client';

export interface AutomationTemplate {
  id: number;
  name: string;
  themeId: string;
  description: string;
  styles: Record<string, any>;
  features: string[];
  useCase: string;
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

export interface TemplateAssignmentOptions {
  rotationStrategy?: 'sequential' | 'random' | 'domain-based' | 'keyword-based';
  preferredTemplates?: number[];
  excludeTemplates?: number[];
}

export class AutomationTemplateService {
  
  /**
   * Numerical template registry - maps numbers to existing themes
   */
  private static readonly AUTOMATION_TEMPLATES: AutomationTemplate[] = [
    {
      id: 1,
      name: 'Clean Minimal',
      themeId: 'minimal',
      description: 'Ultra-clean minimalist design perfect for professional content',
      styles: {
        primaryColor: '#1e40af',
        backgroundColor: '#ffffff',
        textColor: '#0f172a',
        fontFamily: 'Inter, system-ui, sans-serif'
      },
      features: ['responsive', 'fast_loading', 'minimal_ui', 'clean_typography'],
      useCase: 'Professional blogs, corporate content, clean presentations'
    },
    {
      id: 2,
      name: 'Modern Business',
      themeId: 'modern',
      description: 'Bold corporate design with engaging layouts and strong CTAs',
      styles: {
        primaryColor: '#0f172a',
        backgroundColor: '#ffffff',
        textColor: '#1e293b',
        fontFamily: 'Poppins, system-ui, sans-serif'
      },
      features: ['responsive', 'modern_design', 'social_sharing', 'corporate_style'],
      useCase: 'Business blogs, product announcements, company updates'
    },
    {
      id: 3,
      name: 'Editorial Elegant',
      themeId: 'elegant',
      description: 'Sophisticated magazine-style with premium typography',
      styles: {
        primaryColor: '#92400e',
        backgroundColor: '#fffbf7',
        textColor: '#1c1917',
        fontFamily: 'Playfair Display, Georgia, serif'
      },
      features: ['typography_focused', 'reading_optimized', 'magazine_style', 'premium_fonts'],
      useCase: 'Editorial content, thought leadership, long-form articles'
    },
    {
      id: 4,
      name: 'Tech Focus',
      themeId: 'tech',
      description: 'Developer-focused design with code highlighting and dark mode',
      styles: {
        primaryColor: '#111827',
        backgroundColor: '#f8fafc',
        textColor: '#1f2937',
        fontFamily: 'JetBrains Mono, Consolas, monospace'
      },
      features: ['syntax_highlighting', 'tech_focused', 'dark_mode', 'code_blocks'],
      useCase: 'Technical blogs, developer content, product documentation'
    },
    {
      id: 5,
      name: 'Content Marketing',
      themeId: 'modern',
      description: 'Optimized for marketing content with strong conversion elements',
      styles: {
        primaryColor: '#059669',
        backgroundColor: '#ffffff',
        textColor: '#111827',
        fontFamily: 'Open Sans, system-ui, sans-serif'
      },
      features: ['conversion_optimized', 'cta_focused', 'marketing_ready', 'social_proof'],
      useCase: 'Marketing blogs, lead generation, conversion content'
    },
    {
      id: 6,
      name: 'News & Updates',
      themeId: 'elegant',
      description: 'News-style template for timely updates and announcements',
      styles: {
        primaryColor: '#dc2626',
        backgroundColor: '#fefefe',
        textColor: '#374151',
        fontFamily: 'Source Sans Pro, system-ui, sans-serif'
      },
      features: ['news_style', 'timely_content', 'announcement_ready', 'urgency_focused'],
      useCase: 'News articles, press releases, time-sensitive announcements'
    }
  ];

  /**
   * Get template by numerical ID
   */
  static getTemplate(templateId: number): AutomationTemplate | null {
    return this.AUTOMATION_TEMPLATES.find(t => t.id === templateId) || null;
  }

  /**
   * Get all available templates
   */
  static getAllTemplates(): AutomationTemplate[] {
    return [...this.AUTOMATION_TEMPLATES];
  }

  /**
   * Get template for rotation based on domain count and strategy
   */
  static getTemplateForRotation(
    domainIndex: number,
    totalDomains: number,
    options: TemplateAssignmentOptions = {}
  ): AutomationTemplate {
    const { rotationStrategy = 'sequential', preferredTemplates, excludeTemplates } = options;
    
    let availableTemplates = [...this.AUTOMATION_TEMPLATES];
    
    // Apply template filters
    if (preferredTemplates?.length) {
      availableTemplates = availableTemplates.filter(t => preferredTemplates.includes(t.id));
    }
    
    if (excludeTemplates?.length) {
      availableTemplates = availableTemplates.filter(t => !excludeTemplates.includes(t.id));
    }
    
    if (availableTemplates.length === 0) {
      availableTemplates = [this.AUTOMATION_TEMPLATES[0]]; // Fallback to first template
    }
    
    let selectedTemplate: AutomationTemplate;
    
    switch (rotationStrategy) {
      case 'random':
        selectedTemplate = availableTemplates[Math.floor(Math.random() * availableTemplates.length)];
        break;
        
      case 'domain-based':
        // Use domain index to determine template
        selectedTemplate = availableTemplates[domainIndex % availableTemplates.length];
        break;
        
      case 'keyword-based':
        // This would be implemented in the calling function with keyword analysis
        selectedTemplate = availableTemplates[0];
        break;
        
      case 'sequential':
      default:
        // Round-robin through templates
        selectedTemplate = availableTemplates[domainIndex % availableTemplates.length];
        break;
    }
    
    return selectedTemplate;
  }

  /**
   * Select template based on keyword analysis
   */
  static selectTemplateByKeyword(keyword: string, options: TemplateAssignmentOptions = {}): AutomationTemplate {
    const lowerKeyword = keyword.toLowerCase();
    
    // Tech-related keywords
    if (lowerKeyword.includes('tech') || lowerKeyword.includes('development') || 
        lowerKeyword.includes('code') || lowerKeyword.includes('software') ||
        lowerKeyword.includes('programming') || lowerKeyword.includes('api')) {
      return this.getTemplate(4) || this.AUTOMATION_TEMPLATES[0];
    }
    
    // Business-related keywords
    if (lowerKeyword.includes('business') || lowerKeyword.includes('corporate') || 
        lowerKeyword.includes('company') || lowerKeyword.includes('enterprise') ||
        lowerKeyword.includes('professional') || lowerKeyword.includes('b2b')) {
      return this.getTemplate(2) || this.AUTOMATION_TEMPLATES[0];
    }
    
    // Marketing-related keywords
    if (lowerKeyword.includes('marketing') || lowerKeyword.includes('sales') || 
        lowerKeyword.includes('conversion') || lowerKeyword.includes('lead') ||
        lowerKeyword.includes('campaign') || lowerKeyword.includes('advertising')) {
      return this.getTemplate(5) || this.AUTOMATION_TEMPLATES[0];
    }
    
    // News/update keywords
    if (lowerKeyword.includes('news') || lowerKeyword.includes('update') || 
        lowerKeyword.includes('announcement') || lowerKeyword.includes('release') ||
        lowerKeyword.includes('breaking') || lowerKeyword.includes('latest')) {
      return this.getTemplate(6) || this.AUTOMATION_TEMPLATES[0];
    }
    
    // Editorial/content keywords
    if (lowerKeyword.includes('guide') || lowerKeyword.includes('tutorial') || 
        lowerKeyword.includes('how to') || lowerKeyword.includes('tips') ||
        lowerKeyword.includes('best practices') || lowerKeyword.includes('insights')) {
      return this.getTemplate(3) || this.AUTOMATION_TEMPLATES[0];
    }
    
    // Default to minimal clean
    return this.getTemplate(1) || this.AUTOMATION_TEMPLATES[0];
  }

  /**
   * Assign templates to multiple automation domains
   */
  static assignTemplatesToDomains(
    domainEntries: Pick<AutomationDomainEntry, 'id' | 'keyword' | 'domain_id'>[],
    options: TemplateAssignmentOptions = {}
  ): Array<{ domainEntryId: string; templateId: number; templateName: string }> {
    const assignments: Array<{ domainEntryId: string; templateId: number; templateName: string }> = [];
    
    domainEntries.forEach((entry, index) => {
      let template: AutomationTemplate;
      
      if (options.rotationStrategy === 'keyword-based') {
        template = this.selectTemplateByKeyword(entry.keyword, options);
      } else {
        template = this.getTemplateForRotation(index, domainEntries.length, options);
      }
      
      assignments.push({
        domainEntryId: entry.id,
        templateId: template.id,
        templateName: template.name
      });
    });
    
    return assignments;
  }

  /**
   * Get template theme configuration for blog rendering
   */
  static getTemplateThemeConfig(templateId: number) {
    const template = this.getTemplate(templateId);
    if (!template) {
      return ImprovedBlogThemesService.getDefaultTheme();
    }
    
    return ImprovedBlogThemesService.getThemeById(template.themeId) || ImprovedBlogThemesService.getDefaultTheme();
  }

  /**
   * Update automation domain with template assignment
   */
  static async updateDomainTemplate(
    automationDomainId: string,
    templateId: number
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const template = this.getTemplate(templateId);
      if (!template) {
        return { success: false, error: `Template ${templateId} not found` };
      }
      
      const { error } = await supabase
        .from('automation_domains')
        .update({ 
          theme_template: templateId,
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
   * Bulk update templates for multiple automation domains
   */
  static async bulkUpdateDomainTemplates(
    assignments: Array<{ domainEntryId: string; templateId: number }>
  ): Promise<{
    successful: string[];
    failed: Array<{ domainEntryId: string; error: string }>;
  }> {
    const successful: string[] = [];
    const failed: Array<{ domainEntryId: string; error: string }> = [];
    
    for (const assignment of assignments) {
      const result = await this.updateDomainTemplate(assignment.domainEntryId, assignment.templateId);
      
      if (result.success) {
        successful.push(assignment.domainEntryId);
      } else {
        failed.push({
          domainEntryId: assignment.domainEntryId,
          error: result.error || 'Unknown error'
        });
      }
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return { successful, failed };
  }

  /**
   * Get template usage statistics
   */
  static async getTemplateUsageStats(): Promise<{
    totalDomains: number;
    templateDistribution: Array<{ templateId: number; templateName: string; count: number; percentage: number }>;
  }> {
    try {
      const { data, error } = await supabase
        .from('automation_domains')
        .select('theme_template')
        .neq('theme_template', null);
      
      if (error) throw error;
      
      const totalDomains = data?.length || 0;
      const templateCounts: { [key: number]: number } = {};
      
      // Count template usage
      data?.forEach(domain => {
        const templateId = domain.theme_template;
        templateCounts[templateId] = (templateCounts[templateId] || 0) + 1;
      });
      
      // Create distribution array
      const templateDistribution = this.AUTOMATION_TEMPLATES.map(template => ({
        templateId: template.id,
        templateName: template.name,
        count: templateCounts[template.id] || 0,
        percentage: totalDomains > 0 ? ((templateCounts[template.id] || 0) / totalDomains) * 100 : 0
      }));
      
      return {
        totalDomains,
        templateDistribution
      };
    } catch (error) {
      console.error('Error getting template usage stats:', error);
      return {
        totalDomains: 0,
        templateDistribution: this.AUTOMATION_TEMPLATES.map(template => ({
          templateId: template.id,
          templateName: template.name,
          count: 0,
          percentage: 0
        }))
      };
    }
  }

  /**
   * Validate template ID
   */
  static isValidTemplate(templateId: number): boolean {
    return this.AUTOMATION_TEMPLATES.some(t => t.id === templateId);
  }

  /**
   * Get template recommendations for a campaign
   */
  static getTemplateRecommendations(
    keywords: string[],
    targetAudience?: string,
    contentType?: string
  ): AutomationTemplate[] {
    const recommendations: AutomationTemplate[] = [];
    const allKeywords = keywords.join(' ').toLowerCase();
    
    // Score each template based on keywords and content type
    const templateScores = this.AUTOMATION_TEMPLATES.map(template => {
      let score = 0;
      
      // Keyword relevance scoring
      if (allKeywords.includes('tech') || allKeywords.includes('development')) {
        score += template.id === 4 ? 10 : 0;
      }
      if (allKeywords.includes('business') || allKeywords.includes('corporate')) {
        score += template.id === 2 ? 10 : 0;
      }
      if (allKeywords.includes('marketing') || allKeywords.includes('sales')) {
        score += template.id === 5 ? 10 : 0;
      }
      if (allKeywords.includes('guide') || allKeywords.includes('tutorial')) {
        score += template.id === 3 ? 10 : 0;
      }
      
      // Content type scoring
      if (contentType === 'tutorial') score += template.id === 3 ? 5 : 0;
      if (contentType === 'announcement') score += template.id === 6 ? 5 : 0;
      if (contentType === 'technical') score += template.id === 4 ? 5 : 0;
      
      // Target audience scoring
      if (targetAudience === 'developers') score += template.id === 4 ? 8 : 0;
      if (targetAudience === 'business') score += template.id === 2 ? 8 : 0;
      if (targetAudience === 'general') score += template.id === 1 ? 8 : 0;
      
      return { template, score };
    });
    
    // Sort by score and return top recommendations
    return templateScores
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(item => item.template);
  }
}

export default AutomationTemplateService;
