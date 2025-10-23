import React from 'react';

const items = [
  { name: 'Growth Lead, SaaS', quote: 'Our mid‑tail queries and demo volume climbed steadily with editorial content and PR that actually served readers.', rating: 5 },
  { name: 'Ecommerce Director', quote: 'They paired creative testing with category SEO, which stabilized ROAS and improved organic CTR.', rating: 5 },
  { name: 'CMO, Multi‑Location', quote: 'Templates, governance, and community PR gave us predictable local visibility across regions.', rating: 5 },
];

export default function TestimonialsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map((t, i) => (
        <figure key={i} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-yellow-500" aria-label={`${t.rating} stars`}>{'★★★★★'.slice(0, t.rating)}</div>
          <blockquote className="mt-2 text-slate-800">“{t.quote}”</blockquote>
          <figcaption className="mt-3 text-sm text-slate-600">— {t.name}</figcaption>
        </figure>
      ))}
    </div>
  );
}
