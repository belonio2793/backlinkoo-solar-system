import { supabase } from '@/integrations/supabase/client';

export interface AffiliateStats {
  totalCredits: number;
  totalReferrals: number;
  totalEarnings: number;
  conversionRate: number;
  thisMonthCredits: number;
  thisMonthReferrals: number;
  creditMultiplier: number;
  isVip: boolean;
  vipSource: 'premium' | 'milestone' | null;
  totalClicks?: number;        // total number of affiliate link clicks
  thisMonthClicks?: number;    // clicks this month
}

export interface ReferralData {
  id: string;
  email: string;
  joinDate: string;
  totalSpent: number;
  creditsGenerated: number;
  status: 'active' | 'inactive';
  lastActivity: string;
  referrerId: string;
}

export interface CreditTransaction {
  id: string;
  userId: string;
  type: 'referral_signup' | 'referral_purchase' | 'bonus' | 'spent';
  amount: number;
  description: string;
  date: string;
  referralId?: string;
  metadata?: any;
}

class AffiliateService {
  private readonly TRACKING_COOKIE = 'affiliate_ref';
  private readonly TRACKING_COOKIE_TTL_DAYS = 30;
  private readonly CLICK_SESSION_PREFIX = 'affiliate_click_record';

  /**
   * Initialize affiliate tracking for visitors arriving with an affiliate reference.
   */
  async initializeAffiliateTracking(explicitAffiliateId?: string): Promise<void> {
    if (typeof window === 'undefined') {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const affiliateFromParam = explicitAffiliateId || params.get('ref');
    let affiliateId = (affiliateFromParam || this.getTrackingCookie() || '').trim();

    if (!affiliateId) {
      return;
    }

    if (affiliateFromParam) {
      this.storeTrackingCookie(affiliateId);
    }

    const landingPage = window.location.href.split('#')[0];

    if (this.hasLoggedClick(affiliateId, landingPage)) {
      return;
    }

    try {
      const ip = await this.getVisitorIP();
      const utmParams = this.getUTMParams(params);

      await this.recordAffiliateClick(affiliateId, {
        ip,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
        referer: typeof document !== 'undefined' && document.referrer ? document.referrer : undefined,
        landingPage,
        utmParams: Object.keys(utmParams).length > 0 ? utmParams : undefined
      });

      this.markClickLogged(affiliateId, landingPage);
    } catch (error) {
      console.error('Failed to initialize affiliate tracking:', error);
    }
  }

  private async recordAffiliateClick(affiliateId: string, request: {
    ip: string;
    userAgent: string;
    referer?: string;
    landingPage: string;
    utmParams?: Record<string, string>;
  }): Promise<void> {
    try {
      const { error } = await supabase
        .from('affiliate_clicks')
        .insert({
          affiliate_id: affiliateId,
          referral_code: this.buildReferralCode(affiliateId),
          visitor_ip: request.ip || '0.0.0.0',
          user_agent: request.userAgent || 'unknown',
          referer: request.referer ?? null,
          utm_params: request.utmParams ?? null,
          landing_page: request.landingPage,
          device_type: this.detectDeviceType(request.userAgent || ''),
          browser: this.detectBrowser(request.userAgent || ''),
          os: this.detectOS(request.userAgent || '')
        });

      if (error) {
        console.error('Error recording affiliate click:', error);
      }
    } catch (error) {
      console.error('Error storing affiliate click:', error);
    }
  }

  private getSessionKey(affiliateId: string, landingPage: string): string {
    return `${this.CLICK_SESSION_PREFIX}:${affiliateId}:${landingPage}`;
  }

  private hasLoggedClick(affiliateId: string, landingPage: string): boolean {
    if (typeof sessionStorage === 'undefined') {
      return false;
    }

    try {
      return sessionStorage.getItem(this.getSessionKey(affiliateId, landingPage)) === '1';
    } catch {
      return false;
    }
  }

  private markClickLogged(affiliateId: string, landingPage: string): void {
    if (typeof sessionStorage === 'undefined') {
      return;
    }

    try {
      sessionStorage.setItem(this.getSessionKey(affiliateId, landingPage), '1');
    } catch {
      // Ignore storage write errors (private browsing, etc.)
    }
  }

  private storeTrackingCookie(affiliateId: string): void {
    if (typeof document === 'undefined') {
      return;
    }

    const expires = new Date();
    expires.setDate(expires.getDate() + this.TRACKING_COOKIE_TTL_DAYS);
    document.cookie = `${this.TRACKING_COOKIE}=${affiliateId}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
  }

  private getTrackingCookie(): string | null {
    if (typeof document === 'undefined') {
      return null;
    }

    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const trimmed = cookie.trim();
      if (trimmed.startsWith(`${this.TRACKING_COOKIE}=`)) {
        return trimmed.split('=')[1] || null;
      }
    }

    return null;
  }

  private getUTMParams(params: URLSearchParams): Record<string, string> {
    const utmParams: Record<string, string> = {};
    const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

    for (const key of keys) {
      const value = params.get(key);
      if (value) {
        utmParams[key] = value;
      }
    }

    return utmParams;
  }

  private detectDeviceType(userAgent: string): 'desktop' | 'mobile' | 'tablet' {
    const ua = userAgent.toLowerCase();

    if (ua.includes('ipad') || ua.includes('tablet')) {
      return 'tablet';
    }

    if (ua.includes('mobile') || ua.includes('iphone') || ua.includes('android')) {
      return 'mobile';
    }

    return 'desktop';
  }

  private detectBrowser(userAgent: string): string {
    if (!userAgent) {
      return 'Unknown';
    }

    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    if (userAgent.includes('Opera') || userAgent.includes('OPR')) return 'Opera';
    return 'Unknown';
  }

  private detectOS(userAgent: string): string {
    if (!userAgent) {
      return 'Unknown';
    }

    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'iOS';
    return 'Unknown';
  }

  private async getVisitorIP(): Promise<string> {
    if (typeof fetch === 'undefined') {
      return '0.0.0.0';
    }

    try {
      const response = await fetch('https://api.ipify.org?format=json');
      if (!response.ok) {
        return '0.0.0.0';
      }

      const data = await response.json();
      return data?.ip || '0.0.0.0';
    } catch (error) {
      console.error('Failed to determine visitor IP:', error);
      return '0.0.0.0';
    }
  }

  private buildReferralCode(affiliateId: string): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return `${affiliateId}-${crypto.randomUUID()}`;
    }

    return `${affiliateId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  /**
   * Generate referral link for user
   */
  generateReferralLink(userId: string): string {
    const baseUrl = window.location.origin;
    return `${baseUrl}/signup?ref=${userId}`;
  }

  /**
   * Track new referral signup
   */
  async trackReferralSignup(referrerId: string, newUserId: string, newUserEmail: string): Promise<boolean> {
    try {
      // Create referral record
      const { error: referralError } = await supabase
        .from('user_referrals')
        .insert({
          referrer_id: referrerId,
          referred_user_id: newUserId,
          referred_email: newUserEmail,
          status: 'active',
          created_at: new Date().toISOString()
        });

      if (referralError) {
        console.error('Error creating referral record:', referralError.message || referralError.toString() || JSON.stringify(referralError));
        return false;
      }

      // Award signup bonus (2 credits)
      await this.awardCredits(referrerId, 2, 'referral_signup', `New referral signup: ${newUserEmail}`, newUserId);

      return true;
    } catch (error) {
      console.error('Error tracking referral signup:', error.message || error.toString() || JSON.stringify(error));
      return false;
    }
  }

  /**
   * Track referral purchase and award credits
   */
  async trackReferralPurchase(userId: string, amount: number, creditsOrDollars: 'credits' | 'dollars'): Promise<{ creditsAwarded: number; multiplier: number; referrerId: string } | null> {
    try {
      // Find referrer for this user
      const { data: referralData, error: findError } = await supabase
        .from('user_referrals')
        .select('referrer_id, referred_email')
        .eq('referred_user_id', userId)
        .eq('status', 'active')
        .single();

      if (findError || !referralData) {
        // User was not referred by anyone
        return null;
      }

      const multiplier = await this.getReferralCreditMultiplier(referralData.referrer_id);
      const baseUnits = Math.floor(amount / 3);

      if (baseUnits <= 0) {
        await this.updateReferralStats(referralData.referrer_id, userId, amount);
        return { creditsAwarded: 0, multiplier, referrerId: referralData.referrer_id };
      }

      const creditsToAward = baseUnits * multiplier;
      const isVipRate = multiplier > 1;
      const descriptionPrefix = isVipRate ? 'VIP referral purchase' : 'Referral purchase';
      const purchaseSummary = creditsOrDollars === 'credits'
        ? `${referralData.referred_email} bought ${amount} credits`
        : `${referralData.referred_email} spent $${amount}`;
      const metadata = {
        multiplier,
        baseUnits,
        awardedCredits: creditsToAward,
        calculationBasis: creditsOrDollars,
        purchaseAmount: amount,
        referralEmail: referralData.referred_email
      };

      await this.awardCredits(
        referralData.referrer_id,
        creditsToAward,
        'referral_purchase',
        `${descriptionPrefix}: ${purchaseSummary}`,
        userId,
        metadata
      );

      // Update referral statistics
      await this.updateReferralStats(referralData.referrer_id, userId, amount);

      return { creditsAwarded: creditsToAward, multiplier, referrerId: referralData.referrer_id };
    } catch (error) {
      console.error('Error tracking referral purchase:', error.message || error.toString() || JSON.stringify(error));
      return null;
    }
  }

  /**
   * Determine the credit multiplier for a referrer
   */
  private async getReferralCreditMultiplier(userId: string): Promise<number> {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_tier, role, is_vip')
        .eq('user_id', userId)
        .maybeSingle();

      if (profile?.is_vip === true) {
        return 2;
      }

      if (profile?.subscription_tier === 'premium' || profile?.subscription_tier === 'monthly' || profile?.role === 'premium' || profile?.role === 'admin') {
        return 2;
      }

      const nowIso = new Date().toISOString();
      const { data: activeSubscription } = await supabase
        .from('premium_subscriptions')
        .select('id')
        .eq('user_id', userId)
        .eq('status', 'active')
        .gte('current_period_end', nowIso)
        .maybeSingle();

      if (activeSubscription) {
        return 2;
      }

      return 1;
    } catch (error) {
      console.error('Error determining referral credit multiplier:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : undefined
      });
      return 1;
    }
  }

  /**
   * Award credits to user
   */
  private async awardCredits(
    userId: string,
    amount: number,
    type: CreditTransaction['type'],
    description: string,
    referralId?: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    try {
      // Add credit transaction
      const { error: transactionError } = await supabase
        .from('credit_transactions')
        .insert({
          user_id: userId,
          type,
          amount,
          description,
          referral_id: referralId,
          metadata: metadata ?? null,
          created_at: new Date().toISOString()
        });

      if (transactionError) {
        console.error('Error creating credit transaction:', transactionError.message || transactionError.toString() || JSON.stringify(transactionError));
        return;
      }

      // Update user's credits balance in credits table
      const { data: existing } = await supabase
        .from('credits')
        .select('amount, total_purchased')
        .eq('user_id', userId)
        .single();

      if (existing) {
        const newAmount = (existing.amount || 0) + amount;
        const newPurchased = (existing.total_purchased || 0) + amount;
        const { error: updErr } = await supabase
          .from('credits')
          .update({ amount: newAmount, total_purchased: newPurchased, updated_at: new Date().toISOString() })
          .eq('user_id', userId);
        if (updErr) {
          console.error('Error updating credits:', updErr.message || updErr.toString() || JSON.stringify(updErr));
        }
      } else {
        const { error: insErr } = await supabase
          .from('credits')
          .insert({
            user_id: userId,
            amount: amount,
            total_purchased: amount,
            total_used: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        if (insErr) {
          console.error('Error inserting credits:', insErr.message || insErr.toString() || JSON.stringify(insErr));
        }
      }
    } catch (error) {
      console.error('Error awarding credits:', error.message || error.toString() || JSON.stringify(error));
    }
  }

  /**
   * Update referral statistics
   */
  private async updateReferralStats(referrerId: string, referredUserId: string, amount: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_referrals')
        .update({
          total_spent: amount,
          last_activity: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('referrer_id', referrerId)
        .eq('referred_user_id', referredUserId);

      if (error) {
        console.error('Error updating referral stats:', error.message || error.toString() || JSON.stringify(error));
      }
    } catch (error) {
      console.error('Error updating referral stats:', error.message || error.toString() || JSON.stringify(error));
    }
  }

  /**
   * Get affiliate statistics for user
   */
  async getAffiliateStats(userId: string): Promise<AffiliateStats> {
    try {
      // Get total credits
      const { data: creditsData } = await supabase
        .from('credits')
        .select('amount')
        .eq('user_id', userId)
        .single();

      // Get total referrals
      const { data: referralsData } = await supabase
        .from('user_referrals')
        .select('*')
        .eq('referrer_id', userId);

      // Get this month's data
      const thisMonth = new Date();
      thisMonth.setDate(1);
      thisMonth.setHours(0, 0, 0, 0);

      const { data: thisMonthCredits } = await supabase
        .from('credit_transactions')
        .select('amount')
        .eq('user_id', userId)
        .gte('created_at', thisMonth.toISOString())
        .in('type', ['referral_signup', 'referral_purchase', 'bonus']);

      const { data: thisMonthReferrals } = await supabase
        .from('user_referrals')
        .select('id')
        .eq('referrer_id', userId)
        .gte('created_at', thisMonth.toISOString());

      const totalCredits = (creditsData as any)?.amount || 0;
      const totalReferrals = referralsData?.length || 0;
      const totalEarnings = totalCredits * 3.33; // Estimate $3.33 per credit value
      const conversionRate = totalReferrals > 0 ? (totalReferrals * 0.8) : 0; // Simplified calculation
      const thisMonthCreditsTotal = thisMonthCredits?.reduce((sum, t) => sum + t.amount, 0) || 0;
      const thisMonthReferralsTotal = thisMonthReferrals?.length || 0;
      const creditMultiplier = await this.getReferralCreditMultiplier(userId);
      // VIP status is determined solely by premium/subscription - no milestone-based VIP
      const isVip = creditMultiplier > 1;
      const vipSource: 'premium' | null = creditMultiplier > 1 ? 'premium' : null;

      // Get click counts: total and this month
      const { data: totalClicksData, count: totalClicksCount } = await supabase
        .from('affiliate_clicks')
        .select('id', { count: 'exact' })
        .eq('affiliate_id', userId);

      const { data: thisMonthClicksData, count: thisMonthClicksCount } = await supabase
        .from('affiliate_clicks')
        .select('id', { count: 'exact' })
        .eq('affiliate_id', userId)
        .gte('created_at', thisMonth.toISOString());

      return {
        totalCredits,
        totalReferrals,
        totalEarnings,
        conversionRate,
        thisMonthCredits: thisMonthCreditsTotal,
        thisMonthReferrals: thisMonthReferralsTotal,
        creditMultiplier,
        isVip,
        vipSource,
        totalClicks: totalClicksCount || 0,
        thisMonthClicks: thisMonthClicksCount || 0
      };
    } catch (error) {
      const msg = error?.message || error?.toString() || JSON.stringify(error);
      console.error('Error getting affiliate stats:', msg);
      if (typeof msg === 'string' && msg.includes('relation')) {
        console.error('One or more database tables used by the affiliate system appear to be missing. Please run the database migrations in supabase/migrations to create the required tables (affiliate and credit tables). You can also trigger the Netlify migration function: POST /.netlify/functions/run-migration with SUPABASE_SERVICE_ROLE_KEY set.');
      }
      return {
        totalCredits: 0,
        totalReferrals: 0,
        totalEarnings: 0,
        conversionRate: 0,
        thisMonthCredits: 0,
        thisMonthReferrals: 0
      };
    }
  }

  /**
   * Get user's referrals
   */
  async getUserReferrals(userId: string): Promise<ReferralData[]> {
    try {
      const { data, error } = await supabase
        .from('user_referrals')
        .select('*')
        .eq('referrer_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        const msg = error.message || error.toString() || JSON.stringify(error);
        console.error('Error getting user referrals:', msg);
        if (typeof msg === 'string' && msg.includes('relation') && msg.includes('user_referrals')) {
          console.error('Database table "user_referrals" appears to be missing. Run the database migrations in supabase/migrations to create affiliate tables (e.g. 20241220000000_create_affiliate_tables.sql, 20241223000000_create_affiliate_tables_final.sql, 20241225000000_create_affiliate_system.sql).');
          console.error('You can run migrations via the Supabase dashboard or use the provided Netlify migration function: POST /.netlify/functions/run-migration (ensure SUPABASE_SERVICE_ROLE_KEY is set).');
        }
        return [];
      }

      // Apply VIP multiplier based on referrer's status
      const multiplier = await this.getReferralCreditMultiplier(userId);

      return data?.map(referral => ({
        id: referral.id,
        email: referral.referred_email || 'Unknown',
        joinDate: referral.created_at,
        totalSpent: referral.total_spent || 0,
        creditsGenerated: Math.floor((referral.total_spent || 0) / 3) * multiplier,
        status: referral.status as 'active' | 'inactive',
        lastActivity: referral.last_activity || referral.created_at,
        referrerId: referral.referrer_id
      })) || [];
    } catch (error) {
      console.error('Error getting user referrals:', error.message || error.toString() || JSON.stringify(error));
      return [];
    }
  }

  /**
   * Admin: Set VIP status on a user's profile (creates is_vip flag if used)
   */
  async setVipStatus(userId: string, isVip: boolean): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_vip: isVip, updated_at: new Date().toISOString() })
        .eq('user_id', userId);

      if (error) {
        console.error('Error setting VIP status:', error.message || error.toString() || JSON.stringify(error));
        return false;
      }

      return true;
    } catch (e) {
      console.error('Error setting VIP status:', e instanceof Error ? e.message : JSON.stringify(e));
      return false;
    }
  }

