/**
 * Safe storage access wrapper that prevents errors in sandboxed environments
 * This prevents "auth/operation-not-supported-in-this-environment" from Firebase/Supabase
 */

export class SafeStorage implements Storage {
  private fallbackStore: Map<string, string> = new Map();
  private isAccessible: boolean = false;
  private actual: Storage | null = null;
  private type: 'localStorage' | 'sessionStorage';

  constructor(type: 'localStorage' | 'sessionStorage' = 'localStorage') {
    this.type = type;
    this.checkAccessibility();
  }

  private checkAccessibility(): void {
    try {
      const test = '__storage_test_' + Date.now() + '__';
      const storage = this.type === 'localStorage' ? localStorage : sessionStorage;
      storage.setItem(test, 'test');
      storage.removeItem(test);
      this.isAccessible = true;
      this.actual = storage;
    } catch (e) {
      console.warn(`⚠️ ${this.type} is not accessible, using in-memory fallback`);
      this.isAccessible = false;
      this.actual = null;
    }
  }

  getItem(key: string): string | null {
    try {
      if (this.actual) {
        return this.actual.getItem(key);
      }
      return this.fallbackStore.get(key) || null;
    } catch (e) {
      console.warn(`Error getting ${this.type} item:`, e);
      return this.fallbackStore.get(key) || null;
    }
  }

  setItem(key: string, value: string): void {
    try {
      if (this.actual) {
        this.actual.setItem(key, value);
      }
      this.fallbackStore.set(key, value);
    } catch (e) {
      console.warn(`Error setting ${this.type} item:`, e);
      this.fallbackStore.set(key, value);
    }
  }

  removeItem(key: string): void {
    try {
      if (this.actual) {
        this.actual.removeItem(key);
      }
      this.fallbackStore.delete(key);
    } catch (e) {
      console.warn(`Error removing ${this.type} item:`, e);
      this.fallbackStore.delete(key);
    }
  }

  clear(): void {
    try {
      if (this.actual) {
        this.actual.clear();
      }
      this.fallbackStore.clear();
    } catch (e) {
      console.warn(`Error clearing ${this.type}:`, e);
      this.fallbackStore.clear();
    }
  }

  key(index: number): string | null {
    try {
      if (this.actual) {
        return this.actual.key(index);
      }
      const keys = Array.from(this.fallbackStore.keys());
      return keys[index] || null;
    } catch (e) {
      const keys = Array.from(this.fallbackStore.keys());
      return keys[index] || null;
    }
  }

  get length(): number {
    try {
      if (this.actual) {
        return this.actual.length;
      }
      return this.fallbackStore.size;
    } catch (e) {
      return this.fallbackStore.size;
    }
  }
}

// Create safe instances
export const safeLocalStorage = new SafeStorage('localStorage');
export const safeSessionStorage = new SafeStorage('sessionStorage');

// Ensure window.localStorage and window.sessionStorage are wrapped
if (typeof window !== 'undefined') {
  try {
    const origLocalStorage = window.localStorage;
    Object.defineProperty(window, 'localStorage', {
      get: () => safeLocalStorage as any,
      configurable: true
    });
  } catch (e) {
    console.warn('Could not wrap localStorage:', e);
  }

  try {
    const origSessionStorage = window.sessionStorage;
    Object.defineProperty(window, 'sessionStorage', {
      get: () => safeSessionStorage as any,
      configurable: true
    });
  } catch (e) {
    console.warn('Could not wrap sessionStorage:', e);
  }
}
