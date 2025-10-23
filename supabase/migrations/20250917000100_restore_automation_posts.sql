-- Idempotent restoration of automation_posts table, constraints, indexes, triggers, and RLS
-- Safe to run multiple times

create extension if not exists pgcrypto;

-- 1) Base table
create table if not exists public.automation_posts (
  id uuid primary key default gen_random_uuid(),
  automation_id uuid null,
  domain_id uuid null,
  user_id uuid not null references auth.users(id) on delete cascade,
  slug text not null,
  title text not null,
  content text not null,
  url text,
  status text not null default 'published' check (status in ('draft','published','archived','error')),
  blog_theme_id uuid null,
  blog_theme text,
  keywords text[] not null default '{}',
  anchor_texts text[] not null default '{}',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) Add any missing columns (defensive)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema='public' AND table_name='automation_posts' AND column_name='published_at'
  ) THEN
    EXECUTE 'ALTER TABLE public.automation_posts ADD COLUMN published_at timestamptz';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema='public' AND table_name='automation_posts' AND column_name='blog_theme_id'
  ) THEN
    EXECUTE 'ALTER TABLE public.automation_posts ADD COLUMN blog_theme_id uuid';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema='public' AND table_name='automation_posts' AND column_name='blog_theme'
  ) THEN
    EXECUTE 'ALTER TABLE public.automation_posts ADD COLUMN blog_theme text';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema='public' AND table_name='automation_posts' AND column_name='keywords'
  ) THEN
    EXECUTE 'ALTER TABLE public.automation_posts ADD COLUMN keywords text[] NOT NULL DEFAULT ''{}''';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema='public' AND table_name='automation_posts' AND column_name='anchor_texts'
  ) THEN
    EXECUTE 'ALTER TABLE public.automation_posts ADD COLUMN anchor_texts text[] NOT NULL DEFAULT ''{}''';
  END IF;

  -- Optional FKs only when referenced tables exist (avoids errors)
  IF EXISTS (
    SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='automation_campaigns'
  ) THEN
    EXECUTE 'ALTER TABLE public.automation_posts DROP CONSTRAINT IF EXISTS automation_posts_automation_id_fk';
    EXECUTE 'ALTER TABLE public.automation_posts ADD CONSTRAINT automation_posts_automation_id_fk
             FOREIGN KEY (automation_id) REFERENCES public.automation_campaigns(id) ON DELETE SET NULL';
  END IF;
  IF EXISTS (
    SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='domains'
  ) THEN
    EXECUTE 'ALTER TABLE public.automation_posts DROP CONSTRAINT IF EXISTS automation_posts_domain_id_fk';
    EXECUTE 'ALTER TABLE public.automation_posts ADD CONSTRAINT automation_posts_domain_id_fk
             FOREIGN KEY (domain_id) REFERENCES public.domains(id) ON DELETE SET NULL';
  END IF;
END$$;

-- 3) Indexes
CREATE UNIQUE INDEX IF NOT EXISTS ux_automation_posts_domain_slug ON public.automation_posts(domain_id, slug);
CREATE INDEX IF NOT EXISTS idx_automation_posts_automation_id ON public.automation_posts(automation_id);
CREATE INDEX IF NOT EXISTS idx_automation_posts_domain_id ON public.automation_posts(domain_id);
CREATE INDEX IF NOT EXISTS idx_automation_posts_user_id ON public.automation_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_automation_posts_published_at ON public.automation_posts(published_at DESC);

-- 4) Timestamps trigger
CREATE OR REPLACE FUNCTION public.trg_automation_posts_timestamps()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.status = 'published' AND NEW.published_at IS NULL THEN NEW.published_at := NOW(); END IF;
    NEW.created_at := COALESCE(NEW.created_at, NOW());
    NEW.updated_at := NOW();
  ELSE
    IF NEW.status = 'published' AND NEW.published_at IS NULL THEN NEW.published_at := NOW(); END IF;
    NEW.updated_at := NOW();
  END IF;
  RETURN NEW;
END$$;

DROP TRIGGER IF EXISTS trg_automation_posts_ts ON public.automation_posts;
CREATE TRIGGER trg_automation_posts_ts
BEFORE INSERT OR UPDATE ON public.automation_posts
FOR EACH ROW EXECUTE FUNCTION public.trg_automation_posts_timestamps();

-- 5) RLS policies
ALTER TABLE public.automation_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS ap_select ON public.automation_posts;
DROP POLICY IF EXISTS ap_insert ON public.automation_posts;
DROP POLICY IF EXISTS ap_update ON public.automation_posts;
DROP POLICY IF EXISTS ap_delete ON public.automation_posts;

CREATE POLICY ap_select ON public.automation_posts
FOR SELECT USING (
  user_id = auth.uid()
  OR (automation_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.automation_campaigns c WHERE c.id = automation_id AND c.user_id = auth.uid()
     ))
  OR (domain_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.domains d WHERE d.id = domain_id AND d.user_id = auth.uid()
     ))
);

CREATE POLICY ap_insert ON public.automation_posts
FOR INSERT WITH CHECK (
  user_id = auth.uid()
  AND (
    (automation_id IS NULL OR EXISTS (
       SELECT 1 FROM public.automation_campaigns c WHERE c.id = automation_id AND c.user_id = auth.uid()
    ))
    AND (domain_id IS NULL OR EXISTS (
       SELECT 1 FROM public.domains d WHERE d.id = domain_id AND d.user_id = auth.uid()
    ))
  )
);

CREATE POLICY ap_update ON public.automation_posts
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY ap_delete ON public.automation_posts
FOR DELETE USING (user_id = auth.uid());
