#!/usr/bin/env bash
set -euo pipefail

if [ -z "${SUPABASE_URL-}" ] || [ -z "${SUPABASE_SERVICE_ROLE_KEY-}" ]; then
  echo "ERROR: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in your environment."
  echo "Example: SUPABASE_URL=https://xyz.supabase.co SUPABASE_SERVICE_ROLE_KEY=xxx bash $0"
  exit 1
fi

BUCKET="themes"
ROOT_DIR="themes"

echo "Uploading files from $ROOT_DIR to $SUPABASE_URL/storage/v1/object/$BUCKET/"

# Iterate files and upload via PUT (x-upsert to overwrite existing)
find "$ROOT_DIR" -type f -print0 | while IFS= read -r -d '' file; do
  rel_path="${file#$ROOT_DIR/}"
  dest_url="$SUPABASE_URL/storage/v1/object/$BUCKET/$rel_path"
  echo "Uploading: $rel_path"

  if curl --fail -s -X PUT "$dest_url" \
    -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
    -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
    -H "Content-Type: application/octet-stream" \
    -H "x-upsert: true" \
    --data-binary @"$file"; then
    echo "  ✅ $rel_path"
  else
    echo "  ❌ $rel_path failed"
  fi

done

echo "Finished uploading."
