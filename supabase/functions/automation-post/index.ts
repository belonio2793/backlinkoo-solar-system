import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getCorsHeaders } from '../_cors.ts';

serve(async (req: Request) => {
  const origin = req.headers.get('origin') || '';
  const cors = getCorsHeaders(origin);

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: cors });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), { status: 405, headers: { ...cors, 'Content-Type': 'application/json' } });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const serviceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SERVICE_ROLE_KEY') || '';

    if (!supabaseUrl || !serviceRole) {
      return new Response(JSON.stringify({ success: false, error: 'Missing Supabase configuration (SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY)' }), { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } });
    }

    const supabase = createClient(supabaseUrl, serviceRole, { auth: { persistSession: false } });

    const body = await req.json().catch(() => ({}));
    const campaignId = body?.campaign_id || body?.campaignId || null;

    if (!campaignId) {
      return new Response(JSON.stringify({ success: false, error: 'Missing campaign_id in request body' }), { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } });
    }

    // Fetch campaign from primary table, fallback to automation_campaigns if not found
    let campaign: any = null;
    let campaignSource = 'automation';

    const { data: campaigns, error: campaignErr } = await supabase
      .from('automation')
      .select('*')
      .eq('id', campaignId)
      .maybeSingle();

    if (!campaigns || campaignErr) {
      const { data: altCampaign, error: altErr } = await supabase
        .from('automation_campaigns')
        .select('*')
        .eq('id', campaignId)
        .maybeSingle();

      if (altErr || !altCampaign) {
        return new Response(
          JSON.stringify({ success: false, error: 'Campaign not found', details: (campaignErr || altErr)?.message }),
          { status: 404, headers: { ...cors, 'Content-Type': 'application/json' } }
        );
      }

      // Normalize fields from automation_campaigns to expected shape
      campaignSource = 'automation_campaigns';
      campaign = {
        ...altCampaign,
        id: altCampaign.id,
        user_id: (altCampaign as any).user_id,
        target_url: (altCampaign as any).target_url || (altCampaign as any).targetUrl || (altCampaign as any).url || '',
        keyword: (altCampaign as any).keyword || (Array.isArray((altCampaign as any).keywords) ? (altCampaign as any).keywords[0] : ''),
        keywords: Array.isArray((altCampaign as any).keywords) ? (altCampaign as any).keywords : ((altCampaign as any).keyword ? [String((altCampaign as any).keyword)] : []),
        anchor_text: (altCampaign as any).anchor_text || (altCampaign as any).anchorText || (altCampaign as any).anchor || '',
        anchor_texts: Array.isArray((altCampaign as any).anchor_texts) ? (altCampaign as any).anchor_texts : ((altCampaign as any).anchor_text ? [String((altCampaign as any).anchor_text)] : []),
        model: (altCampaign as any).model || 'gpt-3.5-turbo',
        theme: (altCampaign as any).theme || null
      } as any;
    } else {
      campaign = campaigns as any;
      campaign.keywords = Array.isArray((campaign as any).keywords) ? (campaign as any).keywords : ((campaign as any).keyword ? [String((campaign as any).keyword)] : []);
      campaign.anchor_texts = Array.isArray((campaign as any).anchor_texts) ? (campaign as any).anchor_texts : ((campaign as any).anchor_text ? [String((campaign as any).anchor_text)] : []);
    }

    // Fetch eligible domains for the campaign owner
    const { data: domains, error: domainsErr } = await supabase
      .from('domains')
      .select('id, domain, selected_theme, user_id, dns_verified')
      .eq('user_id', campaign.user_id)
      .eq('dns_verified', true)
      .order('created_at', { ascending: false });

    if (domainsErr) {
      return new Response(JSON.stringify({ success: false, error: 'Failed to fetch domains', details: domainsErr.message }), { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } });
    }

    const domainRows = (domains || []).filter(Boolean);
    if (!domainRows || domainRows.length === 0) {
      return new Response(JSON.stringify({ success: false, error: 'No eligible domains found for user' }), { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } });
    }

    // Choose a domain using round-robin style by post count and recency
    let chosenDomain = domainRows[0];
    const countCandidates = ['automation_posts', 'automation_posts_count', 'posts_count', 'post_count', 'published_posts', 'pages_published'];

    const domainStats = domainRows.map((d: any) => {
      let count = Number(d.automation_posts?.[0]?.count || d.automation_posts_count || d.posts_count || d.post_count || d.published_posts || d.pages_published || 0);
      if (isNaN(count)) count = 0;
      let lastPostedRaw = d.last_posted_at || d.posts_last_published_at || d.updated_at || d.updatedAt || null;
      let lastPosted = lastPostedRaw ? new Date(lastPostedRaw).getTime() : 0;
      return { row: d, count, lastPosted };
    });

    domainStats.sort((a: any, b: any) => (a.count !== b.count ? a.count - b.count : a.lastPosted - b.lastPosted));
    if (domainStats.length > 0) chosenDomain = domainStats[0].row; else chosenDomain = domainRows[Math.floor(Math.random() * domainRows.length)];

    // Resolve blog theme for chosen domain (supports id or template_key)
    let domainTemplateKey: string | null = null;
    try {
      const domainTheme = (chosenDomain as any).blog_theme || (chosenDomain as any).theme || (chosenDomain as any).selected_theme || null;
      if (domainTheme) {
        try {
          const { data: themeRow, error: themeErr } = await supabase.from('blog_themes').select('template_key').eq('id', domainTheme).maybeSingle();
          if (!themeErr && themeRow && (themeRow as any).template_key) domainTemplateKey = (themeRow as any).template_key;
        } catch (e) {}
        if (!domainTemplateKey && typeof domainTheme === 'string') domainTemplateKey = domainTheme;
      }
    } catch (e) {
      console.warn('Failed to resolve domain theme for automation-post:', e && (e.message || e));
    }

    // Prepare OpenAI generation
    const OPENAI_KEY = Deno.env.get('OPENAI_API_KEY') || '';

    const model = (campaign.model || 'gpt-3.5-turbo');
    const keyword = campaign.keyword || (Array.isArray(campaign.keywords) ? campaign.keywords[0] : '') || '';
    const anchorText = campaign.anchor_text || (Array.isArray(campaign.anchor_texts) ? campaign.anchor_texts[0] : '') || '';
    const targetUrl = campaign.target_url || campaign.targetUrl || campaign.target || '';

    // Build prompts and generate content through internal function
    let content = '';
    const generateFallbackHtml = (keyword: string, anchorText: string, url: string) => `
<h1>${keyword.charAt(0).toUpperCase() + keyword.slice(1)}: Complete Guide</h1>

<h2>Introduction</h2>

<p>Understanding ${keyword} is essential in today's digital landscape. This comprehensive guide explores the key aspects and practical applications of ${keyword}, providing valuable insights for businesses and individuals alike.</p>

<h2>What is ${keyword.charAt(0).toUpperCase() + keyword.slice(1)}?</h2>

<p>${keyword.charAt(0).toUpperCase() + keyword.slice(1)} encompasses various strategies and techniques that are crucial for success in the modern digital world. From basic concepts to advanced implementations, ${keyword} offers numerous opportunities for growth and improvement.</p>

<p>The importance of ${keyword} cannot be overstated. Organizations worldwide are recognizing its potential to drive engagement, improve efficiency, and create lasting value for their stakeholders.</p>

<h2>Key Benefits of ${keyword}</h2>

<ul>
<li>Enhanced visibility and reach across digital platforms</li>
<li>Improved user engagement and interaction rates</li>
<li>Better conversion rates and ROI optimization</li>
<li>Long-term sustainable growth strategies</li>
<li>Competitive advantage in the marketplace</li>
</ul>

<h2>Best Practices and Implementation</h2>

<p>When implementing ${keyword} strategies, it's important to focus on quality and consistency. Successful implementation requires careful planning, execution, and continuous monitoring of results.</p>

<p>For professional guidance and expert solutions in ${keyword}, consider consulting <a href="${url}" target="_blank" rel="noopener noreferrer">${anchorText}</a> for comprehensive support and industry-leading expertise.</p>

<h3>Implementation Strategies</h3>

<ol>
<li><strong>Research and Planning</strong>: Understand your target audience and set clear objectives</li>
<li><strong>Content Creation</strong>: Develop high-quality, valuable content that resonates with your audience</li>
<li><strong>Optimization</strong>: Fine-tune your approach based on performance data and analytics</li>
<li><strong>Monitoring</strong>: Track results and adjust strategies accordingly for continuous improvement</li>
</ol>

<h2>Common Challenges and Solutions</h2>

<p>Many businesses face challenges when implementing ${keyword} strategies. These can include resource constraints, technical limitations, changing market conditions, and evolving user expectations.</p>

<p>The key to overcoming these challenges lies in developing a comprehensive understanding of the ${keyword} landscape and staying up-to-date with the latest trends and best practices.</p>

<h2>Conclusion</h2>

<p>Mastering ${keyword} is an ongoing journey that requires dedication, continuous learning, and adaptation to changing market conditions. By following the strategies and best practices outlined in this guide, you'll be well-equipped to leverage ${keyword} for sustainable growth and success.</p>
`;
    if (OPENAI_KEY) {
      try {
        const { data: genData, error: genError } = await supabase.functions.invoke('generate-content-openai', {
          body: { keyword, anchorText, url: targetUrl, wordCount: 800, contentType: 'comprehensive', tone: 'professional' }
        });
        if (genError) {
          content = generateFallbackHtml(keyword, anchorText, targetUrl);
        } else {
          content = (genData && (genData.content || genData.data || genData.body || genData)) || '';
        }
        if (!content || String(content).trim().length < 50) {
          content = generateFallbackHtml(keyword, anchorText, targetUrl);
        }
      } catch (genErr) {
        content = generateFallbackHtml(keyword, anchorText, targetUrl);
      }
    } else {
      content = generateFallbackHtml(keyword, anchorText, targetUrl);
    }

    // Title extraction (prefer target page actual title when available)
    let title = '';
    const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/i);
    if (h1Match) title = h1Match[1].trim();
    else {
      const mdH1 = content.match(/^\s*#\s+(.+)\s*$/m);
      if (mdH1) title = mdH1[1].trim();
      else { const firstLine = content.split('\n').find((l: string) => l.trim().length > 0) || ''; title = firstLine.replace(/<[^>]+>/g, '').replace(/^#+\s*/, '').slice(0, 120); }
    }
    try {
      // Do not override title from external pages; keep provided/raw-derived title
    } catch {}

    // Slugify/prefix with theme
    const cleanedForSlug = String(title || `post-${Date.now()}`)
      .replace(/\bhttps?:\/\/[^\s]+/gi, '')
      .replace(/\b[a-z0-9]+(?:com|net|org|io|co|ai)\b/gi, '')
      .replace(/[_\.]+/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim();
    const innerBaseSlug = (cleanedForSlug || `post-${Date.now()}`).toLowerCase()
      .replace(/[^a-z0-9\-\_ ]/g, '')
      .replace(/\s+/g, '-')
      .replace(/\-+/g, '-')
      .replace(/^\-+|\-+$/g, '');

    let themeSegment = String((domainTemplateKey || (chosenDomain as any).selected_theme || 'minimal')).toLowerCase();
    if (themeSegment === 'random-ai-generated') themeSegment = 'random';
    const rand = Math.random().toString(36).slice(2, 6);
    let slug = `${themeSegment}/${innerBaseSlug}-${rand}`;

    // Ensure slug uniqueness
    try {
      let attempt = 0;
      const baseInner = `${innerBaseSlug}-${rand}`;
      while (true) {
        const [{ data: existingAuto, error: existingAutoErr }, { data: existingBlog, error: existingBlogErr }] = await Promise.all([
          supabase.from('automation_posts').select('id').eq('domain_id', (chosenDomain as any).id).eq('slug', slug).limit(1).maybeSingle(),
          supabase.from('blog_posts').select('id').eq('domain_id', (chosenDomain as any).id).eq('slug', slug).limit(1).maybeSingle()
        ]);
        if (existingAutoErr || existingBlogErr) break;
        const exists = existingAuto || existingBlog;
        if (!exists) break;
        attempt += 1;
        slug = `${themeSegment}/${baseInner}-${attempt}`;
        if (attempt > 20) { slug = `${themeSegment}/${innerBaseSlug}-${Date.now().toString(36)}`; break; }
      }
    } catch (_) {}

    // Prepare final content: convert Markdown->HTML if needed and inject into user-provided template (if available in themes bucket)
    // We'll try to load a template from the themes storage at automation/post.html and insert the generated content.
    const finalContentRaw = String(content || '');

    // Simple HTML detection
    const looksLikeHtml = /<[^>]+>/.test(finalContentRaw);

    // Minimal markdown -> html converter for common constructs (H1-H3, lists, links, paragraphs)
    function markdownToHtml(md: string) {
      const lines = String(md || '').replace(/\r\n?/g, '\n').split('\n');
      let out: string[] = [];
      let inUl = false;
      let inOl = false;
      function closeLists() {
        if (inUl) { out.push('</ul>'); inUl = false; }
        if (inOl) { out.push('</ol>'); inOl = false; }
      }
      for (let i = 0; i < lines.length; i++) {
        const raw = lines[i].trimEnd();
        if (!raw) { closeLists(); out.push(''); continue; }
        // Headings
        const hMatch = raw.match(/^(#{1,6})\s+(.*)$/);
        if (hMatch) { closeLists(); const level = Math.min(6, hMatch[1].length); out.push(`<h${level}>${hMatch[2].trim()}</h${level}>`); continue; }
        // Ordered list
        const olMatch = raw.match(/^\d+\.\s+(.*)$/);
        if (olMatch) { if (!inOl) { closeLists(); out.push('<ol>'); inOl = true; } out.push(`<li>${olMatch[1].trim()}</li>`); continue; }
        // Unordered list
        const ulMatch = raw.match(/^[\-*+]\s+(.*)$/);
        if (ulMatch) { if (!inUl) { closeLists(); out.push('<ul>'); inUl = true; } out.push(`<li>${ulMatch[1].trim()}</li>`); continue; }
        // Paragraphs: treat as paragraph unless it's already HTML
        if (/^<.+>$/.test(raw)) { closeLists(); out.push(raw); continue; }
        // Inline link conversion [text](url)
        let line = raw.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
        // Bold/italic (basic)
        line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>');
        out.push(`<p>${line}</p>`);
      }
      closeLists();
      // Collapse multiple blank lines
      return out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
    }

    let finalContentHtml = finalContentRaw;
    if (!looksLikeHtml) {
      try { finalContentHtml = markdownToHtml(finalContentRaw); } catch (e) { finalContentHtml = `<div>${String(finalContentRaw).replace(/</g,'&lt;')}</div>`; }
    }

    // Attempt to load a template from the themes bucket at automation/post.html and inject content
    try {
      const THEMES_BUCKET = Deno.env.get('SUPABASE_THEMES_BUCKET') || 'themes';
      const templatePath = 'automation/post.html';
      const { data: tplData, error: tplErr } = await supabase.storage.from(THEMES_BUCKET).download(templatePath);
      if (!tplErr && tplData) {
        let tplText = '';
        try {
          const ab = await tplData.arrayBuffer();
          tplText = new TextDecoder().decode(ab);
        } catch (err) {
          try { tplText = String(tplData); } catch (_) { tplText = ''; }
        }
        if (tplText && tplText.length > 0) {
          // Candidate placeholders to replace
          const placeholders = ['{{content}}','{{body}}','<!-- CONTENT -->','<!--POST_CONTENT-->','<div id="content"></div>','<!-- CONTENT -->'];
          let injected = false;
          for (const ph of placeholders) {
            if (tplText.indexOf(ph) !== -1) { tplText = tplText.split(ph).join(finalContentHtml); injected = true; break; }
          }
          if (!injected) {
            if (/<\/body>/i.test(tplText)) tplText = tplText.replace(/<\/body>/i, finalContentHtml + '\n</body>');
            else tplText = tplText + '\n' + finalContentHtml;
          }
          // Use the template with injected content as the final content
          const finalContent = String(tplText || finalContentHtml);
          // override content variable for subsequent title extraction and DB insert
          // We shadow the outer finalContent variable by assigning to a new name used below via a small trick: set content variable used further to finalContent
          // To avoid re-declaring, modify the original content holder
          content = finalContent;
        }
      }
    } catch (e) {
      // ignore template loading/injection failures and fall back to generated content
    }

    // Final content fallback if template not used
    const finalContent = String(content || finalContentHtml);

    const finalTitle = (function() {
      try {
        // Prefer H1 in HTML if present
        const h1Match = String(content || '').match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
        if (h1Match) return h1Match[1].replace(/<[^>]*>/g, '').trim();
        // Else try Markdown H1
        const mdH1 = String(content || '').match(/^\s*#\s+(.+)\s*$/m);
        if (mdH1) return mdH1[1].trim();
        return String(title || keyword || 'post');
      } catch (e) { return String(title || keyword || 'post'); }
    })();

    const domainHost = (String((chosenDomain as any).domain || '')).replace(/^https?:\/\//, '').replace(/\/$/, '');
    // Compute inner slug (remove theme prefix if present)
    let rawSlug = String(slug || '').replace(/^\/+/, '').replace(/^themes\//i, '');
    const parts = rawSlug.split('/').filter(Boolean);
    let innerSlug = rawSlug;
    if (parts.length > 1 && String(parts[0]).toLowerCase() === String(themeSegment).toLowerCase()) innerSlug = parts.slice(1).join('/');
    // Permalink uses hash route
    const publicBase = (Deno.env.get('SUPABASE_URL') || '').replace(/\/$/, '') + `/storage/v1/object/public/${THEMES_BUCKET}`;
    const publishedUrl = `${publicBase}/${encodeURIComponent(themeSegment)}/${encodeURIComponent(innerSlug)}/post.html`;

    // Insert into automation_posts with campaign and theme context
    const nowIso = new Date().toISOString();
    const insertRowBase: any = {
      automation_id: campaign.id,
      domain_id: (chosenDomain as any).id,
      user_id: campaign.user_id,
      slug,
      title: finalTitle,
      content: finalContent,
      url: publishedUrl,
      status: 'published',
      blog_theme: themeSegment,
      blog_theme_id: (chosenDomain as any).blog_theme_id,
      keywords: Array.isArray(campaign.keywords) ? campaign.keywords : (campaign.keyword ? [String(campaign.keyword)] : []),
      anchor_texts: Array.isArray(campaign.anchor_texts) ? campaign.anchor_texts : (campaign.anchor_text ? [String(campaign.anchor_text)] : []),
    };

    async function insertWithFallback(payload: Record<string, unknown>) {
      try {
        const res = await supabase
          .from('automation_posts')
          .insert(payload)
          .select()
          .maybeSingle();
        if (res.error) throw res.error;
        return res.data;
      } catch (e) {
        const msg = String((e as any).message || e).toLowerCase();

        // If this is a unique/duplicate constraint error for automation_id+domain_id,
        // try to fetch and return the existing row to avoid creating duplicates.
        try {
          if (msg.includes('duplicate') || msg.includes('unique') || msg.includes('constraint')) {
            if (payload && (payload as any).automation_id && (payload as any).domain_id) {
              const { data: existing, error: existingErr } = await supabase
                .from('automation_posts')
                .select('*')
                .eq('automation_id', (payload as any).automation_id)
                .eq('domain_id', (payload as any).domain_id)
                .maybeSingle();
              if (!existingErr && existing) return existing;
            }
          }
        } catch (fetchErr) {
          // ignore and continue to retry logic
        }

        const clean: any = { ...payload };
        if (msg.includes('column') && msg.includes('blog_theme')) delete clean.blog_theme;
        if (msg.includes('column') && msg.includes('keywords')) delete clean.keywords;
        if (msg.includes('column') && msg.includes('anchor_texts')) delete clean.anchor_texts;
        if (msg.includes('column') && msg.includes('blog_theme_id')) delete clean.blog_theme_id;
        const retry = await supabase.from('automation_posts').insert(clean).select().maybeSingle();
        if (retry.error) {
          const retryMsg = String((retry.error as any).message || retry.error).toLowerCase();
          if ((retryMsg.includes('duplicate') || retryMsg.includes('unique') || retryMsg.includes('constraint')) && clean && clean.automation_id && clean.domain_id) {
            try {
              const { data: existing2, error: existingErr2 } = await supabase
                .from('automation_posts')
                .select('*')
                .eq('automation_id', clean.automation_id)
                .eq('domain_id', clean.domain_id)
                .maybeSingle();
              if (!existingErr2 && existing2) return existing2;
            } catch (_) {}
          }
          throw retry.error;
        }
        return retry.data;
      }
    }

    const insertedPost = await insertWithFallback(insertRowBase);

    // Increment domain post count (best effort)
    try {
      if (typeof supabase.rpc === 'function') {
        await supabase.rpc('increment_domain_post_count', { domain_id: (chosenDomain as any).id });
      } else {
        await supabase.from('domains').update({ post_count: ((chosenDomain as any).post_count || 0) + 1, updated_at: nowIso }).eq('id', (chosenDomain as any).id);
      }
    } catch (_) {}

    // Update source table last_posted_at (best effort)
    try { await supabase.from(campaignSource).update({ last_posted_at: nowIso, updated_at: nowIso }).eq('id', campaign.id); } catch {}

    return new Response(
      JSON.stringify({ success: true, published_url: publishedUrl, post: insertedPost, domain: { id: (chosenDomain as any).id, domain: domainHost, blog_theme: (chosenDomain as any).blog_theme || (chosenDomain as any).theme || null, selected_theme: (typeof domainTemplateKey === 'string' ? domainTemplateKey : null) }, campaign: { id: campaign.id, user_id: campaign.user_id, target_url: targetUrl, keyword, anchor_text: anchorText, model } }),
      { status: 200, headers: { ...cors, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('automation-post error', err);
    return new Response(JSON.stringify({ success: false, error: err instanceof Error ? err.message : String(err) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
});
