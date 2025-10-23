-- Connect Campaign Creation to Post Generation
-- This SQL sets up database triggers to invoke the Supabase Edge Function
-- that generates and publishes a blog post as soon as a campaign is created.
-- It supports both tables: public.automation (primary) and public.automation_campaigns (alternate).

-- Requirements:
-- 1) Supabase Edge Function "automation-post" deployed
-- 2) supabase/config.toml includes:
--    [functions.automation-post]
--    verify_jwt = false
-- 3) Either pg_net or http extension available (pg_net preferred)

-- Enable required extensions if available
DO $$ BEGIN
  BEGIN
    EXECUTE 'CREATE EXTENSION IF NOT EXISTS pg_net';
  EXCEPTION WHEN OTHERS THEN
    -- ignore if not available
    NULL;
  END;
  BEGIN
    EXECUTE 'CREATE EXTENSION IF NOT EXISTS http';
  EXCEPTION WHEN OTHERS THEN
    -- ignore if not available
    NULL;
  END;
END $$;

-- Helper: Post JSON to Edge Function using pg_net if available, otherwise http extension
CREATE OR REPLACE FUNCTION public._post_to_automation_edge(campaign_uuid uuid)
RETURNS void AS $$
DECLARE
  endpoint text := 'https://dfhanacsmsvvkpunurnp.supabase.co/functions/v1/automation-post';
  payload  text := json_build_object('campaign_id', campaign_uuid)::text;
BEGIN
  IF to_regproc('net.http_post') IS NOT NULL THEN
    PERFORM net.http_post(
      url := endpoint,
      headers := jsonb_build_object('Content-Type','application/json'),
      body := payload
    );
  ELSIF to_regproc('http_post') IS NOT NULL THEN
    PERFORM http_post(endpoint, payload);
  ELSE
    RAISE NOTICE 'No HTTP extension available to call Edge Function';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger function (shared)
CREATE OR REPLACE FUNCTION public.trigger_generate_post()
RETURNS trigger AS $$
BEGIN
  PERFORM public._post_to_automation_edge(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers on both possible campaign tables (idempotent)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'generate_post_on_insert'
  ) THEN
    EXECUTE 'CREATE TRIGGER generate_post_on_insert AFTER INSERT ON public.automation FOR EACH ROW EXECUTE FUNCTION public.trigger_generate_post()';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'generate_post_on_insert_alt'
  ) THEN
    EXECUTE 'CREATE TRIGGER generate_post_on_insert_alt AFTER INSERT ON public.automation_campaigns FOR EACH ROW EXECUTE FUNCTION public.trigger_generate_post()';
  END IF;
END $$;
