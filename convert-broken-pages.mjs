import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PAGES_DIR = path.join(__dirname, 'src', 'pages');

// List of pages to convert (those with next imports)
const BROKEN_PAGES = [
  'link-building-beehiiv-growth.tsx',
  'link-building-video-object-links.tsx',
  'link-building-helpful-content.tsx',
  'link-building-rss-feed-links.tsx',
  'backlink-xml-sitemap-priority.tsx',
  'link-building-entity-optimization.tsx',
  'backlink-haro-response-template.tsx',
  'backlink-relevance-score.tsx',
  'link-building-browser-extensions.tsx',
  'link-building-monthly-audit.tsx',
  'link-building-medium-publication.tsx',
  'backlink-substack-newsletter.tsx',
  'backlink-interlinking-strategy.tsx',
  'link-building-core-web-vitals.tsx',
  'backlink-schema-markup-types.tsx',
  'backlink-data-visualization.tsx',
  'backlink-orphan-page-fix.tsx',
  'link-building-author-bio-links.tsx',
  'backlink-quora-space-links.tsx',
  'link-building-silo-structure.tsx',
  'backlink-lost-link-alerts.tsx',
  'backlink-velocity-trends.tsx',
  'backlink-supporting-article-links.tsx',
  'backlink-mention-monitoring.tsx',
  'backlink-e-e-a-t-signals.tsx',
  'backlink-decay-prevention.tsx',
  'link-building-crawl-budget-tips.tsx',
  'link-building-human-edit-layer.tsx',
  'unlinked-brand-mention-strategy.tsx',
  'link-insertion-pricing-models.tsx',
  'backlink-comment-section-strategy.tsx',
  'backlink-tool-stack-2026.tsx',
  'backlink-carousel-placement.tsx',
  'backlink-content-upgrade-method.tsx',
  'backlink-how-to-schema.tsx',
  'link-building-recovery-playbook.tsx',
  'backlink-wakelet-collection.tsx',
  'link-building-pearltrees-board.tsx',
  'link-building-cluster-content.tsx',
  'link-building-zero-click-strategy.tsx',
  'backlink-csv-export-tips.tsx',
  'backlink-value-estimation.tsx',
  'link-building-update-cadence.tsx',
  'link-building-people-also-ask.tsx',
  'backlink-collaboration-ideas.tsx',
  'link-building-dashboard-setup.tsx',
  'link-building-workflow-automation.tsx',
  'backlink-social-profile-links.tsx',
  'link-building-301-strategy.tsx',
  'backlink-negotiation-scripts.tsx',
  'link-building-quora-answers.tsx',
  'backlink-ranking-boost.tsx',
  'link-building-internal-links.tsx',
  'backlink-quality-metrics.tsx',
  'link-building-competitor-analysis.tsx',
  'backlink-seo-strategy.tsx',
  'link-building-outreach.tsx',
  'backlink-best-practices.tsx',
  'link-building-tools.tsx',
];

function extractTitle(content) {
  const titleMatch = content.match(/<title>([^<]+)<\/title>/);
  return titleMatch ? titleMatch[1] : 'Untitled';
}

function extractDescription(content) {
  const descMatch = content.match(/content="([^"]*)"[^>]*\/>/);
  return descMatch ? descMatch[1] : '';
}

function extractHtmlContent(fileContent) {
  // Find the htmlContent variable
  const match = fileContent.match(/const htmlContent = `\s*([\s\S]*?)\s*`;/);
  if (match) {
    return match[1].trim();
  }
  return '';
}

function convertPageNameToValidComponent(filename) {
  // Convert kebab-case to PascalCase
  return filename
    .replace('.tsx', '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

function generateNewPage(title, description, htmlContent, filename) {
  const componentName = convertPageNameToValidComponent(filename);
  const styleName = filename.replace('.tsx', '').replace(/([A-Z])/g, '-$1').toLowerCase();
  
  return `import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertTriangle, ShieldCheck, Gauge, Activity, Star, ListChecks, ArrowLeft, ArrowRight } from 'lucide-react';
import { BacklinkInfinityCTA } from '@/components/BacklinkInfinityCTA';
import '@/styles/${styleName}.css';

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
    upsertMeta('description', '${description}');
    upsertCanonical(typeof window !== 'undefined' ? window.location.href : '');
    injectJSONLD('${filename.replace('.tsx', '')}-schema', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: '${title}',
      description: '${description}',
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
            <div dangerouslySetInnerHTML={{ __html: \`${htmlContent}\` }} />
          </article>
          <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800">
            <BacklinkInfinityCTA />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
`;
}

async function convertPages() {
  console.log('Starting conversion of broken pages...');
  let converted = 0;
  let failed = 0;

  for (const filename of BROKEN_PAGES) {
    const filepath = path.join(PAGES_DIR, filename);
    
    if (!fs.existsSync(filepath)) {
      console.log(`⚠️  Skipped (not found): ${filename}`);
      continue;
    }

    try {
      const fileContent = fs.readFileSync(filepath, 'utf-8');
      
      // Extract data
      const title = extractTitle(fileContent);
      const description = extractDescription(fileContent);
      const htmlContent = extractHtmlContent(fileContent);

      if (!title || !htmlContent) {
        console.log(`⚠️  Skipped (missing content): ${filename}`);
        failed++;
        continue;
      }

      // Generate new page
      const newContent = generateNewPage(title, description, htmlContent, filename);

      // Write back
      fs.writeFileSync(filepath, newContent, 'utf-8');
      converted++;
      console.log(`✅ Converted: ${filename}`);
    } catch (error) {
      console.error(`❌ Failed to convert ${filename}:`, error.message);
      failed++;
    }
  }

  console.log(`\n📊 Conversion complete: ${converted} converted, ${failed} failed`);
}

convertPages().catch(console.error);
