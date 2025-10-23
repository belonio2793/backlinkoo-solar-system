#!/usr/bin/env node
/*
  Generates extended HTML content chunks for /sherlockhacksgoogle using the X_API (xAI Grok) if available.
  - Produces chunk-3.html ... chunk-14.html (approx 12 chunks ~8k-12k words total depending on model output)
  - Rebuilds manifest.json including existing chunks
  Safe-guards: if X_API missing or API fails repeatedly, exits with non-zero code to avoid writing placeholders.
*/
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

const API_KEY = process.env.X_API;
const OUT_DIR = path.join(process.cwd(), 'public', 'seo', 'sherlockhacksgoogle');

const sections = [
  ['Reverse‑Engineered Overview', 'Produce an authoritative, original overview of the “SHERLOCK HACKS GOOGLE by SarkarSEO” concept as a generalized methodology. Avoid copying from any source. Define the pillars, objectives, and the 2025 context (AI summaries, entity understanding, user intent). Use H3/H4 headings, paragraphs, and concise lists. 700‑900 words.'],
  ['Entity‑First SEO Deep Dive', 'Explain entity resolution, knowledge graphs, and brand co‑occurrence. Map diversified link sources to entity strengthening. Provide practical steps and examples (generic, not referencing specific brands). Output clean HTML body only. 700‑900 words.'],
  ['Backlink Quality Spectrum', 'Define quality tiers: editorial, contextual, web2 hubs, citations/profiles, social mentions. Explain risk controls, source vetting, and red flags. Include a short checklist. 700‑900 words.'],
  ['Anchor Text Pacing Framework', 'Detail a pacing model for anchors across phases with examples for informational vs commercial pages. Include dos and don’ts. 700‑900 words.'],
  ['Topical Maps & Internal Links', 'Show how site architecture (pillars/clusters) and internal links combine with external links to compound results. Provide an interlinking recipe and crawl path considerations. 700‑900 words.'],
  ['AI‑Era Signals and UX Proxies', 'Discuss how engagement, navigational queries, task completion, and SERP features influence rankings in 2025. Provide tactics to align link building with on‑page UX. 700‑900 words.'],
  ['Tiering Without Footprints', 'Explain compliant, careful tiering strategies that respect editorial integrity. Specify what NOT to do. 700‑900 words.'],
  ['Reporting & Measurement', 'Design transparent reporting: placement validation, anchor mix, topical match scoring, and correlation with rankings and conversions. Provide a minimal dashboard spec. 700‑900 words.'],
  ['Risk Management Playbook', 'Cover algorithm updates, volatility response, de‑risking with branded anchors, and what to do when a link is removed. 700‑900 words.'],
  ['Industry Examples', 'Create anonymized, illustrative examples: SaaS, e‑commerce, local services, content sites. Focus on strategy, not brand names. 700‑900 words.'],
  ['Comparisons & Alternatives', 'Compare agency‑led outreach, hybrid models, and in‑house. Provide decision criteria and when to switch approaches. 700‑900 words.'],
  ['Implementation Checklist', 'Step‑by‑step execution checklist covering research, sourcing, outreach, content, QA, deployment, and monitoring. 700‑900 words.'],
];

const SYSTEM_PROMPT = `You are an expert SEO strategist and technical writer. Write unique, original, non‑derivative content. Do not copy or paraphrase specific third‑party copy. Output HTML body only (no <html>, <head>, or <body> tags). Use semantic headings (h3/h4), paragraphs, lists, tables if useful. Tone: professional, precise, helpful. Avoid promotional claims. Avoid placeholders or TODOs. Ensure each response meets the requested word count target.`;

async function ensureDir(dir) {
  await fsp.mkdir(dir, { recursive: true });
}

async function callXAI(prompt) {
  if (!API_KEY) throw new Error('Missing X_API');
  const resp = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: 'grok-2-latest',
      temperature: 0.8,
      max_tokens: 1800,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ]
    })
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`xAI error ${resp.status}: ${text}`);
  }
  const data = await resp.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content || typeof content !== 'string') throw new Error('Empty content from xAI');
  return content.trim();
}

async function writeManifestFromDir(dir) {
  const files = (await fsp.readdir(dir)).filter(f => /^chunk-\d+\.html$/.test(f));
  files.sort((a, b) => {
    const na = parseInt(a.match(/(\d+)/)[1], 10);
    const nb = parseInt(b.match(/(\d+)/)[1], 10);
    return na - nb;
  });
  const manifest = { chunks: files };
  await fsp.writeFile(path.join(dir, 'manifest.json'), JSON.stringify(manifest));
}

(async () => {
  try {
    await ensureDir(OUT_DIR);
    // Determine next chunk index
    const existing = (await fsp.readdir(OUT_DIR)).filter(f => /^chunk-\d+\.html$/.test(f));
    const used = new Set(existing.map(f => parseInt(f.match(/(\d+)/)[1], 10)));
    let nextIndex = 3; // start after our seeded 1 & 2

    for (let i = 0; i < sections.length; i++) {
      const [title, instruction] = sections[i];
      const prompt = `Title: ${title}\n\n${instruction}\n\nImportant: The target keyword is "SHERLOCK HACKS GOOGLE by SarkarSEO". Include it naturally (exact match) a few times, plus related terms (link building, backlinks, anchor text, entity SEO, AI).`;
      // Find a free filename
      while (used.has(nextIndex)) nextIndex++;
      const filename = `chunk-${nextIndex}.html`;
      const outPath = path.join(OUT_DIR, filename);
      console.log(`Generating ${filename} -> ${title}`);
      const html = await callXAI(prompt);
      // Basic sanity check: ensure no <html> or <body> wrappers
      const clean = html.replace(/<\/?(html|head|body)[^>]*>/gi, '').trim();
      // Avoid trivial outputs
      if (clean.split(/\s+/).length < 300) throw new Error('Generated content too short');
      await fsp.writeFile(outPath, clean);
      used.add(nextIndex);
      nextIndex++;
    }

    await writeManifestFromDir(OUT_DIR);
    console.log('Done. Manifest updated.');
  } catch (err) {
    console.error('Generation failed:', err?.message || err);
    process.exit(1);
  }
})();
