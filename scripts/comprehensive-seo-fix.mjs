import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PAGES_DIR = path.join(__dirname, '..', 'src', 'pages');

function regeneratePageTemplate(filename, content) {
  const componentName = filename
    .replace('.tsx', '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  const slug = filename.replace('.tsx', '');

  // Extract the htmlContent (article content)
  let htmlContent = '';
  const htmlMatch = content.match(/dangerouslySetInnerHTML=\{\{\s*__html:\s*`([\s\S]*?)`\s*\}\}/);
  if (htmlMatch) {
    htmlContent = htmlMatch[1].trim();
  }

  // Extract the description from upsertMeta
  let description = '';
  const descMatch = content.match(/upsertMeta\('description',\s*`([^`]*)`/);
  if (descMatch) {
    description = descMatch[1];
  }

  // Extract headline from JSON-LD
  let headline = '';
  const headlineMatch = content.match(/headline:\s*`([^`]*)`/);
  if (headlineMatch) {
    headline = headlineMatch[1];
  }

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
    upsertMeta('description', \`${description}\`);
    upsertCanonical(typeof window !== 'undefined' ? window.location.href : 'https://backlinkoo.com/${slug}');
    injectJSONLD('${slug}-schema', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: \`${headline}\`,
      description: \`${description}\`,
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
}`;
}

async function fixAllPages() {
  console.log('🔧 Fixing syntax errors and ensuring proper SEO...\n');

  const files = fs.readdirSync(PAGES_DIR)
    .filter(f => f.endsWith('.tsx') && f.match(/^(anchor-text|backlink|link-building|dofollow|link-gap|link-insertion|link-prospecting|link-reclamation|link-velocity|referral|unlinked)/));

  let fixed = 0;

  for (const filename of files) {
    const filepath = path.join(PAGES_DIR, filename);

    try {
      const content = fs.readFileSync(filepath, 'utf-8');

      // Check if file has the malformed canonical function
      if (content.includes('function upsertCanonical(typeof')) {
        const regenerated = regeneratePageTemplate(filename, content);
        fs.writeFileSync(filepath, regenerated, 'utf-8');
        fixed++;
        console.log(`✅ Fixed: ${filename}`);
      }
    } catch (error) {
      console.error(`❌ Error processing ${filename}: ${error.message}`);
    }
  }

  console.log(`\n✨ Fixed ${fixed} pages with syntax errors`);
}

fixAllPages().catch(console.error);
