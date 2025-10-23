import fs from 'fs/promises';
import path from 'path';

const API = process.env.X_API;
if (!API) {
  console.error('Missing X_API');
  process.exit(1);
}

const OUTPUT = path.resolve('tmp/cyrus-long-sections.json');
const topics = [
  {
    id: 'origins-and-early-experiments',
    focus: 'Narrate Cyrus Shepard’s origin story, the curiosity that led him into SEO, how experimentation defined his early projects, and how these experiences informed his tenure at Moz and ultimately inspired Zyppy.'
  },
  {
    id: 'philosophy-and-principles',
    focus: 'Explain Cyrus Shepard’s philosophy that SEO is helpful marketing, outline his evidence-backed approach, and detail how he communicates these principles to clients and readers.'
  },
  {
    id: 'moz-era-contributions',
    focus: 'Describe Cyrus Shepard’s contributions during his Moz years, including Whiteboard Friday appearances, community mentorship, and the analytical mindset he helped popularize.'
  },
  {
    id: 'zyppy-mission-and-platforms',
    focus: 'Dive into Zyppy’s creation, the services it provides, initiatives like Zyppy List, and how the platform packages Cyrus Shepard’s research into repeatable playbooks.'
  },
  {
    id: 'signature-research-studies',
    focus: 'Highlight hallmark studies such as Google rewriting title tags, the disavow experiment, 23 million internal links, AI Overviews analysis, and how Cyrus Shepard documents methodology so teams can replicate insights.'
  },
  {
    id: 'consulting-framework',
    focus: 'Unpack Cyrus Shepard’s consulting process for SaaS and enterprise teams, detailing discovery, hypothesis building, stakeholder alignment, and the cadence of deliverables.'
  },
  {
    id: 'link-earning-and-digital-pr',
    focus: 'Cover Cyrus Shepard’s approach to link earning, outreach ethics, HARO-alternative tactics, and how he builds relationship-based digital PR engines.'
  },
  {
    id: 'content-architecture-and-onpage',
    focus: 'Explain how Cyrus Shepard structures content hierarchies, resolves cannibalization, and balances intent satisfaction with long-form storytelling.'
  },
  {
    id: 'technical-seo-and-automation',
    focus: 'Discuss technical SEO vigilance, how Cyrus Shepard addresses crawling, indexation, structured data, and how he uses automation without sacrificing editorial quality.'
  },
  {
    id: 'measurement-and-reporting',
    focus: 'Detail the measurement stack Cyrus Shepard prefers, including query clustering, leading indicators, dashboards, and how he communicates results to executives.'
  },
  {
    id: 'education-and-community-leadership',
    focus: 'Describe Cyrus Shepard’s role as an educator, his speaking engagements, workshops, and how his articles, newsletters, and community mentorship elevate practitioners.'
  },
  {
    id: 'future-trends-and-guidance',
    focus: 'Speculate, through Cyrus Shepard’s lens, on the future of SEO, AI-assisted workflows, and how he advises teams to stay adaptable without chasing shortcuts.'
  }
];

