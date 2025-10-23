import React, { useEffect, useMemo, useState } from 'react';

export type TocItem = { id: string; title: string; number?: number };

export function OnThisPage({ items, rootMargin = '-45% 0% -50% 0%' }: { items: TocItem[]; rootMargin?: string }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const numbered = useMemo(() => items.map((it, i) => ({ ...it, number: i + 1 })), [items]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { root: null, rootMargin, threshold: 0.01 }
    );

    numbered.forEach((it) => {
      const el = document.getElementById(it.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [numbered, rootMargin]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', `#${id}`);
  };

  return (
    <div className="sticky top-24 bg-white p-3 rounded-md border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <strong className="text-sm">On this page</strong>
        <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-xs text-sky-600 hover:underline">Top</a>
      </div>
      <nav aria-label="Table of contents">
        <ol className="space-y-3">
          {numbered.map((it) => (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                onClick={(e) => handleClick(e, it.id)}
                className={`flex items-center gap-3 p-2 rounded-md transition hover:bg-sky-50 ${activeId === it.id ? 'bg-sky-50' : ''}`}
              >
                <span className="flex items-center justify-center h-7 w-7 rounded-full bg-sky-600 text-white text-xs font-semibold">{it.number}</span>
                <span className="text-sm text-slate-700">{it.title}</span>
              </a>
            </li>
          ))}
        </ol>
        <div className="mt-4 pt-3 border-t">
          <a href="#get-started" onClick={(e) => handleClick(e, 'get-started')} className="block text-sm font-medium text-sky-600 hover:underline">Start the 30-Day Plan</a>
        </div>
      </nav>
    </div>
  );
}
