import React, { useEffect, useState } from 'react';

export const ArticleProgress: React.FC = () => {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    function onScroll() {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop || 0;
      const height = doc.scrollHeight - doc.clientHeight;
      const progress = height > 0 ? Math.min(100, Math.round((scrollTop / height) * 100)) : 0;
      setPct(progress);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div aria-hidden="true" style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 60 }}>
      <div style={{ height: 4, background: 'linear-gradient(90deg,#7c3aed,#06b6d4)', width: `${pct}%`, transition: 'width 120ms linear' }} />
    </div>
  );
};

export default ArticleProgress;
