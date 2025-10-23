/**
 * generate-seo-page
 * Builds a long-form, styled HTML page from a source URL + keyword.
 * Tries AI providers if available; otherwise synthesizes content from the source page.
 */

const { parse } = require('node-html-parser');

exports.handler = async (event) => {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: cors, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: cors, body: JSON.stringify({ success: false, error: 'Method not allowed' }) };

  try {
    const { url, keyword, slug: _slug, wordCount = 10000 } = JSON.parse(event.body || '{}');
    if (!url || !keyword) {
      return { statusCode: 400, headers: cors, body: JSON.stringify({ success: false, error: 'Missing url or keyword' }) };
    }

    const slug = slugify(_slug || keyword || url);

    // 1) Attempt provider: OpenAI via existing internal function
    const tryOpenAI = async () => {
      try {
        const resp = await fetch(process.env.VITE_NETLIFY_FUNCTIONS_URL ? `${process.env.VITE_NETLIFY_FUNCTIONS_URL}/automation-generate-openai` : '/.netlify/functions/automation-generate-openai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ keyword, url, anchorText: keyword, wordCount })
        });
        const data = await resp.json();
        if (resp.ok && data && data.html) return data.html;
      } catch {}
      return '';
    };

    // 2) Attempt provider: X_API (if known compatible endpoint available)
    const tryXAI = async () => {
      try {
        const X = process.env.X_API;
        if (!X) return '';
        // Attempt OpenAI-compatible endpoint if available in env (some gateways support it)
        const resp = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${X}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'user', content: buildAiPrompt(url, keyword, wordCount) }
            ],
            temperature: 0.6,
            max_tokens: Math.min(12000, Math.floor(wordCount * 1.8))
          })
        });
        const data = await resp.json();
        if (resp.ok && data?.choices?.[0]?.message?.content) {
          return normalizeHtml(data.choices[0].message.content);
        }
      } catch {}
      return '';
    };

    let html = '';
    // Prefer X first (user requested), then OpenAI
    html = (await tryXAI()) || (await tryOpenAI());

    // 3) If no AI, synthesize from source URL content
    if (!html) {
      const { title, description, sections } = await fetchAndExtract(url);
      html = buildSynthesisHtml({ url, keyword, title, description, sections, wordCount });
    }

    const meta = {
      title: deriveTitle(html, keyword),
      description: deriveDescription(html, keyword),
      keyword
    };

    const wc = countWords(html);

    return {
      statusCode: 200,
      headers: { ...cors, 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, slug, html, meta, word_count: wc })
    };
  } catch (error) {
    return { statusCode: 500, headers: cors, body: JSON.stringify({ success: false, error: error.message || 'Internal error' }) };
  }
};

function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/https?:\/\/|www\./g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 140) || 'post';
}

function countWords(html) {
  return String(html || '').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
}

function deriveTitle(html, keyword) {
  const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1];
  return (h1 && strip(h1)) || `${capitalize(keyword)} — Definitive Deep Dive`;
}

function deriveDescription(html, keyword) {
  const p = (html.match(/<p[^>]*>([\s\S]*?)<\/p>/i) || [])[1];
  return (p && strip(p).slice(0, 160)) || `A comprehensive, long-form exploration of ${keyword}.`;
}

function strip(s) { return String(s || '').replace(/<[^>]+>/g, '').trim(); }
function capitalize(s) { return String(s || '').charAt(0).toUpperCase() + String(s || '').slice(1); }

function buildAiPrompt(url, keyword, wordCount) {
  return `Do a deep dive on this URL: ${url} and create a perfect search engine optimization based page 
  "${'/' + slugify(keyword)}"\n\nTarget this specific keyword: ${keyword}. Create about ${wordCount} words.\n\nWrite as a beautifully formatted HTML page (no markdown) with sections, anchor-linked table of contents, sticky progress bar, media gallery using stock image/video URLs, pricing/services tables, pros/cons, risk playbook, FAQ, glossary, and JSON-LD (WebPage, Organization, FAQ, Breadcrumb).\n\nUse elegant, professional, Medium-style paragraphs and headings. Paraphrase and curate insights; stay accurate. Naturally include a hyperlink to ${url} with anchor text "${keyword}" at least once. Do not include scripts that fetch external content. Provide one self-contained HTML article with semantic tags and inline styles for key components.`;
}

