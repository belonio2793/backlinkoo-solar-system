-- Create tables for rank tracker jobs and results

create table if not exists public.rank_jobs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  url text not null,
  keyword text not null,
  status text not null default 'active', -- active, paused, archived
  created_at timestamptz not null default now(),
  last_run_at timestamptz,
  paused_at timestamptz,
  metadata jsonb
);

create table if not exists public.rank_results (
  id uuid default gen_random_uuid() primary key,
  job_id uuid references public.rank_jobs(id) on delete cascade,
  run_at timestamptz not null default now(),
  page integer,
  position integer,
  rank integer, -- 1..100 computed
  raw_response jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_rank_jobs_user_id on public.rank_jobs(user_id);
create index if not exists idx_rank_jobs_status_last_run on public.rank_jobs(status, last_run_at);
create index if not exists idx_rank_results_job_id on public.rank_results(job_id);
