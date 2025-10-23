import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getCorsHeaders } from '../_cors.ts';

interface ReqBody {
  keyword: string;
  anchorText?: string;
  url: string;
  wordCount?: number;
  contentType?: string;
  tone?: string;
  selectedPrompt?: string;
  promptIndex?: number;
  save?: boolean; // whether to attempt to persist generation to DB
  campaignId?: string | null;
  domainId?: string | null;
  model?: string;
}

// Markdown normalization helpers
function splitSentences(text: string): string[] {
  const parts = String(text || '').split(/(?<=[.!?])\s+/);
  return parts.filter(p => p && p.trim().length);
}
function normalizeMarkdown(md: string, maxSentencesPerPara = 4): string {
  const lines = String(md || '').replace(/\r\n?/g, '\n').split('\n');
  const out: string[] = [];
  let buffer: string[] = [];
  const flush = () => {
    if (!buffer.length) return;
    const sentences = splitSentences(buffer.join(' ').replace(/\s+/g, ' ').trim());
    for (let i = 0; i < sentences.length; i += maxSentencesPerPara) {
      out.push(sentences.slice(i, i + maxSentencesPerPara).join(' ').trim());
    }
    buffer = [];
  };
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) { flush(); if (out.length && out[out.length-1] !== '') out.push(''); continue; }
    if (/^#{1,3}\s+/.test(line) || /^\d+\.\s+/.test(line) || /^[-*]\s+/.test(line)) { flush(); out.push(line.trim()); out.push(''); continue; }
    buffer.push(line.trim());
  }
  flush();
  // collapse extra blank lines
  const collapsed = out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
  return collapsed;
}
function ensureMarkdownAnchor(md: string, anchorText: string, url: string): string {
  const safeAnchor = String(anchorText || '').trim();
  const safeUrl = String(url || '').trim();
  if (!safeAnchor || !safeUrl) return md;
  const linkRegex = new RegExp(`\\[${safeAnchor.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}\\]\\(${safeUrl.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}\\)`, 'i');
  if (linkRegex.test(md)) return md;
  const anchorRegex = new RegExp(`\\b${safeAnchor.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}\\b`, 'i');
  if (anchorRegex.test(md)) return md.replace(anchorRegex, `[${safeAnchor}](${safeUrl})`);
  const paras = md.split(/\n\n+/);
  if (paras.length > 2) paras[1] = `${paras[1]} Learn more at [${safeAnchor}](${safeUrl}).`;
  else paras.push(`Learn more at [${safeAnchor}](${safeUrl}).`);
  return paras.join('\n\n');
}

