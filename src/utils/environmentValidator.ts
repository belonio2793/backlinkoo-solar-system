/**
 * Environment Variable Validation Utility
 * 
 * Validates that required environment variables are properly configured
 * for the domains functionality and Netlify integration.
 */

export interface EnvironmentValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  requiredVars: Record<string, boolean>;
  optionalVars: Record<string, boolean>;
}

export interface NetlifyEnvironmentCheck {
  hasAccessToken: boolean;
  hasSiteId: boolean;
  functionsAvailable: boolean;
  apiAccessible: boolean;
}

/**
 * Validates all required environment variables for the application
 */
export function validateEnvironment(): EnvironmentValidation {
  const errors: string[] = [];
  const warnings: string[] = [];
  const requiredVars: Record<string, boolean> = {};
  const optionalVars: Record<string, boolean> = {};

  // Required Supabase variables
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  requiredVars['VITE_SUPABASE_URL'] = !!supabaseUrl;
  requiredVars['VITE_SUPABASE_ANON_KEY'] = !!supabaseAnonKey;

  if (!supabaseUrl) {
    errors.push('VITE_SUPABASE_URL is required for database connectivity');
  } else if (!supabaseUrl.includes('supabase.co')) {
    warnings.push('VITE_SUPABASE_URL does not appear to be a valid Supabase URL');
  }

  if (!supabaseAnonKey) {
    errors.push('VITE_SUPABASE_ANON_KEY is required for database authentication');
  } else if (!supabaseAnonKey.startsWith('eyJ')) {
    warnings.push('VITE_SUPABASE_ANON_KEY does not appear to be a valid JWT token');
  }

  // Optional Netlify variables (for enhanced functionality)
  const netlifyAccessToken = import.meta.env.VITE_NETLIFY_ACCESS_TOKEN;
  const netlifySiteId = import.meta.env.VITE_NETLIFY_SITE_ID;

  optionalVars['VITE_NETLIFY_ACCESS_TOKEN'] = !!netlifyAccessToken;
  optionalVars['VITE_NETLIFY_SITE_ID'] = !!netlifySiteId;

  if (!netlifyAccessToken) {
    warnings.push('VITE_NETLIFY_ACCESS_TOKEN not set - Netlify API features will be limited');
  }

  if (!netlifySiteId) {
    warnings.push('VITE_NETLIFY_SITE_ID not set - Direct API calls to Netlify will not work');
  }

  // Optional OpenAI variables
  const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
  optionalVars['VITE_OPENAI_API_KEY'] = !!openaiApiKey;

  if (!openaiApiKey) {
    warnings.push('VITE_OPENAI_API_KEY not set - AI features will be disabled');
  }

  // Optional Stripe variables
  const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  optionalVars['VITE_STRIPE_PUBLISHABLE_KEY'] = !!stripePublishableKey;

  if (!stripePublishableKey) {
    warnings.push('VITE_STRIPE_PUBLISHABLE_KEY not set - Payment features will be disabled');
  }

  const isValid = errors.length === 0;

  return {
    isValid,
    errors,
    warnings,
    requiredVars,
    optionalVars
  };
}

/**
 * Specifically validates Netlify environment and functionality
 */
