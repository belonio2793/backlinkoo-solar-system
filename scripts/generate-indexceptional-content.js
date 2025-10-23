// Generates extended Indexceptional content using X.AI via X_API env and writes to public/indexceptional-content.html
// Uses Node 18+ global fetch. Outputs valid HTML only, sectioned and styled.

const fs = await import('fs');
const path = await import('path');

const API_KEY = process.env.X_API;
if (!API_KEY) {
  console.error('X_API not set. Aborting.');
  process.exit(1);
}

const system = 'You are an expert SEO analyst and technical writer. Output valid HTML only with semantic headings and paragraphs. No markdown fences.';

const prompts = [
  'Indexceptional deep analysis: overview, value proposition, unique differentiators vs. generic indexers; include best practices and risks. Medium style HTML only.',
  'Operations & credit governance: batching, scheduling, retries, SLAs, dashboards, and cross-team workflows. HTML only, with subsections and lists.',
  'Backlinks synergy: anchor strategy, link velocity governance, topical clustering, internal link blueprints, and outreach alignment. HTML only.',
  'Technical SEO: sitemaps, canonicals, crawl budget, hreflang, structured data, pagination, JS rendering, and log-based QA. HTML only.',
  'Measurement: KPIs, discovery latency, indexation cohort analysis, assisted conversions, attribution windows, and reporting templates. HTML only.',
  'Industry playbooks: SaaS, Ecommerce, Fintech, Health, Media — unique URL types, schema, risks, and success patterns. HTML only.',
  'Case studies: launch week coordination, remediation of under-indexed archives, and internationalization rollouts. HTML only.',
  'FAQ & troubleshooting: common pitfalls, replacement policies, monitoring cadence, escalation paths, and governance. HTML only.',
  'System architecture: signal pathways, error handling, resilience patterns, queues, and observability with practical dashboards. HTML only.',
  'UX patterns: present content in Medium-like rhythm — short paragraphs, scannable subheads, quotations, callouts, and checklists. HTML only.',
  'Compliance & governance: privacy, consent, logging, role-based access, audit trails, and incident response. HTML only.',
  'Glossary & definitions: indexation, crawl budget, canonicalization, soft 404, link equity, topical authority, and more. HTML only.',
  'Implementation checklist: preflight checks, rollout plan, validation steps, backout plan, and week-by-week cadence. HTML only.',
  'Advanced link building alignment: digital PR, brand mentions, partial vs exact match anchors, hub-and-spoke updates, and measurement. HTML only.'
];

async function callXAI(prompt, maxTokens = 2800) {
  const body = { model: 'grok-2-latest', temperature: 0.5, max_tokens: maxTokens, messages: [ { role: 'system', content: system }, { role: 'user', content: prompt } ] };
  const res = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`XAI error ${res.status}: ${txt}`);
  }
  const json = await res.json();
  const content = json?.choices?.[0]?.message?.content || '';
  return content;
}

const outDir = path.resolve('public');
const outFile = path.join(outDir, 'indexceptional-content.html');
await fs.promises.mkdir(outDir, { recursive: true });

let combined = '';
for (let i = 0; i < prompts.length; i++) {
  try {
    const html = await callXAI(prompts[i], 2800);
    combined += `\n<section class="ix-section">${html}</section>`;
    // brief delay to be polite
    await new Promise(r => setTimeout(r, 300));
  } catch (e) {
    console.error('Chunk failed', i + 1, e?.message || e);
  }
}

if (!combined.trim()) {
  console.error('No content generated.');
  process.exit(2);
}

await fs.promises.writeFile(outFile, combined, 'utf8');
console.log('Wrote', outFile, 'bytes', Buffer.byteLength(combined));
