-- Create campaign_urls table to store individual URLs per campaign
-- Ensures simpler CRUD and better UI performance than JSONB arrays

-- Extensions (for gen_random_uuid)
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;

-- Table
CREATE TABLE IF NOT EXISTS public.campaign_urls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url text NOT NULL CHECK (url ~* '^https?://'),
  platform text,
  status text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (campaign_id, url)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_campaign_urls_campaign_id ON public.campaign_urls (campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_urls_user_id ON public.campaign_urls (user_id);
CREATE INDEX IF NOT EXISTS idx_campaign_urls_created_at ON public.campaign_urls (created_at DESC);

-- Updated_at trigger (optional if function exists)
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE p.proname = 'trigger_set_timestamp' AND n.nspname = 'public'
  ) THEN
    CREATE TRIGGER set_timestamp_campaign_urls
    BEFORE UPDATE ON public.campaign_urls
    FOR EACH ROW
    EXECUTE FUNCTION public.trigger_set_timestamp();
  END IF;
END $$;

-- RLS
ALTER TABLE public.campaign_urls ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Own rows access" ON public.campaign_urls;
CREATE POLICY "Own rows access" ON public.campaign_urls
  FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Own rows insert" ON public.campaign_urls;
CREATE POLICY "Own rows insert" ON public.campaign_urls
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Own rows update" ON public.campaign_urls;
CREATE POLICY "Own rows update" ON public.campaign_urls
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Own rows delete" ON public.campaign_urls;
CREATE POLICY "Own rows delete" ON public.campaign_urls
  FOR DELETE
  USING (user_id = auth.uid());

-- Admin policies (allow admins to manage all rows)
DROP POLICY IF EXISTS "Admins manage all campaign_urls" ON public.campaign_urls;
CREATE POLICY "Admins manage all campaign_urls" ON public.campaign_urls
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid() AND p.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid() AND p.role = 'admin'
    )
  );

-- Grants (authenticated role uses policies)
GRANT ALL ON public.campaign_urls TO authenticated;