serve(async (req: Request) => {
  const origin = req.headers.get('origin') || '';
  const cors = getCorsHeaders(origin);

  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), { status: 405, headers: { ...cors, 'Content-Type': 'application/json' } });

  try {
    const body: ReqBody = await req.json().catch(() => ({} as ReqBody));

    const keyword = String(body.keyword || '').trim();
    const anchorText = String(body.anchorText || keyword || '').trim();
    const targetUrl = String(body.url || '').trim();
    const wordCount = Number(body.wordCount || 1000);
    const contentType = String(body.contentType || 'comprehensive');
    const tone = String(body.tone || 'professional');
    const model = String(body.model || 'gpt-3.5-turbo');

    if (!keyword || !targetUrl) {
      return new Response(JSON.stringify({ success: false, error: 'Missing required fields: keyword and url are required' }), { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } });
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
    const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SERVICE_ROLE_KEY') || '';

    if (!OPENAI_API_KEY) {
      return new Response(JSON.stringify({ success: false, error: 'OpenAI API key not configured in environment' }), { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } });
    }

    // Prompt templates rotation pool
    const promptTemplates = [
      `Generate a ${wordCount} word blog post on {{keyword}} including the {{anchor_text}} hyperlinked to {{url}}`,
      `Write a ${wordCount} word blog post about {{keyword}} with a hyperlinked {{anchor_text}} linked to {{url}}`,
      `Produce a ${wordCount}-word blog post on {{keyword}} that links {{anchor_text}}`
    ];

    // Determine which prompt to use
    let finalPrompt = '';
    let usedPromptIndex = 0;

    if (body.selectedPrompt && typeof body.promptIndex === 'number') {
      finalPrompt = body.selectedPrompt;
      usedPromptIndex = body.promptIndex;
    } else {
      // Use simple rotation: hash keyword + timestamp to pick a prompt index (stable-ish per keyword)
      const seed = (keyword + '::' + (Date.now() % (promptTemplates.length * 1000))).split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
      usedPromptIndex = Math.abs(seed) % promptTemplates.length;
      finalPrompt = promptTemplates[usedPromptIndex]
        .replace('{{keyword}}', keyword)
        .replace('{{anchor_text}}', anchorText || keyword)
        .replace('{{url}}', targetUrl);
    }

    const systemPrompt = `You are a professional SEO content writer. Output strictly in Markdown format. Use a ${tone} tone. Requirements:\n- Start with a single H1 title line\n- Use multiple H2 (##) and H3 (###) headings\n- Keep paragraphs short (2–4 sentences each)\n- Use bullet ( - ) and numbered (1.) lists where helpful\n- Perfect grammar, punctuation, and natural readability\n- No HTML tags or entities, no code fences, no frontmatter\n- Include the anchor text "${anchorText || keyword}" as a Markdown link to ${targetUrl}: [${anchorText || keyword}](${targetUrl})`;

    const userPrompt = `Generate a comprehensive ${wordCount}-word ${contentType} blog post about "${keyword}" in Markdown.\n\nSTRUCTURE & STYLE:\n- H1 title on the first line\n- Several H2 sections with optional H3 subsections\n- Short paragraphs (max 4 sentences) with blank lines between paragraphs\n- Use bullet and numbered lists where relevant\n- Natural tone: ${tone}\n\nLINK REQUIREMENT:\n- Include "${anchorText || keyword}" as [${anchorText || keyword}](${targetUrl}) exactly once in a natural sentence\n\nCONSTRAINTS:\n- Do NOT include HTML tags or entities\n- Do NOT include code blocks, frontmatter, or placeholders\n- Return only the Markdown content`;

    // Helper: do request with retries for transient errors (429/5xx)
    const doOpenAiRequest = async (attempt = 0): Promise<any> => {
      const maxAttempts = 3;
      try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: finalPrompt + '\n\n' + userPrompt }
            ],
            temperature: 0.7,
            max_tokens: Math.min(4000, Math.floor(wordCount * 2.5)),
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0
          })
        });

        if (!res.ok) {
          const bodyText = await res.text().catch(() => '');
          const status = res.status;
          // Retry on rate limit or 5xx
          if ((status === 429 || status >= 500) && attempt < maxAttempts - 1) {
            const backoff = 2 ** attempt * 500;
            await new Promise(r => setTimeout(r, backoff));
            return doOpenAiRequest(attempt + 1);
          }
          throw new Error(`OpenAI API error ${status}: ${bodyText}`);
        }

        const json = await res.json();
        return json;
      } catch (err) {
        if (attempt < 2) {
          const backoff = 2 ** attempt * 500;
          await new Promise(r => setTimeout(r, backoff));
          return doOpenAiRequest(attempt + 1);
        }
        throw err;
      }
    };

    const openaiData = await doOpenAiRequest();

    // Parse response content
    const draft = openaiData?.choices?.[0]?.message?.content || openaiData?.choices?.[0]?.text || '';
    const tokens = openaiData?.usage?.total_tokens ?? null;
    const cost = tokens ? tokens * 0.000002 : null; // approximate

    if (!draft || String(draft).trim().length < 80) {
      return new Response(JSON.stringify({ success: false, error: 'No content generated or content too short', provider: 'openai', details: openaiData }), { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } });
    }

    // Second pass: proofreading and style normalization to Markdown
    const doProofread = async (text: string): Promise<string> => {
      try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: 'You are a meticulous editor. Rewrite the provided draft into clean, well-formatted Markdown with perfect grammar and punctuation. Rules: start with a single H1, use H2/H3, short 2–4 sentence paragraphs, use lists where helpful, no HTML or code fences, no frontmatter. Preserve meaning and ensure natural readability.' },
              { role: 'user', content: String(text).slice(0, 120000) }
            ],
            temperature: 0.3,
            max_tokens: Math.min(4000, Math.floor(wordCount * 2.0))
          })
        });
        if (!res.ok) return text;
        const j = await res.json();
        return j?.choices?.[0]?.message?.content || text;
      } catch (_) { return text; }
    };

    let content = await doProofread(draft);
    content = normalizeMarkdown(content);
    content = ensureMarkdownAnchor(content, anchorText || keyword, targetUrl);

    // Extract title supporting Markdown H1
    let title = '';
    try {
      const mdH1 = String(content).match(/^\s*#\s+(.+)\s*$/m);
      if (mdH1) title = mdH1[1].trim();
      else {
        const firstLine = String(content).split('\n').find(l => l.trim().length > 0) || '';
        title = firstLine.replace(/<[^>]+>/g, '').replace(/^#+\s*/, '').slice(0, 120);
      }
    } catch (e) {
      title = (keyword || '').slice(0, 80);
    }

    // Optionally persist generation to DB if requested (best-effort)
    let savedRow: any = null;
    let saved = false;

    if (body.save && SUPABASE_URL && SERVICE_ROLE) {
      try {
        const sb = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });
        const nowIso = new Date().toISOString();
        const insertPayload: any = {
          keyword,
          anchor_text: anchorText,
          target_url: targetUrl,
          prompt: finalPrompt,
          prompt_index: usedPromptIndex,
          model,
          title,
          content,
          tokens,
          cost,
          created_at: nowIso,
          campaign_id: body.campaignId || null,
          domain_id: body.domainId || null
        };

        // Try inserting into automation_generated (non-blocking). If the table doesn't exist, catch and continue.
        const { data: ins, error: insErr } = await sb.from('automation_generated').insert(insertPayload).select().maybeSingle();
        if (insErr) {
          // table may not exist or permissions; log and continue
          console.warn('generate-content-openai: failed to save generation:', insErr.message || insErr);
        } else {
          saved = true;
          savedRow = ins;
        }
      } catch (e) {
        console.warn('generate-content-openai: save attempt failed:', e instanceof Error ? e.message : String(e));
      }
    }

    const responsePayload = {
      success: true,
      provider: 'openai',
      content,
      title,
      usage: { tokens, cost },
      prompt: finalPrompt,
      promptIndex: usedPromptIndex,
      timestamp: new Date().toISOString(),
      saved,
      savedRow
    };

    return new Response(JSON.stringify(responsePayload), { headers: { ...cors, 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error('generate-content-openai error:', error);
    return new Response(JSON.stringify({ success: false, error: error instanceof Error ? error.message : String(error) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
});
