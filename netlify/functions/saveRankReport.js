import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://dfhanacsmsvvkpunurnp.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const headersBase = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: headersBase, body: '' };
  }

  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers: headersBase,
      body: JSON.stringify({
        ok: true,
        status: 'ready',
        service: 'saveRankReport'
      })
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: headersBase,
      body: JSON.stringify({ ok: false, error: 'Method not allowed' })
    };
  }

  try {
    if (!supabaseServiceKey) {
      return {
        statusCode: 500,
        headers: headersBase,
        body: JSON.stringify({ ok: false, error: 'Service configuration error' })
      };
    }

    const rawBody = typeof event.body === 'string' ? event.body : '';
    let body = {};
    if (rawBody) {
      try {
        body = JSON.parse(rawBody);
      } catch (e) {
        return {
          statusCode: 400,
          headers: headersBase,
          body: JSON.stringify({ ok: false, error: 'Invalid JSON body' })
        };
      }
    }

    const { userId, url, keyword, rank, page, position, status, analysis } = body;

    // Validate required fields
    if (!userId || !url || !keyword) {
      return {
        statusCode: 400,
        headers: headersBase,
        body: JSON.stringify({
          ok: false,
          error: 'Missing required fields: userId, url, keyword'
        })
      };
    }

    // Initialize Supabase client with service role
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if user is premium
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('subscription_tier, role')
      .eq('user_id', userId)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Profile lookup error:', profileError);
      return {
        statusCode: 500,
        headers: headersBase,
        body: JSON.stringify({ ok: false, error: 'Failed to verify user status' })
      };
    }

    const isPremium = profile?.subscription_tier === 'premium' || profile?.subscription_tier === 'monthly';

    if (!isPremium) {
      return {
        statusCode: 403,
        headers: headersBase,
        body: JSON.stringify({
          ok: false,
          error: 'Premium subscription required to save rank reports',
          isPremium: false
        })
      };
    }

    // Save rank report for premium user
    const { data: insertedReport, error: saveError } = await supabase
      .from('rank_tracking_history')
      .insert({
        user_id: userId,
        url: url.trim(),
        keyword: keyword.trim(),
        rank: rank || null,
        page: page || null,
        position: position || null,
        status: status || 'pending',
        analysis: analysis || '',
        checked_at: new Date().toISOString()
      })
      .select()
      .single();

    if (saveError) {
      console.error('Save error:', saveError);
      return {
        statusCode: 500,
        headers: headersBase,
        body: JSON.stringify({
          ok: false,
          error: 'Failed to save ranking report',
          details: saveError.message
        })
      };
    }

    return {
      statusCode: 200,
      headers: headersBase,
      body: JSON.stringify({
        ok: true,
        data: insertedReport,
        message: 'Rank report saved successfully',
        savedAt: new Date().toISOString(),
        path: `/rank-tracker/premium/${userId}/${insertedReport.id}`
      })
    };
  } catch (error) {
    console.error('Error in saveRankReport:', error);
    return {
      statusCode: 500,
      headers: headersBase,
      body: JSON.stringify({
        ok: false,
        error: error?.message || 'Internal server error'
      })
    };
  }
}
