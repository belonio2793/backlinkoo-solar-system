/**
 * Automation Template Rotation Service
 * Handles intelligent template rotation for automation domains based on various strategies
 */

import { AutomationTemplateService, TemplateAssignmentOptions } from './automationTemplateService';
import { supabase } from '@/integrations/supabase/client';

export interface RotationConfig {
  strategy: 'sequential' | 'random' | 'domain-based' | 'keyword-based' | 'balanced' | 'performance-based';
  templatePool?: number[]; // Specific templates to use in rotation
  excludeTemplates?: number[];
  rotationInterval?: 'campaign' | 'daily' | 'weekly' | 'monthly';
  maxConsecutiveUse?: number; // Max times same template can be used consecutively
  enablePerformanceOptimization?: boolean;
}

export interface DomainRotationState {
  domainId: string;
  lastTemplateUsed?: number;
  consecutiveUseCount: number;
  totalPostsCreated: number;
  performanceMetrics?: {
    avgEngagement: number;
    clickThroughRate: number;
    templatePerformance: { [templateId: number]: number };
  };
}

export interface RotationResult {
  domainId: string;
  assignedTemplate: number;
  templateName: string;
  reason: string;
  previousTemplate?: number;
}

export class AutomationTemplateRotationService {
  
  /**
   * Assign templates to domains using intelligent rotation
   */
  static async assignTemplatesWithRotation(
    domainIds: string[],
    campaignId: string,
    config: RotationConfig = { strategy: 'sequential' }
  ): Promise<RotationResult[]> {
    try {
      console.log(`🔄 Starting template rotation for ${domainIds.length} domains with strategy: ${config.strategy}`);
      
      // Get current rotation state for domains
      const rotationStates = await this.getDomainRotationStates(domainIds);
      
      // Get available templates based on config
      const availableTemplates = this.getAvailableTemplates(config);
      
      const results: RotationResult[] = [];
      
      for (let i = 0; i < domainIds.length; i++) {
        const domainId = domainIds[i];
        const state = rotationStates.find(s => s.domainId === domainId) || {
          domainId,
          consecutiveUseCount: 0,
          totalPostsCreated: 0
        };
        
        const assignedTemplate = await this.selectTemplateForDomain(
          domainId,
          state,
          availableTemplates,
          config,
          i,
          domainIds.length
        );
        
        const template = AutomationTemplateService.getTemplate(assignedTemplate);
        
        results.push({
          domainId,
          assignedTemplate,
          templateName: template?.name || `Template ${assignedTemplate}`,
          reason: this.getAssignmentReason(assignedTemplate, state, config, i),
          previousTemplate: state.lastTemplateUsed
        });
        
        // Update rotation state
        await this.updateDomainRotationState(domainId, assignedTemplate, campaignId);
      }
      
      console.log(`✅ Template rotation completed. Assignments:`, results.map(r => 
        `${r.domainId}: Template ${r.assignedTemplate} (${r.reason})`
      ));
      
      return results;
    } catch (error) {
      console.error('❌ Template rotation failed:', error);
      throw error;
    }
  }

  /**
   * Select template for a specific domain based on rotation strategy
   */
  private static async selectTemplateForDomain(
    domainId: string,
    state: DomainRotationState,
    availableTemplates: number[],
    config: RotationConfig,
    domainIndex: number,
    totalDomains: number
  ): Promise<number> {
    
    switch (config.strategy) {
      case 'sequential':
        return this.selectSequentialTemplate(availableTemplates, domainIndex, state);
        
      case 'random':
        return this.selectRandomTemplate(availableTemplates, state, config);
        
      case 'domain-based':
        return this.selectDomainBasedTemplate(domainId, availableTemplates);
        
      case 'keyword-based':
        return await this.selectKeywordBasedTemplate(domainId, availableTemplates);
        
      case 'balanced':
        return await this.selectBalancedTemplate(availableTemplates, domainIndex, totalDomains);
        
      case 'performance-based':
        return this.selectPerformanceBasedTemplate(state, availableTemplates);
        
      default:
        return this.selectSequentialTemplate(availableTemplates, domainIndex, state);
    }
  }

  /**
   * Sequential template selection with anti-repetition logic
   */
  private static selectSequentialTemplate(
    availableTemplates: number[],
    domainIndex: number,
    state: DomainRotationState
  ): number {
    const nextTemplate = availableTemplates[domainIndex % availableTemplates.length];
    
    // Anti-repetition: if same template was used too many times, skip to next
    if (state.lastTemplateUsed === nextTemplate && 
        state.consecutiveUseCount >= 2) {
      const nextIndex = (domainIndex + 1) % availableTemplates.length;
      return availableTemplates[nextIndex];
    }
    
    return nextTemplate;
  }

  /**
   * Random template selection with smart avoidance
   */
  private static selectRandomTemplate(
    availableTemplates: number[],
    state: DomainRotationState,
    config: RotationConfig
  ): number {
    // Filter out recently used templates if maxConsecutiveUse is set
    let candidateTemplates = [...availableTemplates];
    
    if (config.maxConsecutiveUse && 
        state.lastTemplateUsed && 
        state.consecutiveUseCount >= config.maxConsecutiveUse) {
      candidateTemplates = candidateTemplates.filter(t => t !== state.lastTemplateUsed);
    }
    
    if (candidateTemplates.length === 0) {
      candidateTemplates = availableTemplates; // Fallback
    }
    
    return candidateTemplates[Math.floor(Math.random() * candidateTemplates.length)];
  }

