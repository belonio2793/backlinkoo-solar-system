const { createClient } = require('@supabase/supabase-js');

/**
 * Blog Post Server - Serves individual blog posts for domains
 * Handles URLs like leadpages.org/blog/post-slug
 */

// Initialize Supabase with correct server-side env vars (no VITE_* needed at runtime)
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
  || process.env.SUPABASE_ANON_KEY
  || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
  || process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Supabase configuration missing in function env', { hasUrl: !!SUPABASE_URL, hasKey: !!SUPABASE_KEY });
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });

function generatePostHTML(domain, post) {
  const siteName = domain.replace('.org', '').replace('.com', '');
  const siteTitle = siteName.charAt(0).toUpperCase() + siteName.slice(1);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${post.title} | ${siteTitle}</title>
    <meta name="description" content="${post.excerpt}">
    
    <!-- SEO Meta Tags -->
    <meta property="og:title" content="${post.title}">
    <meta property="og:description" content="${post.excerpt}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="https://${domain}/blog/${post.slug}">
    
    <!-- Keywords -->
    ${post.keywords ? `<meta name="keywords" content="${post.keywords.join(', ')}">` : ''}
    
    <!-- Canonical URL -->
    <link rel="canonical" href="https://${domain}/blog/${post.slug}">
    
    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <style>
        .beautiful-prose {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        
        .hero-gradient {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .prose-content h1 {
            font-size: 2.5rem;
            font-weight: 800;
            color: #1f2937;
            margin-bottom: 2rem;
            line-height: 1.2;
        }
        
        .prose-content h2 {
            font-size: 2rem;
            font-weight: 700;
            color: #1f2937;
            margin-top: 3rem;
            margin-bottom: 1.5rem;
        }
        
        .prose-content h3 {
            font-size: 1.5rem;
            font-weight: 600;
            color: #1f2937;
            margin-top: 2rem;
            margin-bottom: 1rem;
        }
        
        .prose-content p {
            font-size: 1.125rem;
            line-height: 1.7;
            color: #4b5563;
            margin-bottom: 1.5rem;
        }
        
        .prose-content ul, .prose-content ol {
            margin: 1.5rem 0;
            padding-left: 1.5rem;
        }
        
        .prose-content li {
            font-size: 1.125rem;
            line-height: 1.7;
            color: #4b5563;
            margin-bottom: 0.5rem;
        }
        
        .prose-content a {
            color: #3b82f6;
            text-decoration: underline;
        }
        
        .prose-content a:hover {
            color: #1d4ed8;
        }
        
        .breadcrumb {
            font-size: 0.875rem;
            color: #6b7280;
        }
        
        .breadcrumb a {
            color: #3b82f6;
            text-decoration: none;
        }
        
        .breadcrumb a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Header -->
    <header class="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div class="container mx-auto px-4 py-3 max-w-5xl flex items-center justify-between">
        <div class="flex items-center gap-3 cursor-pointer" onclick="window.location='/'">
          <h1 class="text-lg font-semibold">Backlink</h1>
        </div>
        <div class="hidden md:flex justify-center flex-1">
          <button onclick="window.location='/pricing'" aria-label="Premium $29/mo" class="group relative flex items-center gap-2 px-3.5 py-1.5 rounded-full overflow-hidden text-white text-xs font-bold ring-1 ring-cyan-400/30 bg-[radial-gradient(120%_120%_at_0%_0%,rgba(0,255,255,0.12),transparent_40%),radial-gradient(120%_120%_at_100%_0%,rgba(255,0,128,0.10),transparent_40%),linear-gradient(90deg,#0b0f1a,#05060a,#0b0f1a)] hover:ring-cyan-300/50 transition-all">
            <svg class="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
            <span class="hidden">Premium Plan only $29 a month during special promotion, prices are subject to change to $299.</span>
            <span class="">Premium $29/mo</span>
            <span aria-hidden="true" class="hidden ml-2 px-2 py-0.5 rounded-full bg-white/15 text-[10px] font-extrabold tracking-wide">Limited Time</span>
          </button>
        </div>
        <div class="flex items-center gap-2">
          <a href="/blog" class="text-sm text-gray-600 hover:text-gray-900">Blog</a>
        </div>
      </div>
    </header>

    <!-- Breadcrumb -->
    <div class="container mx-auto px-6 py-2">
        <nav class="breadcrumb">
            <a href="/">Home</a>
            <span class="mx-2">›</span>
            <a href="/blog">Blog</a>
            <span class="mx-2">›</span>
            <span class="text-gray-900">${post.title}</span>
        </nav>
    </div>

    <!-- Main Content -->
    <main class="container mx-auto px-6 py-4">
        <article class="max-w-4xl mx-auto">
            <!-- Article Header -->
            <header class="mb-6">
                <h1 class="beautiful-prose text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
                    ${post.title}
                </h1>
                
                <div class="flex items-center gap-6 text-gray-600 mb-6">
                    <span>Published ${new Date(post.published_at || post.created_at).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}</span>
                    <span>•</span>
                    <span>5 min read</span>
                </div>
                
                ${post.excerpt ? `
                <div class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                    <p class="beautiful-prose text-lg text-blue-900 leading-relaxed">
                        ${post.excerpt}
                    </p>
                </div>
                ` : ''}
            </header>

            <!-- Article Content -->
            <div class="prose-content bg-white rounded-2xl shadow-lg p-6 mb-8">
                ${post.content}
            </div>

            <!-- Article Footer -->
            <footer class="bg-white rounded-2xl shadow-lg p-6">
                ${post.keywords && post.keywords.length > 0 ? `
                <div class="mb-6">
                    <h3 class="beautiful-prose text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                    <div class="flex flex-wrap gap-2">
                        ${post.keywords.map(keyword => `
                            <span class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                                ${keyword}
                            </span>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
                
                <div class="border-t pt-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="beautiful-prose text-sm text-gray-600">
                                Found this article helpful? Share it with others!
                            </p>
                        </div>
                        <div class="flex gap-3">
                            <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://${domain}/blog/${post.slug}`)}" 
                               target="_blank" 
                               class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                                Share on Twitter
                            </a>
                            <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://${domain}/blog/${post.slug}`)}" 
                               target="_blank" 
                               class="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                                Share on LinkedIn
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </article>
    </main>

    <!-- Related Articles Section -->
    <section class="container mx-auto px-6 py-8">
        <div class="max-w-4xl mx-auto">
            <h2 class="beautiful-prose text-3xl font-bold text-gray-900 mb-8 text-center">
                More Articles
            </h2>
            <div class="text-center">
                <a href="/" 
                   class="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    Browse All Articles
                </a>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-12 mt-16">
        <div class="container mx-auto px-6 text-center">
            <p class="beautiful-prose text-gray-300">
                © ${new Date().getFullYear()} ${siteTitle}. All rights reserved.
            </p>
            <p class="beautiful-prose text-gray-400 mt-2 text-sm">
                Providing expert insights and resources for digital marketing success.
            </p>
        </div>
    </footer>
</body>
</html>`;
}

function generate404HTML(domain) {
  const siteName = domain.replace('.org', '').replace('.com', '');
  const siteTitle = siteName.charAt(0).toUpperCase() + siteName.slice(1);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Article Not Found | ${siteTitle}</title>
    <meta name="robots" content="noindex">
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
  <!-- Site Header with Promotional Banner -->
  <header class="border-b border-gray-200 bg-white/80 sticky top-0 z-50">
    <div class="container mx-auto px-4 py-3 max-w-5xl flex items-center justify-between">
      <div class="flex items-center gap-3 cursor-pointer" onclick="window.location='/'">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-primary"><path d="M12 2c.6 0 1 .4 1 1v18c0 .6-.4 1-1 1s-1-.4-1-1V3c0-.6.4-1 1-1z" fill="currentColor"/></svg>
        <h1 class="text-lg font-semibold">Backlink</h1>
      </div>
      <div class="hidden md:flex justify-center flex-1">
        <button onclick="window.location='/pricing'" aria-label="Premium $29/mo" class="group relative flex items-center gap-2 px-3.5 py-1.5 rounded-full overflow-hidden text-white text-xs font-bold ring-1 ring-cyan-400/30 bg-gradient-to-r from-slate-800 to-slate-900 hover:ring-cyan-300/50 transition-all">
          <svg class="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="currentColor"/></svg>
          <span class="hidden">Premium Plan only $29 a month during special promotion, prices are subject to change to $299.</span>
          <span class="">Premium $29/mo</span>
          <span aria-hidden="true" class="hidden ml-2 px-2 py-0.5 rounded-full bg-white/15 text-[10px] font-extrabold tracking-wide">Limited Time</span>
        </button>
      </div>
      <div class="flex items-center gap-2">
        <a href="/blog" class="text-sm text-gray-600 hover:text-gray-900">Blog</a>
      </div>
    </div>
  </header>

  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center max-w-md mx-auto px-6">
      <h1 class="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <h2 class="text-2xl font-semibold text-gray-700 mb-4">Article Not Found</h2>
      <p class="text-gray-600 mb-8">
        The article you're looking for doesn't exist or has been moved.
      </p>
      <a href="/"
         class="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
          ← Back to Home
      </a>
    </div>
  </div>
</body>
</html>`;
}

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'text/html',
    'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      return {
        statusCode: 500,
        headers,
        body: '<html><body><h1>Service configuration error</h1><p>Supabase environment variables are not set for this function.</p></body></html>'
      };
    }

    // Get the domain and slug
    const requestDomain = event.headers.host || 'leadpages.org';
    const slug = event.queryStringParameters?.slug || 
                 event.path?.split('/blog/')[1] || 
                 '';

    console.log('📝 Processing blog post request:', { domain: requestDomain, slug });

    if (!slug) {
      // Redirect to home if no slug provided
      return {
        statusCode: 302,
        headers: {
          ...headers,
          'Location': `https://${requestDomain}/`
        },
        body: ''
      };
    }

    // Try to fetch the blog post
    let post = null;
    
    try {
      // First try domain-scoped posts (domain_blog_posts)
      let domainData = null;
      try {
        const { data } = await supabase
          .from('domains')
          .select('*')
          .or(`domain.eq.${requestDomain},domain.eq.www.${requestDomain}`)
          .limit(1)
          .maybeSingle();
        domainData = data || null;
      } catch (e) {
        domainData = null;
      }

      if (domainData) {
        try {
          const { data: postData } = await supabase
            .from('domain_blog_posts')
            .select('*')
            .eq('domain_id', domainData.id)
            .eq('slug', slug)
            .eq('status', 'published')
            .maybeSingle();

          if (postData) {
            post = postData;
          }
        } catch (e) {
          // ignore and continue to other tables
        }
      }

      // If not found yet, try the primary blog_posts table
      if (!post) {
        try {
          const { data: postData } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('slug', slug)
            .eq('status', 'published')
            .maybeSingle();

          if (postData) post = postData;
        } catch (e) {
          // ignore
        }
      }

      // Try published_blog_posts as another possible location
      if (!post) {
        try {
          const { data: postData } = await supabase
            .from('published_blog_posts')
            .select('*')
            .eq('slug', slug)
            .eq('status', 'published')
            .maybeSingle();

          if (postData) post = postData;
        } catch (e) {
          // ignore
        }
      }

      // Fallback: automation_posts scoped by domain id
      if (!post) {
        try {
          let domainId = domainData ? domainData.id : null;

          if (!domainId) {
            const { data: domainRows } = await supabase
              .from('domains')
              .select('id')
              .or(`domain.eq.${requestDomain},domain.eq.www.${requestDomain}`)
              .limit(1);

            domainId = domainRows && domainRows[0] ? domainRows[0].id : null;
          }

          if (domainId) {
            const { data: postData } = await supabase
              .from('automation_posts')
              .select('*')
              .eq('domain_id', domainId)
              .eq('slug', slug)
              .eq('status', 'published')
              .maybeSingle();

            if (postData) {
              // Map automation_posts to expected shape
              post = {
                id: postData.id,
                slug: postData.slug,
                title: postData.title || '',
                content: postData.content || '',
                status: postData.status || 'published',
                created_at: postData.created_at,
                updated_at: postData.published_at || postData.created_at,
                user_id: postData.user_id,
                published_url: postData.url || `https://${requestDomain}/blog/${postData.slug}`,
                anchor_text: postData.anchor_text || '',
                published_at: postData.published_at || postData.created_at,
                excerpt: postData.excerpt || ''
              };
            }
          }
        } catch (e) {
          // ignore
        }
      }

    } catch (error) {
      console.log('Note: Could not fetch from database, post not found');
    }

    if (!post) {
      return {
        statusCode: 404,
        headers,
        body: generate404HTML(requestDomain)
      };
    }

    // Generate the HTML for the post
    const html = generatePostHTML(requestDomain, post);

    return {
      statusCode: 200,
      headers,
      body: html
    };

  } catch (error) {
    console.error('❌ Error serving blog post:', error);

    return {
      statusCode: 500,
      headers,
      body: `
        <html>
          <head><title>Error</title></head>
          <body>
            <h1>Temporary Error</h1>
            <p>We're experiencing a temporary issue. Please try again in a few moments.</p>
          </body>
        </html>
      `
    };
  }
};
