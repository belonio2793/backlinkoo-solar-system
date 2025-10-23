-- Backfill: Enable blog_enabled and ssl_enabled for all domains
-- Run this in Supabase SQL editor or via psql connected to your DB.

BEGIN;

-- 1) Add columns if missing with default TRUE
ALTER TABLE domains
  ADD COLUMN IF NOT EXISTS blog_enabled boolean DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS ssl_enabled boolean DEFAULT TRUE;

-- 2) Update all existing rows to TRUE (force enable)
UPDATE domains
SET blog_enabled = TRUE
WHERE blog_enabled IS DISTINCT FROM TRUE;

UPDATE domains
SET ssl_enabled = TRUE
WHERE ssl_enabled IS DISTINCT FROM TRUE;

-- 3) Ensure DEFAULT TRUE for future rows
ALTER TABLE domains
  ALTER COLUMN blog_enabled SET DEFAULT TRUE,
  ALTER COLUMN ssl_enabled SET DEFAULT TRUE;

-- 4) Optionally set NOT NULL if no NULLs remain (safe-guarded)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM domains WHERE blog_enabled IS NULL) THEN
    EXECUTE 'ALTER TABLE domains ALTER COLUMN blog_enabled SET NOT NULL';
  ELSE
    RAISE NOTICE 'Skipped setting NOT NULL for blog_enabled because NULL values remain.';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM domains WHERE ssl_enabled IS NULL) THEN
    EXECUTE 'ALTER TABLE domains ALTER COLUMN ssl_enabled SET NOT NULL';
  ELSE
    RAISE NOTICE 'Skipped setting NOT NULL for ssl_enabled because NULL values remain.';
  END IF;
END
$$;

COMMIT;
