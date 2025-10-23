BEGIN;

-- 1) Ensure minimal theme exists
INSERT INTO blog_themes (name, description, template_key, preview_url, created_at)
VALUES ('Minimal (default)', 'Default minimal theme', 'minimal', NULL, now())
ON CONFLICT (template_key) DO NOTHING;

-- 2) Add columns on domains and automation_posts if missing
ALTER TABLE domains
  ADD COLUMN IF NOT EXISTS blog_theme_id uuid,
  ADD COLUMN IF NOT EXISTS blog_theme_template_key text;

ALTER TABLE automation_posts
  ADD COLUMN IF NOT EXISTS blog_theme_id uuid;

-- 3) Backfill domains.blog_theme_template_key from available columns (theme OR template_key OR existing)
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
      SET blog_theme_template_key = LOWER(COALESCE(NULLIF(theme, ''''), NULLIF(template_key, ''''), blog_theme_template_key, ''minimal''))
      WHERE blog_theme_template_key IS NULL
    ';
  ELSIF has_template_key_col THEN
    EXECUTE '
      UPDATE domains
      SET blog_theme_template_key = LOWER(COALESCE(NULLIF(template_key, ''''), blog_theme_template_key, ''minimal''))
      WHERE blog_theme_template_key IS NULL
    ';
  ELSE
    EXECUTE '
      UPDATE domains
      SET blog_theme_template_key = COALESCE(blog_theme_template_key, ''minimal'')
      WHERE blog_theme_template_key IS NULL
    ';
  END IF;
END
$$;

-- 4) Ensure blog_theme_id on domains by matching template_key
UPDATE domains d
SET blog_theme_id = bt.id
FROM blog_themes bt
WHERE d.blog_theme_id IS NULL
  AND bt.template_key = d.blog_theme_template_key;

-- 5) Any remaining domains without blog_theme_id -> set to minimal theme id
WITH def AS (
  SELECT id FROM blog_themes WHERE template_key = 'minimal' LIMIT 1
)
UPDATE domains d
SET blog_theme_id = def.id
FROM def
WHERE d.blog_theme_id IS NULL;

-- 6) Backfill automation_posts.blog_theme_id from domains.blog_theme_id
UPDATE automation_posts ap
SET blog_theme_id = d.blog_theme_id
FROM domains d
WHERE ap.domain_id = d.id
  AND (ap.blog_theme_id IS NULL OR ap.blog_theme_id = '')
  AND d.blog_theme_id IS NOT NULL;

-- 7) Set defaults and indexes
ALTER TABLE domains ALTER COLUMN blog_theme_template_key SET DEFAULT 'minimal';
ALTER TABLE domains ALTER COLUMN blog_theme_id SET DEFAULT NULL;
ALTER TABLE automation_posts ALTER COLUMN blog_theme_id SET DEFAULT NULL;

-- 8) Add FK constraints if not exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'domains_blog_theme_fk') THEN
    ALTER TABLE domains ADD CONSTRAINT domains_blog_theme_fk FOREIGN KEY (blog_theme_id) REFERENCES blog_themes(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'automation_posts_blog_theme_fk') THEN
    ALTER TABLE automation_posts ADD CONSTRAINT automation_posts_blog_theme_fk FOREIGN KEY (blog_theme_id) REFERENCES blog_themes(id) ON DELETE SET NULL;
  END IF;
END
$$;

-- 9) Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_domains_blog_theme_id ON domains (blog_theme_id);
CREATE INDEX IF NOT EXISTS idx_domains_blog_theme_template_key ON domains (blog_theme_template_key);
CREATE INDEX IF NOT EXISTS idx_automation_posts_blog_theme_id ON automation_posts (blog_theme_id);

COMMIT;
