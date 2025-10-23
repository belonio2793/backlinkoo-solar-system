-- Restore domains.user_id FK safely (run in Supabase SQL editor)
-- 1) Inspect sample user_id values
SELECT user_id, count(*) FROM public.domains GROUP BY user_id ORDER BY count(*) DESC LIMIT 20;

-- 2) Ensure user_id column exists and is uuid-typed (attempt cast if necessary)
ALTER TABLE public.domains ADD COLUMN IF NOT EXISTS user_id uuid;

-- If user_id stored as text, attempt to cast valid-looking values to uuid safely
-- (this will set invalid values to NULL)
DO $$
BEGIN
  IF (SELECT pg_typeof(user_id) FROM public.domains LIMIT 1) = 'text' THEN
    ALTER TABLE public.domains ALTER COLUMN user_id TYPE uuid USING (CASE WHEN user_id ~* '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$' THEN user_id::uuid ELSE NULL END);
  END IF;
EXCEPTION WHEN undefined_function THEN
  -- pg_typeof may behave unexpectedly on empty tables; ignore
  NULL;
END$$;

-- 3) Recreate FK if missing
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'domains_user_id_fkey') THEN
    ALTER TABLE public.domains
      ADD CONSTRAINT domains_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END$$;

-- 4) Quick test (replace with a real user id when testing via SQL)
-- INSERT INTO public.domains (domain, user_id) VALUES ('test-restore.example', '00000000-0000-0000-0000-000000000000');

-- After running: re-run your policies/triggers script (supabase/fix-domains-policies.sql) if needed.
