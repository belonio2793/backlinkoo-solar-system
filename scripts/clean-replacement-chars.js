#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Directories to scan (relative to repo root)
const ROOT = process.cwd();
const includeDirs = [
  'src',
  'public',
  'netlify',
  'scripts',
  'pages',
  'themes',
  'supabase',
];

// File extensions to treat as text
const textExt = new Set(['.js', '.ts', '.jsx', '.tsx', '.json', '.html', '.css', '.md', '.mjs', '.mts', '.cts']);

function isBinary(filePath) {
  try {
    const buf = fs.readFileSync(filePath);
    for (let i = 0; i < Math.min(buf.length, 8000); i++) {
      if (buf[i] === 0) return true; // contains null byte -> binary
    }
    return false;
  } catch (e) {
    return true;
  }
}

function shouldProcess(file) {
  const ext = path.extname(file).toLowerCase();
  if (textExt.has(ext)) return true;
  // also process files without extension inside selected dirs (like Dockerfiles, Makefile)
  const base = path.basename(file);
  if (!ext && /^[A-Za-z0-9._-]+$/.test(base)) return true;
  return false;
}

function walk(dir, cb) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      walk(p, cb);
    } else if (ent.isFile()) {
      cb(p);
    }
  }
}

let totalFiles = 0;
let modifiedFiles = 0;
let totalReplacements = 0;

for (const rel of includeDirs) {
  const d = path.join(ROOT, rel);
  if (!fs.existsSync(d)) continue;
  walk(d, (file) => {
    totalFiles++;
    try {
      if (!shouldProcess(file)) return;
      if (isBinary(file)) return;
      let content = fs.readFileSync(file, 'utf8');
      if (!content.includes('\uFFFD') && !content.includes('')) return;
      const before = content;
      // Remove replacement character U+FFFD and the literal replacement glyph
      content = content.split('\uFFFD').join('');
      content = content.split('').join('');
      if (content !== before) {
        fs.writeFileSync(file, content, 'utf8');
        modifiedFiles++;
        const count = (before.length - content.length);
        totalReplacements += Math.max(1, Math.floor(count / 1));
        console.log(`Cleaned: ${file}`);
      }
    } catch (e) {
      console.error('Error processing', file, e.message || e);
    }
  });
}

console.log('\nScan complete');
console.log(`Files scanned (in selected dirs): ${totalFiles}`);
console.log(`Files modified: ${modifiedFiles}`);
console.log(`Estimated characters removed: ${totalReplacements}`);

if (modifiedFiles === 0) {
  console.log('No replacement characters found in scanned files.');
}
