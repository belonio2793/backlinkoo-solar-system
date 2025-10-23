import { createClient } from '@supabase/supabase-js';

async function cleanupExpiredPosts(event, context) {
  try {
    // Initialize Supabase client
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('🧹 Starting scheduled cleanup of expired unclaimed posts...');

    // Sanitize any bad string values stored as 'null' before deleting
    try {
      const { error: blogSanErr } = await supabase.rpc('exec_sql', {
        query: `UPDATE blog_posts SET expires_at = NULL WHERE expires_at::text = 'null' OR expires_at::text = ''`
      });
      if (blogSanErr) console.warn('Sanitization (blog_posts) reported error:', blogSanErr);

      const { error: pubSanErr } = await supabase.rpc('exec_sql', {
        query: `UPDATE published_blog_posts SET expires_at = NULL WHERE expires_at::text = 'null' OR expires_at::text = ''`
      });
      if (pubSanErr) console.warn('Sanitization (published_blog_posts) reported error:', pubSanErr);
    } catch (sanErr) {
      console.warn('Timestamp sanitization failed in cleanup function (continuing):', sanErr?.message || sanErr);
    }

    // Delete expired posts where user_id is null (unclaimed)
    // Use server-side SQL to avoid client-side casting issues when some rows store bad string values like 'null'
    try {
      const deleteSql = `DELETE FROM blog_posts
        WHERE user_id IS NULL
          AND expires_at IS NOT NULL
          AND expires_at::text NOT IN ('null', '')
          AND expires_at < NOW()
        RETURNING *;`;

      const { data: deleted, error: deleteError } = await supabase.rpc('exec_sql', { query: deleteSql });

      if (deleteError) {
        console.error('❌ Cleanup deletion failed (rpc):', deleteError);
        return {
          statusCode: 500,
          body: JSON.stringify({
            success: false,
            error: 'Cleanup failed',
            details: deleteError.message || deleteError
          }),
        };
      }

      const deletedCount = Array.isArray(deleted) ? deleted.length : (deleted?.length || 0);
      console.log(`✅ Cleanup completed: ${deletedCount} expired posts deleted`);

      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          deleted: deletedCount,
          message: `Successfully cleaned up ${deletedCount} expired unclaimed posts`,
          timestamp: new Date().toISOString()
        }),
      };
    } catch (delErr) {
      console.error('❌ Cleanup deletion fatal error:', delErr);
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          error: 'Cleanup failed',
          details: delErr?.message || String(delErr)
        }),
      };
    }

  } catch (error) {
    console.error('❌ Fatal error during cleanup:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: 'Cleanup failed',
        details: error.message
      }),
    };
  }
}

// Export the cleanup function as a regular handler (no cron/schedule). This keeps the function available for manual invocation but removes automatic scheduling.
export const handler = cleanupExpiredPosts;
