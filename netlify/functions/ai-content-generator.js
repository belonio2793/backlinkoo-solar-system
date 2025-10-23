import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Markdown normalization helpers
function splitSentences(text) {
  const parts = String(text || '').split(/(?<=[.!?])\s+/);
  return parts.filter((p) => p && p.trim().length);
}
function normalizeMarkdown(md, maxSentencesPerPara = 4) {
  const lines = String(md || '').replace(/\r\n?/g, '\n').split('\n');
  const out = [];
  let buffer = [];
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
    if (!line.trim()) { flush(); if (out.length && out[out.length - 1] !== '') out.push(''); continue; }
    if (/^#{1,3}\s+/.test(line) || /^\d+\.\s+/.test(line) || /^[-*]\s+/.test(line)) { flush(); out.push(line.trim()); out.push(''); continue; }
    buffer.push(line.trim());
  }
  flush();
  const collapsed = out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
  return collapsed;
}
function ensureMarkdownAnchor(md, anchorText, url) {
  const safeAnchor = String(anchorText || '').trim();
  const safeUrl = String(url || '').trim();
  if (!safeAnchor || !safeUrl) return md;
  const linkRegex = new RegExp(`\\[${safeAnchor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\]\\(${safeUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)`, 'i');
  if (linkRegex.test(md)) return md;
  const anchorRegex = new RegExp(`\\b${safeAnchor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
  if (anchorRegex.test(md)) return md.replace(anchorRegex, `[${safeAnchor}](${safeUrl})`);
  const paras = md.split(/\n\n+/);
  if (paras.length > 2) paras[1] = `${paras[1]} Learn more at [${safeAnchor}](${safeUrl}).`;
  else paras.push(`Learn more at [${safeAnchor}](${safeUrl}).`);
  return paras.join('\n\n');
}

export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ success: false, error: 'Method not allowed' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const {
      prompt,
      keyword,
      anchor_text,
      target_url,
      word_count = 1000,
      model = 'gpt-3.5-turbo',
      temperature = 0.7,
      max_tokens = 2000,
    } = body;

    if (!prompt || !keyword || !anchor_text || !target_url) {
      return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: 'Missing required fields: prompt, keyword, anchor_text, target_url' }) };
    }
    const desiredWordCount = Number(word_count) || 1000;

    // Prepare messages payload
    const messages = [
      { role: 'system', content: 'You are a professional SEO copywriter. Output valid Markdown only.' },
      { role: 'user', content: `${prompt}\n\nRequirements:\n- Topic keyword: "${keyword}"\n- Target URL: ${target_url}\n- Anchor text: "${anchor_text}"\n- Length: about ${desiredWordCount} words\n- Write like a Medium article with headings and short paragraphs.` },
    ];

    let aiContent = '';

    if (process.env.OPENAI_API_KEY) {
      // Use official OpenAI SDK when available
      const completion = await openai.chat.completions.create({
        model,
        messages,
        max_tokens,
        temperature,
      });
      aiContent = completion.choices?.[0]?.message?.content || completion.choices?.[0]?.text || '';
    } else if (process.env.X_API) {
      // Fallback: attempt to call an OpenAI-compatible chat completion endpoint using X_API key
      const resp = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.X_API}`,
        },
        body: JSON.stringify({ model, messages, max_tokens, temperature }),
      });
      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(`X API generator HTTP ${resp.status}: ${txt}`);
      }
      const json = await resp.json();
      aiContent = json.choices?.[0]?.message?.content || json.choices?.[0]?.text || '';
    } else {
      return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: 'OpenAI API not configured and X_API fallback not present' }) };
    }

    if (!aiContent) throw new Error('No content generated from AI provider');

    let finalContent = normalizeMarkdown(aiContent);
    finalContent = ensureMarkdownAnchor(finalContent, anchor_text, target_url);

    const lines = finalContent.split('\n');
    const titleLine = lines.find((l) => l.startsWith('# '));
    const title = titleLine ? titleLine.replace(/^#\s+/, '').trim() : `The Complete Guide to ${String(keyword || '').charAt(0).toUpperCase() + String(keyword || '').slice(1)}`;

    const generatedWordCount = finalContent.trim().split(/\s+/).length;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        content: finalContent,
        title,
        word_count: generatedWordCount,
        keyword_used: keyword,
        anchor_text_used: anchor_text,
        target_url_used: target_url,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: error.message || 'Failed to generate content' }),
    };
  }
};
