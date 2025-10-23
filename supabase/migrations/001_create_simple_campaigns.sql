-- Supabase migration: create tables for simple campaigns (non-conflicting names)

-- Table: simple_campaigns
create table if not exists public.simple_campaigns (
  id uuid default gen_random_uuid() primary key,
  target_url text not null,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  started_at timestamptz,
  paused_at timestamptz
);

-- Table: simple_campaign_events
create table if not exists public.simple_campaign_events (
  id uuid default gen_random_uuid() primary key,
  campaign_id uuid references public.simple_campaigns(id) on delete cascade,
  event_type text not null,
  payload jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_simple_campaign_events_campaign_id on public.simple_campaign_events(campaign_id);
create index if not exists idx_simple_campaigns_created_at on public.simple_campaigns(created_at);
