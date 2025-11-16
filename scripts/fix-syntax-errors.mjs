import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PAGES_DIR = path.join(__dirname, '..', 'src', 'pages');

const pages = [
  'anchor-text-ratio-guide.tsx',
  'backlink-acquisition-funnel.tsx',
  'backlink-data-visualization.tsx',
  'backlink-decay-prevention.tsx',
];

function fixCanonicalFunction(content) {
  // Fix the malformed canonical function
  const pattern = /function upsertCanonical\(typeof[^}]*?\}/;
  const replacement = `function upsertCanonical(href: string) {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}`;

  return content.replace(pattern, replacement);
}

async function fix() {
  console.log('🔧 Fixing syntax errors...\n');
  
  let fixed = 0;

  for (const filename of pages) {
    const filepath = path.join(PAGES_DIR, filename);
    
    if (!fs.existsSync(filepath)) {
      continue;
    }

    try {
      let content = fs.readFileSync(filepath, 'utf-8');
      
      if (content.includes('function upsertCanonical(typeof')) {
        content = fixCanonicalFunction(content);
        fs.writeFileSync(filepath, content, 'utf-8');
        fixed++;
        console.log(`✅ Fixed: ${filename}`);
      }
    } catch (error) {
      console.error(`❌ Error processing ${filename}: ${error.message}`);
    }
  }

  console.log(`\n✨ Fixed ${fixed} files`);
}

fix().catch(console.error);
