/**
 * Storage quota management system
 * Prevents localStorage quota exceeded errors by monitoring and cleaning up storage
 * Particularly important in preview environments where quota is limited
 */

const STORAGE_QUOTA_THRESHOLD = 0.85; // Clean when 85% full
const MAX_STORAGE_ESTIMATE = 5 * 1024 * 1024; // 5MB fallback estimate
const CRITICAL_KEYS = new Set([
  'auth_token',
  'auth_email',
  'auth_id',
  'supabase.auth.token',
  'supabase_session',
]);

interface StorageInfo {
  usage: number;
  quota: number;
  percentUsed: number;
}

/**
 * Estimate current storage usage
 */
export async function getStorageInfo(): Promise<StorageInfo> {
  try {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return {
        usage: estimate.usage || 0,
        quota: estimate.quota || MAX_STORAGE_ESTIMATE,
        percentUsed: (estimate.usage || 0) / (estimate.quota || MAX_STORAGE_ESTIMATE),
      };
    }
  } catch (error) {
    console.warn('Could not get storage estimate:', error);
  }

  // Fallback: estimate based on localStorage size
  let totalSize = 0;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        totalSize += (key.length + (value?.length || 0)) * 2; // UTF-16 encoding
      }
    }
  } catch (e) {
    console.warn('Could not calculate localStorage size:', e);
  }

  return {
    usage: totalSize,
    quota: MAX_STORAGE_ESTIMATE,
    percentUsed: totalSize / MAX_STORAGE_ESTIMATE,
  };
}

/**
 * Get all keys from localStorage sorted by last access (oldest first)
 */
function getLocalStorageKeysWithAge(): Array<{ key: string; age: number }> {
  const keys: Array<{ key: string; age: number }> = [];
  const now = Date.now();

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || CRITICAL_KEYS.has(key)) continue;

      // Try to extract timestamp metadata if available
      let age = now;
      try {
        const value = localStorage.getItem(key);
        if (value) {
          const match = value.match(/"timestamp":(\d+)/);
          if (match) {
            age = now - parseInt(match[1], 10);
          }
        }
      } catch (e) {
        // ignore
      }

      keys.push({ key, age });
    }
  } catch (e) {
    console.warn('Could not read localStorage keys:', e);
  }

  return keys.sort((a, b) => b.age - a.age); // Newest first, so we delete oldest
}

/**
 * Clean up storage by removing oldest/largest non-critical entries
 */
export async function cleanupStorage(targetPercentage: number = 0.7): Promise<boolean> {
  try {
    const info = await getStorageInfo();

    if (info.percentUsed < targetPercentage) {
      return true; // No cleanup needed
    }

    console.log(
      `🧹 Storage cleanup triggered: ${Math.round(info.percentUsed * 100)}% used`,
    );

    const keys = getLocalStorageKeysWithAge();
    let cleaned = false;

    // Remove entries starting with oldest/largest
    for (const { key } of keys) {
      try {
        localStorage.removeItem(key);
        cleaned = true;

        const newInfo = await getStorageInfo();
        if (newInfo.percentUsed < targetPercentage) {
          console.log(
            `✅ Storage cleaned to ${Math.round(newInfo.percentUsed * 100)}%`,
          );
          return true;
        }
      } catch (e) {
        console.warn(`Failed to remove storage key ${key}:`, e);
      }
    }

    // If we couldn't get enough space, try emergency cleanup
    if (cleaned) {
      const finalInfo = await getStorageInfo();
      if (finalInfo.percentUsed > 0.95) {
        console.warn(
          '⚠️ Storage still critical after cleanup:',
          Math.round(finalInfo.percentUsed * 100),
          '%',
        );
      }
    }

    return cleaned;
  } catch (error) {
    console.error('Storage cleanup failed:', error);
    return false;
  }
}

/**
 * Safe wrapper for localStorage.setItem with automatic quota management
 */
export function safeSetItem(key: string, value: string, autoCleanup = true): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    if ((error as any).name === 'QuotaExceededError' || (error as any).code === 22) {
      console.warn(`⚠️ Quota exceeded when setting ${key}, attempting cleanup...`);

      if (autoCleanup) {
        // Cleanup synchronously won't work but we can try to remove non-critical entries
        const keys = getLocalStorageKeysWithAge();
        for (const { key: removeKey } of keys) {
          try {
            localStorage.removeItem(removeKey);
            // Try again
            localStorage.setItem(key, value);
            console.log(`✅ Successfully saved ${key} after cleanup`);
            return true;
          } catch (retryError) {
            // continue trying other keys
          }
        }
      }

      console.error(`❌ Failed to set ${key} - storage quota exceeded`);
      return false;
    }

    console.error(`Error setting ${key}:`, error);
    return false;
  }
}

/**
 * Monitor storage usage and log warnings
 */
export async function monitorStorageUsage() {
  try {
    const info = await getStorageInfo();
    const percentUsed = Math.round(info.percentUsed * 100);

    if (info.percentUsed > STORAGE_QUOTA_THRESHOLD) {
      console.warn(
        `⚠️ Storage usage at ${percentUsed}% - consider cleanup. Usage: ${Math.round(info.usage / 1024)}KB / ${Math.round(info.quota / 1024)}KB`,
      );

      // Auto-cleanup if too full
      if (info.percentUsed > 0.95) {
        await cleanupStorage(0.7);
      }
    } else if (percentUsed > 70) {
      console.debug(
        `📊 Storage usage: ${percentUsed}% (${Math.round(info.usage / 1024)}KB / ${Math.round(info.quota / 1024)}KB)`,
      );
    }
  } catch (error) {
    console.warn('Storage monitoring failed:', error);
  }
}

/**
 * Clear storage for a specific domain/prefix
 */
export function clearStorageByPrefix(prefix: string): number {
  let count = 0;
  const keysToRemove: string[] = [];

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(prefix)) {
        keysToRemove.push(key);
      }
    }

    for (const key of keysToRemove) {
      try {
        localStorage.removeItem(key);
        count++;
      } catch (e) {
        console.warn(`Failed to remove ${key}:`, e);
      }
    }
  } catch (e) {
    console.warn('Error clearing storage by prefix:', e);
  }

  return count;
}

/**
 * Initialize storage monitoring on app startup
 */
export function initializeStorageMonitoring() {
  // Monitor storage on startup
  monitorStorageUsage().catch(() => {});

  // Monitor periodically
  const interval = setInterval(() => {
    monitorStorageUsage().catch(() => {});
  }, 60000); // Every 60 seconds

  // Cleanup on visibility change (when user returns to tab)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden === false) {
      cleanupStorage(0.8).catch(() => {});
    }
  });

  return () => clearInterval(interval);
}
