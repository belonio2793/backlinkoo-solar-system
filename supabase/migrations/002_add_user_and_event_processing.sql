-- Add user_id to simple_campaigns and processing columns to simple_campaign_events

alter table if exists public.simple_campaigns
  add column if not exists user_id uuid references auth.users(id) on delete set null;

alter table if exists public.simple_campaign_events
  add column if not exists processed boolean not null default false,
  add column if not exists processed_at timestamptz,
  add column if not exists result jsonb,
  add column if not exists user_id uuid references auth.users(id) on delete set null;

create index if not exists idx_simple_campaigns_user_id on public.simple_campaigns(user_id);
create index if not exists idx_simple_campaign_events_processed on public.simple_campaign_events(processed);
create index if not exists idx_simple_campaign_events_user_id on public.simple_campaign_events(user_id);
