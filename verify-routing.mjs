import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pagesDir = path.join(__dirname, 'src/pages');

// Simulate the routing logic from DynamicPageLoader
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

const testRoutes = [
  '/ab-testing-anchor-texts',
  '/affordable-link-building-services',
  '/zero-click-search-link-strategies',
  '/backlink-building-for-beginners',
];

console.log('Testing route resolution for sample pages:\n');

testRoutes.forEach(route => {
  const normalized = route.toLowerCase();
  const found = files.find(f => {
    const filePath = f.replace('.tsx', '').toLowerCase();
    return filePath === normalized.slice(1) || filePath === normalized;
  });
  
  console.log(route + ' -> ' + (found ? 'RESOLVED ✓ (' + found + ')' : 'NOT FOUND ✗'));
});

console.log('\nTotal pages available: ' + files.filter(f => f.includes('-')).length);
