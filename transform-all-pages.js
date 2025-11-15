#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// All 100 page names to transform
const pageNames = [
  'affordable-link-building-services',
  'ahrefs-for-link-building',
  'ai-powered-link-building',
  'anchor-text-optimization-for-backlinks',
  'are-paid-backlinks-worth-it',
  'authoritative-backlinks-for-e-commerce',
  'backlink-building-for-beginners',
  'backlink-disavow-tool-usage',
  'backlink-dr-vs-ur-metrics',
  'backlink-equity-calculation',
  'backlink-farming-risks',
  'backlink-growth-tracking',
  'backlink-indexing-techniques',
  'backlink-negotiation-scripts',
  'backlink-profile-diversification',
  'backlink-quality-factors',
  'backlink-relevancy-best-practices',
  'backlink-score-improvement',
  'backlink-strategy-for-local-business',
  'backlink-types-explained',
  'best-backlink-marketplaces',
  'best-backlink-monitoring-tools',
  'best-backlink-services-review',
  'best-guest-posting-platforms',
  'best-link-building-agencies',
  'best-link-building-courses',
  'best-seo-backlinking-tools',
  'blogger-outreach-for-backlinks',
  'broken-backlink-recovery',
  'broken-link-building-guide',
  'buying-backlinks-safely',
  'cheap-backlinks-vs-premium',
  'competitive-seo-backlink-analysis',
  'content-distribution-backlinks',
  'content-syndication-for-backlinks',
  'contextual-backlinks-guide',
  'create-high-authority-backlinks',
  'custom-backlink-strategy',
  'da-pa-backlink-metrics',
  'edu-backlink-strategies',
  'effective-backlink-outreach',
  'ecommerce-backlink-seo-guide',
  'enterprise-link-building-strategy',
  'expert-roundup-backlinks',
  'forum-backlinks-strategy',
  'free-backlinks-methods',
  'guest-post-backlink-strategy',
  'guest-post-email-templates',
  'high-authority-blog-backlinks',
  'high-quality-link-building-services',
  'how-many-backlinks-needed',
  'how-to-analyze-backlink-quality',
  'how-to-build-backlinks-fast',
  'how-to-check-backlinks',
  'how-to-do-backlink-outreach',
  'how-to-find-backlink-opportunities',
  'how-to-get-organic-backlinks',
  'industry-specific-backlink-tips',
  'influencer-link-building',
  'infographic-backlink-method',
  'internal-links-vs-backlinks',
  'keyword-research-for-link-building',
  'link-audit-and-cleanup',
  'link-bait-content-ideas',
  'link-building-automation-tools',
  'link-building-for-affiliate-sites',
  'link-building-for-saas-companies',
  'link-building-kpis',
  'link-building-scams-to-avoid',
  'link-buying-vs-organic',
  'link-exchange-risks',
  'link-indexing-services',
  'link-insertion-backlinks',
  'link-magnet-content-types',
  'local-backlink-strategies',
  'manual-vs-automated-link-building',
  'micro-niche-backlinks',
  'natural-backlink-growth',
  'niche-edits-guide',
  'nicheoutreach-backlinks',
  'outreach-personalization-tips',
  'parasite-seo-backlink-strategy',
  'pdf-backlinks-technique',
  'press-release-backlinks',
  'private-blog-network-risks',
  'profile-backlinks-guide',
  'quick-backlink-wins',
  'resource-page-link-building',
  'review-backlink-services',
  'seo-link-pyramids',
  'seo-ranking-with-backlinks',
  'skyscraper-backlink-technique',
  'social-media-signal-backlinks',
  'spam-score-reduction-for-links',
  'spyfu-competitor-backlinks',
  'tech-startup-backlinks',
  'top-backlink-providers-reviewed',
  'topical-authority-through-links',
  'toxic-backlink-removal',
  'travel-blog-guest-posts',
  'ultimate-link-building-checklist',
  'video-seo-backlinks',
  'voice-search-backlink-optimization',
  'web3-link-building-nfts',
  'where-to-find-high-quality-backlinks',
  'white-hat-link-building-techniques',
  'xrumer-backlink-automation',
  'zero-click-search-link-strategies',
];

