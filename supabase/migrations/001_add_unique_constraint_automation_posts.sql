-- Add unique constraint on (domain_id, slug) to ensure posts are unique per domain
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relkind = 'i' AND c.relname = 'automation_posts_domain_id_slug_key'
  ) THEN
    ALTER TABLE public.automation_posts
    ADD CONSTRAINT automation_posts_domain_id_slug_key UNIQUE (domain_id, slug);
  END IF;
EXCEPTION WHEN duplicate_object THEN
  -- Constraint already exists, ignore
  RAISE NOTICE 'Constraint automation_posts_domain_id_slug_key already exists';
END$$;

-- Create unique index as a fallback if constraint creation above is skipped
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_automation_posts_domain_id_slug'
  ) THEN
    CREATE UNIQUE INDEX idx_automation_posts_domain_id_slug ON public.automation_posts (domain_id, slug);
  END IF;
END$$;
