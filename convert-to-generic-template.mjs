import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pagesDir = path.join(__dirname, 'src', 'pages');

// List of all 100 imported pages to convert
const pagesToConvert = [
  'ab-testing-anchor-texts.tsx',
  'affordable-link-building-services.tsx',
  'ahrefs-for-link-building.tsx',
  'ai-powered-link-building.tsx',
  'anchor-text-optimization-for-backlinks.tsx',
  'are-paid-backlinks-worth-it.tsx',
  'authoritative-backlinks-for-e-commerce.tsx',
  'backlink-building-for-beginners.tsx',
  'backlink-disavow-tool-usage.tsx',
  'backlink-dr-vs-ur-metrics.tsx',
  'backlink-equity-calculation.tsx',
  'backlink-farming-risks.tsx',
  'backlink-growth-tracking.tsx',
  'backlink-indexing-techniques.tsx',
  'backlink-negotiation-scripts.tsx',
  'backlink-profile-diversification.tsx',
  'backlink-quality-factors.tsx',
  'backlink-relevancy-best-practices.tsx',
  'backlink-score-improvement.tsx',
  'backlink-strategy-for-local-business.tsx',
  'backlink-types-explained.tsx',
  'best-backlink-marketplaces.tsx',
  'best-backlink-monitoring-tools.tsx',
  'best-backlink-services-review.tsx',
  'best-guest-posting-platforms.tsx',
  'best-link-building-agencies.tsx',
  'best-link-building-courses.tsx',
  'best-seo-backlinking-tools.tsx',
  'blogger-outreach-for-backlinks.tsx',
  'broken-backlink-recovery.tsx',
  'broken-link-building-guide.tsx',
  'buying-backlinks-safely.tsx',
  'cheap-backlinks-vs-premium.tsx',
  'competitive-seo-backlink-analysis.tsx',
  'content-distribution-backlinks.tsx',
  'content-syndication-for-backlinks.tsx',
  'contextual-backlinks-guide.tsx',
  'create-high-authority-backlinks.tsx',
  'custom-backlink-strategy.tsx',
  'da-pa-backlink-metrics.tsx',
  'edu-backlink-strategies.tsx',
  'effective-backlink-outreach.tsx',
  'ecommerce-backlink-seo-guide.tsx',
  'enterprise-link-building-strategy.tsx',
  'expert-roundup-backlinks.tsx',
  'forum-backlinks-strategy.tsx',
  'free-backlinks-methods.tsx',
  'guest-post-backlink-strategy.tsx',
  'guest-post-email-templates.tsx',
  'high-authority-blog-backlinks.tsx',
  'high-quality-link-building-services.tsx',
  'how-many-backlinks-needed.tsx',
  'how-to-analyze-backlink-quality.tsx',
  'how-to-build-backlinks-fast.tsx',
  'how-to-check-backlinks.tsx',
  'how-to-do-backlink-outreach.tsx',
  'how-to-find-backlink-opportunities.tsx',
  'how-to-get-organic-backlinks.tsx',
  'industry-specific-backlink-tips.tsx',
  'influencer-link-building.tsx',
  'infographic-backlink-method.tsx',
  'internal-links-vs-backlinks.tsx',
  'keyword-research-for-link-building.tsx',
  'link-audit-and-cleanup.tsx',
  'link-bait-content-ideas.tsx',
  'link-building-automation-tools.tsx',
  'link-building-for-affiliate-sites.tsx',
  'link-building-for-saas-companies.tsx',
  'link-building-kpis.tsx',
  'link-building-scams-to-avoid.tsx',
  'link-buying-vs-organic.tsx',
  'link-exchange-risks.tsx',
  'link-indexing-services.tsx',
  'link-insertion-backlinks.tsx',
  'link-magnet-content-types.tsx',
  'local-backlink-strategies.tsx',
  'manual-vs-automated-link-building.tsx',
  'micro-niche-backlinks.tsx',
  'natural-backlink-growth.tsx',
  'niche-edits-guide.tsx',
  'nicheoutreach-backlinks.tsx',
  'outreach-personalization-tips.tsx',
  'parasite-seo-backlink-strategy.tsx',
  'pdf-backlinks-technique.tsx',
  'press-release-backlinks.tsx',
  'private-blog-network-risks.tsx',
  'profile-backlinks-guide.tsx',
  'quick-backlink-wins.tsx',
  'resource-page-link-building.tsx',
  'review-backlink-services.tsx',
  'seo-link-pyramids.tsx',
  'seo-ranking-with-backlinks.tsx',
  'skyscraper-backlink-technique.tsx',
  'social-media-signal-backlinks.tsx',
  'spam-score-reduction-for-links.tsx',
  'spyfu-competitor-backlinks.tsx',
  'tech-startup-backlinks.tsx',
  'top-backlink-providers-reviewed.tsx',
  'topical-authority-through-links.tsx',
  'toxic-backlink-removal.tsx',
  'travel-blog-guest-posts.tsx',
  'ultimate-link-building-checklist.tsx',
  'video-seo-backlinks.tsx',
  'voice-search-backlink-optimization.tsx',
  'web3-link-building-nfts.tsx',
  'where-to-find-high-quality-backlinks.tsx',
  'white-hat-link-building-techniques.tsx',
  'xrumer-backlink-automation.tsx',
  'zero-click-search-link-strategies.tsx'
];

