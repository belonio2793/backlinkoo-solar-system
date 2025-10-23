#!/usr/bin/env node
/**
 * Generate ~10,000 words of HTML content for Outreach Labs using x.ai (Grok) via X_API.
 * Writes output to public/outreachlabs-content.html
 */

const fs = await import('fs');
const path = await import('path');

const API = process.env.X_API;
if (!API) {
  console.error('Missing X_API');
  process.exit(1);
}

const OUT = path.resolve('public/outreachlabs-content.html');

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
  'Outreach Labs executive overview with positioning, differentiation, and philosophy of relevance-first link building. Include buyer expectations and success criteria. HTML only.',
  'Services catalog for Outreach Labs: blogger outreach, editorial guest posts, link insertions (niche edits), digital PR, white-label. Detail deliverables, QA criteria, SLAs, and reporting. HTML only.',
  'Industry playbooks: SaaS, ecommerce, services, AI/LLM. For each, outline publisher selection rules, anchor guidelines, and examples of acceptable placements. HTML only.',
  'Quality and risk management: domain vetting, traffic thresholds, topical relevance, anchor diversification, link velocity, indexation checks, and replacement policies. HTML only.',
  'Comparative landscape vs providers like Loganix, The HOTH, FATJOE—who each best serves, tradeoffs, pricing levers, and editorial strictness. HTML only.',
  '90-day playbook: onboarding, briefs, approvals, CRO alignment, internal linking, measurement framework, FAQ page, and schema considerations. HTML only.'
];

async function main() {
  let combined = '';
  for (let i = 0; i < prompts.length; i++) {
    console.error(`Generating chunk ${i+1}/${prompts.length}...`);
    const chunk = await callXAI(prompts[i], 3200);
    combined += `\n<section class=\"ol-section\">${chunk}</section>`;
  }

  let attempts = 0;
  while (wordCount(combined) < 10000 && attempts < 30) {
    console.error(`Top-up attempt ${attempts+1} (current ~${wordCount(combined)} words)...`);
    const extra = await callXAI('Extended Outreach Labs deep dive: technical workflows, anchor distributions by funnel stage, geo-targeted nuances, reporting templates, and common pitfalls with remediations. HTML only.', 3000);
    combined += `\n<section class=\"ol-section\">${extra}</section>`;
    attempts++;
  }

  const header = `<!-- Generated ${new Date().toISOString()} with x.ai via X_API; Approx words: ${wordCount(combined)} -->\n`;
  await fs.promises.mkdir(path.dirname(OUT), { recursive: true });
  await fs.promises.writeFile(OUT, header + combined, 'utf8');
  console.error(`Wrote ${OUT}`);
  console.log(`OK ${wordCount(combined)}`);
}

main().catch((e) => { console.error(e.stack || e.message || String(e)); process.exit(1); });
