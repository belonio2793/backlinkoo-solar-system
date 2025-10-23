import React from 'react';

const features = [
  { title: 'APAC‑Savvy Execution', desc: 'Localization, transcreation, and regional partnerships baked in.' },
  { title: 'Governance First', desc: 'Decision logs, SLAs, and change management prevent drift.' },
  { title: 'Evidence‑Based', desc: 'Clear hypotheses and after‑action reports guide budgets.' },
  { title: 'Accessibility as QA', desc: 'WCAG‑aware components and performance budgets by template.' },
];

export default function FeatureGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {features.map((f) => (
        <div key={f.title} className="rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4">
          <div className="text-sm font-bold tracking-wide text-slate-700">{f.title}</div>
          <p className="mt-1 text-slate-700">{f.desc}</p>
        </div>
      ))}
    </div>
  );
}
