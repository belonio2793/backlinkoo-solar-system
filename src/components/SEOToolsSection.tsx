import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { logError } from '@/utils/errorFormatter';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Zap,
  Target,
  Activity,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  ExternalLink,
  Calendar,
  BarChart3,
  Shield,
  Globe,
  Link,
  RefreshCw,
  Eye,
  Filter,
  Settings,
  CreditCard,
  Crown,
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Download,
  X,
  AlertCircle,
  Search,
  TrendingUp,
  DollarSign,
  ArrowRight,
  Lock,
  Star
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PremiumService } from "@/services/premiumService";
import { useToast } from "@/hooks/use-toast";
import type { User } from '@supabase/supabase-js';
import { KeywordResearchTool } from "@/components/KeywordResearchTool";
import { RankingTracker } from "@/components/RankingTracker";
import NoHandsSEODashboard from "@/components/NoHandsSEODashboard";
import SubscriptionService, { type SubscriptionStatus } from "@/services/subscriptionService";
import { usePremiumUpgrade } from "@/components/PremiumUpgradeProvider";
import { useAuth } from "@/hooks/useAuth";
import { PremiumCheckoutModal } from "@/components/PremiumCheckoutModal";

interface SEOToolsSectionProps {
  user: User | null;
}

interface NoHandsSEOProject {
  id: string;
  name: string;
  target_url: string;
  keywords: string[];
  status: 'active' | 'paused' | 'completed';
  blogs_found: number;
  successful_posts: number;
  created_at: string;
  last_run: string;
}

interface BlogPost {
  id: string;
  project_id: string;
  blog_url: string;
  post_url: string;
  keyword: string;
  status: 'pending' | 'posted' | 'failed';
  posted_at: string;
  name_used: string;
  website_field: string;
}

