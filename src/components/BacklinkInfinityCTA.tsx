import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface BacklinkInfinityCTAProps {
  title?: string;
  description?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  className?: string;
  variant?: 'default' | 'minimal' | 'card' | 'inline';
}

let _learnPrefetched = false;
function prefetchLearn() {
  try {
    if (_learnPrefetched) return;
    _learnPrefetched = true;
    void import(/* webpackPrefetch: true */ '../pages/Learn');
  } catch (e) { /* ignore */ }
}

export const BacklinkInfinityCTA: React.FC<BacklinkInfinityCTAProps> = ({
  title = 'Ready to Buy Quality Backlinks?',
  description = 'Register for Backlink ∞ to access premium backlinks, drive traffic through proven SEO strategies, and get expert guidance on building your authority online.',
  primaryButtonText = 'Register for Backlink ∞',
  secondaryButtonText = 'Learn More',
  className = '',
  variant = 'default',
}) => {
  const handlePrimaryClick = () => {
    window.location.href = '/register';
  };

  const handleSecondaryClick = () => {
    prefetchLearn();
    window.location.href = '/learn';
  };

  if (variant === 'minimal') {
    return (
      <div className={`py-6 text-center ${className}`}>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button size="sm" className="text-white bg-blue-600 hover:bg-blue-700" onClick={handlePrimaryClick}>
            {primaryButtonText}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`inline-flex gap-2 items-center ${className}`}>
        <Button size="sm" className="text-white bg-blue-600 hover:bg-blue-700" onClick={handlePrimaryClick}>
          {primaryButtonText}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <Button size="sm" variant="outline" className="text-white border-white hover:bg-white/10" onClick={handleSecondaryClick}>
          {secondaryButtonText}
        </Button>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-6 md:p-8 ${className}`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
          </div>
          <div className="flex flex-wrap gap-3 md:flex-col md:items-end">
            <Button size="lg" className="text-white bg-blue-600 hover:bg-blue-700 group" onClick={handlePrimaryClick}>
              {primaryButtonText}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="text-slate-700 border-slate-300 hover:bg-slate-100" onClick={handleSecondaryClick}>
              {secondaryButtonText}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <section className={`py-12 md:py-16 px-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 rounded-lg border border-blue-200 dark:border-slate-700 ${className}`}>
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
            <p className="text-lg text-muted-foreground mb-6">{description}</p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="text-white bg-blue-600 hover:bg-blue-700 group" onClick={handlePrimaryClick}>
                {primaryButtonText}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="text-slate-700 border-slate-300 hover:bg-slate-100" onClick={handleSecondaryClick}>
                {secondaryButtonText}
              </Button>
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center">
            <div className="bg-white dark:bg-slate-950 rounded-lg p-8  border border-blue-100 dark:border-slate-700">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium">Premium Backlink Access</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium">SEO Traffic Growth</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium">Expert Guidance</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium">24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BacklinkInfinityCTA;
