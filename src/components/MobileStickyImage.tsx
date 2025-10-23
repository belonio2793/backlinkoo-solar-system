import React, { useEffect, useState } from 'react';

const ATTACHMENT_URL = 'https://cdn.builder.io/api/v1/image/assets%2F6c9ecf7e9d1042aab5dc8f726b26bf81%2F64c66336fec34e5e8f372f8ccd72ddff?format=webp&width=800';

export default function MobileStickyImage() {
  const [dismissed, setDismissed] = useState(false);
  const [leftOpen, setLeftOpen] = useState<boolean>(() => {
    try { return localStorage.getItem('askai_left_open') === '1'; } catch { return false; }
  });

  useEffect(() => {
    const read = () => {
      try { setLeftOpen(localStorage.getItem('askai_left_open') === '1'); } catch {}
    };
    const onStorage = (e: StorageEvent) => { if (e.key === 'askai_left_open') read(); };
    const onCustom = (e: any) => { if (e?.detail?.key === 'askai_left_open') read(); };
    window.addEventListener('storage', onStorage);
    window.addEventListener('askai:state', onCustom as EventListener);
    read();
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('askai:state', onCustom as EventListener);
    };
  }, []);

  useEffect(() => {
    try {
      const v = localStorage.getItem('mobile_sticky_image_dismissed_v1');
      setDismissed(v === '1');
    } catch (e) {
      // ignore
    }
  }, []);

  const hidden = dismissed || leftOpen;

  useEffect(() => {
    try {
      const v = hidden ? '0' : '1';
      localStorage.setItem('askai_bottom_active', v);
      window.dispatchEvent(new CustomEvent('askai:state', { detail: { key: 'askai_bottom_active', value: v } }));
    } catch {}
  }, [hidden]);

  if (hidden) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 md:hidden z-50 flex items-center justify-center px-4"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="w-full max-w-3xl bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl shadow-lg flex items-center justify-between p-3">
        <a href="#" onClick={(e) => e.preventDefault()} className="flex items-center gap-3 flex-1">
          <img src={ATTACHMENT_URL} alt="Sticky attachment" className="h-12 w-auto object-contain rounded-md" />
          <div className="flex flex-col text-left">
            <span className="text-sm font-semibold text-slate-900">Ask Backlink</span>
            <span className="text-xs text-slate-600">Tap to learn more</span>
          </div>
        </a>
        <button
          aria-label="Close sticky"
          onClick={() => {
            try {
              localStorage.setItem('mobile_sticky_image_dismissed_v1', '1');
            } catch (e) {}
            setDismissed(true);
          }}
          className="ml-3 inline-flex h-8 w-8 items-center justify-center rounded-md bg-white/60 text-slate-700 hover:bg-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