  /**
   * Get credit transaction history
   */
  async getCreditHistory(userId: string): Promise<CreditTransaction[]> {
    try {
      const { data, error } = await supabase
        .from('credit_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        const msg = error.message || error.toString() || JSON.stringify(error);
        console.error('Error getting credit history:', msg);
        if (typeof msg === 'string' && msg.includes('relation') && msg.includes('credit_transactions')) {
          console.error('Database table "credit_transactions" appears to be missing. Run the database migrations in supabase/migrations to create credit/affiliate tables (look for files like 20241220000000_create_affiliate_tables.sql and 20241225000000_create_affiliate_system.sql).');
          console.error('You can run migrations via the Supabase dashboard or use the provided Netlify migration function: POST /.netlify/functions/run-migration (ensure SUPABASE_SERVICE_ROLE_KEY is set as an env variable).');
        }
        return [];
      }

      return data?.map(transaction => ({
        id: transaction.id,
        userId: transaction.user_id,
        type: transaction.type,
        amount: transaction.amount,
        description: transaction.description,
        date: transaction.created_at,
        referralId: transaction.referral_id,
        metadata: transaction.metadata
      })) || [];
    } catch (error) {
      console.error('Error getting credit history:', error.message || error.toString() || JSON.stringify(error));
      return [];
    }
  }

