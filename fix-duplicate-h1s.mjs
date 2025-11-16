import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { globSync } from 'glob';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PAGE_SLUGS = [
  'anchor-text-ratio-guide',
  'backlink-acquisition-funnel',
  'backlink-ai-content-detection',
  'backlink-ama-session-ideas',
  'backlink-anchor-cloud-analysis',
  'backlink-canonical-tag-issues',
  'backlink-carousel-placement',
  'backlink-co-citation-strategy',
  'backlink-collaboration-ideas',
  'backlink-comment-section-strategy',
  'backlink-content-freshness-score',
  'backlink-content-upgrade-method',
  'backlink-csv-export-tips',
  'backlink-data-visualization',
  'backlink-decay-prevention',
  'backlink-e-e-a-t-signals',
  'backlink-evergreen-content-ideas',
  'backlink-expert-quote-collection',
  'backlink-featured-snippet-links',
  'backlink-flipboard-magazine',
  'backlink-follow-up-sequence',
  'backlink-haro-response-template',
  'backlink-how-to-schema',
  'backlink-hub-and-spoke-model',
  'backlink-interlinking-strategy',
  'backlink-log-file-analysis',
  'backlink-lost-link-alerts',
  'backlink-mention-monitoring',
  'backlink-mobile-indexing-tips',
  'backlink-orphan-page-fix',
  'backlink-outreach-calendar',
  'backlink-passage-ranking-boost',
  'backlink-performance-report',
  'backlink-podcast-guest-strategy',
  'backlink-quora-space-links',
  'backlink-redirect-chain-fix',
  'backlink-relevance-score',
  'backlink-schema-markup-types',
  'backlink-social-profile-links',
  'backlink-spam-brain-recovery',
  'backlink-substack-newsletter',
  'backlink-supporting-article-links',
  'backlink-tool-stack-2026',
  'backlink-topical-map-creation',
  'backlink-trust-signals',
  'backlink-value-estimation',
  'backlink-velocity-trends',
  'backlink-visual-asset-ideas',
  'backlink-wakelet-collection',
  'backlink-xml-sitemap-priority',
  'dofollow-vs-nofollow-balance',
  'link-building-301-strategy',
  'link-building-author-bio-links',
  'link-building-beehiiv-growth',
  'link-building-browser-extensions',
  'link-building-cluster-content',
  'link-building-content-pillar-pages',
  'link-building-content-repurposing',
  'link-building-core-web-vitals',
  'link-building-crawl-budget-tips',
  'link-building-crm-setup',
  'link-building-dashboard-setup',
  'link-building-data-study-format',
  'link-building-entity-optimization',
  'link-building-faq-page-links',
  'link-building-forum-signature',
  'link-building-google-sheets-hacks',
  'link-building-helpful-content',
  'link-building-hreflang-impact',
  'link-building-human-edit-layer',
  'link-building-internal-anchor-text',
  'link-building-medium-publication',
  'link-building-micro-content-hooks',
  'link-building-monthly-audit',
  'link-building-partnership-types',
  'link-building-pearltrees-board',
  'link-building-people-also-ask',
  'link-building-pitch-deck',
  'link-building-recovery-playbook',
  'link-building-roi-tracker',
  'link-building-rss-feed-links',
  'link-building-scoop-it-curation',
  'link-building-server-response-codes',
  'link-building-silo-structure',
  'link-building-survey-outreach',
  'link-building-timeline-planner',
  'link-building-update-cadence',
  'link-building-video-object-links',
  'link-building-virtual-summit',
  'link-building-webinar-promotion',
  'link-building-workflow-automation',
  'link-building-ymy-l-compliance',
  'link-building-zero-click-strategy',
  'link-gap-analysis-template',
  'link-insertion-pricing-models',
  'link-prospecting-checklist',
  'link-reclamation-email-script',
  'link-velocity-monitoring',
  'referral-traffic-from-backlinks',
  'unlinked-brand-mention-strategy'
];

function fixDuplicateH1(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Check if page has the duplicate h1 pattern
    const hasFirstH1 = content.includes('dangerouslySetInnerHTML={{ __html: `<h1>');
    const hasSecondH1 = content.match(/<article[^>]*>[\s\S]*?<h1>/);
    
    if (!hasFirstH1) {
      return { fixed: false, reason: 'No duplicate pattern found' };
    }
    
    // Remove the first h1 that's outside the article div
    // Pattern: <div dangerouslySetInnerHTML={{ __html: `<h1>...</h1>` }} />
    const originalContent = content;
    content = content.replace(
      /\s*<div dangerouslySetInnerHTML={{\s*__html:\s*`<h1>[^<]*<\/h1>`\s*}}\s*\/>\s*/,
      '\n            '
    );
    
    if (content === originalContent) {
      return { fixed: false, reason: 'Could not match pattern for removal' };
    }
    
    fs.writeFileSync(filePath, content, 'utf-8');
    return { fixed: true, reason: 'Removed duplicate h1 tag' };
  } catch (error) {
    return { fixed: false, reason: error.message };
  }
}

async function fixAllPages() {
  console.log(`Scanning ${PAGE_SLUGS.length} pages for duplicate h1 tags...\n`);
  
  let fixedCount = 0;
  let alreadyCleanCount = 0;
  let errorCount = 0;
  const duplicates = [];
  
  for (let i = 0; i < PAGE_SLUGS.length; i++) {
    const slug = PAGE_SLUGS[i];
    const filePath = path.join(__dirname, 'src', 'pages', `${slug}.tsx`);
    
    if (!fs.existsSync(filePath)) {
      console.log(`❌ File not found: ${slug}`);
      errorCount++;
      continue;
    }
    
    const result = fixDuplicateH1(filePath);
    
    if (result.fixed) {
      console.log(`✅ Fixed: ${slug}`);
      fixedCount++;
      duplicates.push(slug);
    } else if (result.reason === 'No duplicate pattern found') {
      // Silent - means page is already correct
      alreadyCleanCount++;
    } else {
      console.log(`⚠️ ${slug}: ${result.reason}`);
      errorCount++;
    }
    
    if ((i + 1) % 10 === 0) {
      console.log(`Progress: ${i + 1}/${PAGE_SLUGS.length} pages scanned`);
    }
  }
  
  console.log(`\n📊 Duplicate H1 Fix Complete!`);
  console.log(`✅ Fixed pages: ${fixedCount}`);
  console.log(`✓ Already clean: ${alreadyCleanCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`\nPages that had duplicate h1 tags:\n${duplicates.join('\n')}`);
}

fixAllPages().catch(console.error);
