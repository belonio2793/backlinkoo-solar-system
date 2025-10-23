/* Emergency Disable Utilities - refactored to be init-only
   This module exports functions and an init() function. No side-effects on import.
*/
import { restoreOriginalFetch } from './viteClientProtection';

export function disableFetchProtection() {
  try {
    console.log('🚨 EMERGENCY: Disabling all fetch protection');

    // Set disable flags
    (window as any).DISABLE_VITE_PROTECTION = true;
    (window as any).DISABLE_FULLSTORY_PROTECTION = true;

    // Restore original fetch if possible
    try {
      restoreOriginalFetch();
      console.log('✅ Original fetch restored');
    } catch (error) {
      console.warn('⚠️ Could not restore original fetch:', error);
    }

    // Try to get a clean fetch function
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    try {
      const cleanFetch = iframe.contentWindow?.fetch;
      if (cleanFetch) {
        window.fetch = cleanFetch.bind(window);
        console.log('✅ Clean fetch obtained from iframe');
      }
    } catch (error) {
      console.warn('⚠️ Could not get clean fetch from iframe:', error);
    } finally {
      document.body.removeChild(iframe);
    }

    console.log('🎯 Fetch protection disabled. Try your request again.');
    console.log('💡 If issues persist, try refreshing the page.');
  } catch (e) {
    console.warn('disableFetchProtection failed:', e);
  }
}

export function checkFetchProtection() {
  try {
    const status = {
      viteProtectionDisabled: !!(window as any).DISABLE_VITE_PROTECTION,
      fullstoryProtectionDisabled: !!(window as any).DISABLE_FULLSTORY_PROTECTION,
      fetchModified: window.fetch.toString().length < 100,
      fetchSource: window.fetch.toString().substring(0, 200) + '...'
    };

    console.log('🔍 Fetch Protection Status:', status);
    return status;
  } catch (e) {
    console.warn('checkFetchProtection failed:', e);
    return null;
  }
}

let errorCount = 0;
const maxErrors = 3;

function onGlobalError(event: ErrorEvent | PromiseRejectionEvent) {
  const error = 'reason' in event ? (event as any).reason : (event as any).error;
  if (error && (String(error).includes('Failed to fetch') || String(error).includes('NetworkInterferenceError'))) {
    errorCount++;
    console.warn(`⚠️ Network error ${errorCount}/${maxErrors}:`, error);
    if (errorCount >= maxErrors) {
      console.log('🚨 Too many network errors, auto-disabling fetch protection');
      disableFetchProtection();
      errorCount = 0;
    }
  }
}

export function initEmergencyUtilities() {
  try {
    (window as any).disableFetchProtection = disableFetchProtection;
    (window as any).checkFetchProtection = checkFetchProtection;

    window.addEventListener('error', onGlobalError as any);
    window.addEventListener('unhandledrejection', onGlobalError as any);

    console.log('🔧 Emergency utilities initialized. Use window.disableFetchProtection() to trigger.');
  } catch (e) {
    console.warn('initEmergencyUtilities failed:', e);
  }
}

export default initEmergencyUtilities;
