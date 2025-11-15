const fs = require('fs');
const path = require('path');

// List of all 100 page files to transform
const pagesToTransform = [
  'ab-testing-anchor-texts',
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

function transformPage(fileName) {
  const filePath = path.join(__dirname, 'src/pages', `${fileName}.tsx`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${fileName}.tsx`);
    return false;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  
  // Extract title from h1 in the content
  const titleMatch = content.match(/<h1[^>]*>([^<]+)<\/h1>/);
  const title = titleMatch ? titleMatch[1].trim() : fileName.replace(/-/g, ' ').toUpperCase();
  
  // Extract subtitle (often the first paragraph after the first h1)
  const subtitleMatch = content.match(/<\/h1>\s*<p[^>]*>([^<]+)<\/p>/);
  const subtitle = subtitleMatch ? subtitleMatch[1].trim().substring(0, 150) : 'Complete guide on ' + title.toLowerCase();
  
  // Extract HTML content between the dangerouslySetInnerHTML markers
  const htmlMatch = content.match(/dangerouslySetInnerHTML=\{\{\s*__html:\s*['"`]([^'"`]+)['"`]\s*\}\}/s);
  let htmlContent = htmlMatch ? htmlMatch[1] : '';
  
  // Handle escaped characters
  htmlContent = htmlContent
    .replace(/\\"/g, '"')
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t');

  // Create the component name (PascalCase)
  const componentName = fileName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  // Generate the new file content
  const newContent = `import React from 'react';
import { GenericPageTemplate } from '@/components/GenericPageTemplate';

const ${componentName}: React.FC = () => {
  const title = "${title.replace(/"/g, '\\"')}";
  const subtitle = "${subtitle.replace(/"/g, '\\"')}";
  const htmlContent = \`${htmlContent}\`;
  const keywords = "${title.toLowerCase().replace(/"/g, '\\"')}, backlink strategy, link building, SEO";
  
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
  return true;
}

console.log('Starting page transformation...');
console.log(`Total pages to transform: ${pagesToTransform.length}\n`);

let successCount = 0;
let failCount = 0;

pagesToTransform.forEach((pageName, index) => {
  const success = transformPage(pageName);
  if (success) {
    successCount++;
    console.log(`✅ [${index + 1}/${pagesToTransform.length}] Transformed: ${pageName}`);
  } else {
    failCount++;
    console.log(`❌ [${index + 1}/${pagesToTransform.length}] Failed: ${pageName}`);
  }
});

console.log(`\n✨ Transformation complete!`);
console.log(`✅ Successful: ${successCount}`);
console.log(`❌ Failed: ${failCount}`);
