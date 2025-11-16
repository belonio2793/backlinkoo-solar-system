import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generatePage } from './generate-unique-seo-content.mjs';

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

function toCamelCase(slug) {
  return slug
    .split('-')
    .map((part, i) => {
      if (i === 0) return part;
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join('');
}

function toPascalCase(slug) {
  return slug
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function generatePageTemplate(slug, componentName, description, headline, htmlContent) {
  const canonicalUrl = `https://backlinkoo.com/${slug}`;
  const schemaId = `${slug}-schema`;
  
  return `import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BacklinkInfinityCTA } from '@/components/BacklinkInfinityCTA';

function upsertMeta(name: string, content: string) {
  if (typeof document === 'undefined') return;
  const sel = \`meta[name="\${name}"]\`;
  let el = document.head.querySelector(sel) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href: string) {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function injectJSONLD(id: string, json: any) {
  if (typeof document === 'undefined') return;
  let el = document.getElementById(id) as HTMLScriptElement | null;
  const text = JSON.stringify(json);
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = id;
    el.text = text;
    document.head.appendChild(el);
  } else {
    el.text = text;
  }
}

export default function ${componentName}() {
  React.useEffect(() => {
    upsertMeta('description', '${description.replace(/'/g, "\\'")}');
    upsertCanonical(typeof window !== 'undefined' ? window.location.href : '${canonicalUrl}');
    injectJSONLD('${schemaId}', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: '${headline.replace(/'/g, "\\'")}',
      description: '${description.replace(/'/g, "\\'")}',
      author: { '@type': 'Person', name: 'Backlinkoo SEO Expert' },
      datePublished: new Date().toISOString().split('T')[0],
    });
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        <div className="container mx-auto px-4 py-12">
          <article className="prose prose-slate max-w-4xl mx-auto dark:prose-invert">
            <div dangerouslySetInnerHTML={{ __html: \`<h1>${headline}</h1>\` }} />
            <div dangerouslySetInnerHTML={{ __html: \`
${htmlContent}
            \` }} />
            <div className="mt-12">
              <BacklinkInfinityCTA />
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
`;
}

function updatePage(slug) {
  const filePath = path.join(__dirname, 'src', 'pages', `${slug}.tsx`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${filePath}`);
    return false;
  }
  
  try {
    const { description, headline, htmlContent } = generatePage(slug);
    const componentName = toPascalCase(slug);
    const pageTemplate = generatePageTemplate(slug, componentName, description, headline, htmlContent);
    
    fs.writeFileSync(filePath, pageTemplate, 'utf-8');
    console.log(`✅ Updated: ${slug}`);
    return true;
  } catch (error) {
    console.log(`❌ Error updating ${slug}: ${error.message}`);
    return false;
  }
}

async function updateAllPages() {
  console.log(`Starting update of ${PAGE_SLUGS.length} pages...`);
  console.log('This will remove SEO footprints and create unique, keyword-optimized content for each page.\n');
  
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < PAGE_SLUGS.length; i++) {
    const slug = PAGE_SLUGS[i];
    const success = updatePage(slug);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
    
    if ((i + 1) % 10 === 0) {
      console.log(`Progress: ${i + 1}/${PAGE_SLUGS.length} pages processed`);
    }
  }
  
  console.log(`\n📊 Update Complete!`);
  console.log(`✅ Successfully updated: ${successCount} pages`);
  console.log(`❌ Failed updates: ${failCount} pages`);
}

updateAllPages().catch(console.error);