async function fetchAndExtract(url) {
  try {
    const resp = await fetch(url, { headers: { 'User-Agent': 'BacklinkooBot/1.0 (+https://backlinkoo.com)' } });
    const html = await resp.text();
    const root = parse(html);
    const title = root.querySelector('title')?.text?.trim() || '';
    const description = root.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    const h2s = root.querySelectorAll('h1, h2, h3');
    const ps = root.querySelectorAll('p');
    const sections = {
      headings: h2s.slice(0, 50).map(n => strip(n.text || '')),
      paras: ps.slice(0, 400).map(n => strip(n.text || '')).filter(Boolean)
    };
    return { title, description, sections };
  } catch {
    return { title: '', description: '', sections: { headings: [], paras: [] } };
  }
}

function buildSynthesisHtml({ url, keyword, title, description, sections, wordCount }) {
  const intro = description || `This page presents a curated, research-driven exploration of ${keyword}.`;
  const seed = [
    `<h1>${escapeHtml(title || `${capitalize(keyword)} — Comprehensive Review`)}</h1>`,
    `<p>${escapeHtml(intro)}</p>`
  ];
  const toc = `
  <nav class="gen-toc">
    <div class="gen-toc__title">On this page</div>
    <ul>
      ${['overview','media','pricing','services','backlinks','process','stories','cases','fit','proscons','risks','checklist','alternatives','glossary','faq','ctas'].map(id => `<li><a href="#${id}">${capitalize(id)}</a></li>`).join('')}
    </ul>
  </nav>`;

  const base = `
  <style>
    .gen-wrap{max-width:980px;margin:0 auto;padding:1rem}
    .gen-hero{padding:1rem 0 0.5rem;border-bottom:1px solid #e5e7eb}
    .gen-sub{color:#475569}
    .gen-grid{display:grid;grid-template-columns:1fr;gap:1rem}
    .gen-toc{position:sticky;top:72px;border:1px solid #e5e7eb;border-radius:12px;padding:12px;background:#fff}
    .gen-toc__title{font-weight:700;margin-bottom:6px}
    .gen-section{padding:1rem 0;border-bottom:1px dashed #e5e7eb}
    .gen-card{border:1px solid #e5e7eb;border-radius:12px;padding:12px;background:#fff}
    .gen-progress{position:sticky;top:0;height:3px;background:transparent}
    .gen-progress__bar{height:3px;background:linear-gradient(90deg,#10b981,#0ea5e9);width:0%}
    .gen-media{display:grid;grid-template-columns:1fr;gap:12px}
    @media(min-width:768px){.gen-media{grid-template-columns:1fr 1fr}}
    .gen-table{width:100%;border-collapse:separate;border-spacing:0}
    .gen-table th,.gen-table td{padding:10px;border-bottom:1px solid #e5e7eb;text-align:left}
    .gen-table thead th{background:#f8fafc}
  </style>
  <div class="gen-progress"><div class="gen-progress__bar" id="gen-progress-bar"></div></div>
  <script>(function(){function u(){try{var b=document.getElementById('gen-progress-bar');var c=document.getElementById('gen-content');if(!b||!c)return;var r=c.getBoundingClientRect();var t=Math.max(1,c.scrollHeight-window.innerHeight);var p=Math.min(100,Math.max(0,(-r.top)/t*100));b.style.width=p+'%'}catch{}}window.addEventListener('scroll',u,{passive:true});u();})();</script>
  <main class="gen-wrap">
    <header class="gen-hero">
      <p class="text-emerald-700 uppercase tracking-widest text-xs">Independent Review</p>
      ${seed.join('\n')}
      <p class="gen-sub">Target keyword: <strong>${escapeHtml(keyword)}</strong>. We analyzed <a href="${escapeHtml(url)}" target="_blank" rel="nofollow noopener">${escapeHtml(url)}</a> and synthesized an elegant, long‑form experience with media, tables, FAQs, and more.</p>
    </header>
    <div class="gen-grid" style="grid-template-columns:280px 1fr;gap:24px">
      ${toc}
      <article id="gen-content" class="prose max-w-none">
        ${sectionHtml('overview','Overview', buildParas(sections, keyword, 900))}
        ${mediaSection()}
        ${pricingSection(keyword)}
        ${servicesSection(keyword)}
        ${backlinksSection(keyword)}
        ${processSection(keyword)}
        ${storiesSection(keyword)}
        ${casesSection(keyword)}
        ${fitSection()}
        ${prosconsSection()}
        ${risksSection()}
        ${checklistSection()}
        ${alternativesSection()}
        ${glossarySection()}
        ${faqSection(url, keyword)}
        ${ctasSection(url, keyword)}
      </article>
    </div>
  </main>`;

  // Ensure approximate length by repeating enriched narrative blocks if needed
  let html = base;
  const currentWords = countWords(html);
  if (currentWords < wordCount) {
    const needed = wordCount - currentWords;
    const filler = repeatedInsights(keyword, Math.ceil(needed / 200)).join('\n');
    html = html.replace('</article>', `${sectionHtml('appendix','Appendix: Additional Insights', filler)}\n</article>`);
  }
  return html;
}

