import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PAGES_DIR = path.join(__dirname, 'src', 'pages');

async function fixCssImports() {
  console.log('Fixing CSS import errors in converted pages...');
  
  const files = fs.readdirSync(PAGES_DIR)
    .filter(f => f.endsWith('.tsx') && !f.startsWith('.'));
  
  let fixed = 0;
  let errors = 0;

  for (const filename of files) {
    const filepath = path.join(PAGES_DIR, filename);
    
    try {
      let content = fs.readFileSync(filepath, 'utf-8');
      
      // Check if file has the problematic CSS import pattern
      const cssImportRegex = /import\s+['"]@\/styles\/[^'"]+';\n/g;
      
      if (cssImportRegex.test(content)) {
        // Remove all CSS imports
        content = content.replace(cssImportRegex, '');
        
        fs.writeFileSync(filepath, content, 'utf-8');
        fixed++;
        console.log(`✅ Fixed: ${filename}`);
      }
    } catch (error) {
      console.error(`❌ Error processing ${filename}:`, error.message);
      errors++;
    }
  }

  console.log(`\n📊 CSS import fixes complete!`);
  console.log(`   ✅ Fixed: ${fixed}`);
  console.log(`   ❌ Errors: ${errors}`);
}

fixCssImports().catch(console.error);