export async function validateNetlifyEnvironment(): Promise<NetlifyEnvironmentCheck> {
  const hasAccessToken = !!import.meta.env.VITE_NETLIFY_ACCESS_TOKEN;
  const hasSiteId = !!import.meta.env.VITE_NETLIFY_SITE_ID;

  // Default state
  let functionsAvailable = false;
  let apiAccessible = false;

  // If we don't have both vars, don't probe the /.netlify endpoint to avoid noisy network errors
  if (!hasAccessToken || !hasSiteId) {
    return { hasAccessToken, hasSiteId, functionsAvailable: false, apiAccessible: false };
  }

  // Only attempt the Netlify functions check when running on Netlify or when explicitly enabled for local dev
  const isNetlifyHost = typeof window !== 'undefined' && /\.netlify\.app$/.test(window.location.hostname);
  const allowLocalProbe = import.meta.env.VITE_ENABLE_NETLIFY_LOCAL === 'true';
  if (!isNetlifyHost && !allowLocalProbe) {
    return { hasAccessToken, hasSiteId, functionsAvailable: false, apiAccessible: true };
  }

  // Check if Netlify functions are available with timeout protection
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const response = await fetch('/.netlify/functions/add-domain-to-netlify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'health_check' }),
      signal: controller.signal
    });
    clearTimeout(timeout);

    functionsAvailable = response.status !== 404;

    if (functionsAvailable) {
      apiAccessible = response.ok;
      try {
        const result = await response.clone().json();
        if (result && typeof result === 'object') {
          apiAccessible = apiAccessible && !String(result.error || '').includes('NETLIFY_ACCESS_TOKEN');
        }
      } catch {
        // ignore non-JSON responses
      }
    }
  } catch (error) {
    console.log('Netlify functions check skipped/failed:', (error as any)?.message || error);
    functionsAvailable = false;
    apiAccessible = false;
  }

  return { hasAccessToken, hasSiteId, functionsAvailable, apiAccessible };
}

/**
 * Gets a human-readable status message for the environment
 */
export function getEnvironmentStatusMessage(validation: EnvironmentValidation): string {
  if (validation.isValid) {
    if (validation.warnings.length === 0) {
      return '✅ All environment variables are properly configured';
    } else {
      return `✅ Core environment is valid, but ${validation.warnings.length} optional features are not configured`;
    }
  } else {
    return `❌ Environment configuration has ${validation.errors.length} critical issues`;
  }
}

/**
 * Gets recommendations for fixing environment issues
 */
export function getEnvironmentRecommendations(validation: EnvironmentValidation): string[] {
  const recommendations: string[] = [];

  if (!validation.requiredVars['VITE_SUPABASE_URL']) {
    recommendations.push('Set VITE_SUPABASE_URL to your Supabase project URL (found in Project Settings → API)');
  }

  if (!validation.requiredVars['VITE_SUPABASE_ANON_KEY']) {
    recommendations.push('Set VITE_SUPABASE_ANON_KEY to your Supabase anon/public key (found in Project Settings → API)');
  }

  if (!validation.optionalVars['VITE_NETLIFY_ACCESS_TOKEN']) {
    recommendations.push('Set VITE_NETLIFY_ACCESS_TOKEN to enable Netlify API integration (create at netlify.com/user/applications)');
  }

  if (!validation.optionalVars['VITE_NETLIFY_SITE_ID']) {
    recommendations.push('Set VITE_NETLIFY_SITE_ID to your Netlify site ID (found in Site Settings → General)');
  }

  if (recommendations.length === 0 && validation.warnings.length > 0) {
    recommendations.push('Consider configuring optional environment variables for enhanced functionality');
  }

  return recommendations;
}

/**
 * Validates specific domain-related environment requirements
 */
export function validateDomainEnvironment(): {
  canAddDomains: boolean;
  canSyncWithNetlify: boolean;
  canValidateDNS: boolean;
  issues: string[];
} {
  const validation = validateEnvironment();
  const issues: string[] = [];

  const canAddDomains = validation.requiredVars['VITE_SUPABASE_URL'] && 
                       validation.requiredVars['VITE_SUPABASE_ANON_KEY'];

  if (!canAddDomains) {
    issues.push('Cannot add domains: Supabase configuration missing');
  }

  const canSyncWithNetlify = canAddDomains && 
                            validation.optionalVars['VITE_NETLIFY_ACCESS_TOKEN'];

  if (!canSyncWithNetlify && canAddDomains) {
    issues.push('Cannot sync with Netlify: Access token missing');
  }

  const canValidateDNS = canSyncWithNetlify && 
                        validation.optionalVars['VITE_NETLIFY_SITE_ID'];

  if (!canValidateDNS && canSyncWithNetlify) {
    issues.push('Cannot validate DNS: Site ID missing');
  }

  return {
    canAddDomains,
    canSyncWithNetlify,
    canValidateDNS,
    issues
  };
}
