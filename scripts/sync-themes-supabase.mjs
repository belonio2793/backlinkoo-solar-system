import fs from 'fs/promises';
import path from 'path';
import process from 'process';
import { createClient } from '@supabase/supabase-js';

const LOCAL_THEMES_DIR = path.resolve(process.cwd(), 'themes');
const BUCKET = 'themes';

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const res = path.resolve(dir, e.name);
    if (e.isDirectory()) {
      files.push(...await walk(res));
    } else if (e.isFile()) {
      files.push(res);
    }
  }
  return files;
}

function getPathInBucket(filePath) {
  // produce path relative to LOCAL_THEMES_DIR without leading slash
  return path.relative(LOCAL_THEMES_DIR, filePath).replaceAll('\\', '/');
}

async function bufferFromBody(body) {
  // body may be a ReadableStream with arrayBuffer or Node stream
  if (!body) return null;
  if (typeof body.arrayBuffer === 'function') {
    const ab = await body.arrayBuffer();
    return Buffer.from(ab);
  }
  // fallback: if it's a Node stream
  if (body instanceof Buffer) return body;
  const chunks = [];
  for await (const chunk of body) chunks.push(chunk);
  return Buffer.concat(chunks);
}

async function main() {
  const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment');
    process.exit(2);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false }
  });

  // list local theme files
  const localFiles = await walk(LOCAL_THEMES_DIR);
  const changed = [];
  const uploaded = [];
  const skipped = [];

  for (const localFile of localFiles) {
    const rel = getPathInBucket(localFile);
    const localBuf = await fs.readFile(localFile);

    // try download remote
    const { data, error } = await supabase.storage.from(BUCKET).download(rel);
    if (error && error.status === 404) {
      // upload
      const up = await supabase.storage.from(BUCKET).upload(rel, localBuf, { upsert: true });
      if (up.error) {
        console.error('Upload failed for', rel, up.error.message || up.error);
      } else {
        uploaded.push(rel);
        console.log('Uploaded new file:', rel);
      }
      continue;
    }
    if (error) {
      console.error('Error downloading', rel, error.message || error);
      continue;
    }
    const remoteBuf = await bufferFromBody(data);
    if (!remoteBuf) {
      console.error('Unable to read remote content for', rel);
      continue;
    }
    if (!remoteBuf.equals(localBuf)) {
      // content differs, upload
      const up = await supabase.storage.from(BUCKET).upload(rel, localBuf, { upsert: true });
      if (up.error) {
        console.error('Upload failed for', rel, up.error.message || up.error);
      } else {
        changed.push(rel);
        console.log('Updated file:', rel);
      }
    } else {
      skipped.push(rel);
    }
  }

  console.log('--- Summary ---');
  console.log('Uploaded new files:', uploaded.length);
  console.log('Updated files:', changed.length);
  console.log('Unchanged (skipped):', skipped.length);
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
