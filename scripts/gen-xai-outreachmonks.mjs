#!/usr/bin/env node
/**
 * Generate ~10,000 words of HTML content for Outreach Monks using x.ai (Grok) via X_API.
 * Writes output to public/outreachmonks-content.html
 */

const fs = await import('fs');
const path = await import('path');

const API = process.env.X_API;
if (!API) {
  console.error('Missing X_API');
  process.exit(1);
}

const OUT = path.resolve('public/outreachmonks-content.html');

async function callXAI(prompt, maxTokens = 3000) {
  const body = {
    model: 'grok-2-latest',
    temperature: 0.5,
    max_tokens: maxTokens,
    messages: [
      { role: 'system', content: 'You are an expert SEO analyst and copywriter. Output valid HTML only. Use semantic headings, lists, and paragraphs. No markdown fences.' },
      { role: 'user', content: prompt }
    ]
  };
  const resp = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${API}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const text = await resp.text();
  let json = null;
  try { json = JSON.parse(text); } catch {
    throw new Error(`Non-JSON response: ${text.slice(0, 500)}`);
  }
  if (!resp.ok) {
    const err = json?.error?.message || text;
    throw new Error(String(err));
  }
  const html = json?.choices?.[0]?.message?.content || '';
  if (!html || typeof html !== 'string') throw new Error('Empty content');
  return html;
}

function wordCount(html) {
  const text = String(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  if (!text) return 0; return text.split(/\s+/).length;
}

const prompts = [
  'Outreach Monks full executive overview with history, mission, value proposition, and philosophy of white-hat link building. Include sections on brand voice, trust signals, and measurable ROI frameworks. Output valid HTML only.',
  'Deep services catalog for Outreach Monks: guest posts, blogger outreach, link insertions (niche edits), brand mentions, local citations, multilingual/country-specific link building, and content creation. Detail deliverables, quality criteria, SLAs, and reporting. HTML only.',
  'Industry playbooks: SaaS, law, ecommerce, real estate, technology, cannabis, and iGaming. For each, outline audience pain points, publisher selection rules, anchor guidelines, and acceptable examples. HTML only.',
  'Quality control and risk management: domain vetting, traffic thresholds, topical relevance, anchor diversification, link velocity, indexation monitoring, and replacement policy. Include algorithm update preparedness. HTML only.',
  'Competitive landscape and alternatives: compare Outreach Monks vs Loganix, The HOTH, FATJOE across pricing levers, editorial strictness, turnaround, and best-fit scenarios. HTML only.',
  '90-day playbook and SOPs: onboarding, briefs, approvals, CRO alignment, internal linking, measurement framework, and quarterly renegotiation checklist. Include FAQs. HTML only.'
];

async function main() {
  let combined = '';
  for (let i = 0; i < prompts.length; i++) {
    console.error(`Generating chunk ${i+1}/${prompts.length}...`);
    const chunk = await callXAI(prompts[i], 3200);
    combined += `\n<section class=\"om-section\">${chunk}</section>`;
  }

  let attempts = 0;
  while (wordCount(combined) < 10000 && attempts < 30) {
    console.error(`Top-up attempt ${attempts+1} (current ~${wordCount(combined)} words)...`);
    const extra = await callXAI('Extended Outreach Monks technical deep dive: case studies, anchor distributions by funnel stage, geo-targeted outreach nuances, reporting templates, and common pitfalls with remediations. HTML only.', 3000);
    combined += `\n<section class=\"om-section\">${extra}</section>`;
    attempts++;
  }

  const header = `<!-- Generated ${new Date().toISOString()} with x.ai via X_API; Approx words: ${wordCount(combined)} -->\n`;
  await fs.promises.writeFile(OUT, header + combined, 'utf8');
  console.error(`Wrote ${OUT}`);
  console.log(`OK ${wordCount(combined)}`);
}

main().catch((e) => { console.error(e.stack || e.message || String(e)); process.exit(1); });