  /**
   * Check for milestone rewards
   */
  async checkMilestoneRewards(userId: string): Promise<void> {
    try {
      const stats = await this.getAffiliateStats(userId);
      const milestones = [
        { referrals: 5, reward: 10 },
        { referrals: 10, reward: 25 },
        { referrals: 25, reward: 75 },
        { referrals: 50, reward: 200 },
        { referrals: 100, reward: 500 },
        { referrals: 250, reward: 1500 }
      ];

      // Check if user has reached any new milestones
      for (const milestone of milestones) {
        if (stats.totalReferrals >= milestone.referrals) {
          // Check if already awarded
          const { data: existingReward } = await supabase
            .from('credit_transactions')
            .select('id')
            .eq('user_id', userId)
            .eq('type', 'bonus')
            .ilike('description', `%${milestone.referrals} referrals%`)
            .single();

          if (!existingReward) {
            await this.awardCredits(
              userId,
              milestone.reward,
              'bonus',
              `Milestone bonus: ${milestone.referrals} referrals achieved`
            );
          }
        }
      }
    } catch (error) {
      console.error('Error checking milestone rewards:', error.message || error.toString() || JSON.stringify(error));
    }
  }

  /**
   * Spend credits (deduct from balance)
   */
  async spendCredits(userId: string, amount: number, description: string): Promise<boolean> {
    try {
      // Check current balance
      const stats = await this.getAffiliateStats(userId);
      if (stats.totalCredits < amount) {
        return false; // Insufficient credits
      }

      // Record spending transaction
      await this.awardCredits(userId, -amount, 'spent', description);

      return true;
    } catch (error) {
      console.error('Error spending credits:', error.message || error.toString() || JSON.stringify(error));
      return false;
    }
  }
}

export const affiliateService = new AffiliateService();
