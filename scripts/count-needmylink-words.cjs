const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../src/data/needMyLinkContent.ts');
const source = fs.readFileSync(filePath, 'utf8');
const chunks = [];
const regex = /`([^`]*)`|"([^"\\]*(?:\\.[^"\\]*)*)"/g;
let match;
while ((match = regex.exec(source)) !== null) {
  const chunk = match[1] ?? match[2];
  if (!chunk) continue;
  chunks.push(chunk);
}

const totalWords = chunks
  .map((chunk) =>
    chunk
      .replace(/\\n/g, ' ')
      .replace(/[^A-Za-z0-9\s]+/g, ' ')
      .split(/\s+/)
      .filter(Boolean)
  )
  .reduce((sum, words) => sum + words.length, 0);

console.log(`Total counted words: ${totalWords}`);
