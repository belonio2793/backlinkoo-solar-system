export { default as MinimalCleanTemplate } from './MinimalCleanTemplate';
export { default as ModernBusinessTemplate } from './ModernBusinessTemplate';
export { default as ElegantEditorialTemplate } from './ElegantEditorialTemplate';
export { default as TechFocusTemplate } from './TechFocusTemplate';
export { default as MagazineTemplate } from './MagazineTemplate';
export { default as SEOOptimizedTemplate } from './SEOOptimizedTemplate';
export { default as LifestyleTemplate } from './LifestyleTemplate';
export { default as BusinessTemplate } from './BusinessTemplate';
export { default as PortfolioTemplate } from './PortfolioTemplate';
export { default as EcommerceTemplate } from './EcommerceTemplate';
export { default as CardBasedTemplate } from './CardBasedTemplate';
export { default as CustomLayoutTemplate } from './CustomLayoutTemplate';

// Template registry for easy access
import MinimalCleanTemplate from './MinimalCleanTemplate';
import ModernBusinessTemplate from './ModernBusinessTemplate';
import ElegantEditorialTemplate from './ElegantEditorialTemplate';
import TechFocusTemplate from './TechFocusTemplate';
import MagazineTemplate from './MagazineTemplate';
import SEOOptimizedTemplate from './SEOOptimizedTemplate';
import LifestyleTemplate from './LifestyleTemplate';
import BusinessTemplate from './BusinessTemplate';
import PortfolioTemplate from './PortfolioTemplate';
import EcommerceTemplate from './EcommerceTemplate';
import CardBasedTemplate from './CardBasedTemplate';
import CustomLayoutTemplate from './CustomLayoutTemplate';

export const TEMPLATE_REGISTRY = {
  minimal: MinimalCleanTemplate,
  modern: ModernBusinessTemplate,
  elegant: ElegantEditorialTemplate,
  tech: TechFocusTemplate,
  magazine: MagazineTemplate,
  'seo-optimized': SEOOptimizedTemplate,
  lifestyle: LifestyleTemplate,
  business: BusinessTemplate,
  portfolio: PortfolioTemplate,
  ecommerce: EcommerceTemplate,
  card: CardBasedTemplate,
  custom: CustomLayoutTemplate,
} as const;

export type TemplateId = keyof typeof TEMPLATE_REGISTRY;
