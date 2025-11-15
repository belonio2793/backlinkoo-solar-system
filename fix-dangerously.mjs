import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pagesDir = path.join(__dirname, 'src/pages');

const files = fs.readdirSync(pagesDir).filter(f => {
  return f.endsWith('.tsx') && f.includes('-');
});

console.log('Fixing dangerouslySetInnerHTML in ' + files.length + ' files');

files.forEach(file => {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Fix dangerouslySetInnerHTML={<article>...} to dangerouslySetInnerHTML={{ __html: '...' }}
  // First, extract the HTML content between <article> tags
  const match = content.match(/dangerouslySetInnerHTML=<article>([\s\S]*?)<\/article>/);
  
  if (match) {
    const htmlContent = match[1];
    // Escape quotes in the HTML content
    const escapedHtml = htmlContent.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
    
    // Replace the broken syntax with proper React syntax
    content = content.replace(
      /dangerouslySetInnerHTML=<article>[\s\S]*?<\/article>/,
      'dangerouslySetInnerHTML={{ __html: "' + escapedHtml.replace(/"/g, '\\"') + '" }}'
    );
    
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log('Fixed: ' + file);
  }
});

console.log('Done!');
