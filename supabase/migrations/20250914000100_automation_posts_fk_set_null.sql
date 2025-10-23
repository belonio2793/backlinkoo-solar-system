-- Migration: Make automation_posts.automation_id nullable and set FK ON DELETE SET NULL
-- Created: 2025-09-14T00:01:00Z

DO $$
DECLARE
  conname text;
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema='public' AND table_name='automation_posts'
  ) THEN
    -- Allow NULLs on automation_posts.automation_id (noop if already nullable)
    BEGIN
      EXECUTE 'ALTER TABLE public.automation_posts ALTER COLUMN automation_id DROP NOT NULL';
    EXCEPTION WHEN undefined_column THEN
      NULL;
    END;

    -- Pre-clean orphaned references to avoid FK creation failure
    IF EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema='public' AND table_name='automation_campaigns'
    ) THEN
      EXECUTE $$
        UPDATE public.automation_posts ap
        SET automation_id = NULL
        WHERE automation_id IS NOT NULL
          AND NOT EXISTS (
            SELECT 1 FROM public.automation_campaigns c
            WHERE c.id = ap.automation_id
          )
      $$;
    END IF;

    -- Drop any existing FK constraints on automation_posts(automation_id)
    FOR conname IN
      SELECT c.conname
      FROM pg_constraint c
      JOIN pg_class t ON t.oid = c.conrelid
      WHERE t.relname = 'automation_posts'
        AND c.contype = 'f'
        AND (SELECT array_agg(attnum) FROM pg_attribute WHERE attrelid = t.oid AND attname = 'automation_id') @> c.conkey
    LOOP
      EXECUTE format('ALTER TABLE public.automation_posts DROP CONSTRAINT %I', conname);
    END LOOP;

    -- Recreate FK with ON DELETE SET NULL if campaigns table exists
    IF EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema='public' AND table_name='automation_campaigns'
    ) THEN
      BEGIN
        ALTER TABLE public.automation_posts
          ADD CONSTRAINT automation_posts_automation_id_fk
          FOREIGN KEY (automation_id)
          REFERENCES public.automation_campaigns(id)
          ON DELETE SET NULL;
      EXCEPTION WHEN duplicate_object THEN
        NULL; -- already present
      END;
    END IF;
  END IF;
END $$;
