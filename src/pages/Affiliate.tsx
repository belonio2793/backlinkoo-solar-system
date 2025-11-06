import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users, DollarSign, Gift, Copy, Share2, Trophy, Target,
  TrendingUp, MousePointerClick, Calendar, Clock, CheckCircle, Star,
  CreditCard, Wallet, Link2, Eye, RefreshCw, Download,
  Crown, Zap, Heart, Award, Sparkles
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useAffiliate } from '@/hooks/useAffiliate';
import { affiliateService } from '@/services/affiliateService';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const Affiliate: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const {
    isLoading,
    stats,
    referrals,
    creditHistory,
    generateReferralLink,
    refreshData
  } = useAffiliate();

  const referralLink = generateReferralLink();
  const linkInputRef = useRef<HTMLInputElement>(null);

  const copyReferralLink = async () => {
    // Focus and select entire input so users can Ctrl+C or right-click -> Copy
    if (linkInputRef.current) {
      try {
        linkInputRef.current.focus();
        linkInputRef.current.select();
        linkInputRef.current.setSelectionRange(0, referralLink.length);
      } catch (e) {
        // ignore selection errors in unsupported browsers
      }
    }

    toast({
      title: "Link Selected",
      description: "Press Ctrl+C or right-click and choose Copy.",
    });
  };

  const shareReferralLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Backlink ∞ - Get Free Credits',
          text: 'Join the best link building platform and get free credits to start!',
          url: referralLink,
        });
      } catch (error) {
        copyReferralLink();
      }
    } else {
      copyReferralLink();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="relative">
                <Users className="h-10 w-10 text-purple-600" />
                <Crown className="h-5 w-5 text-yellow-500 absolute -top-1 -right-1" />
              </div>
              <h1 className="relative inline-block px-6 py-1 text-5xl font-extrabold text-black tracking-tight overflow-hidden after:absolute after:inset-y-0 after:-left-1/3 after:h-full after:w-1/2 after:bg-white/60 after:skew-x-[-18deg] after:animate-glare-shine after:content-[''] after:pointer-events-none">
                Affiliate Program
              </h1>
              {stats?.isVip && (
                <Badge variant="secondary" className="ml-3 flex items-center gap-1">
                  <Crown className="h-4 w-4 text-yellow-500" />
                  VIP
                </Badge>
              )}
            </div>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              Earn credits by referring new users! {stats?.creditMultiplier > 1 ? (
                <>Premium VIPs earn <strong>2 credits</strong> for every $3 referrals spend (or per 3 credits purchased), and are eligible for VIP compensation, priority payouts and exclusive bonuses.</>
              ) : (
                <>You get <strong>1 credit</strong> for every $3 referrals spend (or per 3 credits purchased).</>
              )} Your referrals stay connected to you forever.
            </p>
          </div>

          {/* VIP Benefits (Premium-only) */}
          {stats?.isVip ? (
            <Card className="w-full col-span-1 lg:col-span-2 bg-white">
              <CardContent className="p-6 text-center">
                <div className="flex flex-col items-center">
                  <Crown className="h-8 w-8 text-yellow-500 mb-2" />
                  <h3 className="text-xl font-semibold mb-2">VIP Affiliate Program (Premium)</h3>
                  <p className="text-sm text-gray-600 max-w-3xl">As a Premium member you automatically receive VIP affiliate status with enhanced rewards and priority treatment.</p>
                  <div className="mt-4 grid grid-cols-3 gap-4 w-full">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">2x</div>
                      <div className="text-xs text-gray-500">Commission Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">Priority</div>
                      <div className="text-xs text-gray-500">Payouts & Support</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">Bonuses</div>
                      <div className="text-xs text-gray-500">Exclusive Rewards</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="w-full col-span-1 lg:col-span-2 bg-white border border-dashed border-gray-200">
              <CardContent className="p-6 text-center">
                <div className="flex flex-col items-center">
                  <Crown className="h-8 w-8 text-gray-400 mb-2" />
                  <h3 className="text-xl font-semibold mb-2">Become a VIP Affiliate</h3>
                  <p className="text-sm text-gray-600 max-w-3xl">Upgrade to Premium to automatically unlock VIP affiliate status with double rewards, priority payouts and exclusive bonuses.</p>
                  <div className="mt-4">
                    <Button variant="default" onClick={() => { /* open premium modal via Header default behavior */ window.location.href = '/signup'; }}>
                      Upgrade to Premium
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Credits</p>
                    <p className="text-3xl font-bold text-purple-600">{stats.totalCredits}</p>
                  </div>
                  <Gift className="h-8 w-8 text-purple-600" />
                </div>
                <div className="mt-2 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+{stats.thisMonthCredits} this month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Referrals</p>
                    <p className="text-3xl font-bold text-blue-600">{stats.totalReferrals}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div className="mt-2 space-y-1 text-xs text-gray-500">
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingUp className="h-3 w-3" />
                    <span>+{stats.thisMonthReferrals} this month</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1">
                    <MousePointerClick className="h-3 w-3 text-purple-600" />
                    <span className="flex items-center gap-1">
                      <span className="text-gray-600">Clicks:</span>
                      <span className="font-medium text-sm text-purple-600">{(stats.totalClicks ?? 0).toLocaleString()}</span>
                      {typeof stats.thisMonthClicks === 'number' && (
                        <span className="ml-1 text-[11px] text-gray-500">
                          (+{stats.thisMonthClicks.toLocaleString()} this month)
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                    <p className="text-3xl font-bold text-green-600">${stats.totalEarnings.toFixed(2)}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
                <div className="mt-2 flex items-center gap-1">
                  <span className="text-xs text-gray-600">Credits: ${(stats.totalCredits * 3.33).toFixed(0)} value</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                    <p className="text-3xl font-bold text-orange-600">{stats.conversionRate.toFixed(1)}%</p>
                  </div>
                  <Target className="h-8 w-8 text-orange-600" />
                </div>
                <div className="mt-2 flex items-center gap-1">
                  <Trophy className="h-3 w-3 text-orange-600" />
                  <span className="text-xs text-orange-600">Above average</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Referral Link Section */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="h-5 w-5" />
                Your Referral Link
              </CardTitle>
              <CardDescription>
                Share this link to earn credits when people sign up and make purchases
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={referralLink}
                  readOnly
                  ref={linkInputRef}
                  className="bg-white"
                />
                <Button onClick={copyReferralLink} variant="outline">
                  <Copy className="h-4 w-4 mr-2" />
                  Select
                </Button>
                <Button onClick={async () => { try { await navigator.clipboard.writeText(referralLink); toast({ title: 'Link Copied!', description: 'Your referral link has been copied to clipboard' }); } catch { toast({ title: 'Copy Failed', description: 'Please copy the link manually', variant: 'destructive' }); } }} variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
              
              <Alert>
                <Sparkles className="h-4 w-4" />
                <AlertDescription>
                  <strong>Earning Formula:</strong> {stats?.creditMultiplier > 1 ? (
                    <>Premium VIPs: <strong>2 credits</strong> per $3 spent (or per 3 credits purchased) — plus eligibility for VIP compensation, priority payouts, and exclusive bonuses.</>
                  ) : (
                    <>Standard: <strong>1 credit</strong> per $3 spent (or per 3 credits purchased).</>
                  )} Referrals are permanent - earn from their lifetime activity!
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="referrals">Referrals</TabsTrigger>
              <TabsTrigger value="credits">Credit History</TabsTrigger>
              <TabsTrigger value="rewards">Rewards</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Performance Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Performance This Month
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Credits Earned</span>
                        <span className="text-2xl font-bold text-purple-600">{stats.thisMonthCredits}</span>
                      </div>
                      <Progress value={Math.min(100, (stats.thisMonthCredits / 50) * 100)} className="h-2" />

                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">New Referrals</span>
                        <span className="text-2xl font-bold text-blue-600">{stats.thisMonthReferrals}</span>
                      </div>
                      <Progress value={Math.min(100, (stats.thisMonthReferrals / 10) * 100)} className="h-2" />

                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Conversion Rate</span>
                        <span className="text-2xl font-bold text-green-600">{stats.conversionRate.toFixed(1)}%</span>
                      </div>
                      <Progress value={Math.min(100, stats.conversionRate)} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button onClick={shareReferralLink} className="w-full justify-start">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Referral Link
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <a href="/affiliate/promotion-materials">
                        <Download className="h-4 w-4 mr-2" />
                        Download Marketing Materials
                      </a>
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Eye className="h-4 w-4 mr-2" />
                      View Affiliate Guide
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={refreshData}
                      disabled={isLoading}
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                      Refresh Statistics
                    </Button>

                    {user?.role === 'admin' && (
                      <Button
                        variant="destructive"
                        className="w-full justify-start mt-2"
                        onClick={async () => {
                          if (!user?.id) return;
                          const targetVip = !stats.isVip;
                          const ok = await affiliateService.setVipStatus(user.id, targetVip);
                          if (ok) {
                            await refreshData();
                            toast({ title: 'VIP Updated', description: `Your VIP status is now ${targetVip ? 'ON' : 'OFF'}` });
                          } else {
                            toast({ title: 'Update Failed', description: 'Could not update VIP status', variant: 'destructive' });
                          }
                        }}
                      >
                        <Crown className="h-4 w-4 mr-2" />
                        Toggle VIP (Admin)
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {creditHistory.slice(0, 5).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${
                            transaction.type === 'referral_purchase' ? 'bg-green-100' :
                            transaction.type === 'referral_signup' ? 'bg-blue-100' :
                            transaction.type === 'bonus' ? 'bg-purple-100' : 'bg-gray-100'
                          }`}>
                            {transaction.type === 'referral_purchase' && <DollarSign className="h-4 w-4 text-green-600" />}
                            {transaction.type === 'referral_signup' && <Users className="h-4 w-4 text-blue-600" />}
                            {transaction.type === 'bonus' && <Gift className="h-4 w-4 text-purple-600" />}
                            {transaction.type === 'spent' && <CreditCard className="h-4 w-4 text-gray-600" />}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{transaction.description}</p>
                            <p className="text-xs text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <Badge variant={transaction.amount > 0 ? 'default' : 'secondary'}>
                          {transaction.amount > 0 ? '+' : ''}{transaction.amount} credits
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="referrals" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Your Referrals ({referrals.length})
                  </CardTitle>
                  <CardDescription>
                    Track your referrals and their activity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {referrals.map((referral) => (
                      <div key={referral.id} className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-4">
                          <div className={`w-3 h-3 rounded-full ${
                            referral.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                          }`} />
                          <div>
                            <p className="font-medium">{referral.email}</p>
                            <p className="text-sm text-gray-500">
                              Joined: {new Date(referral.joinDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <p className="text-lg font-bold text-green-600">${referral.totalSpent}</p>
                              <p className="text-xs text-gray-500">Total Spent</p>
                            </div>
                            <div className="text-center">
                              <p className="text-lg font-bold text-purple-600">{referral.creditsGenerated}</p>
                              <p className="text-xs text-gray-500">Credits Earned</p>
                            </div>
                            <Badge variant={referral.status === 'active' ? 'default' : 'secondary'}>
                              {referral.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="credits" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    Credit History
                  </CardTitle>
                  <CardDescription>
                    Complete history of your credit transactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {creditHistory.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${
                            transaction.type === 'referral_purchase' ? 'bg-green-100' :
                            transaction.type === 'referral_signup' ? 'bg-blue-100' :
                            transaction.type === 'bonus' ? 'bg-purple-100' : 'bg-red-100'
                          }`}>
                            {transaction.type === 'referral_purchase' && <DollarSign className="h-4 w-4 text-green-600" />}
                            {transaction.type === 'referral_signup' && <Users className="h-4 w-4 text-blue-600" />}
                            {transaction.type === 'bonus' && <Gift className="h-4 w-4 text-purple-600" />}
                            {transaction.type === 'spent' && <CreditCard className="h-4 w-4 text-red-600" />}
                          </div>
                          <div>
                            <p className="font-medium">{transaction.description}</p>
                            <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant={transaction.amount > 0 ? 'default' : 'destructive'}
                            className={transaction.amount > 0 ? 'bg-green-100 text-green-800' : ''}
                          >
                            {transaction.amount > 0 ? '+' : ''}{transaction.amount} credits
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rewards" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Affiliate Rewards & Milestones
                  </CardTitle>
                  <CardDescription>
                    Unlock special bonuses as you grow your affiliate network
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { milestone: '5 Referrals', reward: '10 Bonus Credits', completed: true, progress: 100 },
                      { milestone: '10 Referrals', reward: '25 Bonus Credits', completed: true, progress: 100 },
                      { milestone: '25 Referrals', reward: '75 Bonus Credits', completed: false, progress: 48 },
                      { milestone: '50 Referrals', reward: '200 Bonus Credits', completed: false, progress: 24 },
                      { milestone: '100 Referrals', reward: '500 Bonus Credits', completed: false, progress: 12 },
                      { milestone: '250 Referrals', reward: '1500 Bonus Credits', completed: false, progress: 5 }
                    ].map((item, idx) => (
                      <div key={idx} className={`p-4 rounded-lg border-2 ${
                        item.completed ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'
                      }`}>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold">{item.milestone}</h4>
                          {item.completed && <CheckCircle className="h-5 w-5 text-green-600" />}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{item.reward}</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>Progress</span>
                            <span>{item.progress}%</span>
                          </div>
                          <Progress value={item.progress} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    VIP Affiliate Program
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <Crown className="h-12 w-12 text-yellow-500 mx-auto" />
                    <h3 className="text-xl font-bold">Premium Users</h3>
                    <p className="text-gray-600">
                      Unlock VIP status with exclusive benefits: Higher commission rates, 
                      priority support, custom landing pages, and monthly bonus rewards!
                    </p>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">2x</p>
                        <p className="text-sm text-gray-600">Commission Rate</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">24/7</p>
                        <p className="text-sm text-gray-600">Priority Support</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Affiliate;
