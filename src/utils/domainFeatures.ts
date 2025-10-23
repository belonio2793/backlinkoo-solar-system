export const DOMAIN_FEATURES_ENABLED: boolean = (import.meta as any)?.env?.VITE_ENABLE_DOMAIN_FEATURES === 'true';

export function requireDomainFeaturesEnabled(): asserts DOMAIN_FEATURES_ENABLED is true {
  if (!DOMAIN_FEATURES_ENABLED) {
    throw new Error('Domain features are disabled');
  }
}
