import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pagesDir = path.join(__dirname, 'src/pages');

const files = fs.readdirSync(pagesDir).filter(f => {
  return f.endsWith('.tsx') && f.includes('-');
});

console.log('Processing ' + files.length + ' files');
let fixedCount = 0;

files.forEach(file => {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  const original = content;
  
  // Fix all dangerouslySetInnerHTML patterns with HTML tags
  // Match: dangerouslySetInnerHTML=<tag>...</tag> -> dangerouslySetInnerHTML={{ __html: "..." }}
  content = content.replace(
    /dangerouslySetInnerHTML=<([^>]+)>([\s\S]*?)<\/\1>/g,
    (match, tag, htmlContent) => {
      // Escape special characters for JavaScript string
      const escaped = htmlContent
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\$/g, '\\$');
      return 'dangerouslySetInnerHTML={{ __html: "' + escaped + '" }}';
    }
  );
  
  // Also handle cases where the closing tag might be different or missing
  if (content.includes('dangerouslySetInnerHTML=<')) {
    // Fallback: find and fix remaining broken patterns
    content = content.replace(
      /dangerouslySetInnerHTML=<([^>]+)>/g,
      (match, content_part) => {
        // This is a workaround for malformed HTML
        const findClosing = content.indexOf('</' + content_part.split(/\s/)[0]);
        if (findClosing > -1) {
          return 'dangerouslySetInnerHTML={{ __html: \'';
        }
        return match;
      }
    );
  }
  
  if (original !== content) {
    fs.writeFileSync(filePath, content, 'utf-8');
    fixedCount++;
    console.log('Fixed: ' + file);
  }
});

console.log('Total files fixed: ' + fixedCount);
