import { mkdir, cp } from 'node:fs/promises';

async function main() {
  // Always copy themes into dist during postbuild so theme pages are available
  const shouldCopy = true;

  if (!shouldCopy) {
    console.log('Skipping themes copy (set COPY_THEMES=true to force).');
    return;
  }

  await mkdir('dist', { recursive: true });
  await cp('themes', 'dist/themes', { recursive: true });
  console.log('Copied themes -> dist/themes');
}

main().catch((e) => {
  console.error('Failed to copy themes:', e);
  process.exit(1);
});