function sectionHtml(id, title, inner) {
  return `<section id="${id}" class="gen-section"><h2>${escapeHtml(title)}</h2>${inner}</section>`;
}

function buildParas(sections, keyword, approx = 600) {
  const pool = (sections.paras || []).slice(0, 100);
  if (!pool.length) return `<p>${escapeHtml(capitalize(keyword))} sits at the intersection of relevance, editorial quality, and measurable outcomes.</p>`;
  const out = [];
  let words = 0;
  for (const p of pool) {
    const para = enrichParagraph(p, keyword);
    out.push(`<p>${escapeHtml(para)}</p>`);
    words += para.split(/\s+/).length;
    if (words > approx) break;
  }
  return out.join('\n');
}

function enrichParagraph(text, keyword) {
  const base = text.replace(/\s+/g, ' ').trim();
  if (!base) return '';
  return `${base} This analysis examines ${keyword} from multiple angles—services, pricing references, editorial standards, process rigor, and practical outcomes.`;
}

function mediaSection() {
  return sectionHtml('media','Media Gallery', `
    <div class="gen-media">
      <div class="aspect-video" style="overflow:hidden;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,.05)">
        <video controls preload="metadata" style="width:100%;height:100%;object-fit:cover" poster="https://images.pexels.com/photos/95916/pexels-photo-95916.jpeg">
          <source src="https://videos.pexels.com/video-files/7054949/7054949-sd_960_540_24fps.mp4" type="video/mp4" />
        </video>
      </div>
      <div class="aspect-video" style="overflow:hidden;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,.05)">
        <video controls preload="metadata" style="width:100%;height:100%;object-fit:cover" poster="https://images.pexels.com/photos/669616/pexels-photo-669616.jpeg">
          <source src="https://videos.pexels.com/video-files/7578620/7578620-sd_506_960_25fps.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  `);
}

function pricingSection(keyword){
  return sectionHtml('pricing', `${capitalize(keyword)} Pricing References`, `
    <p>Public references often surface package- or scope-based pricing. Always verify current offers on the official site as they change over time.</p>
    <div class="gen-card"><table class="gen-table"><thead><tr><th>Package</th><th>Includes</th><th>Use When</th></tr></thead><tbody>
      <tr><td>Foundations</td><td>Citations / Basic Outreach</td><td>Establish baseline presence</td></tr>
      <tr><td>Growth</td><td>Managed Outreach + Content</td><td>Scale acquisition with QA</td></tr>
      <tr><td>Custom</td><td>Editorial PR / Research Assets</td><td>Compete in hard niches</td></tr>
    </tbody></table></div>
  `);
}