const referenceFacts = `Facts to respect:\n- Cyrus Shepard is the founder of Zyppy SEO (https://zyppy.com/cyrus/).\n- He is a data-driven SaaS SEO consultant who values evidence-backed testing and actionable strategies.\n- He previously worked at Moz, contributing to Moz Blog, Whiteboard Friday, and community training.\n- He publishes research on topics such as Google rewriting title tags, internal linking at scale, AI Overviews, disavowing every link to a site, HARO outreach alternatives, and Google quality updates.\n- He works with startups and Fortune 500 companies, focusing on experiment design, measurement, and ethical link acquisition.\n- Zyppy List is a directory for marketing professionals that he announced on the Zyppy blog.\n- His recent articles include: \"What Is Neil Hiding? Bankrupt FTX Sues Neil Patel to Recover Millions in Payments\", \"How AI Overviews Shift Traffic From Publishers to Google\", \"Announcing Zyppy List: A Next-Level Directory For Marketing Pros\", \"Google’s Index Size Revealed: 400 Billion Docs (& Changing)\", \"I Disavowed Every Link To My Website. Here’s What Happened\", \"How Sites With Less SEO Win Google + 4 More SEO Tips\", \"How Recent Google Updates Punish Good SEO: 50-Site Case Study\", \"Link Building With HARO Alternatives + How to Implement Ranch-Style SEO\", \"Ranking Higher by Satisfying Intent Quicker + 5 More SEO Tips\", and \"A New Google Page Quality Rating Scorecard + Top 2024 SEO Tips\".\n- He speaks at industry events such as MozCon and SMX, mentors practitioners, and emphasizes transparent reporting.\n- Emphasize the primary keyword \"Cyrus Shepard\" naturally throughout the narrative.`;

async function callXAI(topic) {
  const messages = [
    {
      role: 'system',
      content: 'You are an expert SEO analyst and senior copywriter. You must output valid JSON only. Tone should resemble polished long-form features on Medium. Avoid bullet lists and numbered lists; write in immersive paragraphs.'
    },
    {
      role: 'user',
      content: `${referenceFacts}\n\nTopic focus: ${topic.focus}\n\nReturn a strict JSON object with keys id, title, summary, paragraphs. Requirements:\n- id must be exactly \"${topic.id}\".\n- title should be 6-12 words, headline case, inclusive of \"Cyrus Shepard\" or a close variant.\n- summary must be a single sentence between 32 and 42 words.\n- paragraphs must be an array of 7 items. Each item must be a paragraph between 170 and 220 words, no bullet lists, no headings, no markdown.\n- Weave the keyword \"Cyrus Shepard\" at least twice across the full set of paragraphs.\n- Reference the provided facts where relevant and keep claims accurate.\n- Write with vivid detail, transitions, and specific examples that sound authoritative.\n- Avoid repeating sentences across paragraphs.`
    }
  ];

  const body = { model: 'grok-2-latest', temperature: 0.45, max_tokens: 3600, messages };
  const resp = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  const text = await resp.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch (error) {
    throw new Error(`Failed to parse X.AI response for topic ${topic.id}: ${text}`);
  }

  if (!resp.ok) {
    const err = json?.error?.message || text;
    throw new Error(`X.AI error for ${topic.id}: ${err}`);
  }

  const content = json?.choices?.[0]?.message?.content;
  if (!content || typeof content !== 'string') {
    throw new Error(`Empty content for ${topic.id}`);
  }

  const sanitized = content.trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();

  let data;
  try {
    data = JSON.parse(sanitized);
  } catch (error) {
    throw new Error(`Model output not JSON for ${topic.id}: ${content}`);
  }

  if (!data || data.id !== topic.id || !Array.isArray(data.paragraphs)) {
    throw new Error(`Unexpected structure for ${topic.id}`);
  }

  return data;
}

function countWords(text) {
  return String(text).split(/\s+/).filter(Boolean).length;
}

(async () => {
  const sections = [];
  for (const topic of topics) {
    console.error(`Generating section ${topic.id}...`);
    const section = await callXAI(topic);
    sections.push(section);
  }

  const totalWords = sections.reduce((sum, section) => {
    const summaryWords = countWords(section.summary);
    const paragraphWords = section.paragraphs.reduce((acc, paragraph) => acc + countWords(paragraph), 0);
    return sum + summaryWords + paragraphWords;
  }, 0);

  await fs.mkdir(path.dirname(OUTPUT), { recursive: true });
  await fs.writeFile(OUTPUT, JSON.stringify({ generatedAt: new Date().toISOString(), totalWords, sections }, null, 2), 'utf8');
  console.log(`Wrote ${OUTPUT} with approximately ${totalWords} words`);
})();
