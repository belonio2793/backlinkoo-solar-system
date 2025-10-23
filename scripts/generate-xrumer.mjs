import fs from 'fs';
import path from 'path';

const X_API = process.env.X_API;
if (!X_API) {
  console.error('Missing X_API environment variable.');
  process.exit(1);
}

const SECTIONS = [
  { key: 'overview', title: 'XRumer at a Glance' },
  { key: 'history', title: 'Origin and Evolution' },
  { key: 'architecture', title: 'Core Architecture (Conceptual)' },
  { key: 'capabilities', title: 'Reported Capabilities' },
  { key: 'usage', title: 'How It Was Used Historically' },
  { key: 'seo_impact', title: 'SEO Impact and Modern Relevance' },
  { key: 'ethics', title: 'Ethical Considerations' },
  { key: 'detection', title: 'Detection and Countermeasures' },
  { key: 'alternatives', title: 'Responsible Alternatives' },
  { key: 'best_practices', title: 'Modern Best Practices' },
  { key: 'case_studies', title: 'Case Studies and Lessons' },
  { key: 'legal', title: 'Legal Notes' },
  { key: 'faq', title: 'XRumer FAQs' },
  { key: 'glossary', title: 'Glossary' },
  { key: 'resources', title: 'Further Reading & Resources' },
];

function sleep(ms){return new Promise(r=>setTimeout(r,ms));}

async function generateSection(section, words=700){
  const prompt = `You are an expert technical writer and SEO specialist. Produce an authoritative, original, neutral, factual, and educational section about "${section.title}" in relation to XRumer (referencing publicly available information like Wikipedia). Do not provide step-by-step instructions for abusive activity. Format output as Markdown with headings, subheadings and multiple short paragraphs. Aim for approximately ${words} words.`;

  const body = {
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are a professional SEO copywriter. Output valid Markdown only.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.2,
    max_tokens: 2000
  };

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${X_API}`
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`OpenAI HTTP ${res.status}: ${txt}`);
  }
  const json = await res.json();
  const content = json.choices?.[0]?.message?.content || json.choices?.[0]?.text || '';
  return content;
}

(async ()=>{
  console.log('Starting XRumer content generation...');
  const out = {};
  for (const s of SECTIONS) {
    console.log('Generating:', s.title);
    try {
      const content = await generateSection(s, 700);
      out[s.key] = content.replaceAll('\r\n','\n');
      // be kind to API
      await sleep(1200);
    } catch (e) {
      console.error('Failed section', s.key, e);
      out[s.key] = `Failed to generate section: ${e.message}`;
    }
  }

  const publicDir = path.resolve(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
  const filePath = path.join(publicDir, 'xrumer.generated.json');
  fs.writeFileSync(filePath, JSON.stringify(out, null, 2), 'utf8');
  console.log('Wrote generated content to', filePath);
})();
