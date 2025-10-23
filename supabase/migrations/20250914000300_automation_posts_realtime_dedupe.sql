-- Real-time duplicate detection/cleanup for automation_posts (per-domain)
-- Adds normalized/hash columns, indexes, BEFORE trigger to set norms, and AFTER trigger to auto-archive duplicates

DO $$ BEGIN
  -- Add columns if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='automation_posts' AND column_name='title_norm'
  ) THEN
    ALTER TABLE public.automation_posts ADD COLUMN title_norm text;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='automation_posts' AND column_name='content_norm'
  ) THEN
    ALTER TABLE public.automation_posts ADD COLUMN content_norm text;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='automation_posts' AND column_name='title_hash'
  ) THEN
    ALTER TABLE public.automation_posts ADD COLUMN title_hash text;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='automation_posts' AND column_name='content_hash'
  ) THEN
    ALTER TABLE public.automation_posts ADD COLUMN content_hash text;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='automation_posts' AND column_name='updated_at'
  ) THEN
    ALTER TABLE public.automation_posts ADD COLUMN updated_at timestamptz DEFAULT NOW();
  END IF;
END $$;

-- Helpers (idempotent)
CREATE OR REPLACE FUNCTION public.strip_tags(input text)
RETURNS text LANGUAGE sql IMMUTABLE AS $$
  SELECT regexp_replace(coalesce(input,''), '<[^>]+>', ' ', 'g');
$$;

CREATE OR REPLACE FUNCTION public.normalize_title(input text)
RETURNS text LANGUAGE sql IMMUTABLE AS $$
  SELECT trim(lower(
    regexp_replace(
      regexp_replace(coalesce(input,''), '[[:punct:]]+', ' ', 'g'),
      '\\s+', ' ', 'g'
    )
  ));
$$;

CREATE OR REPLACE FUNCTION public.normalize_content(input text)
RETURNS text LANGUAGE sql IMMUTABLE AS $$
  SELECT trim(lower(
    regexp_replace(
      regexp_replace(
        strip_tags(coalesce(input,'')),
        'https?://\\S+', ' ', 'gi'
      ),
      '\\s+', ' ', 'g'
    )
  ));
$$;

-- BEFORE trigger: set normalized fields and hashes
CREATE OR REPLACE FUNCTION public.automation_posts_set_norm()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.title_norm := public.normalize_title(NEW.title);
  NEW.content_norm := public.normalize_content(NEW.content);
  NEW.title_hash := md5(coalesce(NEW.title_norm,''));
  NEW.content_hash := md5(coalesce(NEW.content_norm,''));
  NEW.updated_at := NOW();
  RETURN NEW;
END; $$;

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_trigger t JOIN pg_class c ON c.oid=t.tgrelid
    WHERE c.relname='automation_posts' AND t.tgname='trg_automation_posts_set_norm') THEN
    DROP TRIGGER trg_automation_posts_set_norm ON public.automation_posts;
  END IF;
END $$;

CREATE TRIGGER trg_automation_posts_set_norm
BEFORE INSERT OR UPDATE ON public.automation_posts
FOR EACH ROW EXECUTE FUNCTION public.automation_posts_set_norm();

-- AFTER trigger: archive duplicates in real-time
CREATE OR REPLACE FUNCTION public.automation_posts_dedupe_realtime()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  existing RECORD;
  existing_is_better boolean;
  new_is_better boolean;
  existing_when timestamptz;
  new_when timestamptz;
BEGIN
  -- Find an existing duplicate within the same domain by title or content hash
  SELECT * INTO existing
  FROM public.automation_posts ap
  WHERE ap.domain_id = NEW.domain_id
    AND ap.id <> NEW.id
    AND (
      (NEW.title_hash IS NOT NULL AND ap.title_hash = NEW.title_hash) OR
      (NEW.content_hash IS NOT NULL AND ap.content_hash = NEW.content_hash)
    )
  ORDER BY (CASE WHEN lower(coalesce(ap.status,''))='published' THEN 0 ELSE 1 END),
           COALESCE(ap.published_at, ap.created_at)
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN NEW; -- no duplicates
  END IF;

  existing_when := COALESCE(existing.published_at, existing.created_at);
  new_when := COALESCE(NEW.published_at, NEW.created_at);

  existing_is_better := (lower(coalesce(existing.status,''))='published' AND lower(coalesce(NEW.status,''))<>'published')
                        OR (existing_when IS NOT NULL AND new_when IS NOT NULL AND existing_when <= new_when);
  new_is_better := NOT existing_is_better;

  IF new_is_better THEN
    -- Keep NEW, archive existing
    UPDATE public.automation_posts SET status='archived', updated_at=NOW() WHERE id = existing.id;
    RETURN NEW;
  ELSE
    -- Keep existing, archive NEW
    NEW.status := 'archived';
    RETURN NEW;
  END IF;
END; $$;

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_trigger t JOIN pg_class c ON c.oid=t.tgrelid
    WHERE c.relname='automation_posts' AND t.tgname='trg_automation_posts_dedupe_realtime') THEN
    DROP TRIGGER trg_automation_posts_dedupe_realtime ON public.automation_posts;
  END IF;
END $$;

CREATE TRIGGER trg_automation_posts_dedupe_realtime
AFTER INSERT ON public.automation_posts
FOR EACH ROW EXECUTE FUNCTION public.automation_posts_dedupe_realtime();

-- Indexes to support fast lookup
CREATE INDEX IF NOT EXISTS idx_automation_posts_domain_title_hash ON public.automation_posts(domain_id, title_hash);
CREATE INDEX IF NOT EXISTS idx_automation_posts_domain_content_hash ON public.automation_posts(domain_id, content_hash);

-- Backfill norms & hashes
UPDATE public.automation_posts ap
SET title_norm = public.normalize_title(ap.title),
    content_norm = public.normalize_content(ap.content),
    title_hash = md5(coalesce(public.normalize_title(ap.title),'')),
    content_hash = md5(coalesce(public.normalize_content(ap.content),''))
WHERE ap.title_hash IS NULL OR ap.content_hash IS NULL OR ap.title_norm IS NULL OR ap.content_norm IS NULL;
