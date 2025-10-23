BEGIN;

-- 1) Ensure columns exist on domains
ALTER TABLE domains
  ADD COLUMN IF NOT EXISTS blog_theme_id uuid,
  ADD COLUMN IF NOT EXISTS blog_theme_template_key text;

-- 2) Ensure default theme exists (template_key = 'minimal')
INSERT INTO blog_themes (name, description, template_key, preview_url, created_at)
VALUES ('Minimal (default)', 'Default theme used when none set', 'minimal', NULL, now())
ON CONFLICT (template_key) DO NOTHING;

-- 3) Populate blog_theme_template_key from whichever source column exists (theme OR template_key OR keep existing)
DO $$
DECLARE
  has_theme_col boolean;
  has_template_key_col boolean;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = current_schema()
      AND table_name = 'domains'
      AND column_name = 'theme'
  ) INTO has_theme_col;

  SELECT EXISTS(
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = current_schema()
      AND table_name = 'domains'
      AND column_name = 'template_key'
  ) INTO has_template_key_col;

  IF has_theme_col THEN
    EXECUTE '
      UPDATE domains
      SET blog_theme_template_key = LOWER(COALESCE(NULLIF(theme, ''''), COALESCE(blog_theme_template_key, ''minimal'')))
      WHERE blog_theme_template_key IS NULL
    ';
  ELSIF has_template_key_col THEN
    EXECUTE '
      UPDATE domains
      SET blog_theme_template_key = LOWER(COALESCE(NULLIF(template_key, ''''), COALESCE(blog_theme_template_key, ''minimal'')))
      WHERE blog_theme_template_key IS NULL
    ';
  ELSE
    -- No source column available; ensure non-null default
    EXECUTE '
      UPDATE domains
      SET blog_theme_template_key = COALESCE(blog_theme_template_key, ''minimal'')
      WHERE blog_theme_template_key IS NULL
    ';
  END IF;
END
$$;

-- 4) Set blog_theme_id by matching template_key -> blog_themes.template_key
UPDATE domains d
SET blog_theme_id = bt.id
FROM blog_themes bt
WHERE d.blog_theme_id IS NULL
  AND bt.template_key = d.blog_theme_template_key;

-- 5) Any remaining domains without blog_theme_id -> assign default 'minimal'
WITH def AS (
  SELECT id FROM blog_themes WHERE template_key = 'minimal' LIMIT 1
)
UPDATE domains d
SET blog_theme_id = def.id
FROM def
WHERE d.blog_theme_id IS NULL;

-- 6) Add FK constraint if it doesn't already exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'domains_blog_theme_fk'
  ) THEN
    ALTER TABLE domains
      ADD CONSTRAINT domains_blog_theme_fk
      FOREIGN KEY (blog_theme_id) REFERENCES blog_themes(id) ON DELETE SET NULL;
  END IF;
END
$$;

-- 7) Ensure index exists for faster joins
CREATE INDEX IF NOT EXISTS idx_domains_blog_theme_id ON domains (blog_theme_id);

COMMIT;
