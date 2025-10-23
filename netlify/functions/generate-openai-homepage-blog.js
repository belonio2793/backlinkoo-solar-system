/**
 * OpenAI Content Generation Netlify Function (Homepage Blog)
 * Dedicated endpoint for homepage BlogForm submissions
 */

// Utilities for formatting raw model output into clean HTML
function escapeRegExp(str) { return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

function getStyleTag() {
  const css = `
  .generated-post{font-family:ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, Noto Sans, "Apple Color Emoji","Segoe UI Emoji";color:#111827;line-height:1.75}
  .generated-post h1,.generated-post h2{font-weight:800;line-height:1.2;margin:1.25rem 0 .75rem}
  .generated-post h3{font-weight:700;margin:1rem 0 .5rem}
  .generated-post p{margin:.75rem 0;font-size:1rem}
  .generated-post ul,.generated-post ol{margin:.75rem 0 1rem 1.25rem;padding:0}
  .generated-post li{margin:.25rem 0}
  .generated-post a{color:#2563eb;text-decoration:underline;text-underline-offset:2px}
  .generated-post strong{font-weight:700}
  `;
  return `<style>${css.replace(/\n+/g,'')}</style>`;
}

function convertInline(text){
  if(!text) return '';
  let s = String(text);
  // Convert markdown links [text](url)
  s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, (m, t, u) => `<a href="${u}" target="_blank" rel="noopener noreferrer">${t}</a>`);
  // Convert autolinks <https://url>
  s = s.replace(/<((?:https?:)\/\/[^>\s]+)>/g, (m, u) => `<a href="${u}" target="_blank" rel="noopener noreferrer">${u}</a>`);
  // Convert bare URLs
  s = s.replace(/(^|[\s(])((?:https?:)\/\/[^\s)<]+)/g, (m, pre, u) => `${pre}<a href="${u}" target="_blank" rel="noopener noreferrer">${u}</a>`);
  // Bold: **text** or __text__
  s = s.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
  s = s.replace(/__([^_]+)__/g,'<strong>$1</strong>');
  // Bold single-asterisk pairs when surrounded by non-space
  s = s.replace(/(^|[^*])\*([^*]+)\*/g, (m, pre, inner)=> `${pre}<strong>${inner}</strong>`);
  // Remove stray markdown markers
  s = s.replace(/(^|\s)[#*]+(\s|$)/g,'$1$2');
  return s.trim();
}

function buildHtml(raw){
  const lines = String(raw || '').replace(/\r\n?/g,'\n').split('\n');
  const out = [];
  let i=0;
  while(i<lines.length){
    let line = lines[i];
    if(!line || !line.trim()){ i++; continue; }

    // Headings
    let m = line.match(/^\s{0,3}#{1,6}\s+(.*)$/);
    if(m){
      const level = Math.min(3, Math.max(2, line.replace(/\s/g,'').indexOf('#')===0 ? (line.match(/^\s*#+/)[0].length) : 2));
      const tag = level>=3? 'h3':'h2';
      out.push(`<${tag}>${convertInline(m[1])}</${tag}>`);
      i++; continue;
    }

    // Horizontal rule or separator (e.g., --- or ___) → skip (no visual rule on homepage)
    if(/^\s*[-_*]{3,}\s*$/.test(line)) { i++; continue; }

    // Unordered list
    if(/^\s*[-*+]\s+/.test(line)){
      const items=[];
      while(i<lines.length && /^\s*[-*+]\s+/.test(lines[i])){
        items.push(`<li>${convertInline(lines[i].replace(/^\s*[-*+]\s+/,''))}</li>`);
        i++;
      }
      out.push(`<ul>${items.join('')}</ul>`);
      continue;
    }

    // Ordered list
    if(/^\s*\d+[.)]\s+/.test(line)){
      const items=[];
      while(i<lines.length && /^\s*\d+[.)]\s+/.test(lines[i])){
        items.push(`<li>${convertInline(lines[i].replace(/^\s*\d+[.)]\s+/,''))}</li>`);
        i++;
      }
      out.push(`<ol>${items.join('')}</ol>`);
      continue;
    }

    // Paragraph (collect consecutive text lines)
    const buff=[];
    while(i<lines.length && lines[i] && lines[i].trim() && !/^\s*([-*+]|\d+[.)]|#{1,6})\s+/.test(lines[i])){
      buff.push(lines[i].trim());
      i++;
    }
    const para = convertInline(buff.join(' ')).replace(/\s{2,}/g,' ').trim();
    if(para) out.push(`<p>${para}</p>`);
  }

  return out.join('\n');
}

function linkifyAnchor(html, anchorText, url){
  if(!anchorText || !url) return html;
  // If link already present, also ensure any bare occurrences of the URL are linked
  if(html.includes(`href=\"${url}\"`)){
    return html.replace(new RegExp(escapeRegExp(url), 'g'), (u) => {
      return html.includes(`href=\"${url}\"`) ? u : `<a href=\"${url}\" target=\"_blank\" rel=\"noopener noreferrer\">${u}</a>`;
    });
  }
  if (html.toLowerCase().includes(`>${anchorText.toLowerCase()}<`)) return html;

  let replaced=false;
  const lower = anchorText.toLowerCase();
  const result = html.replace(/>([^<]+)</g, (m, text)=>{
    if(replaced) return m;
    const idx = text.toLowerCase().indexOf(lower);
    if(idx!==-1){
      const before = text.slice(0,idx);
      const match = text.slice(idx, idx+anchorText.length);
      const after = text.slice(idx+anchorText.length);
      replaced=true;
      return `>${before}<a href=\"${url}\" target=\"_blank\" rel=\"noopener noreferrer\">${match}</a>${after}<`;
    }
    return m;
  });
  if(replaced) return result;

  // As a final fallback, replace the first plain-text occurrence of the URL with a hyperlink
  const urlLinked = result.replace(new RegExp(escapeRegExp(url)), `<a href=\"${url}\" target=\"_blank\" rel=\"noopener noreferrer\">${anchorText}</a>`);
  if (urlLinked !== result) return urlLinked;

  return result + `\n<p>Learn more here: <a href=\"${url}\" target=\"_blank\" rel=\"noopener noreferrer\">${anchorText}</a>.</p>`;
}

function formatGeneratedContent(raw, anchorText, url){
  let html = buildHtml(raw);
  html = linkifyAnchor(html, anchorText, url);
  return `${getStyleTag()}<div class="generated-post">${html}</div>`;
}

exports.handler = async (event, context) => {
  // Handle CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, X-Requested-With, apikey',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Credentials': 'true'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  // Allow quick GET status for health checks (returns minimal info)
  if (event.httpMethod === 'GET') {
    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ success: true, message: 'generate-openai-homepage-blog OK' }) };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ success: false, error: 'Method not allowed' }) };
  }

  try {
    const { keyword, url, anchorText, wordCount = 1500, contentType = 'how-to', tone = 'professional', apiKey: requestApiKey } = JSON.parse(event.body);

    if (!keyword || !url) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          success: false,
          error: 'Missing required fields: keyword and url'
        })
      };
    }

    // Get OpenAI API key from environment variables (secure server-side only)
    const apiKey = process.env.OPENAI_API_KEY || process.env.OPEN_AI_API_KEY;
    console.log('🔑 [homepage] API Key check:', apiKey ? `Found (${apiKey.substring(0, 7)}...)` : 'Not found');

    if (!apiKey) {
      console.error('❌ No OpenAI API key found in environment variables');
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          success: false,
          error: 'OpenAI API key not configured in Netlify environment',
          details: 'Please set OPENAI_API_KEY or OPEN_AI_API_KEY in Netlify environment variables'
        })
      };
    }

    const systemPrompt = `You are a famous writer known for being able to connect with readers`;

    const userPrompt = `Write a 500-1000 word blog post about "${keyword}". The writing tone should have personality. Make sure to naturally incorporate the URL(${url}) and use the anchor text "${anchorText}" at least once. Structure it like a Medium article.`;

    console.log('🚀 [homepage] Starting OpenAI generation via Netlify function...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Backlinkoo.com'
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: Math.min(4000, Math.floor(wordCount * 2.5)),
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      })
    });

    // Read response body once and handle both success and error cases
    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      console.error('❌ Failed to parse OpenAI response as JSON:', jsonError);
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          success: false,
          error: 'Failed to parse OpenAI response',
          provider: 'openai'
        })
      };
    }

    if (!response.ok) {
      let errorMessage = `OpenAI API error: ${response.status}`;

      if (data?.error?.message) {
        errorMessage += ` - ${data.error.message}`;
      }

      console.error('❌ OpenAI API error:', errorMessage);

      return {
        statusCode: response.status,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          success: false,
          error: errorMessage,
          provider: 'openai'
        })
      };
    }

    if (!data.choices || data.choices.length === 0) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          success: false, 
          error: 'No content generated from OpenAI',
          provider: 'openai'
        })
      };
    }

    const rawContent = data.choices[0].message.content;

    if (!rawContent || rawContent.trim().length < 100) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          success: false, 
          error: 'Generated content is too short or empty',
          provider: 'openai'
        })
      };
    }

    const tokens = data.usage.total_tokens;
    const cost = tokens * 0.000002; // Approximate cost for gpt-3.5-turbo

    console.log('✅ [homepage] OpenAI generation successful:', {
      contentLength: rawContent.length,
      tokens,
      cost: `$${cost.toFixed(4)}`
    });

    // Format and sanitize content for homepage blog
    const formatted = formatGeneratedContent(rawContent, anchorText, url);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        source: 'openai',
        provider: 'openai',
        content: formatted,
        usage: {
          tokens,
          cost
        },
        timestamp: new Date().toISOString(),
        context: 'homepage'
      })
    };

  } catch (error) {
    console.error('❌ [homepage] OpenAI Netlify function error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        success: false, 
        error: error.message || 'Internal server error',
        provider: 'openai',
        context: 'homepage'
      })
    };
  }
};