function extractComponentName(fileName) {
  // Convert filename to component name (e.g., ab-testing-anchor-texts.tsx -> AbTestingAnchorTexts)
  return fileName
    .replace('.tsx', '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

function extractTitle(htmlContent) {
  // Extract from <h1> tag
  const match = htmlContent.match(/<h1>([^<]+)<\/h1>/);
  if (match) {
    return match[1].trim();
  }
  return "SEO Link Building Guide";
}

function createSubtitle(htmlContent) {
  // Extract from first <p> tag
  const match = htmlContent.match(/<p>([^<]{50,150}[^<]*?)<\/p>/);
  if (match) {
    let subtitle = match[1].trim();
    // Remove HTML tags
    subtitle = subtitle.replace(/<[^>]+>/g, '');
    // Truncate to ~150 chars
    if (subtitle.length > 150) {
      subtitle = subtitle.substring(0, 147) + '...';
    }
    return subtitle;
  }
  return "In the ever-evolving world of SEO, link building remains a cornerstone...";
}

function extractKeywords(fileName) {
  // Create keywords from filename
  const keywords = fileName
    .replace('.tsx', '')
    .split('-')
    .slice(0, 5)
    .join(', ');
  return keywords;
}

function convertFile(filePath, fileName) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Extract the component name
    const componentMatch = content.match(/const\s+(\w+):\s*React\.FC/);
    const componentName = componentMatch ? componentMatch[1] : extractComponentName(fileName);
    
    // Extract htmlContent - look for the htmlContent template literal
    let htmlContent = '';
    
    // Try to extract from htmlContent = ` ... `
    const htmlMatch = content.match(/const\s+htmlContent\s*=\s*`([\s\S]*?)`\s*;/);
    if (htmlMatch) {
      htmlContent = htmlMatch[1];
    } else {
      // Try to extract from dangerouslySetInnerHTML
      const innerMatch = content.match(/dangerouslySetInnerHTML=\{{\s*__html:\s*`([\s\S]*?)`\s*}}\s*\/>/);
      if (innerMatch) {
        htmlContent = innerMatch[1];
      } else {
        // Try to extract from the div with className
        const divMatch = content.match(/<div\s+className="[^"]*"\s+dangerouslySetInnerHTML=\{{\s*__html:\s*([^}]+)\s*}}\s*\/>/);
        if (divMatch) {
          // This is already wrapped, just extract the content
          const varMatch = content.match(/const\s+htmlContent\s*=\s*`([\s\S]*?)`/);
          if (varMatch) {
            htmlContent = varMatch[1];
          }
        }
      }
    }
    
    if (!htmlContent.trim()) {
      console.log(`⚠️  Could not extract htmlContent from ${fileName}`);
      return false;
    }
    
    const title = extractTitle(htmlContent);
    const subtitle = createSubtitle(htmlContent);
    const keywords = extractKeywords(fileName);
    
    // Create the converted file
    const converted = `import React from 'react';
import { GenericPageTemplate } from '@/components/GenericPageTemplate';

const ${componentName}: React.FC = () => {
  const title = "${title.replace(/"/g, '\\"')}";
  const subtitle = "${subtitle.replace(/"/g, '\\"')}";
  const htmlContent = \`${htmlContent.replace(/`/g, '\\`')}\`;
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

export default ${componentName};`;

    fs.writeFileSync(filePath, converted, 'utf8');
    console.log(`✅ Converted: ${fileName}`);
    return true;
  } catch (error) {
    console.error(`❌ Error converting ${fileName}:`, error.message);
    return false;
  }
}

// Convert all files
let successCount = 0;
let failureCount = 0;

console.log(`Starting to convert ${pagesToConvert.length} pages to GenericPageTemplate pattern...\n`);

pagesToConvert.forEach(fileName => {
  const filePath = path.join(pagesDir, fileName);
  if (fs.existsSync(filePath)) {
    if (convertFile(filePath, fileName)) {
      successCount++;
    } else {
      failureCount++;
    }
  } else {
    console.log(`⚠️  File not found: ${fileName}`);
  }
});

console.log(`\n✅ Successfully converted: ${successCount} pages`);
console.log(`❌ Failed to convert: ${failureCount} pages`);
console.log('Done!');