function extractTitleFromHtml(html) {
  // Try to find h1
  const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
  if (h1Match) {
    return h1Match[1].trim();
  }
  // Fallback to h2
  const h2Match = html.match(/<h2[^>]*>([^<]+)<\/h2>/);
  if (h2Match) {
    return h2Match[1].trim();
  }
  return '';
}

function extractSubtitleFromHtml(html) {
  // Try to find first paragraph after h1
  const match = html.match(/<h1[^>]*>([^<]+)<\/h1>\s*<p[^>]*>([^<]+)<\/p>/);
  if (match) {
    return match[2].trim().substring(0, 160);
  }
  // Fallback to first p after h2
  const h2Match = html.match(/<h2[^>]*>([^<]+)<\/h2>\s*<p[^>]*>([^<]+)<\/p>/);
  if (h2Match) {
    return h2Match[2].trim().substring(0, 160);
  }
  // Just get first p
  const pMatch = html.match(/<p[^>]*>([^<]+)<\/p>/);
  if (pMatch) {
    return pMatch[1].trim().substring(0, 160);
  }
  return 'Complete guide on ' + extractTitleFromHtml(html).toLowerCase();
}

function extractHtmlContent(fileContent) {
  // Match the dangerouslySetInnerHTML content
  const match = fileContent.match(/dangerouslySetInnerHTML=\{\{\s*__html:\s*["'`]([^"'`]+)["'`]\s*\}\}/s);
  
  if (match && match[1]) {
    let html = match[1];
    
    // Unescape common escape sequences
    html = html
      .replace(/\\"/g, '"')
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t')
      .replace(/\\\//g, '/')
      .replace(/\\'/g, "'");
    
    // Trim leading/trailing whitespace
    html = html.trim();
    
    return html;
  }
  
  return '';
}

function generateComponentName(pageName) {
  return pageName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

function generateNewContent(pageName, htmlContent) {
  const title = extractTitleFromHtml(htmlContent).replace(/"/g, '\\"');
  const subtitle = extractSubtitleFromHtml(htmlContent).replace(/"/g, '\\"');
  const componentName = generateComponentName(pageName);
  const keywords = pageName.replace(/-/g, ', ') + ', backlink strategy, link building, SEO';
  
  // Escape backticks in HTML content
  const escapedHtml = htmlContent.replace(/`/g, '\\`');
  
  return `import React from 'react';
import { GenericPageTemplate } from '@/components/GenericPageTemplate';

const ${componentName}: React.FC = () => {
  const title = "${title}";
  const subtitle = "${subtitle}";
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
}

function transformPage(pageName) {
  const filePath = path.join(__dirname, 'src/pages', `${pageName}.tsx`);
  
  if (!fs.existsSync(filePath)) {
    return { success: false, pageName, error: 'File not found' };
  }

  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const htmlContent = extractHtmlContent(fileContent);
    
    if (!htmlContent) {
      return { success: false, pageName, error: 'No HTML content found' };
    }
    
    const newContent = generateNewContent(pageName, htmlContent);
    fs.writeFileSync(filePath, newContent, 'utf8');
    
    return { success: true, pageName };
  } catch (error) {
    return { success: false, pageName, error: error.message };
  }
}

async function transformAllPages() {
  console.log('🚀 Starting transformation of all pages...');
  console.log(`Total pages: ${pageNames.length}\n`);

  const results = {
    success: [],
    failed: [],
  };

  for (let i = 0; i < pageNames.length; i++) {
    const pageName = pageNames[i];
    const result = transformPage(pageName);
    
    if (result.success) {
      results.success.push(pageName);
      console.log(`✅ [${i + 1}/${pageNames.length}] ${pageName}`);
    } else {
      results.failed.push({ pageName, error: result.error });
      console.log(`❌ [${i + 1}/${pageNames.length}] ${pageName} - ${result.error}`);
    }
  }

  console.log('\n📊 Transformation Summary:');
  console.log(`✅ Successful: ${results.success.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  
  if (results.failed.length > 0) {
    console.log('\nFailed pages:');
    results.failed.forEach(({ pageName, error }) => {
      console.log(`  - ${pageName}: ${error}`);
    });
  }
}

transformAllPages().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
