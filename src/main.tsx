import * as React from 'react'
import { createRoot } from 'react-dom/client'

// Install safety patches BEFORE importing the app so any module-level access
// to sessionStorage/document.cookie doesn't crash in sandboxed preview iframes.
// Import safeFetchInit first to preserve original fetch before any third-party scripts run.
import '@/utils/safeFetchInit'
import '@/utils/safeStorageAccess' // Wrap localStorage/sessionStorage early to prevent auth errors
import { installSafeCookiePatch } from '@/utils/safeCookiePatch'
import { installSafeSessionStoragePatch } from '@/utils/safeSessionStoragePatch'

// Apply early patches
installSafeCookiePatch()
installSafeSessionStoragePatch()
import { installSafeWebSocketPatch } from '@/utils/safeWebSocketPatch'
// Install WebSocket safety patch to block external WSS attempts from preview proxy
installSafeWebSocketPatch()

import { installSafePaymentPatch } from '@/utils/paymentPatch'
// Install payment API safety patch (stubs PaymentRequest in iframes/preview hosts)
installSafePaymentPatch()

// Guard preview/frame evaluation APIs when running inside sandboxed preview iframes
import '@/utils/previewGuard'

// Lightweight runtime patches: suppress noisy warnings, guard Quill and analytics init
import '@/utils/runtimePatches'

// Install error suppression for external tool errors (screenshot tools, extensions)
import { installErrorSuppression } from '@/utils/errorSuppression'
installErrorSuppression()

// Initialize storage quota monitoring to prevent localStorage from overflowing
import { initializeStorageMonitoring } from '@/utils/storageQuotaManager'
initializeStorageMonitoring()

// Suppress Firebase warnings in preview environments
import { suppressFirebaseWarnings } from '@/utils/firebaseErrorHandler'
suppressFirebaseWarnings()

// Setup deferred analytics loaders to prevent blocking initial page load
import { initializeDeferredAnalytics } from '@/utils/deferredAnalyticsLoader'
initializeDeferredAnalytics()

import { patchReactStripReplacement } from '@/lib/emojiSanitizer'

// Strip any Unicode replacement characters from rendered text using the React module directly
try {
  patchReactStripReplacement(React);
} catch {
  // ignore - patch is best-effort
}

import App from './App.tsx'
import './index.css'

// Suppress crypto wallet/browser extension errors (MetaMask, Coinbase, etc.)
// This prevents "Cannot redefine property: ethereum" from showing to users

// Mark application start timestamp for suppressing early runtime notifications
;(globalThis as any).__APP_START_TS__ = Date.now()

// Clear console for fresh start
console.clear();
console.log('Starting Backlinkoo application...');

if (import.meta.env.DEV) {
  console.log('Development mode active');
  console.log('Debug helpers will be available after app loads');
}

// Disable FullStory on production domain to avoid interference
try {
  if (typeof window !== 'undefined') {
    const h = window.location.hostname;
    if (h === 'backlinkoo.com' || h === 'www.backlinkoo.com') {
      const invoke = () => { try { (window as any).disableFullStory?.(); } catch {} };
      if (!(window as any).disableFullStory) {
        const s = document.createElement('script');
        s.src = '/disable-fullstory.js';
        s.async = true;
        s.onload = invoke;
        document.head.appendChild(s);
      } else {
        invoke();
      }
    }
  }
} catch {}

// Inject Meta Pixel safely after session/storage patches to avoid errors in sandboxed iframes
try {
  if (typeof window !== 'undefined') {
    const safeToInitAnalytics = (() => {
      try {
        // protocol must be http/https and storage must be accessible
        if (!/^https?:/.test(window.location.protocol)) return false;
        // touch sessionStorage and cookies to confirm accessibility
        try { void window.sessionStorage && window.sessionStorage.length; } catch { return false; }
        try { void document.cookie; } catch { return false; }
        // also ensure not running inside a sandboxed iframe (origin not 'null')
        if (window.origin === 'null' || window.location.origin === 'null') return false;
        return true;
      } catch { return false; }
    })();

    if (safeToInitAnalytics) {
      // Meta Pixel
      (function(f: any,b: any,e: any,v: any,n?: any,t?: any,s?: any){
        if(f.fbq) return; n=f.fbq=function(){ n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
        if(!f._fbq) f._fbq=n; n.push=n; n.loaded = !0; n.version='2.0'; n.queue=[]; t=b.createElement(e); t.async=!0; t.src=v; s=b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t,s);
      })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      try { (window as any).fbq('init', '626866590361345'); (window as any).fbq('track', 'PageView'); } catch(e) {}
    } else {
      // Provide a no-op fbq to avoid errors from code that assumes it exists
      try { (window as any).fbq = function(){}; } catch(e) {}
    }
  }
} catch(e) {
  // swallow
}

// Ensure a default robots meta tag exists for crawlers
try {
  if (typeof document !== 'undefined') {
    const sel = 'meta[name="robots"]';
    if (!document.head.querySelector(sel)) {
      const m = document.createElement('meta');
      m.name = 'robots';
      m.content = 'index, follow';
      document.head.appendChild(m);
    }
  }
} catch(e) { /* ignore */ }

// Priority: Get React app rendering ASAP
const rootEl = document.getElementById('root');
const shouldMount = rootEl ? (rootEl.innerHTML || rootEl.childNodes.length ? false : true) : true;
if (shouldMount) {
  createRoot(rootEl!).render(<App />);
} else {
  console.log('Server-rendered content detected in #root — skipping client app mount to preserve rendered post');
}
