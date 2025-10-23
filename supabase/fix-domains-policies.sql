-- Inspect existing policies/triggers related to public.domains
-- Run these queries first to review current state

-- 1) List policies for the domains table
SELECT polname, polcmd, polpermissive, polroles, polqual, polwithcheck
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'domains'
ORDER BY polname;

-- 2) Show triggers defined on public.domains
SELECT tgname, tgenabled, tgtype, tgfoid, pg_get_triggerdef(pg_trigger.oid) AS definition
FROM pg_trigger
WHERE tgrelid = 'public.domains'::regclass;

-- 3) Show functions that touch domains (basic)
SELECT proname, prosrc, proretset, provolatile
FROM pg_proc
WHERE proname ILIKE '%domain%' OR proname ILIKE 'update_updated_at%';

-- ====================================
-- Automated cleanup: remove duplicated/ambiguous policies
-- (This will DROP any policy on public.domains that matches common duplicate name patterns)
-- Review the list from the inspection queries before running this section.
DO $$
DECLARE r record;
BEGIN
  FOR r IN (
    SELECT polname FROM pg_policies
    WHERE schemaname='public' AND tablename='domains'
      AND (polname ~* '(users?.*domains)|(domains_.*)|(users_.*_domains)')
  ) LOOP
    RAISE NOTICE 'Dropping policy %', r.polname;
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.domains', r.polname);
  END LOOP;
END$$;

-- ====================================
-- Create canonical, minimal RLS policies for public.domains
-- These policies allow authenticated users to only select/insert/update/delete rows where user_id = auth.uid()
-- NOTE: If your client inserts do not provide user_id, the INSERT will fail the WITH CHECK.

-- Ensure RLS is enabled
ALTER TABLE public.domains ENABLE ROW LEVEL SECURITY;

-- SELECT
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='domains' AND polname='domains_select_own'
  ) THEN
    EXECUTE 'CREATE POLICY domains_select_own ON public.domains FOR SELECT USING (auth.uid() = user_id);';
  END IF;
END$$;

-- INSERT (require that auth.uid() equals the row's user_id)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='domains' AND polname='domains_insert_own'
  ) THEN
    EXECUTE 'CREATE POLICY domains_insert_own ON public.domains FOR INSERT WITH CHECK (auth.uid() = user_id);';
  END IF;
END$$;

-- UPDATE
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='domains' AND polname='domains_update_own'
  ) THEN
    EXECUTE 'CREATE POLICY domains_update_own ON public.domains FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);';
  END IF;
END$$;

-- DELETE
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='domains' AND polname='domains_delete_own'
  ) THEN
    EXECUTE 'CREATE POLICY domains_delete_own ON public.domains FOR DELETE USING (auth.uid() = user_id);';
  END IF;
END$$;

-- ====================================
-- Make sure user_id is NOT nullable if you rely on RLS checks (optional)
-- If you prefer to allow server/service inserts without user_id, do NOT make this NOT NULL.
-- ALTER TABLE public.domains ALTER COLUMN user_id SET NOT NULL;

-- ====================================
-- Helpful trigger to normalize domains on insert/update (keeps domain format consistent)
-- This trigger will NOT override an explicitly provided user_id.

CREATE OR REPLACE FUNCTION public.domains_set_defaults()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.domain IS NOT NULL THEN
    NEW.domain := lower(regexp_replace(regexp_replace(NEW.domain, '^https?://', ''), '^www\.', ''));
    NEW.domain := regexp_replace(NEW.domain, '/+$', '');
  END IF;

  IF NEW.user_id IS NULL THEN
    -- Preserve NULL if auth.uid() is not available (avoid assigning wrong owner)
    NEW.user_id := auth.uid();
  END IF;

  IF TG_OP = 'INSERT' THEN
    NEW.created_at := COALESCE(NEW.created_at, now());
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_domains_set_defaults ON public.domains;
CREATE TRIGGER trg_domains_set_defaults
BEFORE INSERT OR UPDATE ON public.domains
FOR EACH ROW EXECUTE FUNCTION public.domains_set_defaults();

-- ====================================
-- Grants (keeps previous grants but ensures authenticated can use table)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.domains TO authenticated;

-- ====================================
-- Quick verification queries (run after applying fixes)
-- 1) Try an insert as a user (in Supabase SQL editor you can simulate by using jwt claims or run from client)
-- Example (replace '00000000-0000-0000-0000-000000000000' with a real user id if testing via SQL):
-- INSERT INTO public.domains (domain, user_id) VALUES ('test-example.com', '00000000-0000-0000-0000-000000000000');

-- 2) List policies again to confirm canonical set
SELECT polname, polcmd, polpermissive, polroles, polqual, polwithcheck
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'domains'
ORDER BY polname;