function servicesSection(keyword){
  return sectionHtml('services', `${capitalize(keyword)} Services`, `
    <div class="gen-grid" style="grid-template-columns:repeat(3,minmax(0,1fr))">
      <div class="gen-card"><h3>Outreach</h3><p>Goal-driven campaigns to earn relevant, editorial links.</p></div>
      <div class="gen-card"><h3>Niche Edits</h3><p>Contextual placements on vetted, existing articles.</p></div>
      <div class="gen-card"><h3>Citations</h3><p>Aggregator + directory submissions to reinforce local signals.</p></div>
      <div class="gen-card"><h3>Content</h3><p>Briefs and articles crafted for usefulness and linkability.</p></div>
      <div class="gen-card"><h3>Digital PR</h3><p>Story-led campaigns using data, expert commentary, and assets.</p></div>
      <div class="gen-card"><h3>SEO Support</h3><p>On-page/technical fixes so links land on pages ready to rank.</p></div>
    </div>
  `);
}

function backlinksSection(keyword){
  return sectionHtml('backlinks','Backlink Types & Editorial Criteria', `
    <ul>
      <li><strong>Guest Posts:</strong> New articles on relevant publications; vet editorial quality and audience fit.</li>
      <li><strong>Niche Edits:</strong> Links added to existing pieces; ensure natural context and stable indexing.</li>
      <li><strong>Digital PR:</strong> Earned media through compelling narratives and assets.</li>
      <li><strong>Resource Links:</strong> Inclusion in curated lists or guides when truly helpful.</li>
    </ul>
  `);
}

function processSection(keyword){
  return sectionHtml('process','Process & Reporting', `
    <ol>
      <li>Prospecting & Qualification</li>
      <li>Briefing & Drafting</li>
      <li>Placement & Publication</li>
      <li>Replacements & Escalations</li>
      <li>Reporting with URLs, anchors, dates, and notes</li>
    </ol>
  `);
}

function storiesSection(keyword){
  return sectionHtml('stories','Stories from the Field', `<p>Durable outcomes come from content that improves host publications and serves readers first. Outreach is a craft refined through thousands of interactions.</p>`);
}

function casesSection(keyword){
  return sectionHtml('cases','Case Studies (Composite)', `
    <div class="gen-grid" style="grid-template-columns:1fr 1fr">
      <div class="gen-card"><h3>Ecommerce</h3><p>Seasonal clusters + targeted outreach; internal links ladder to category pages to scale revenue.</p></div>
      <div class="gen-card"><h3>Local Services</h3><p>Citations + regional content; improved visibility for service + city terms and GMB interactions.</p></div>
    </div>
  `);
}

function fitSection(){
  return sectionHtml('fit','Who It’s For', `
    <div class="gen-grid" style="grid-template-columns:1fr 1fr">
      <div class="gen-card"><h3>Best Fit</h3><ul><li>Teams valuing predictable fulfillment</li><li>Local brands needing NAP integrity</li><li>Agencies requiring white‑label capacity</li></ul></div>
      <div class="gen-card"><h3>Customize</h3><ul><li>Enterprise PR mandates</li><li>Highly regulated categories</li><li>Hard niches needing bespoke assets</li></ul></div>
    </div>
  `);
}

function prosconsSection(){
  return sectionHtml('proscons','Pros & Cons', `
    <div class="gen-grid" style="grid-template-columns:1fr 1fr">
      <div class="gen-card"><h3>Pros</h3><ul><li>Clear scoping</li><li>Process discipline</li><li>Useful white‑label options</li></ul></div>
      <div class="gen-card"><h3>Cons</h3><ul><li>Editorial ceiling vs. top PR boutiques</li><li>Publisher quality varies; vet samples</li></ul></div>
    </div>
  `);
}