const SEOToolsSection = ({ user }: SEOToolsSectionProps) => {
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({
    isSubscribed: false,
    subscriptionTier: null,
    features: {
      keywordResearch: false,
      automatedCampaigns: false,
      rankTracker: false,
      unlimitedAccess: false,
    }
  });
  const [projects, setProjects] = useState<NoHandsSEOProject[]>([]);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("keyword-research");
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isCancellingSubscription, setIsCancellingSubscription] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [billingEmailNotifications, setBillingEmailNotifications] = useState(true);
  const [subscriptionInfo, setSubscriptionInfo] = useState<any>(null);
  const [showPremiumCheckout, setShowPremiumCheckout] = useState(false);
  const { toast } = useToast();
  const { openUpgradeModal } = usePremiumUpgrade();
  const { isPremium: authIsPremium } = useAuth();
  const [isPremiumResolved, setIsPremiumResolved] = useState(false);
  const [isPremiumEffective, setIsPremiumEffective] = useState<boolean>(!!authIsPremium);

  useEffect(() => {
    if (user) {
      checkSubscriptionStatus();
      fetchProjects();
      fetchRecentPosts();
      loadBillingEmailPreferences();
    }
  }, [user]);

  // Resolve premium early to avoid overlay flash
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        if (authIsPremium) {
          if (active) {
            setIsPremiumEffective(true);
            setIsPremiumResolved(true);
            try { localStorage.setItem('premium:active', '1'); } catch {}
          }
          return;
        }
        const cached = (() => { try { return localStorage.getItem('premium:active'); } catch { return null; } })();
        if (cached === '1') {
          if (active) { setIsPremiumEffective(true); setIsPremiumResolved(true); }
          return;
        }
        const { data: { session } } = await supabase.auth.getSession();
        const uid = session?.user?.id;
        if (!uid) { if (active) { setIsPremiumEffective(false); setIsPremiumResolved(true); } return; }
        const isPrem = await PremiumService.checkPremiumStatus(uid);
        try { localStorage.setItem('premium:active', isPrem ? '1' : '0'); } catch {}
        if (active) { setIsPremiumEffective(isPrem); setIsPremiumResolved(true); }
      } catch {
        if (active) { setIsPremiumEffective(!!authIsPremium); setIsPremiumResolved(true); }
      }
    })();
    return () => { active = false; };
  }, [authIsPremium]);

  const checkSubscriptionStatus = async () => {
    try {
      const status = await SubscriptionService.getSubscriptionStatus(user);
      setSubscriptionStatus(status);

      // Also get subscription info for the modal
      const info = await SubscriptionService.getSubscriptionInfo(user);
      setSubscriptionInfo(info);
    } catch (error: any) {
      logError('Error checking subscription', error);
      setSubscriptionStatus({
        isSubscribed: false,
        subscriptionTier: null,
        features: {
          keywordResearch: false,
          automatedCampaigns: false,
          rankTracker: false,
          unlimitedAccess: false,
        }
      });
    }
  };

  const fetchProjects = async () => {
    try {
      setProjects([]);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    }
  };

  const fetchRecentPosts = async () => {
    try {
      setRecentPosts([]);
    } catch (error) {
      console.error('Error fetching recent posts:', error);
      setRecentPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = async () => {
    try {
      const result = await SubscriptionService.createSubscription(user);

      if (!result.success) {
        throw new Error(result.error);
      }

      if (result.url) {
        const checkoutWindow = window.open(
          result.url,
          'stripe-checkout',
          'width=800,height=600,scrollbars=yes,resizable=yes,location=yes,status=yes'
        );

        if (!checkoutWindow) {
          toast({
            title: "Popup Blocked",
            description: "Opening in new window...",
          });
          const fallbackWindow = window.open(result.url, 'stripe-checkout-fallback', 'width=800,height=600,scrollbars=yes,resizable=yes');
          if (!fallbackWindow) {
            window.location.href = result.url;
          }
        }
      }
    } catch (error: any) {
      console.error('Error creating subscription:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to start subscription process. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Use subscription info from service
  const subscriptionData = subscriptionInfo || {
    plan: "Premium SEO Tools",
    price: "$29.00",
    billing: "Monthly",
    nextBillingDate: "March 15, 2024",
    cardLast4: "4242",
    cardBrand: "Visa",
    email: user?.email || "user@example.com",
    status: "Active",
    features: [
      "Unlimited keyword research",
      "Advanced SERP analysis",
      "Automated campaign management",
      "Real-time rank tracking",
      "Priority support",
      "Export capabilities"
    ]
  };

  const handleCancelSubscription = async () => {
    setIsCancellingSubscription(true);
    try {
      const result = await SubscriptionService.cancelSubscription(user);

      if (!result.success) {
        throw new Error(result.error);
      }

      toast({
        title: "Subscription Cancelled",
        description: "Your subscription has been cancelled. You'll continue to have access until your current billing period ends.",
      });

      setIsSubscriptionModalOpen(false);
      setShowCancelConfirmation(false);

      await checkSubscriptionStatus();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to cancel subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCancellingSubscription(false);
    }
  };

  const downloadInvoice = () => {
    toast({
      title: "Invoice Downloaded",
      description: "Your latest invoice has been downloaded to your device.",
    });
  };

  const loadBillingEmailPreferences = async () => {
    try {
      const savedPreference = localStorage.getItem(`billing_email_notifications_${user?.id}`);
      if (savedPreference !== null) {
        setBillingEmailNotifications(savedPreference === 'true');
      }
    } catch (error) {
      console.error('Error loading billing email preferences:', error);
    }
  };

  const updateBillingEmailPreferences = async (enabled: boolean) => {
    try {
      localStorage.setItem(`billing_email_notifications_${user?.id}`, enabled.toString());

      setBillingEmailNotifications(enabled);
      toast({
        title: enabled ? "Notifications Enabled" : "Notifications Disabled",
        description: `You will ${enabled ? 'now' : 'no longer'} receive billing email notifications.`,
      });
    } catch (error) {
      console.error('Error updating billing email preferences:', error);
      toast({
        title: "Error",
        description: "Failed to update email notification preferences. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Teaser component for Keyword Research
  const KeywordResearchTeaser = () => (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-600" />
            Keyword Research Tool
          </CardTitle>
          <Badge variant="outline" className="border-blue-300 text-blue-700">
            <Crown className="h-3 w-3 mr-1" />
            Premium
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Demo Interface */}
        <div className="relative">
          <div className="opacity-60 pointer-events-none">
            <div className="flex gap-2 mb-4">
              <div className="flex-1">
                <input 
                  className="w-full px-3 py-2 border rounded-lg bg-gray-50" 
                  placeholder="Enter keyword..." 
                  value="digital marketing" 
                  readOnly 
                />
              </div>
              <Button className="bg-blue-600 text-white" disabled>
                <Search className="h-4 w-4 mr-2" />
                Research
              </Button>
            </div>
            
            {/* Sample Results */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">12,400</div>
                  <div className="text-sm text-gray-600">Monthly Searches</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">Medium</div>
                  <div className="text-sm text-gray-600">Difficulty</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">$2.40</div>
                  <div className="text-sm text-gray-600">Avg CPC</div>
                </CardContent>
              </Card>
            </div>

            {/* Sample Keywords Table */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 font-medium text-sm">Related Keywords</div>
              <div className="divide-y">
                {[
                  { keyword: "digital marketing strategy", volume: "8,200", difficulty: "Medium", cpc: "$3.10" },
                  { keyword: "digital marketing tools", volume: "15,600", difficulty: "High", cpc: "$4.20" },
                  { keyword: "digital marketing tips", volume: "5,900", difficulty: "Low", cpc: "$1.80" }
                ].map((item, index) => (
                  <div key={index} className="grid grid-cols-4 gap-4 px-4 py-3 text-sm">
                    <span className="font-medium">{item.keyword}</span>
                    <span className="text-gray-600">{item.volume}</span>
                    <span className="text-gray-600">{item.difficulty}</span>
                    <span className="text-gray-600">{item.cpc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-lg">
            <div className="text-center space-y-4 p-6">
              <Lock className="h-12 w-12 text-blue-600 mx-auto" />
              <h3 className="text-xl font-semibold text-gray-900">Unlock Advanced Keyword Research</h3>
              <p className="text-gray-600 max-w-sm">
                Get unlimited keyword suggestions, search volume data, competition analysis, and geographic targeting.
              </p>
              <div className="space-y-2">
                {["Search volume & trends", "Keyword difficulty scores", "Geographic targeting", "Competitor analysis", "Export capabilities"].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    {feature}
                  </div>
                ))}
              </div>
              <Button 
                onClick={() => setShowPremiumCheckout(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Crown className="h-4 w-4 mr-2" />
                Upgrade to Premium
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Teaser component for Rank Tracker
  const RankTrackerTeaser = () => (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-green-50 to-emerald-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Rank Tracker
          </CardTitle>
          <Badge variant="outline" className="border-green-300 text-green-700">
            <Crown className="h-3 w-3 mr-1" />
            Premium
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Demo Interface */}
        <div className="relative">
          <div className="opacity-60 pointer-events-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Website URL</label>
                <input 
                  className="w-full px-3 py-2 border rounded-lg bg-gray-50" 
                  placeholder="https://example.com" 
                  value="https://mywebsite.com" 
                  readOnly 
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Target Keyword</label>
                <input 
                  className="w-full px-3 py-2 border rounded-lg bg-gray-50" 
                  placeholder="your keyword" 
                  value="digital marketing" 
                  readOnly 
                />
              </div>
            </div>
            
            <Button className="bg-green-600 text-white mb-4" disabled>
              <Target className="h-4 w-4 mr-2" />
              Track Rankings
            </Button>

            {/* Sample Rankings Table */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 font-medium text-sm">Ranking Results</div>
              <div className="divide-y">
                {[
                  { keyword: "digital marketing", url: "mywebsite.com", position: 8, trend: "up", change: "+3" },
                  { keyword: "seo services", url: "mywebsite.com", position: 15, trend: "down", change: "-2" },
                  { keyword: "online marketing", url: "mywebsite.com", position: 23, trend: "stable", change: "0" }
                ].map((item, index) => (
                  <div key={index} className="grid grid-cols-5 gap-4 px-4 py-3 text-sm">
                    <span className="font-medium">{item.keyword}</span>
                    <span className="text-gray-600">{item.url}</span>
                    <span className="font-bold text-gray-900">#{item.position}</span>
                    <div className="flex items-center gap-1">
                      {item.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-600" />}
                      {item.trend === 'down' && <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />}
                      {item.trend === 'stable' && <div className="w-4 h-4 bg-gray-400 rounded-full" />}
                      <span className={item.trend === 'up' ? 'text-green-600' : item.trend === 'down' ? 'text-red-600' : 'text-gray-600'}>
                        {item.change}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Google
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-lg">
            <div className="text-center space-y-4 p-6">
              <Lock className="h-12 w-12 text-green-600 mx-auto" />
              <h3 className="text-xl font-semibold text-gray-900">Unlock Real-Time Rank Tracking</h3>
              <p className="text-gray-600 max-w-sm">
                Monitor your keyword rankings across multiple search engines with automatic daily updates and historical data.
              </p>
              <div className="space-y-2">
                {["Daily rank monitoring", "Multiple search engines", "Historical tracking", "Position change alerts", "Competitor comparison"].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    {feature}
                  </div>
                ))}
              </div>
              <Button 
                onClick={() => setShowPremiumCheckout(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Crown className="h-4 w-4 mr-2" />
                Upgrade to Premium
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const BlockingOverlay = ({ title, description }: { title: string; description?: string }) => (
    <div className="w-full min-h-[320px] flex items-center justify-center">
      <div className="text-center space-y-4 p-6 bg-white rounded-lg shadow-sm border max-w-sm w-full">
        <div className="flex justify-center">
          <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
            <Crown className="h-8 w-8 text-white" />
          </div>
        </div>
        <div className="flex items-center justify-center gap-2">
          <span className="text-xl font-semibold">{title}</span>
          <Badge variant="outline" className="border-yellow-300 text-yellow-700">Premium</Badge>
        </div>
        {description ? (
          <p className="text-gray-600 text-sm">{description}</p>
        ) : null}
        <Button onClick={() => setShowPremiumCheckout(true)} className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white">
          Upgrade to Premium
        </Button>
      </div>
    </div>
  );

  const hasPremiumAccess = (() => {
    if (isPremiumEffective || authIsPremium) return true;
    if (!subscriptionStatus || !subscriptionStatus.isSubscribed) return false;
    const tier = (subscriptionStatus.subscriptionTier || '').toString().toLowerCase();
    if (tier.includes('premium') || subscriptionStatus.features?.unlimitedAccess || subscriptionStatus.features?.keywordResearch) return true;
    return false;
  })();

  // Allow global dashboard button to open subscription management or checkout
  useEffect(() => {
    const handler = () => {
      if (hasPremiumAccess) {
        setIsSubscriptionModalOpen(true);
      } else {
        setShowPremiumCheckout(true);
      }
    };
    window.addEventListener('openManageSubscription', handler);
    // Hash-based trigger
    try {
      if (window.location.hash.replace('#','') === 'manage-subscription') {
        handler();
      }
    } catch {}
    return () => {
      window.removeEventListener('openManageSubscription', handler);
    };
  }, [hasPremiumAccess]);

  if (!hasPremiumAccess) {
    return (
      <div className="space-y-6">
        <BlockingOverlay title="SEO Tools are Premium" description="Upgrade to access Keyword Research and Rank Tracker." />
        <PremiumCheckoutModal
          isOpen={showPremiumCheckout}
          onClose={() => setShowPremiumCheckout(false)}
          onSuccess={() => {
            setShowPremiumCheckout(false);
            checkSubscriptionStatus();
            toast({ title: 'Welcome to Premium!', description: 'Your subscription is now active.' });
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">SEO Tools</h2>
          {hasPremiumAccess && (
            <Badge variant="secondary" className="text-xs">
              <Crown className="h-3 w-3 mr-1" />
              Premium Active
            </Badge>
          )}
        </div>
      </div>

      {/* Main Content - Always show tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="keyword-research" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Keyword Research
            {isPremiumResolved && !hasPremiumAccess && (
              <Lock className="h-3 w-3 opacity-50" />
            )}
          </TabsTrigger>
          <TabsTrigger value="rank-tracker" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Rank Tracker
            {isPremiumResolved && !hasPremiumAccess && (
              <Lock className="h-3 w-3 opacity-50" />
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="keyword-research" className="space-y-6">
          {!isPremiumResolved && !hasPremiumAccess && !isPremiumEffective ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading tools...</p>
              </CardContent>
            </Card>
          ) : !hasPremiumAccess ? (
            <KeywordResearchTeaser />
          ) : (
            <KeywordResearchTool />
          )}
        </TabsContent>

        <TabsContent value="rank-tracker" className="space-y-6">
          {!isPremiumResolved && !hasPremiumAccess && !isPremiumEffective ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading tools...</p>
              </CardContent>
            </Card>
          ) : !hasPremiumAccess ? (
            <RankTrackerTeaser />
          ) : (
            <RankingTracker />
          )}
        </TabsContent>
      </Tabs>

      {/* Premium Checkout Modal */}
      <PremiumCheckoutModal
        isOpen={showPremiumCheckout}
        onClose={() => setShowPremiumCheckout(false)}
        onSuccess={() => {
          setShowPremiumCheckout(false);
          checkSubscriptionStatus();
          toast({ title: 'Welcome to Premium!', description: 'Your subscription is now active.' });
        }}
      />

      {/* Subscription Management Modal */}
      {hasPremiumAccess && (
        <Dialog open={isSubscriptionModalOpen} onOpenChange={setIsSubscriptionModalOpen}>
          <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Subscription Management
              </DialogTitle>
              <DialogDescription>
                Manage your subscription, billing information, and payment settings.
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="subscription" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="subscription">Plan</TabsTrigger>
                <TabsTrigger value="billing">Billing</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <div className="overflow-y-auto max-h-[50vh] mt-4">
                <TabsContent value="subscription" className="space-y-4 mt-0">
                  {/* Current Plan */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Current Plan</h3>
                      <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        {subscriptionData.status}
                      </Badge>
                    </div>

                    <Card>
                      <CardContent className="p-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Plan</p>
                            <p className="font-medium">{subscriptionData.plan}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Price</p>
                            <p className="font-medium">{subscriptionData.price}/{subscriptionData.billing.toLowerCase()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Next Billing</p>
                            <p className="font-medium">{subscriptionData.nextBillingDate}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-medium">{subscriptionData.email}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Features Included */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Features Included</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {subscriptionData.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="billing" className="space-y-4 mt-0">
                  {/* Payment Method */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Payment Method</h3>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <CreditCard className="h-8 w-8 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{subscriptionData.cardBrand} ••••{subscriptionData.cardLast4}</p>
                              <p className="text-sm text-muted-foreground">Expires 12/2027</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Update
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Billing History */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Recent Invoices</h3>
                      <Button variant="outline" size="sm" onClick={downloadInvoice}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                    <Card>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span>Feb 15, 2024</span>
                            <span className="font-medium">$29.00</span>
                            <Badge variant="outline" className="text-xs">Paid</Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span>Jan 15, 2024</span>
                            <span className="font-medium">$29.00</span>
                            <Badge variant="outline" className="text-xs">Paid</Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span>Dec 15, 2023</span>
                            <span className="font-medium">$29.00</span>
                            <Badge variant="outline" className="text-xs">Paid</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4 mt-0">
                  {/* Account Settings */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Account Settings</h3>
                    <Card>
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Billing Email Notifications</p>
                            <p className="text-sm text-muted-foreground">Receive billing and payment alerts</p>
                          </div>
                          <Switch
                            checked={billingEmailNotifications}
                            onCheckedChange={updateBillingEmailPreferences}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Cancellation */}
                  {!showCancelConfirmation ? (
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-red-600">Danger Zone</h3>
                      <Card className="border-red-200">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div>
                              <p className="font-medium text-red-800">Cancel Subscription</p>
                              <p className="text-sm text-red-600">You'll continue to have access until your current billing period ends.</p>
                            </div>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setShowCancelConfirmation(true)}
                              className="w-full"
                            >
                              Cancel Plan
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Card className="border-red-200 bg-red-50">
                        <CardContent className="p-4">
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <AlertCircle className="h-5 w-5 text-red-600" />
                              <h3 className="font-semibold text-red-800">Confirm Cancellation</h3>
                            </div>
                            <p className="text-sm text-red-700">
                              Are you sure you want to cancel your subscription? You'll lose access to all premium features
                              after {subscriptionData.nextBillingDate}.
                            </p>
                            <div className="space-y-2">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleCancelSubscription}
                                disabled={isCancellingSubscription}
                                className="w-full"
                              >
                                {isCancellingSubscription ? "Cancelling..." : "Yes, Cancel Subscription"}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowCancelConfirmation(false)}
                                disabled={isCancellingSubscription}
                                className="w-full"
                              >
                                Keep Subscription
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </TabsContent>
              </div>
            </Tabs>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsSubscriptionModalOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default SEOToolsSection;
