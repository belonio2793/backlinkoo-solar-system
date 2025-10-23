#!/usr/bin/env node
/* Generate extended HTML chunks for /scrapebox using X_API (xAI). */
const fsp = require('fs/promises');
const path = require('path');
const API_KEY = process.env.X_API;
const OUT_DIR = path.join(process.cwd(), 'public', 'seo', 'scrapebox');

const sections = [
  ['Capabilities & Architecture', 'Explain Scrapebox core capabilities (harvesting, enrichment, auditing) and a high‑level architecture. Provide practical guidance for 2025 usage. 700‑900 words.'],
  ['Proxy & Throttling Strategy', 'Safe, respectful scraping: proxies, backoff, concurrency, and rotating user agents. Include a short checklist. 700‑900 words.'],
  ['Advanced Harvesting Patterns', 'Compose complex operators and footprints to discover platforms, prospects, and research targets. Give safe patterns and filtering tips. 700‑900 words.'],
  ['Prospecting to Outreach Pipeline', 'Turn harvested lists into vetted dossiers: relevance filters, topic matching, contact pages, and enrichment. 700‑900 words.'],
  ['SERP & Content Auditing', 'Capture titles, headings, word counts, internal/outbound link ratios, and detect gaps. 700‑900 words.'],
  ['Keyword Expansion & Clustering', 'Use suggests and modifiers; cluster by intent; map to pillars and support articles. 700‑900 words.'],
  ['Broken Link Discovery (Ethical)', 'Use 404 discovery and replacements to offer value to publishers (no spam). 700‑900 words.'],
  ['Footprint Safety Playbook', 'Enumerate do’s and don’ts; emphasize legal and ethical considerations. 700‑900 words.'],
  ['Automation Without Spam', 'Automate deduping, labeling, classification, and QA. Keep outreach personalized and human‑led. 700‑900 words.'],
  ['Industry Examples', 'Create anonymized examples (SaaS, ecommerce, local) to show different pipelines and KPIs. 700‑900 words.'],
  ['Comparison With Other Tools', 'Position Scrapebox among modern stacks; when to pair it with other research or outreach tools. 700‑900 words.'],
  ['Implementation Checklist', 'A step‑by‑step execution plan from setup to reporting. 700‑900 words.']
];

const SYSTEM_PROMPT = `You are an expert technical SEO and operations writer. Produce unique, original, non‑derivative content. Do not copy site copy. Output HTML body only (no <html>, <head>, or <body>). Use semantic headings (h3/h4), paragraphs, and lists. Tone: practical, precise, ethical.`;

async function ensureDir(dir){ await fsp.mkdir(dir,{recursive:true}); }
async function callXAI(prompt){
  if(!API_KEY) throw new Error('Missing X_API');
  const resp = await fetch('https://api.x.ai/v1/chat/completions',{
    method:'POST',
    headers:{'Content-Type':'application/json','Authorization':`Bearer ${API_KEY}`},
    body:JSON.stringify({model:'grok-2-latest',temperature:0.8,max_tokens:1800,messages:[{role:'system',content:SYSTEM_PROMPT},{role:'user',content:prompt}]})
  });
  if(!resp.ok){ throw new Error(`xAI error ${resp.status}: ${await resp.text()}`); }
  const data = await resp.json();
  const content = data?.choices?.[0]?.message?.content;
  if(!content) throw new Error('Empty content');
  return content.replace(/<\/?(html|head|body)[^>]*>/gi,'').trim();
}

async function writeManifestFromDir(dir){
  const files = (await fsp.readdir(dir)).filter(f=>/^chunk-\d+\.html$/.test(f)).sort((a,b)=>parseInt(a.match(/(\d+)/)[1])-parseInt(b.match(/(\d+)/)[1]));
  await fsp.writeFile(path.join(dir,'manifest.json'), JSON.stringify({chunks:files}));
}

(async()=>{
  try{
    await ensureDir(OUT_DIR);
    const existing = (await fsp.readdir(OUT_DIR)).filter(f=>/^chunk-\d+\.html$/.test(f));
    const used = new Set(existing.map(f=>parseInt(f.match(/(\d+)/)[1])));
    let next = 3;
    for(const [title,instruction] of sections){
      while(used.has(next)) next++;
      const file = `chunk-${next}.html`;
      const prompt = `Title: ${title}\n\n${instruction}\n\nImportant: Target keyword is "Scrapebox". Include it naturally. Cover link building, backlinks, harvesting, auditing, footprint safety.`;
      console.log('Generating', file, '->', title);
      const html = await callXAI(prompt);
      if(html.split(/\s+/).length < 300) throw new Error('Generated content too short');
      await fsp.writeFile(path.join(OUT_DIR,file), html);
      used.add(next); next++;
    }
    await writeManifestFromDir(OUT_DIR);
    console.log('Done. Manifest updated.');
  }catch(e){ console.error('Generation failed:', e?.message||e); process.exit(1); }
})();
