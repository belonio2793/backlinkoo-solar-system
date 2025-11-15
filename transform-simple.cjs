#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// All 100 page names
const pageNames = [
  'affordable-link-building-services', 'ahrefs-for-link-building', 'ai-powered-link-building',
  'anchor-text-optimization-for-backlinks', 'are-paid-backlinks-worth-it', 'authoritative-backlinks-for-e-commerce',
  'backlink-building-for-beginners', 'backlink-disavow-tool-usage', 'backlink-dr-vs-ur-metrics',
  'backlink-equity-calculation', 'backlink-farming-risks', 'backlink-growth-tracking',
  'backlink-indexing-techniques', 'backlink-negotiation-scripts', 'backlink-profile-diversification',
  'backlink-quality-factors', 'backlink-relevancy-best-practices', 'backlink-score-improvement',
  'backlink-strategy-for-local-business', 'backlink-types-explained', 'best-backlink-marketplaces',
  'best-backlink-monitoring-tools', 'best-backlink-services-review', 'best-guest-posting-platforms',
  'best-link-building-agencies', 'best-link-building-courses', 'best-seo-backlinking-tools',
  'blogger-outreach-for-backlinks', 'broken-backlink-recovery', 'broken-link-building-guide',
  'buying-backlinks-safely', 'cheap-backlinks-vs-premium', 'competitive-seo-backlink-analysis',
  'content-distribution-backlinks', 'content-syndication-for-backlinks', 'contextual-backlinks-guide',
  'create-high-authority-backlinks', 'custom-backlink-strategy', 'da-pa-backlink-metrics',
  'edu-backlink-strategies', 'effective-backlink-outreach', 'ecommerce-backlink-seo-guide',
  'enterprise-link-building-strategy', 'expert-roundup-backlinks', 'forum-backlinks-strategy',
  'free-backlinks-methods', 'guest-post-backlink-strategy', 'guest-post-email-templates',
  'high-authority-blog-backlinks', 'high-quality-link-building-services', 'how-many-backlinks-needed',
  'how-to-analyze-backlink-quality', 'how-to-build-backlinks-fast', 'how-to-check-backlinks',
  'how-to-do-backlink-outreach', 'how-to-find-backlink-opportunities', 'how-to-get-organic-backlinks',
  'industry-specific-backlink-tips', 'influencer-link-building', 'infographic-backlink-method',
  'internal-links-vs-backlinks', 'keyword-research-for-link-building', 'link-audit-and-cleanup',
  'link-bait-content-ideas', 'link-building-automation-tools', 'link-building-for-affiliate-sites',
  'link-building-for-saas-companies', 'link-building-kpis', 'link-building-scams-to-avoid',
  'link-buying-vs-organic', 'link-exchange-risks', 'link-indexing-services',
  'link-insertion-backlinks', 'link-magnet-content-types', 'local-backlink-strategies',
  'manual-vs-automated-link-building', 'micro-niche-backlinks', 'natural-backlink-growth',
  'niche-edits-guide', 'nicheoutreach-backlinks', 'outreach-personalization-tips',
  'parasite-seo-backlink-strategy', 'pdf-backlinks-technique', 'press-release-backlinks',
  'private-blog-network-risks', 'profile-backlinks-guide', 'quick-backlink-wins',
  'resource-page-link-building', 'review-backlink-services', 'seo-link-pyramids',
  'seo-ranking-with-backlinks', 'skyscraper-backlink-technique', 'social-media-signal-backlinks',
  'spam-score-reduction-for-links', 'spyfu-competitor-backlinks', 'tech-startup-backlinks',
  'top-backlink-providers-reviewed', 'topical-authority-through-links', 'toxic-backlink-removal',
  'travel-blog-guest-posts', 'ultimate-link-building-checklist', 'video-seo-backlinks',
  'voice-search-backlink-optimization', 'web3-link-building-nfts', 'where-to-find-high-quality-backlinks',
  'white-hat-link-building-techniques', 'xrumer-backlink-automation', 'zero-click-search-link-strategies',
];

function generateComponentName(name) {
  return name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}

function transformPage(name) {
  const filePath = path.join(__dirname, 'src/pages', `${name}.tsx`);
  
  if (!fs.existsSync(filePath)) {
    return { success: false, reason: 'not found' };
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Find the h1 title from dangerouslySetInnerHTML
    const titleMatch = content.match(/<h1[^>]*>([^<]+)<\/h1>/);
    const title = titleMatch ? titleMatch[1].trim() : 'Link Building Guide: ' + name.replace(/-/g, ' ');
    
    // Extract HTML from dangerouslySetInnerHTML - match between __html: and closing }}
    // Look for content between __html: ' (or ") and the next quote
    const htmlMatch = content.match(/dangerouslySetInnerHTML=\{\{\s*__html:\s*['"](.+?)['"][,\s\}]/s);
    
    if (!htmlMatch || !htmlMatch[1]) {
      return { success: false, reason: 'no content' };
    }

    let html = htmlMatch[1];
    
    // Unescape
    html = html
      .replace(/\\"/g, '"')
      .replace(/\\'/g, "'")
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t');

    // Extract subtitle from first p tag
    const subtitleMatch = html.match(/<p[^>]*>([^<]+)<\/p>/);
    const subtitle = subtitleMatch ? subtitleMatch[1].trim().substring(0, 160) : 'Complete guide';
    
    const componentName = generateComponentName(name);
    const keywords = name.replace(/-/g, ', ') + ', SEO';
    
    // Escape backticks in HTML
    const escapedHtml = html.replace(/`/g, '\\`');
    
    const newContent = `import React from 'react';
import { GenericPageTemplate } from '@/components/GenericPageTemplate';

const ${componentName}: React.FC = () => {
  const title = "${title.replace(/"/g, '\\"')}";
  const subtitle = "${subtitle.replace(/"/g, '\\"')}";
  const htmlContent = \`${escapedHtml}\`;
  const keywords = "${keywords}";
  
  return (
    <GenericPageTemplate
      title={title}
      subtitle={subtitle}
      htmlContent={htmlContent}
      keywords={keywords}
      description={subtitle}
    />
  );
};

export default ${componentName};
`;

    fs.writeFileSync(filePath, newContent, 'utf8');
    return { success: true };
  } catch (e) {
    return { success: false, reason: e.message.substring(0, 30) };
  }
}

console.log('🚀 Transforming all pages...\n');
let success = 0, failed = 0;

pageNames.forEach((name, i) => {
  const result = transformPage(name);
  if (result.success) {
    success++;
    if (i % 20 === 0) console.log(`✅ Batch: ${i}-${Math.min(i+20, pageNames.length)}`);
  } else {
    failed++;
    console.log(`❌ ${name} (${result.reason})`);
  }
});

console.log(`\n✨ Complete! ✅ ${success} | ❌ ${failed}`);
