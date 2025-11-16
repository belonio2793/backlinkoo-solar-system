import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PAGES_DIR = path.join(__dirname, 'src', 'pages');

function convertPageNameToValidComponent(filename) {
  return filename
    .replace('.tsx', '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

function extractTitle(content) {
  // Try to find title in <title> tag
  let match = content.match(/<title>([^<]+)<\/title>/);
  if (match) return match[1];
  
  // Try to find in const title = "..."
  match = content.match(/const title = ['"](.*?)['"];/);
  if (match) return match[1];
  
  // Try to find first <h1>
  match = content.match(/<h1[^>]*>([^<]+)<\/h1>/);
  if (match) return match[1];
  
  return 'Untitled';
}

function extractDescription(content) {
  // Try to find in meta description
  let match = content.match(/meta name="description" content="([^"]*)"/);
  if (match) return match[1];
  
  // Try to find in const subtitle
  match = content.match(/const subtitle = ['"](.*?)['"];/);
  if (match) return match[1];
  
  return '';
}

function extractHtmlContent(fileContent) {
  // Try to find const htmlContent = `...`
  let match = fileContent.match(/const htmlContent = `([\s\S]*?)`;/);
  if (match) {
    return match[1].trim();
  }

  // Try to find content between <PageContainer> tags
  match = fileContent.match(/<PageContainer>([\s\S]*?)<\/PageContainer>/);
  if (match) {
    return match[1].trim();
  }

  // Try to find JSX return content
  match = fileContent.match(/return\s*\(\s*<>?([\s\S]*?)<\/?\s*>\s*\)/);
  if (match) {
    return match[1].trim();
  }

  return '';
}

function isBrokenPage(content) {
  return /from ['"]next\/(head|image|link)['"]|from ['"]styled-components['"]/.test(content);
}

function generateNewPage(title, description, htmlContent, filename) {
  const componentName = convertPageNameToValidComponent(filename);
  const styleName = filename.replace('.tsx', '');
  
  // Escape backticks and special characters in HTML
  const escapedHtml = htmlContent
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$');
  
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
    upsertMeta('description', \`${description}\`);
    upsertCanonical(typeof window !== 'undefined' ? window.location.href : '');
    injectJSONLD('${styleName}-schema', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: \`${title}\`,
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
            <div dangerouslySetInnerHTML={{ __html: \`${escapedHtml}\` }} />
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

async function fixAllPages() {
  console.log('Scanning for broken pages...');
  
  const files = fs.readdirSync(PAGES_DIR)
    .filter(f => f.endsWith('.tsx') && !f.startsWith('.'));
  
  let converted = 0;
  let failed = 0;
  const brokenFiles = [];

  // Find broken pages
  for (const filename of files) {
    const filepath = path.join(PAGES_DIR, filename);
    const content = fs.readFileSync(filepath, 'utf-8');
    
    if (isBrokenPage(content)) {
      brokenFiles.push(filename);
    }
  }

  console.log(`Found ${brokenFiles.length} broken pages. Converting...`);

  // Convert broken pages
  for (const filename of brokenFiles) {
    const filepath = path.join(PAGES_DIR, filename);
    
    try {
      const fileContent = fs.readFileSync(filepath, 'utf-8');
      
      const title = extractTitle(fileContent);
      const description = extractDescription(fileContent);
      const htmlContent = extractHtmlContent(fileContent);

      if (!title || !htmlContent) {
        console.log(`⚠️  Skipped (missing content): ${filename}`);
        failed++;
        continue;
      }

      const newContent = generateNewPage(title, description, htmlContent, filename);
      fs.writeFileSync(filepath, newContent, 'utf-8');
      converted++;
      console.log(`✅ Converted: ${filename}`);
    } catch (error) {
      console.error(`❌ Failed to convert ${filename}:`, error.message);
      failed++;
    }
  }

  console.log(`\n📊 Conversion complete!`);
  console.log(`   ✅ Converted: ${converted}`);
  console.log(`   ❌ Failed: ${failed}`);
}

fixAllPages().catch(console.error);
