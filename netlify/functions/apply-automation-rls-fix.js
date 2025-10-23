const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  try {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) return { statusCode: 500, headers, body: JSON.stringify({ error: 'Missing service credentials' }) };

    const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

    const statements = [
      "ALTER TABLE IF EXISTS public.automation_campaigns ENABLE ROW LEVEL SECURITY;",
      "DROP POLICY IF EXISTS \"Service role can manage campaigns\" ON public.automation_campaigns;",
      "DROP POLICY IF EXISTS \"Users can delete their own campaigns\" ON public.automation_campaigns;",
      "DROP POLICY IF EXISTS \"Users can delete own campaigns\" ON public.automation_campaigns;",
      // create service_role policy
      "CREATE POLICY IF NOT EXISTS \"Service role can manage campaigns\" ON public.automation_campaigns FOR ALL TO service_role USING (true);",
      // user policies
      "CREATE POLICY IF NOT EXISTS \"Users can view own campaigns\" ON public.automation_campaigns FOR SELECT TO authenticated USING (auth.uid() = user_id);",
      "CREATE POLICY IF NOT EXISTS \"Users can create own campaigns\" ON public.automation_campaigns FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);",
      "CREATE POLICY IF NOT EXISTS \"Users can update own campaigns\" ON public.automation_campaigns FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);",
      "CREATE POLICY IF NOT EXISTS \"Users can delete own campaigns\" ON public.automation_campaigns FOR DELETE TO authenticated USING (auth.uid() = user_id);"
    ];

    const results = [];
    for (const sql of statements) {
      try {
        const { data, error } = await supabase.rpc('exec_sql', { query: sql });
        if (error) {
          results.push({ sql, status: 'error', error: error.message || error });
        } else {
          results.push({ sql, status: 'ok', data });
        }
      } catch (e) {
        results.push({ sql, status: 'exception', error: e?.message || String(e) });
      }
    }

    return { statusCode: 200, headers, body: JSON.stringify({ success: true, results }) };
  } catch (err) {
    console.error('apply-automation-rls-fix error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err?.message || String(err) }) };
  }
};
