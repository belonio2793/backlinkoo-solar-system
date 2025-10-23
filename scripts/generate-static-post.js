import { readFile, writeFile, access } from 'node:fs/promises';
import { constants as fsConstants } from 'node:fs';
import path from 'node:path';

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) {
        args[key] = next;
        i++;
      } else {
        args[key] = 'true';
      }
    }
  }
  return args;
}

function sanitizeSlug(s) {
  return String(s)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 120);
}

function formatDate(d) {
  const date = d ? new Date(d) : new Date();
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

async function ensureExists(p) {
  try { await access(p, fsConstants.F_OK); return true; } catch { return false; }
}

async function main() {
  const args = parseArgs(process.argv);
  const domain = args.domain;
  const theme = args.theme || 'minimal';
  const title = args.title || 'Untitled';
  const publishedAt = formatDate(args.publishedAt);
  const content = args.content;
  const contentFile = args.contentFile;
  const rawSlug = args.slug || title;
  const slug = sanitizeSlug(rawSlug);

  if (!domain) {
    console.error('Error: --domain is required');
    process.exit(1);
  }
  if (!slug) {
    console.error('Error: could not derive a valid slug');
    process.exit(1);
  }

  const templatePath = path.join('themes', theme, 'post.html');
  if (!(await ensureExists(templatePath))) {
    console.error(`Error: theme template not found at ${templatePath}`);
    process.exit(1);
  }

  let contentHtml = '';
  if (contentFile) {
    try { contentHtml = await readFile(contentFile, 'utf8'); } catch (e) {
      console.error(`Error: failed to read --contentFile ${contentFile}:`, e.message);
      process.exit(1);
    }
  } else if (content) {
    contentHtml = content;
  } else {
    contentHtml = `<p>${title}</p>`;
  }

  const raw = await readFile(templatePath, 'utf8');
  const out = raw
    .replace(/\{\{\s*post_title\s*\}\}/g, title)
    .replace(/\{\{\s*domain\s*\}\}/g, domain)
    .replace(/\{\{\s*published_at\s*\}\}/g, publishedAt)
    .replace(/<!--POST_CONTENT-->/g, contentHtml)
    .replace(/\{\{\s*post_content\s*\}\}/g, contentHtml);

  const outPath = path.join('themes', theme, `${slug}.html`);
  await writeFile(outPath, out, 'utf8');
  console.log(JSON.stringify({ success: true, file: outPath, slug, title, domain, theme }));
}

main().catch((err) => {
  console.error('Failed to generate static post:', err);
  process.exit(1);
});