  /**
   * Domain-based template selection using domain characteristics
   */
  private static selectDomainBasedTemplate(
    domainId: string,
    availableTemplates: number[]
  ): number {
    // Use domain ID hash to consistently assign templates
    const hash = this.hashString(domainId);
    return availableTemplates[hash % availableTemplates.length];
  }

  /**
   * Keyword-based template selection using automation domain keywords
   */
  private static async selectKeywordBasedTemplate(
    domainId: string,
    availableTemplates: number[]
  ): Promise<number> {
    try {
      // Get keywords from automation_domains table
      const { data: automationDomain } = await supabase
        .from('automation_domains')
        .select('keyword')
        .eq('domain_id', domainId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (automationDomain?.keyword) {
        const recommendedTemplate = AutomationTemplateService.selectTemplateByKeyword(
          automationDomain.keyword,
          { preferredTemplates: availableTemplates }
        );
        
        return recommendedTemplate.id;
      }
    } catch (error) {
      console.warn('Could not fetch keyword for domain-based selection:', error);
    }
    
    // Fallback to sequential
    return availableTemplates[0];
  }

  /**
   * Balanced template selection ensuring even distribution
   */
  private static async selectBalancedTemplate(
    availableTemplates: number[],
    domainIndex: number,
    totalDomains: number
  ): Promise<number> {
    try {
      // Get current template usage statistics
      const stats = await AutomationTemplateService.getTemplateUsageStats();
      
      // Find least used template from available pool
      const availableStats = stats.templateDistribution
        .filter(s => availableTemplates.includes(s.templateId))
        .sort((a, b) => a.count - b.count);
      
      if (availableStats.length > 0) {
        return availableStats[0].templateId;
      }
    } catch (error) {
      console.warn('Could not get template stats for balanced selection:', error);
    }
    
    // Fallback to sequential
    return availableTemplates[domainIndex % availableTemplates.length];
  }

  /**
   * Performance-based template selection using historical performance
   */
  private static selectPerformanceBasedTemplate(
    state: DomainRotationState,
    availableTemplates: number[]
  ): number {
    if (!state.performanceMetrics?.templatePerformance) {
      // No performance data, use first available template
      return availableTemplates[0];
    }
    
    // Select template with best performance for this domain
    const performances = state.performanceMetrics.templatePerformance;
    const availablePerformances = availableTemplates
      .map(id => ({ id, performance: performances[id] || 0 }))
      .sort((a, b) => b.performance - a.performance);
    
    return availablePerformances[0]?.id || availableTemplates[0];
  }

  /**
   * Get available templates based on config
   */
  private static getAvailableTemplates(config: RotationConfig): number[] {
    let templates = config.templatePool || AutomationTemplateService.getAllTemplates().map(t => t.id);
    
    if (config.excludeTemplates?.length) {
      templates = templates.filter(id => !config.excludeTemplates!.includes(id));
    }
    
    return templates.length > 0 ? templates : [1]; // Fallback to template 1
  }

  /**
   * Get rotation states for domains
   */
  private static async getDomainRotationStates(domainIds: string[]): Promise<DomainRotationState[]> {
    try {
      const { data, error } = await supabase
        .from('automation_domain_rotation_state')
        .select('*')
        .in('domain_id', domainIds);
      
      if (error && error.code !== 'PGRST116') {
        console.warn('Could not fetch rotation states:', error);
        return domainIds.map(id => ({
          domainId: id,
          consecutiveUseCount: 0,
          totalPostsCreated: 0
        }));
      }
      
      // Create states for all domains, filling missing ones
      return domainIds.map(domainId => {
        const existing = data?.find(s => s.domain_id === domainId);
        return existing ? {
          domainId,
          lastTemplateUsed: existing.last_template_used,
          consecutiveUseCount: existing.consecutive_use_count || 0,
          totalPostsCreated: existing.total_posts_created || 0,
          performanceMetrics: existing.performance_metrics
        } : {
          domainId,
          consecutiveUseCount: 0,
          totalPostsCreated: 0
        };
      });
    } catch (error) {
      console.warn('Error fetching rotation states:', error);
      return domainIds.map(id => ({
        domainId: id,
        consecutiveUseCount: 0,
        totalPostsCreated: 0
      }));
    }
  }

  /**
   * Update domain rotation state
   */
  private static async updateDomainRotationState(
    domainId: string,
    templateId: number,
    campaignId: string
  ): Promise<void> {
    try {
      // Get current state
      const { data: currentState } = await supabase
        .from('automation_domain_rotation_state')
        .select('*')
        .eq('domain_id', domainId)
        .single();
      
      const consecutiveCount = currentState?.last_template_used === templateId 
        ? (currentState.consecutive_use_count || 0) + 1 
        : 1;
      
      const updateData = {
        domain_id: domainId,
        last_template_used: templateId,
        consecutive_use_count: consecutiveCount,
        total_posts_created: (currentState?.total_posts_created || 0) + 1,
        last_campaign_id: campaignId,
        updated_at: new Date().toISOString()
      };
      
      // Upsert the state
      const { error } = await supabase
        .from('automation_domain_rotation_state')
        .upsert(updateData, {
          onConflict: 'domain_id'
        });
      
      if (error && !error.message.includes('does not exist')) {
        console.warn('Could not update rotation state:', error);
      }
    } catch (error) {
      console.warn('Error updating rotation state:', error);
      // Don't throw - this is not critical for the main flow
    }
  }

  /**
   * Get assignment reason for logging/debugging
   */
  private static getAssignmentReason(
    templateId: number,
    state: DomainRotationState,
    config: RotationConfig,
    domainIndex: number
  ): string {
    switch (config.strategy) {
      case 'sequential':
        return `Sequential rotation (index ${domainIndex})`;
      case 'random':
        return 'Random selection';
      case 'domain-based':
        return 'Domain characteristics';
      case 'keyword-based':
        return 'Keyword analysis';
      case 'balanced':
        return 'Balanced distribution';
      case 'performance-based':
        return state.performanceMetrics ? 'Performance optimization' : 'No performance data';
      default:
        return 'Default assignment';
    }
  }

  /**
   * Hash string to number for consistent domain-based selection
   */
  private static hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Get rotation analytics for campaign optimization
   */
  static async getRotationAnalytics(campaignId: string): Promise<{
    templateDistribution: { [templateId: number]: number };
    domainPerformance: { [domainId: string]: number };
    rotationEfficiency: number;
    recommendations: string[];
  }> {
    try {
      // Get template usage for campaign
      const { data: campaignDomains } = await supabase
        .from('automation_domains')
        .select('domain_id, theme_template')
        .eq('campaign_id', campaignId);
      
      const templateDistribution: { [templateId: number]: number } = {};
      
      campaignDomains?.forEach(domain => {
        if (domain.theme_template) {
          templateDistribution[domain.theme_template] = 
            (templateDistribution[domain.theme_template] || 0) + 1;
        }
      });
      
      // Calculate rotation efficiency (how evenly distributed templates are)
      const totalDomains = campaignDomains?.length || 0;
      const numberOfTemplates = Object.keys(templateDistribution).length;
      const idealDistribution = totalDomains / numberOfTemplates;
      
      let efficiency = 0;
      if (numberOfTemplates > 0) {
        const variance = Object.values(templateDistribution)
          .reduce((sum, count) => sum + Math.pow(count - idealDistribution, 2), 0) / numberOfTemplates;
        efficiency = Math.max(0, 100 - (variance / idealDistribution) * 100);
      }
      
      // Generate recommendations
      const recommendations: string[] = [];
      if (efficiency < 70) {
        recommendations.push('Consider using balanced rotation strategy for better template distribution');
      }
      if (numberOfTemplates < 3) {
        recommendations.push('Use more templates to increase content variety');
      }
      if (totalDomains > numberOfTemplates * 3) {
        recommendations.push('Add more templates to prevent over-repetition');
      }
      
      return {
        templateDistribution,
        domainPerformance: {}, // Would be populated with actual performance metrics
        rotationEfficiency: efficiency,
        recommendations
      };
    } catch (error) {
      console.error('Error getting rotation analytics:', error);
      return {
        templateDistribution: {},
        domainPerformance: {},
        rotationEfficiency: 0,
        recommendations: ['Error retrieving analytics']
      };
    }
  }

  /**
   * Preview template rotation for a campaign
   */
  static async previewRotation(
    domainIds: string[],
    config: RotationConfig
  ): Promise<Array<{ domainId: string; templateId: number; templateName: string; reason: string }>> {
    const availableTemplates = this.getAvailableTemplates(config);
    const rotationStates = await this.getDomainRotationStates(domainIds);
    
    const preview: Array<{ domainId: string; templateId: number; templateName: string; reason: string }> = [];
    
    for (let i = 0; i < domainIds.length; i++) {
      const domainId = domainIds[i];
      const state = rotationStates.find(s => s.domainId === domainId) || {
        domainId,
        consecutiveUseCount: 0,
        totalPostsCreated: 0
      };
      
      const templateId = await this.selectTemplateForDomain(
        domainId,
        state,
        availableTemplates,
        config,
        i,
        domainIds.length
      );
      
      const template = AutomationTemplateService.getTemplate(templateId);
      
      preview.push({
        domainId,
        templateId,
        templateName: template?.name || `Template ${templateId}`,
        reason: this.getAssignmentReason(templateId, state, config, i)
      });
    }
    
    return preview;
  }

  /**
   * Reset rotation state for a domain
   */
  static async resetDomainRotation(domainId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('automation_domain_rotation_state')
        .delete()
        .eq('domain_id', domainId);
      
      return !error;
    } catch (error) {
      console.error('Error resetting domain rotation:', error);
      return false;
    }
  }
}

export default AutomationTemplateRotationService;
