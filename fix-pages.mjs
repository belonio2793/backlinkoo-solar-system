import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pagesDir = path.join(__dirname, 'src/pages');

// Convert kebab-case to PascalCase
function kebabToPascal(str) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

// Get all new backlink pages (those with kebab-case names)
const files = fs.readdirSync(pagesDir).filter(f => {
  return f.endsWith('.tsx') && f.includes('-') && !f.startsWith('.');
});

console.log('Found ' + files.length + ' files to fix');

files.forEach(file => {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  const kebabName = file.replace('.tsx', '');
  const pascalName = kebabToPascal(kebabName);
  
  // Remove Next.js imports
  content = content.replace(/import Head from 'next\/head';\n/g, '');
  content = content.replace(/import Image from 'next\/image';\n/g, '');
  content = content.replace(/import Link from 'next\/link';\n/g, "import { Link } from 'react-router-dom';\n");
  content = content.replace(/import styled from 'styled-components';\n/g, '');
  
  // Remove styled-components styled div definition
  content = content.replace(/const PageContainer = styled\.div`[\s\S]*?`;\n\n/g, '');
  
  // Replace PageContainer with tailwind div
  content = content.replace(/<PageContainer>/g, '<div className="max-w-4xl mx-auto px-5 py-8 font-sans leading-relaxed text-gray-800">');
  content = content.replace(/<\/PageContainer>/g, '</div>');
  
  // Fix component name (convert from kebab-Page to PascalCase)
  content = content.replace('const ' + kebabName + 'Page:', 'const ' + pascalName + ':');
  
  // Remove Head component and its contents
  content = content.replace(/<Head>[\s\S]*?<\/Head>\n*/g, '');
  
  // Replace Link href with Link to
  content = content.replace(/<Link href=/g, '<Link to=');
  
  // Fix the export
  content = content.replace('export default ' + kebabName + 'Page;', 'export default ' + pascalName + ';');
  
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log('Fixed: ' + file);
});

console.log('All files fixed!');
