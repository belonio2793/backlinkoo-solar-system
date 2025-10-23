import React, { useMemo, useState } from 'react';

export default function ContentBriefGenerator() {
  const [topic, setTopic] = useState('SEO audit checklist');
  const [persona, setPersona] = useState('Marketing Manager');
  const [stage, setStage] = useState('Consideration');

  const brief = useMemo(() => {
    return [
      `Title: ${topic} — A Practical Guide for ${persona}`,
      'Reader Intent: clarify the problem, steps, pitfalls, and success criteria.',
      'Outline:',
      '1. What the problem looks like in the real world',
      '2. Key questions and definitions',
      '3. Step‑by‑step playbook with screenshots and examples',
      '4. Common mistakes and how to avoid them',
      '5. Metrics, glossary, and next actions',
      `Stage: ${stage} — include objections and proof (quotes, data, screenshots)`,
      'Internal Links: pillar, 2–3 supports, and product/CTA where relevant',
      'External Citations: standards, studies, and credible sources',
      'Accessibility: alt text, descriptive link labels, concise paragraphs',
    ].join('\n');
  }, [topic, persona, stage]);

  return (
    <div className="fpd-widget">
      <div className="fpd-widget__header">Content Brief Generator</div>
      <div className="fpd-widget__grid">
        <label>Topic<input value={topic} onChange={e=>setTopic(e.target.value)} /></label>
        <label>Persona<input value={persona} onChange={e=>setPersona(e.target.value)} /></label>
        <label>Stage<select value={stage} onChange={e=>setStage(e.target.value)}><option>Awareness</option><option>Consideration</option><option>Decision</option></select></label>
      </div>
      <pre className="mt-2 whitespace-pre-wrap text-sm text-slate-800">{brief}</pre>
    </div>
  );
}
