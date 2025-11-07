import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { AuthFormTabs } from '@/components/shared/AuthFormTabs';
import SubscriptionService from '@/services/subscriptionService';
import { ErrorLogger } from '@/utils/errorLogger';
import { CheckoutRedirectManager } from '@/utils/checkoutRedirectManager';
import {
  Crown, Shield, CheckCircle, X, Lock, Star, Infinity, BookOpen,
  TrendingUp, Users, Target, Sparkles, Zap, ArrowRight, CreditCard,
  Loader2, Gift, Calendar, Eye, EyeOff, UserPlus
} from 'lucide-react';
import LaunchLifetimeOverlay from '@/components/LaunchLifetimeOverlay';

interface PremiumPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  triggerSource?: 'navigation' | 'settings' | 'manual' | 'upgrade_button';
}

type FlowStep = 'features' | 'plans' | 'auth' | 'checkout' | 'processing' | 'success';

export function PremiumPlanModal({
  isOpen,
  onClose,
  onSuccess,
  triggerSource = 'manual'
}: PremiumPlanModalProps) {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<FlowStep>('features');
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [guestEmail, setGuestEmail] = useState('');
  const [checkoutMode, setCheckoutMode] = useState<'guest' | 'account'>('account');

  // Premium plan configuration - Prices for live Stripe product prod_SoVja4018pbOcy
  const plans = {
    monthly: {
      price: 29,
      originalPrice: 49,
      period: 'month',
      savings: null,
      discount: 41
    },
    yearly: {
      price: 290,
      originalPrice: 588,
      period: 'year',
      savings: 298,
      discount: 51,
      monthlyEquivalent: 24
    }
  };

  // Core premium features
  const premiumFeatures = [
    {
      icon: <TrendingUp className="h-5 w-5" />,
      title: "Premium Backlinks",
      description: "Access high-quality backlinks with credit-based usage"
    },
    {
      icon: <BookOpen className="h-5 w-5" />,
      title: "Complete SEO Academy",
      description: "Access 50+ lessons and expert SEO training courses"
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Priority 24/7 Support",
      description: "Skip the line with priority support from SEO experts"
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      title: "Advanced Analytics",
      description: "Detailed reporting, analytics, and campaign insights"
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "White-Hat Guarantee",
      description: "100% safe, Google-approved link building methods"
    },
    {
      icon: <Target className="h-5 w-5" />,
      title: "Custom Strategies",
      description: "Personalized campaign strategies for your industry"
    },
    {
      icon: <Star className="h-5 w-5" />,
      title: "Professional Certifications",
      description: "SEO certifications to boost your professional credibility"
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "API Access & Integrations",
      description: "Connect with your favorite tools and automate workflows"
    }
  ];

  // Additional benefits
  const additionalBenefits = [
    "Bulk data export capabilities",
    "White-label and custom branding options",
    "Advanced keyword research tools",
    "Competitor analysis features",
    "Custom reporting dashboards",
    "Team collaboration tools"
  ];

  // Initialize step based on authentication state
  useEffect(() => {
    if (!authLoading && isOpen) {
      // If no user or email not verified, go straight to auth step
      if (!user || !user.email_confirmed_at) {
        setCurrentStep('auth');
      } else {
        // User is authenticated and verified; jump to plan selection
        setCurrentStep('plans');
      }
    }
  }, [isOpen, authLoading, user]);

  // Handle plan selection and navigation
  const handlePlanContinue = () => {
    if (isAuthenticated && user && user.email_confirmed_at) {
      setCurrentStep('checkout');
    } else {
      setCurrentStep('auth');
    }
  };

  // Handle authentication success
  const handleAuthSuccess = (authenticatedUser: any) => {
    setCurrentStep('checkout');
    toast({
      title: "Authentication Successful!",
      description: "Now let's complete your premium upgrade.",
    });
  };

  // Handle guest checkout
  const handleGuestCheckout = async () => {
    if (!guestEmail) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to continue.",
        variant: "destructive"
      });
      return;
    }

    setCheckoutMode('guest');
    await handleCheckout();
  };

  // Handle subscription checkout
  const handleCheckout = async () => {
    // Require authenticated, verified email for account checkout
    if (!(isAuthenticated && user && user.email_confirmed_at)) {
      setCurrentStep('auth');
      toast({
        title: 'Sign in required',
        description: 'Please sign in and verify your email to continue to checkout.',
        variant: 'destructive'
      });
      return;
    }

    try {
      // Store intent for post-payment UX; webhook will grant premium
      localStorage.setItem('premium_upgrade_intent', JSON.stringify({
        plan: selectedPlan,
        source: triggerSource,
        timestamp: Date.now()
      }));

      // Open Stripe directly (new window) — rely on webhook to activate premium
      const { quickSubscribe } = await import('@/services/stripeWrapper');
      const res = await quickSubscribe(selectedPlan, user.email || undefined);

      if (res.success && res.url) {
        toast({ title: '✅ Checkout Opened', description: 'Complete payment in the Stripe window.' });
        // Close immediately; verification handled by webhook and app will reflect via auth hooks
        handleClose();
      } else {
        throw new Error(res.error || 'Failed to open Stripe checkout');
      }
    } catch (error: any) {
      ErrorLogger.logError('Premium checkout error', error);
      setCurrentStep('checkout');
      toast({
        title: 'Checkout Error',
        description: ErrorLogger.getUserFriendlyMessage(error, 'Unable to open Stripe. Please try again.'),
        variant: 'destructive'
      });
    }
  };

  // Reset modal state when closed
  const handleClose = () => {
    setCurrentStep('features');
    setSelectedPlan('yearly');
    setIsProcessing(false);
    setGuestEmail('');
    setCheckoutMode('account');
    onClose();
  };

  // Render features overview step (horizontal, compact)
  const renderFeaturesStep = () => (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-6 items-start">
        {/* Left: Title + first features */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
              <Crown className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Premium Plan</h2>
              <p className="text-sm text-gray-600">Unlock premium SEO potential with our comprehensive features</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {premiumFeatures.slice(0,4).map((feature, index) => (
              <div key={index} className="bg-white/10 border-white/20 rounded-lg p-3">
                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 rounded-full p-2 flex-shrink-0">
                    <div className="text-purple-600">{feature.icon}</div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">{feature.title}</h3>
                    <p className="text-gray-600 text-xs">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <h3 className="font-semibold text-gray-900 mb-2 text-sm">More Benefits</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {additionalBenefits.slice(0,3).map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-xs text-gray-700">
                  <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: remaining features + CTA */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {premiumFeatures.slice(4).map((feature, index) => (
              <div key={index} className="bg-white/10 border-white/20 rounded-lg p-3">
                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 rounded-full p-2 flex-shrink-0">
                    <div className="text-purple-600">{feature.icon}</div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">{feature.title}</h3>
                    <p className="text-gray-600 text-xs">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {additionalBenefits.slice(3).map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-xs text-gray-700">
                  <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex md:justify-end">
            <Button
              onClick={() => setCurrentStep('plans')}
              size="default"
              className="w-full md:w-auto px-8 h-11 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Crown className="h-4 w-4 mr-2" />
              Choose Your Plan
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render plan selection step
  const renderPlansStep = () => (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Choose Your Plan</h2>
        <p className="text-gray-600 text-sm">Select the perfect plan for your SEO needs</p>
      </div>

      {/* Plan Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Monthly Plan */}
        <Card 
          className={`cursor-pointer transition-all duration-200 hover: ${
            selectedPlan === 'monthly' ? 'ring-2 ring-purple-500 ' : ''
          }`}
          onClick={() => setSelectedPlan('monthly')}
        >
          <CardHeader className="text-center pb-3">
            <CardTitle className="text-xl">Monthly Plan</CardTitle>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl font-bold">${plans.monthly.price}</span>
                <div className="text-left">
                  <div className="text-sm text-gray-500 line-through">${plans.monthly.originalPrice}</div>
                  <div className="text-sm text-gray-600">per month</div>
                </div>
              </div>
              <Badge className="bg-blue-100 text-blue-800">
                {plans.monthly.discount}% Off
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-center text-xs text-gray-600 mb-2">
              Billed monthly • Cancel anytime
            </div>
            {selectedPlan === 'monthly' && (
              <div className="text-center">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Yearly Plan */}
        <Card 
          className={`cursor-pointer transition-all duration-200 hover: relative ${
            selectedPlan === 'yearly' ? 'ring-2 ring-purple-500 ' : ''
          }`}
          onClick={() => setSelectedPlan('yearly')}
        >
          <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-1">
            <Sparkles className="h-3 w-3 mr-1" />
            Best Value - Save 51%
          </Badge>
          <CardHeader className="text-center pb-3 pt-5">
            <CardTitle className="text-xl">Yearly Plan</CardTitle>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl font-bold">${plans.yearly.price}</span>
                <div className="text-left">
                  <div className="text-sm text-gray-500 line-through">${plans.yearly.originalPrice}</div>
                  <div className="text-sm text-gray-600">per year</div>
                </div>
              </div>
              <div className="space-y-1">
                <Badge className="bg-green-100 text-green-800">{`Save $${plans.yearly.savings} (${plans.yearly.discount}% Off)`}</Badge>
                <div className="text-sm text-purple-600 font-medium">
                  Just ${plans.yearly.monthlyEquivalent}/month!
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-center text-xs text-gray-600 mb-2">
              Billed annually • Best value for serious SEO
            </div>
            {selectedPlan === 'yearly' && (
              <div className="text-center">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Plan Benefits Comparison */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h3 className="font-semibold text-gray-900 mb-2 text-center text-sm">
          Both plans include all premium features:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {premiumFeatures.slice(0, 4).map((feature, index) => (
            <div key={index} className="text-center">
              <div className="bg-white rounded-full p-2.5 w-10 h-10 flex items-center justify-center mx-auto mb-1.5">
                <div className="text-purple-600">{feature.icon}</div>
              </div>
              <div className="text-sm font-medium text-gray-900">{feature.title}</div>
            </div>
          ))}
        </div>
        <div className="text-center mt-2 text-sm text-gray-600">
          {`+${premiumFeatures.length - 4}\u00A0more premium features`}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handlePlanContinue}
          size="default"
          className="flex-1 h-12 text-base bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          <Lock className="h-5 w-5 mr-3" />
          {`Continue with ${selectedPlan === 'monthly' ? 'Monthly' : 'Yearly'} Plan` }
          <ArrowRight className="h-5 w-5 ml-3" />
        </Button>
        <Button
          onClick={() => setCurrentStep('features')}
          variant="outline"
          size="default"
          className="px-6 h-11"
        >
          Back
        </Button>
      </div>
    </div>
  );

  // Render authentication step
  const renderAuthStep = () => (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Almost There!</h2>
        <p className="text-gray-600">
          Sign in or create an account to complete your premium upgrade
        </p>
      </div>


      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Or use your account</span>
        </div>
      </div>

      {/* Auth form - choose tab based on state */}
      {user && !user.email_confirmed_at && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-sm text-yellow-800 mb-2">
          Please verify your email to continue. Check your inbox for a verification link.
        </div>
      )}
      <AuthFormTabs
        onAuthSuccess={handleAuthSuccess}
        defaultTab={user ? 'login' : 'signup'}
        isCompact={true}
      />

      <div className="text-center">
        <Button
          onClick={() => setCurrentStep('plans')}
          variant="ghost"
          className="text-gray-500 hover:text-gray-700"
        >
          Back
        </Button>
      </div>
    </div>
  );

  // Render checkout step
  const renderCheckoutStep = () => {
    const canCheckout = !!(isAuthenticated && user && user.email_confirmed_at);
    return (
    <div className="space-y-4">
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-bold">Secure Checkout</h2>
        <p className="text-gray-600">Review and complete your premium upgrade</p>
      </div>

      {/* Order Summary */}
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-purple-600" />
            Premium Plan Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">Premium Plan ({selectedPlan})</span>
            <span className="text-lg font-bold">${plans[selectedPlan].price}</span>
          </div>

          {selectedPlan === 'yearly' && (
            <div className="flex justify-between items-center text-green-600">
              <span>Annual Savings</span>
              <span className="font-medium">-${plans.yearly.savings}</span>
            </div>
          )}

          <Separator />

          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total</span>
            <span>${plans[selectedPlan].price}</span>
          </div>

          {selectedPlan === 'yearly' && (
            <div className="text-center text-sm text-purple-600 font-medium">
              That's just ${plans.yearly.monthlyEquivalent}/month billed annually
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Info */}
      {isAuthenticated && user && (
        <div className={`${user.email_confirmed_at ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'} border rounded-lg p-4`}>
          <div className="flex items-center gap-2">
            {user.email_confirmed_at ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <Shield className="h-5 w-5 text-yellow-600" />
            )}
            <span className={`font-medium ${user.email_confirmed_at ? 'text-green-800' : 'text-yellow-800'}`}>{`Signed in as ${user.email}`}</span>
          </div>
          <p className={`text-sm mt-1 ${user.email_confirmed_at ? 'text-green-600' : 'text-yellow-700'}`}>
            {user.email_confirmed_at ? 'Your subscription will be linked to this account' : 'Please verify your email to continue with checkout'}
          </p>
        </div>
      )}

      {/* Secure Payment Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Shield className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="font-semibold text-blue-900 mb-1">Secure Stripe Checkout</h3>
        <p className="text-sm text-blue-700 mb-3">
          You'll be redirected to Stripe's secure payment page to complete your purchase safely.
        </p>
        <div className="flex items-center justify-center gap-6 text-xs text-blue-600">
          <span className="flex items-center gap-1">
            <CreditCard className="h-3 w-3" />
            Credit Cards
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-600 rounded"></div>
            Apple Pay
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-600 rounded"></div>
            Google Pay
          </span>
        </div>
      </div>

      {/* Checkout Actions */}
      <div className="space-y-2">
        <Button
          onClick={handleCheckout}
          disabled={isProcessing || !canCheckout}
          size="default"
          className="w-full h-12 text-base bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:opacity-60"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-5 w-5 mr-3 animate-spin" />
              Setting up secure checkout...
            </>
          ) : (
            <>
              <Lock className="h-5 w-5 mr-3" />
              {canCheckout ? `Complete Secure Checkout - $${plans[selectedPlan].price}` : 'Verify email to continue'}
            </>
          )}
        </Button>

        <Button
          onClick={() => setCurrentStep(isAuthenticated ? 'plans' : 'auth')}
          variant="outline"
          size="default"
          className="w-full h-11"
        >
          Back
        </Button>
      </div>

      {/* Security & Guarantee */}
      <div className="flex items-center justify-center gap-2 text-sm text-gray-500 text-center whitespace-nowrap">
        <Shield className="h-4 w-4" />
        <span>Secured by 256-bit SSL encryption • 30-day money-back guarantee • Cancel anytime</span>
      </div>
    </div>
    );
  };

  // Render processing step (kept for legacy flows but not used in direct checkout)
  const renderProcessingStep = () => (
    <div className="text-center py-12 space-y-6">
      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
      </div>
      <div>
        <h3 className="text-2xl font-bold mb-2">Setting Up Your Checkout</h3>
        <p className="text-gray-600">Creating secure payment session...</p>
        <p className="text-sm text-gray-500 mt-2">This usually takes just a few seconds</p>
      </div>
    </div>
  );

  // Render success step
  const renderSuccessStep = () => (
    <div className="text-center py-12 space-y-6">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto relative">
        <CheckCircle className="h-12 w-12 text-green-600" />
        <div className="absolute -top-2 -right-2">
          <Crown className="h-8 w-8 text-yellow-500" />
        </div>
      </div>
      <div>
        <h3 className="text-3xl font-bold text-green-600 mb-2">🎉 Premium Activated!</h3>
        <p className="text-gray-600 text-lg">Welcome to the premium experience!</p>
        
        <div className="bg-green-50 rounded-lg p-6 mt-6">
          <h4 className="font-semibold text-green-900 mb-3">What's Next?</h4>
          <p className="text-sm text-green-700 mb-4">
            You now have access to premium features including the SEO Academy, priority support, and more.
          </p>
          <Button
            onClick={() => {
              handleClose();
              navigate('/dashboard');
              onSuccess?.();
            }}
            className="bg-green-600 hover:bg-green-700"
          >
            Go to Dashboard
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );

  // Get step content
  const getStepContent = () => {
    switch (currentStep) {
      case 'features':
        return renderFeaturesStep();
      case 'plans':
        return renderPlansStep();
      case 'auth':
        return renderAuthStep();
      case 'checkout':
        return renderCheckoutStep();
      case 'processing':
        return renderProcessingStep();
      case 'success':
        return renderSuccessStep();
      default:
        return renderFeaturesStep();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl max-w-[95vw] max-h-[92vh] overflow-y-visible p-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="sr-only">Premium Plan Upgrade</DialogTitle>
        </DialogHeader>
        
        <div className="p-4 pt-2">
          <div className="rounded-lg overflow-hidden bg-gradient-to-br from-purple-600 to-blue-600 text-white">
            <div className="p-6">
              <LaunchLifetimeOverlay />
              {authLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
              ) : (
                getStepContent()
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PremiumPlanModal;
