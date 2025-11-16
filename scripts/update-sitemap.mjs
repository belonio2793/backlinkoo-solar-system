import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITEMAP_PATH = path.join(__dirname, '..', 'public', 'sitemap.xml');

// All pages to add to sitemap
const pages = [
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
  'unlinked-brand-mention-strategy',
];

function updateSitemap() {
  console.log('📝 Updating sitemap.xml...\n');

  // Read existing sitemap
  let sitemapContent = fs.readFileSync(SITEMAP_PATH, 'utf-8');

  // Find where to insert new entries (before closing </urlset>)
  const closeTag = '</urlset>';
  const closeIndex = sitemapContent.lastIndexOf(closeTag);

  if (closeIndex === -1) {
    console.error('❌ Invalid sitemap format - missing closing </urlset> tag');
    process.exit(1);
  }

  // Generate URL entries for all pages
  const urlEntries = pages
    .map(page => {
      return `  <url>
    <loc>https://backlinkoo.com/${page}</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
    })
    .join('\n');

  // Insert new entries before closing tag
  const newSitemap =
    sitemapContent.slice(0, closeIndex) +
    urlEntries +
    '\n' +
    closeTag;

  // Write updated sitemap
  fs.writeFileSync(SITEMAP_PATH, newSitemap, 'utf-8');

  console.log(`✅ Successfully added ${pages.length} pages to sitemap.xml`);
  console.log(`\n📊 Summary:`);
  console.log(`   • Pages added: ${pages.length}`);
  console.log(`   • Priority: 0.8`);
  console.log(`   • Change frequency: monthly`);
  console.log(`   • Last modified: 2024-01-15`);
  console.log(`\n🎯 Sample pages added:`);
  pages.slice(0, 5).forEach(page => {
    console.log(`   • https://backlinkoo.com/${page}`);
  });
  if (pages.length > 5) {
    console.log(`   ... and ${pages.length - 5} more`);
  }
}

updateSitemap();