function risksSection(){
  return sectionHtml('risks','Risk Playbook', `<ol><li>Favor publications with substance</li><li>Diversify anchors and pages</li><li>Link to content that solves real problems</li><li>Keep a detailed placement ledger</li><li>Measure beyond link counts</li></ol>`);
}

function checklistSection(){
  return sectionHtml('checklist','Editorial Checklist', `<ul><li>Useful for the host audience</li><li>Originality and clear thesis</li><li>Evidence and examples</li><li>Natural link context</li><li>Coherent internal links</li></ul>`);
}

function alternativesSection(){
  return sectionHtml('alternatives','Alternatives', `<div class="gen-card"><table class="gen-table"><thead><tr><th>Provider</th><th>Strength</th><th>Consider When</th></tr></thead><tbody><tr><td>Page One Power</td><td>Editorial outreach</td><td>Need research‑heavy placements</td></tr><tr><td>Siege Media</td><td>Design‑forward PR</td><td>Investing in linkable assets</td></tr><tr><td>Authority Builders</td><td>Marketplace controls</td><td>Granular domain selection</td></tr></tbody></table></div>`);
}

function glossarySection(){
  return sectionHtml('glossary','Glossary', `<ul><li><strong>NAP:</strong> Name, Address, Phone consistency</li><li><strong>Guest Post:</strong> Contributed article</li><li><strong>Niche Edit:</strong> Link in existing article</li><li><strong>Aggregator:</strong> Distributes business data</li><li><strong>E‑E‑A‑T:</strong> Experience, Expertise, Authoritativeness, Trustworthiness</li></ul>`);
}

function faqSection(url, keyword){
  return sectionHtml('faq','FAQ', `<h3>Does this guarantee rankings?</h3><p>No provider can guarantee rankings. Focus on quality and fit.</p><h3>How long for results?</h3><p>3–6 months is common for compounding growth, faster for local data propagation.</p><h3>Will the page link to the source?</h3><p>Yes — we include a natural reference to <a href="${escapeHtml(url)}" target="_blank" rel="nofollow noopener">${escapeHtml(keyword)}</a>.</p>`);
}

function ctasSection(url, keyword){
  return sectionHtml('ctas','Get Started', `<div class="gen-grid" style="grid-template-columns:1fr 1fr"><a class="gen-card" href="${escapeHtml(url)}" target="_blank" rel="nofollow noopener"><h3>Visit Source</h3><p>Explore ${escapeHtml(url)}</p></a><a class="gen-card" href="/" rel="nofollow"><h3>Try Backlink ∞</h3><p>Generate reports and content with our toolkit.</p></a></div>`);
}

function repeatedInsights(keyword, blocks){
  const arr = [];
  for (let i=0;i<blocks;i++){
    arr.push(`<p>${capitalize(keyword)} strategies work best when aligned with audience needs, consistent editorial standards, and transparent reporting. This extended appendix collects additional perspectives and practical advice for teams operating in varied competitive contexts. Treat it as a reference you can scan during planning and review cycles.</p>`);
  }
  return arr;
}

function normalizeHtml(content){
  // If model returned markdown, make a light conversion of headings to HTML
  let txt = String(content || '').replace(/\r\n?/g, '\n');
  // Convert basic markdown headers
  txt = txt.replace(/^# (.*)$/gm, '<h1>$1</h1>')
           .replace(/^## (.*)$/gm, '<h2>$1</h2>')
           .replace(/^### (.*)$/gm, '<h3>$1</h3>');
  // Convert lists
  txt = txt.replace(/\n- (.*)/g, '\n<li>$1</li>');
  // Wrap list items in <ul>
  txt = txt.replace(/(<li>[^<]*<\/li>\s*)+/g, (m)=>`<ul>${m}</ul>`);
  return txt;
}

function escapeHtml(s){
  return String(s||'').replace(/[&<>"']/g, (c)=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;' }[c]));
}
