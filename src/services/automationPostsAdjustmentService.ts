import { supabase } from '@/integrations/supabase/client';
import { BlogQualityMonitor } from '@/utils/blogQualityMonitor';
import { normalizeContent, titleCase, extractTitleFromContent } from '@/lib/autoPostFormatter';

export interface AutomationPostRow {
  id: string;
  title: string | null;
  content: string | null;
  slug: string;
  target_url?: string | null;
  anchor_text?: string | null;
  url?: string | null;
  status?: string | null;
  published_at?: string | null;
}

export interface AdjustmentResult {
  success: boolean;
  wasAdjusted: boolean;
  originalContent: string;
  adjustedContent: string;
  issues: string[];
  adjustments: string[];
  qualityScore: { before: number; after: number };
}

export interface BatchAdjustmentResult {
  totalPosts: number;
  processedPosts: number;
  adjustedPosts: number;
  failedPosts: number;
  results: AdjustmentResult[];
}

export const AutomationPostsAdjustmentService = {
  async fetchRecentPosts(limit = 500): Promise<AutomationPostRow[]> {
    const { data, error } = await supabase
      .from('automation_posts')
      .select('id,title,content,slug,target_url,anchor_text,url,status,published_at')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data || []) as AutomationPostRow[];
  },

  async scanForIssues(limit = 500): Promise<{ needsAdjustment: AutomationPostRow[]; highPriority: AutomationPostRow[]; report: string; }>{
    const posts = await this.fetchRecentPosts(limit);
    const needsAdjustment: AutomationPostRow[] = [];
    const highPriority: AutomationPostRow[] = [];
    const qualityStats = { excellent: 0, good: 0, poor: 0, critical: 0 };

    for (const p of posts) {
      const metrics = BlogQualityMonitor.analyzeContent(p.content || '', p.target_url || undefined);
      if (metrics.qualityScore >= 80) qualityStats.excellent++; 
      else if (metrics.qualityScore >= 60) qualityStats.good++; 
      else if (metrics.qualityScore >= 40) { qualityStats.poor++; needsAdjustment.push(p); }
      else { qualityStats.critical++; needsAdjustment.push(p); highPriority.push(p); }
      if (metrics.hasMalformedPatterns && !needsAdjustment.includes(p)) needsAdjustment.push(p);
    }

    const report = [
      '📊 Automation Posts Quality Scan',
      '================================',
      `Total Scanned: ${posts.length}`,
      `Excellent (80+): ${qualityStats.excellent}`,
      `Good (60-79): ${qualityStats.good}`,
      `Poor (40-59): ${qualityStats.poor}`,
      `Critical (<40): ${qualityStats.critical}`,
      `Needs Adjustment: ${needsAdjustment.length}`,
      `High Priority: ${highPriority.length}`,
    ].join('\n');

    return { needsAdjustment, highPriority, report };
  },

  async autoAdjustPost(row: AutomationPostRow, updateDatabase = true): Promise<AdjustmentResult> {
    const originalContent = row.content || '';
    const initial = BlogQualityMonitor.analyzeContent(originalContent, row.target_url || undefined);

    let adjustedContent = normalizeContent(row.title || '', originalContent);
    const newTitle = titleCase(extractTitleFromContent(adjustedContent) || row.title || '');

    const finalMetrics = BlogQualityMonitor.analyzeContent(adjustedContent, row.target_url || undefined);

    const adjustments: string[] = [];
    const issues: string[] = [];

    if (finalMetrics.qualityScore > initial.qualityScore || adjustedContent !== originalContent || newTitle !== (row.title || '')) {
      adjustments.push('Normalized structure and formatting');
    }
    if (initial.hasMalformedPatterns) issues.push('Malformed patterns detected');

    if (updateDatabase && (adjustedContent !== originalContent || newTitle !== (row.title || ''))) {
      await supabase
        .from('automation_posts')
        .update({ title: newTitle || row.title, content: adjustedContent, updated_at: new Date().toISOString() })
        .eq('id', row.id);
    }

    return {
      success: true,
      wasAdjusted: adjustments.length > 0,
      originalContent,
      adjustedContent,
      issues,
      adjustments,
      qualityScore: { before: initial.qualityScore, after: finalMetrics.qualityScore }
    };
  },

  async batchAutoAdjust(posts: AutomationPostRow[], options: { maxConcurrent?: number; updateDatabase?: boolean } = {}): Promise<BatchAdjustmentResult> {
    const { maxConcurrent = 5, updateDatabase = true } = options;
    const results: AdjustmentResult[] = [];
    let adjusted = 0, failed = 0;

    for (let i = 0; i < posts.length; i += maxConcurrent) {
      const chunk = posts.slice(i, i + maxConcurrent);
      const chunkResults = await Promise.all(chunk.map(async (p) => {
        try {
          const r = await this.autoAdjustPost(p, updateDatabase);
          if (r.wasAdjusted) adjusted++;
          return r;
        } catch (e) {
          failed++;
          return { success: false, wasAdjusted: false, originalContent: p.content || '', adjustedContent: p.content || '', issues: ['Adjustment failed'], adjustments: [], qualityScore: { before: 0, after: 0 } } as AdjustmentResult;
        }
      }));
      results.push(...chunkResults);
      if (i + maxConcurrent < posts.length) await new Promise(r => setTimeout(r, 100));
    }

    return { totalPosts: posts.length, processedPosts: results.length, adjustedPosts: adjusted, failedPosts: failed, results };
  }
};
