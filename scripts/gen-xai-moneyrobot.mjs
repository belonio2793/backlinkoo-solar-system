/**
 * Generate ~10,000 words of HTML content for Money Robot using x.ai (Grok) via X_API.
 * Writes output to public/moneyrobot-content.html (incremental and resumable)
 */

const fs = await import('fs');
const path = await import('path');

const API = process.env.X_API;
if (!API) {
  console.error('Missing X_API');
  process.exit(1);
}

const OUT = path.resolve('public/moneyrobot-content.html');

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

function stripHeader(input) {
  return String(input).replace(/^<!--[\s\S]*?-->\n?/, '');
}

async function writeOut(combined) {
  const header = `<!-- Generated ${new Date().toISOString()} with x.ai via X_API; Approx words: ${wordCount(combined)} -->\n`;
  await fs.promises.mkdir(path.dirname(OUT), { recursive: true });
  await fs.promises.writeFile(OUT, header + combined, 'utf8');
}

const prompts = [
  'Money Robot executive overview: automation scope, backlink types, strengths/limitations, and buyer success criteria. HTML only.',
  'Feature deep dive: AI content/spinning, captcha solving, site list updates, live link checker, tiered submissions, scheduling. HTML only.',
  'Governance and risk: footprints, anchor diversification, indexation validation, replacements/remediations. HTML only.',
  'Pricing overview: monthly vs lifetime, operational implications, pairing with editorial oversight. HTML only.',
  'Comparative landscape including Outreach Labs and marketplace providers—tradeoffs, pricing levers, editorial strictness. HTML only.',
  '90-day playbook with anchor distributions by funnel stage, internal linking SOPs, KPI dashboards. HTML only.'
];

async function main() {
  let combined = '';
  try {
    const existing = await fs.promises.readFile(OUT, 'utf8');
    combined = stripHeader(existing);
    console.error(`Resuming from existing file (~${wordCount(combined)} words)...`);
  } catch {}

  // Seed base prompts if file is empty or small
  if (wordCount(combined) < 800) {
    for (let i = 0; i < prompts.length; i++) {
      console.error(`Generating chunk ${i+1}/${prompts.length}...`);
      const chunk = await callXAI(prompts[i], 3200);
      combined += `\n<section class=\"mr-section\">${chunk}</section>`;
      await writeOut(combined);
    }
  }

  let attempts = 0;
  while (wordCount(combined) < 10000 && attempts < 60) {
    console.error(`Top-up attempt ${attempts+1} (current ~${wordCount(combined)} words)...`);
    const extra = await callXAI('Extended Money Robot deep dive: platform mixes, geo/niche nuances, reporting templates, and common pitfalls with remediations. HTML only.', 3000);
    combined += `\n<section class=\"mr-section\">${extra}</section>`;
    await writeOut(combined);
    attempts++;
  }

  await writeOut(combined);
  console.error(`Wrote ${OUT}`);
  console.log(`OK ${wordCount(combined)}`);
}

main().catch((e) => { console.error(e.stack || e.message || String(e)); process.exit(1); });
