#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function walk(dir, files = []) {
  fs.readdirSync(dir).forEach((f) => {
    const fp = path.join(dir, f);
    if (fs.statSync(fp).isDirectory()) walk(fp, files);
    else files.push(fp);
  });
  return files;
}

const files = walk('src').filter((f) => f.match(/\.(tsx|ts|jsx|js)$/));
files.forEach((f) => {
  const s = fs.readFileSync(f, 'utf8');
  const m = s.match(/from\s+['\"]react['\"]/g) || [];
  if (m.length > 1) console.log(f + ': ' + m.length);
});
