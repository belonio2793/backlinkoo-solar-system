import React, { useEffect, useState } from 'react';
import { realTimeFeedService, type RealTimeFeedEvent } from '@/services/realTimeFeedService';

interface BacklinkNotificationProps {
  isVisible?: boolean;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  url?: string;
  time: string;
}

// Inject high-priority CSS to ensure visibility even if parent styles try to override
if (typeof window !== 'undefined' && !document.getElementById('backlink-notification-styles')) {
  const style = document.createElement('style');
  style.id = 'backlink-notification-styles';
  style.textContent = `
    .backlink-notification-root { position: fixed !important; right: 24px !important; bottom: 24px !important; z-index: 9999999999 !important; pointer-events: auto !important; }
    .backlink-notification-root, .backlink-notification-root * { filter: none !important; backdrop-filter: none !important; -webkit-backdrop-filter: none !important; mix-blend-mode: normal !important; opacity: 1 !important; transform: none !important; }
    .backlink-notification-root * { background: transparent !important; color: inherit !important; }
    .notification-card { background: #ffffff !important; color: #000000 !important; box-shadow: 0 28px 80px rgba(2,6,23,0.35) !important; border: 1px solid rgba(2,6,23,0.14) !important; opacity: 1 !important; }
    .notification-card, .notification-card * { color: #000000 !important; background: #ffffff !important; }
    .notification-card a { color: #000000 !important; text-decoration: underline !important; }
    .notification-card button { background: #ffffff !important; color: #000000 !important; border: 1px solid rgba(2,6,23,0.08) !important; }
    /* Ensure overlays do not cover notifications */
    ., .bg-white\/80, .bg-white\/90, .glass, .overlay, .modal-backdrop { pointer-events: none !important; }
  `;
  document.head.appendChild(style);
}

export const BacklinkNotification: React.FC<BacklinkNotificationProps> = ({ isVisible = true }) => {
  const [items, setItems] = useState<NotificationItem[]>([]);

  useEffect(() => {
    if (!isVisible) return;

    const handleEvent = (event: RealTimeFeedEvent) => {
      if (event.type !== 'url_published') return;

      const publishedUrl = event.details?.publishedUrl || '';
      if (!publishedUrl || publishedUrl === 'undefined' || publishedUrl.trim() === '') return;

      try {
        new URL(publishedUrl);
      } catch {
        return;
      }

      const title = 'New Backlink Published';
      const campaign = event.campaignName || 'Campaign';
      const keyword = event.details?.keyword || '';
      const platform = event.details?.platform || '';
      const message = `${campaign}${keyword ? ` • ${keyword}` : ''}${platform ? ` • ${platform}` : ''}`;

      const id = `bl-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const time = new Date().toLocaleTimeString();

      setItems((prev) => {
        if (prev.some((p) => p.url === publishedUrl)) return prev;
        return [{ id, title, message, url: publishedUrl, time }, ...prev].slice(0, 4);
      });

      setTimeout(() => {
        setItems((prev) => prev.filter((i) => i.id !== id));
      }, 10000);
    };

    const unsubscribe = realTimeFeedService.subscribe(handleEvent);
    return () => unsubscribe();
  }, [isVisible]);

  if (!isVisible || items.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed backlink-notification-root"
      style={{
        right: 24,
        bottom: 24,
        zIndex: 2147483647,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        pointerEvents: 'auto',
        paddingBottom: 'env(safe-area-inset-bottom, 1rem)',
        // prevent page-level backdrops/filters from affecting the toast
        filter: 'none',
        backdropFilter: 'none',
        WebkitBackdropFilter: 'none',
        isolation: 'isolate'
      }}
    >
      {items.map((item) => (
        <div
          key={item.id}
          role="status"
          tabIndex={0}
          className="notification-card"
          style={{
            minWidth: 420,
            maxWidth: 520,
            backgroundColor: '#ffffff',
            color: '#000000',
            borderRadius: 12,
            boxShadow: '0 18px 50px rgba(2,6,23,0.18)',
            border: '1px solid rgba(2,6,23,0.06)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'stretch',
            opacity: 1
          }}
        >
          <div style={{ width: 6, background: '#10b981' }} aria-hidden />

          <div style={{ padding: 14, flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#000' }}>{item.title}</div>
                <div style={{ marginTop: 6, fontSize: 13, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.message}</div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  aria-label="Dismiss notification"
                  onClick={() => setItems((prev) => prev.filter((i) => i.id !== item.id))}
                  style={{
                    background: 'transparent',
                    border: 0,
                    color: '#374151',
                    fontSize: 18,
                    lineHeight: '18px',
                    cursor: 'pointer'
                  }}
                >
                  ×
                </button>
              </div>
            </div>

            {item.url && (
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  style={{
                    flex: 1,
                    fontFamily: 'Roboto Mono, monospace',
                    fontSize: 13,
                    color: '#000000',
                    textDecoration: 'none',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                  title={item.url}
                >
                  {item.url}
                </a>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => navigator.clipboard.writeText(item.url || '')}
                    style={{
                      padding: '6px 10px',
                      borderRadius: 8,
                      border: '1px solid rgba(2,6,23,0.08)',
                      background: '#ffffff',
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{ fontSize: 13, color: '#000000' }}>Copy</span>
                  </button>

                  <button
                    onClick={() => window.open(item.url, '_blank')}
                    style={{
                      padding: '6px 10px',
                      borderRadius: 8,
                      border: '1px solid rgba(2,6,23,0.08)',
                      background: '#ffffff',
                      color: '#000000',
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{ fontSize: 13 }}>View</span>
                  </button>
                </div>
              </div>
            )}

            <div style={{ marginTop: 10, fontSize: 11, color: '#6b7280' }}>{item.time}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BacklinkNotification;
