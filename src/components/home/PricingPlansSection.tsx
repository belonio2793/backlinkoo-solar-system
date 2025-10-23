import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { RotatingWord } from '@/components/RotatingWord';
import { RotatingText } from '@/components/RotatingText';

export type PricingPlanId = 'starter_100' | 'starter_200' | 'starter_300' | 'custom';

interface PricingPlansSectionProps {
  onGetStarted: (planId: PricingPlanId) => void;
}

const getPlanOverlay = (id: 'starter_100' | 'starter_200' | 'starter_300') => {
  if (id === 'starter_100') return {
    label: 'Easy Competition',
    text: 'Ideal for new sites or low‑difficulty keywords. Quick traction with safe diversification and measured link velocity.'
  } as const;
  if (id === 'starter_200') return {
    label: 'Medium Difficulty',
    text: 'Balanced volume for competitive niches. Steady ranking gains with broader domain variety and stronger authority.'
  } as const;
  return {
    label: 'Hard Difficulty',
    text: 'Designed for tough keywords and established competitors. Higher link velocity and deep domain mix for sustained impact.'
  } as const;
};

const pricingPlans = [
  {
    id: 'starter_100' as const,
    name: 'Starter 100',
    credits: 100,
    price: 140,
    pricePerLink: 1.4,
    description: 'Perfect for testing our platform',
    features: [
      'High DA backlinks',
      'Competitive analysis',
      'Real-time reporting',
      'Campaign management',
    ],
  },
  {
    id: 'starter_200' as const,
    name: 'Starter 200',
    credits: 200,
    price: 280,
    pricePerLink: 1.4,
    description: 'Most popular starting package',
    features: [
      'High DA backlinks',
      'Advanced analytics',
      'Priority support',
      'Campaign optimization',
    ],
    popular: true,
  },
  {
    id: 'starter_300' as const,
    name: 'Starter 300',
    credits: 300,
    price: 420,
    pricePerLink: 1.4,
    description: 'Maximum starter value',
    features: [
      'High DA backlinks',
      'Full feature access',
      'Dedicated support',
      'Custom reporting',
    ],
  },
] as const;

const PricingPlansSection: React.FC<PricingPlansSectionProps> = ({ onGetStarted }) => {
  const [customCredits, setCustomCredits] = useState<number>(0);
  const [customCreditsInput, setCustomCreditsInput] = useState<string>('');

  return (
    <section id="pricing" className="relative py-24 px-0 md:px-6 bg-white section-ambient bg-hero-soft soft-vignette" style={{ backgroundColor: '#ffffff' }}>
      <div className="w-full max-w-6xl mx-auto relative z-10 px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-3xl xl:text-4xl font-light mb-6 tracking-tight text-gray-900 headline-single-line">
            Get Any <RotatingWord words={["Keyword","Search Term","Phrase","Long Tail Keyword"]} /> Ranked Using Our <RotatingText phrases={["Domain Authority","Citation Flow","Unique Domains","Aged Domains","Trust Factor","Low Outbound Links"]} className="text-primary" />
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-6xl mx-auto leading-relaxed font-light">
            Prices are subject to change at any time based on network and market conditions. Before and after results noticeably guaranteed, each campaign includes verified reporting with rankings updates.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mx-auto max-w-6xl">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.id}
              role="button"
              tabIndex={0}
              onClick={() => onGetStarted(plan.id)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onGetStarted(plan.id); } }}
              className={`group p-8 text-center border-0 shadow-lg hover:shadow-xl transition-all relative bg-white pricing-card pricing-card-rainbow cursor-pointer focus:outline-none focus-visible:outline-none outline-none`}
            >
              {('popular' in plan && plan.popular) && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-50 bg-gray-100 text-primary font-mono text-xs most-popular-badge pointer-events-none">
                  MOST POPULAR
                </Badge>
              )}

              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-semibold mb-2 text-gray-900">{plan.name}</CardTitle>
                <div className="text-4xl font-light mb-2 text-gray-900">
                  <span className="text-2xl font-mono">$</span>{plan.price}
                </div>
                <div className="text-sm text-gray-500 font-mono">$1.4 per link</div>
                <p className="text-gray-600 font-light">{plan.description}</p>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="text-3xl font-semibold text-gray-900 mb-4">{`${plan.credits} Credits`}</div>
                <ul className="space-y-3 text-left">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                      <span className="font-light text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full font-medium ${('popular' in plan && plan.popular) ? 'bg-primary text-white hover:bg-primary/90' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'} rainbow-outline-onhover focus-visible:ring-0 focus:ring-0 focus:outline-none`}
                  variant={('popular' in plan && plan.popular) ? 'default' : 'outline'}
                  onClick={(e) => { e.stopPropagation(); onGetStarted(plan.id); }}
                >
                  Get Started
                </Button>
              </CardContent>
              {(() => { const o = getPlanOverlay(plan.id); return (
                <div className="seo-feature-overlay">
                  <div className="seo-feature-overlay-inner">
                    <div className="text-left">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">{plan.name}</span>
                        <Badge variant="outline" className="text-xs">{o.label}</Badge>
                      </div>
                      <p className="text-sm leading-relaxed text-gray-800">{o.text}</p>
                    </div>
                  </div>
                </div>
              ); })()}
            </Card>
          ))}
        </div>

        <div className="mt-16 max-w-md mx-auto overscroll-contain">
          <Card className="p-8 text-center border-2 border-primary shadow-xl bg-gradient-to-br from-primary/5 to-blue-50">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-semibold mb-2 text-gray-900">Custom Package</CardTitle>
              <p className="text-gray-600 font-light">Choose your exact credit amount</p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Credits</label>
                <input
                  id="custom-credits"
                  name="custom-credits"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="one-time-code"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  min={1}
                  max={10000}
                  step={1}
                  value={customCreditsInput}
                  placeholder="Enter credits (min: 1)"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-center text-lg font-semibold"
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setCustomCreditsInput(value);
                    const credits = parseInt(value, 10) || 0;
                    setCustomCredits(credits);
                  }}
                  onWheel={(e) => { e.preventDefault(); }}
                  onKeyDown={(e) => {
                    if (['ArrowUp','ArrowDown','Home','End','PageUp','PageDown'].includes(e.key)) {
                      e.preventDefault();
                    }
                    e.stopPropagation();
                  }}
                />
              </div>

              <div className="text-center">
                <div className="text-3xl font-semibold text-gray-900 mb-2">
                  <span className="text-xl font-mono">Total: </span>
                  <span>${customCredits > 0 ? (customCredits * 1.4).toFixed(2) : '0.00'}</span>
                </div>
                <div className="text-sm text-gray-500 font-mono">$1.40 per credit</div>
              </div>

              <Button
                className="w-full font-medium bg-primary text-white hover:bg-primary/90 rainbow-outline-onhover focus-visible:ring-0 focus:ring-0 focus:outline-none"
                disabled={customCredits < 1}
                onClick={() => { if (customCredits >= 1) onGetStarted('custom'); }}
              >
                Purchase Custom Package
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PricingPlansSection;
