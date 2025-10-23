/**
 * Set Domain Theme - Netlify Function
 * Configures a domain with a selected blog theme
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const AVAILABLE_THEMES = [
  { id: 'minimal', name: 'Minimal Clean', description: 'Clean and simple design' },
  { id: 'modern', name: 'Modern Business', description: 'Professional business layout' },
  { id: 'elegant', name: 'Elegant Editorial', description: 'Magazine-style layout' },
  { id: 'tech', name: 'Tech Focus', description: 'Technology-focused design' }
];

exports.handler = async (event, context) => {
  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: 'Method not allowed' }),
    };
  }

  try {
    console.log('🎨 Set domain theme function called');

    // Parse request body
    let requestData = {};
    if (event.body) {
      try {
        requestData = JSON.parse(event.body);
        console.log('📋 Request data:', { domainId: requestData.domainId, domain: requestData.domain, themeId: requestData.themeId });
      } catch (error) {
        console.error('❌ Invalid JSON in request body:', error);
        return {
          statusCode: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ success: false, error: 'Invalid JSON in request body' }),
        };
      }
    }

    const { domainId, domain, themeId } = requestData;

    if (!domainId || !domain || !themeId) {
      return {
        statusCode: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          success: false, 
          error: 'Domain ID, domain, and theme ID are required' 
        }),
      };
    }

    // Validate theme exists
    const selectedTheme = AVAILABLE_THEMES.find(theme => theme.id === themeId);
    if (!selectedTheme) {
      return {
        statusCode: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          success: false, 
          error: 'Invalid theme ID' 
        }),
      };
    }

    console.log(`🎨 Setting theme for domain ${domain}: ${selectedTheme.name}`);

    // Get Supabase credentials for database updates
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

    console.log('🔑 Environment check:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey,
      urlPreview: supabaseUrl ? supabaseUrl.substring(0, 20) + '...' : 'none'
    });

    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Missing Supabase configuration');
      return {
        statusCode: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: 'Database configuration not available'
        }),
      };
    }

    // Update domain with selected theme
    try {
      console.log('📊 Updating domain in database...');
      
      const updateData = {
        selected_theme: themeId,
        blog_theme_template_key: themeId,
        theme_name: selectedTheme.name,
        status: 'active',
        updated_at: new Date().toISOString()
      };

      console.log('📝 Update data:', updateData);

      const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || supabaseKey;
      const updateResponse = await fetch(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/domains?id=eq.${encodeURIComponent(domainId)}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'apikey': SERVICE_KEY,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(updateData)
      });

      console.log(`📊 Database update response status: ${updateResponse.status}`);

      if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        console.error('❌ Database update failed:', errorText);
        throw new Error(`Database update failed: ${errorText}`);
      }

      console.log(`✅ Successfully set theme ${selectedTheme.name} for domain ${domain}`);

      // Optionally create domain_blog_themes entry if table exists
      try {
        console.log('📋 Creating domain blog theme entry...');

        await fetch(`${supabaseUrl}/rest/v1/domain_blog_themes`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
            'Prefer': 'resolution=ignore-duplicates'
          },
          body: JSON.stringify({
            domain_id: domainId,
            theme_id: themeId,
            theme_name: selectedTheme.name,
            theme_config: {
              description: selectedTheme.description,
              enabled_for_campaigns: true
            },
            created_at: new Date().toISOString()
          })
        });

        console.log('✅ Domain blog theme entry created');
      } catch (themeError) {
        console.warn('⚠️ Could not create domain_blog_themes entry:', themeError);
        // Don't fail the main operation if this fails
      }

      // Copy theme files into a domain-specific folder in Supabase storage so the domain can serve them directly
      try {
        const { createClient } = require('@supabase/supabase-js');
        const pathLib = require('path');

        const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
        const BUCKET = process.env.SUPABASE_THEMES_BUCKET || 'themes';

        if (SERVICE_KEY && supabaseUrl) {
          console.log('📁 Copying theme files to domain folder in Supabase storage...');
          const sb = createClient(supabaseUrl, SERVICE_KEY, { auth: { persistSession: false } });

          const themePrefix = String(themeId).replace(/(^\/+|\/+$/g,'');
          const domainKey = String(domain).replace(/^https?:\/\//,'').replace(/^www\./,'').replace(/\/$/, '');

          async function listAll(prefix) {
            const out = [];
            let page = 0;
            const pageSize = 1000;
            while (true) {
              const { data, error } = await sb.storage.from(BUCKET).list(prefix, { limit: pageSize, offset: page * pageSize });
              if (error) throw error;
              if (!data || data.length === 0) break;
              out.push(...data);
              if (data.length < pageSize) break;
              page++;
            }
            return out;
          }

          const files = await listAll(themePrefix);
          console.log(`🔎 Found ${files.length} files under theme ${themePrefix}`);

          function getMimeType(fileName) {
            const ext = pathLib.extname(fileName).toLowerCase();
            switch (ext) {
              case '.html': return 'text/html; charset=utf-8';
              case '.css': return 'text/css; charset=utf-8';
              case '.js': return 'application/javascript; charset=utf-8';
              case '.json': return 'application/json; charset=utf-8';
              case '.svg': return 'image/svg+xml';
              case '.png': return 'image/png';
              case '.jpg':
              case '.jpeg': return 'image/jpeg';
              case '.webp': return 'image/webp';
              case '.gif': return 'image/gif';
              case '.txt': return 'text/plain; charset=utf-8';
              default: return 'application/octet-stream';
            }
          }

          for (const f of files) {
            try {
              const srcPath = `${themePrefix}/${f.name}`;
              const destPath = `${domainKey}/${f.name}`;
              console.log('Copying', srcPath, '->', destPath);

              const { data: downloadData, error: downloadErr } = await sb.storage.from(BUCKET).download(srcPath);
              if (downloadErr) { console.warn('Could not download', srcPath, downloadErr.message || downloadErr); continue; }

              const arrayBuffer = await downloadData.arrayBuffer();
              const buffer = Buffer.from(arrayBuffer);

              const contentType = getMimeType(f.name);
              const { error: uploadErr } = await sb.storage.from(BUCKET).upload(destPath, buffer, { contentType, upsert: true });
              if (uploadErr) { console.warn('Failed to upload', destPath, uploadErr.message || uploadErr); continue; }
            } catch (e) {
              console.warn('Error copying file for domain theme:', e && e.message);
            }
          }

          console.log('✅ Theme files copied to domain folder');
        } else {
          console.log('⚠️ Supabase service key not available; skipping theme file copy');
        }
      } catch (copyErr) {
        console.warn('⚠️ Failed to copy theme files to Supabase storage:', copyErr && copyErr.message);
      }

      const result = {
        success: true,
        message: `Successfully configured ${domain} with ${selectedTheme.name} theme. Domain is now ready for campaign blog generation.`,
        theme: selectedTheme,
        domain: domain
      };

      console.log('✅ Returning success response:', result);

      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify(result),
      };

    } catch (dbError) {
      console.error('❌ Database operation failed:', dbError);
      
      return {
        statusCode: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: dbError instanceof Error ? dbError.message : 'Database update failed'
        }),
      };
    }

  } catch (error) {
    console.error('❌ Theme selection error:', error);
    
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Theme selection failed'
      }),
    };
  }
};
