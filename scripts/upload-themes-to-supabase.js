import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = process.env.SUPABASE_THEMES_BUCKET || 'themes';
const ROOT_DIR = process.env.THEMES_ROOT_DIR || './themes';
const MAKE_PUBLIC = String(process.env.SUPABASE_BUCKET_PUBLIC || 'true') === 'true';

if (!SUPABASE_URL) {
  console.error('Missing SUPABASE_URL or VITE_SUPABASE_URL environment variable.');
  process.exit(1);
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable. This is required to create buckets and upload files.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.html': return 'text/html; charset=utf-8';
    case '.css': return 'text/css; charset=utf-8';
    case '.js': return 'application/javascript; charset=utf-8';
    case '.json': return 'application/json; charset=utf-8';
    case '.svg': return 'image/svg+xml';
    case '.png': return 'image/png';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.webp': return 'image/webp';
    case '.gif': return 'image/gif';
    case '.txt': return 'text/plain; charset=utf-8';
    default: return 'application/octet-stream';
  }
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const res = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(res);
    return res;
  }));
  return files.flat();
}

async function ensureBucket(bucket, makePublic) {
  const { data: buckets, error: listErr } = await supabase.storage.listBuckets();
  if (listErr) throw listErr;
  const exists = buckets?.some((b) => b.name === bucket);
  if (!exists) {
    const { error: createErr } = await supabase.storage.createBucket(bucket, { public: makePublic });
    if (createErr) throw createErr;
    return;
  }
  // Ensure public flag matches request (best effort)
  const { error: updateErr } = await supabase.storage.updateBucket(bucket, { public: makePublic });
  if (updateErr) {
    // Non-fatal; continue uploading
    console.warn('Warning: could not update bucket public flag:', updateErr.message);
  }
}

async function uploadAll() {
  const absRoot = path.resolve(ROOT_DIR);
  const files = await walk(absRoot);
  await ensureBucket(BUCKET, MAKE_PUBLIC);

  let uploaded = 0;
  for (const filePath of files) {
    const rel = path.relative(absRoot, filePath);
    const key = rel.split(path.sep).join('/'); // POSIX style
    const contentType = getMimeType(filePath);
    const data = await fs.readFile(filePath);

    const { error } = await supabase.storage.from(BUCKET).upload(key, data, {
      contentType,
      cacheControl: '3600',
      upsert: true,
    });
    if (error) {
      console.error(`Failed to upload ${key}:`, error.message);
      process.exitCode = 1; // continue but mark failure
    } else {
      uploaded++;
    }
  }

  console.log(`Completed: ${uploaded}/${files.length} files uploaded to bucket "${BUCKET}" (public=${MAKE_PUBLIC}).`);
  if (MAKE_PUBLIC) {
    console.log('Public base URL: ', `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/`);
  }
}

uploadAll().catch((e) => {
  console.error('Upload failed:', e);
  process.exit(1);
});
