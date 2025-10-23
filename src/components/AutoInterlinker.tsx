import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { applyAutoInterlinks } from '@/utils/autoInterlinker';

export const AutoInterlinker: React.FC = () => {
  const location = useLocation();
  useEffect(() => {
    const id = window.setTimeout(() => {
      try { applyAutoInterlinks(document, { maxPerLinkPerPage: 2 }); } catch {}
    }, 50);
    return () => window.clearTimeout(id);
  }, [location.pathname, location.search, location.hash]);

  useEffect(() => {
    // Observe late content mutations (lazy content or async data)
    const observer = new MutationObserver(() => {
      try { applyAutoInterlinks(document, { maxPerLinkPerPage: 2 }); } catch {}
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return null;
};
