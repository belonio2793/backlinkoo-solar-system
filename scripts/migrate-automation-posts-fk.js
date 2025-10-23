import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ACCESS_TOKEN || '';

if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment');
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SERVICE_ROLE);

async function hasExecSql() {
  try {
    const { error } = await sb.rpc('exec_sql', { query: 'SELECT 1' });
    return !error;
  } catch {
    return false;
  }
}

async function run() {
  console.log('Applying automation_posts FK migration (ON DELETE SET NULL, nullable column)...');

  if (!(await hasExecSql())) {
    console.error('exec_sql function is not available on this database. Please run the exec_sql creation migration first or use Supabase SQL editor.');
    process.exit(2);
  }

  const statements = `
    -- Make column nullable
    ALTER TABLE public.automation_posts ALTER COLUMN automation_id DROP NOT NULL;

    -- Null out orphaned references before adding FK
    UPDATE public.automation_posts ap
    SET automation_id = NULL
    WHERE automation_id IS NOT NULL
      AND NOT EXISTS (
        SELECT 1 FROM public.automation_campaigns c WHERE c.id = ap.automation_id
      );

    -- Drop common FK constraint names if present
    ALTER TABLE public.automation_posts DROP CONSTRAINT IF EXISTS automation_posts_automation_id_fkey;
    ALTER TABLE public.automation_posts DROP CONSTRAINT IF EXISTS automation_posts_automation_id_fk;

    -- Recreate FK with ON DELETE SET NULL
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'automation_campaigns'
      ) THEN
        BEGIN
          ALTER TABLE public.automation_posts
          ADD CONSTRAINT automation_posts_automation_id_fk
          FOREIGN KEY (automation_id)
          REFERENCES public.automation_campaigns(id)
          ON DELETE SET NULL;
        EXCEPTION WHEN duplicate_object THEN
          NULL;
        END;
      END IF;
    END$$;
  `;

  const { data, error } = await sb.rpc('exec_sql', { query: statements });
  if (error) {
    console.error('Migration failed:', error.message || error);
    process.exit(1);
  }

  console.log('Migration result:', data || 'ok');
  console.log('✅ Migration applied successfully.');
}

run().catch((e) => {
  console.error('Unexpected error:', e?.message || e);
  process.exit(1);
});
