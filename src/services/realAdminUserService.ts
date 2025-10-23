import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { databaseConnectionService } from './databaseConnectionService';
import { SafeAuth } from '@/utils/safeAuth';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Subscriber = Database['public']['Tables']['subscribers']['Row'];

export interface RealUserDetails extends Profile {
  subscription?: Subscriber | null;
  campaignCount: number;
  totalCreditsUsed: number;
  currentCredits: number;
  totalRevenue: number;
  lastActivity: string | null;
  isPremium: boolean;
  isGifted: boolean;
}

export interface UserUpdatePayload {
  display_name?: string;
  email?: string;
  role?: 'admin' | 'user';
  isPremium?: boolean;
  isGifted?: boolean;
  subscriptionTier?: string;
  subscriptionEnd?: string;
}

export interface UserListFilters {
  search?: string;
  role?: 'admin' | 'user' | 'all';
  premiumStatus?: 'premium' | 'free' | 'gifted' | 'all';
  sortBy?: 'created_at' | 'email' | 'last_activity' | 'revenue';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

class RealAdminUserService {
  
  /**
   * Test database connection using enhanced service
   */
  async testConnection(): Promise<{
    success: boolean;
    profileCount: number;
    error?: string;
  }> {
    try {
      const result = await databaseConnectionService.testConnection();
      return {
        success: result.success,
        profileCount: result.profileCount,
        error: result.error
      };
    } catch (error: any) {
      return {
        success: false,
        profileCount: 0,
        error: error.message
      };
    }
  }

  /**
   * Check if current user has admin access using SafeAuth
   */
  async checkAdminAccess(): Promise<boolean> {
    try {
      const result = await SafeAuth.isAdmin();
      return result.isAdmin && !result.needsAuth;
    } catch (error) {
      console.error(' Admin access check failed:', error);
      return false;
    }
  }

  /**
   * Get all user profiles with proper error handling
   */
  async getAllProfiles(bypassAuth: boolean = false): Promise<Profile[]> {
    try {
      console.log('📋 Fetching all profiles...');

      // Check admin access unless bypassed (for admin dashboard use)
      if (!bypassAuth) {
        const isAdmin = await this.checkAdminAccess();
        if (!isAdmin) {
          throw new Error('Admin access required. Please ensure you are signed in as an admin user.');
        }
      } else {
        console.log('⚠ Bypassing auth check for admin dashboard metrics');
      }
      
      // Use direct query to profiles table to avoid auth.users permission issues
      const methods = [
        {
          name: 'Direct Query',
          execute: async () => {
            const { data, error } = await supabase
              .from('profiles')
              .select('*')
              .order('created_at', { ascending: false });
            if (error) throw error;
            return data;
          }
        }
      ];
      
      let lastError = null;
      for (const method of methods) {
        try {
          console.log(`🧪 Trying ${method.name}...`);
          const result = await method.execute();
          if (result && result.length >= 0) {
            console.log(`✅ ${method.name} successful - got ${result.length} profiles`);
            return result;
          }
        } catch (error: any) {
          console.warn(`❌ ${method.name} failed:`, error.message);
          lastError = error;
        }
      }
      
      throw lastError || new Error('All profile fetch methods failed');
      
    } catch (error: any) {
      console.error('❌ Failed to fetch profiles:', error);
      throw new Error(`Failed to fetch profiles: ${error.message}`);
    }
  }

  /**
   * Get paginated and filtered users with enhanced error handling
   */
  async getUsers(filters: UserListFilters = {}): Promise<{
    users: RealUserDetails[];
    totalCount: number;
    hasMore: boolean;
  }> {
    try {
      const {
        search = '',
        role = 'all',
        premiumStatus = 'all',
        sortBy = 'created_at',
        sortOrder = 'desc',
        limit = 50,
        offset = 0
      } = filters;

      console.log('📋 Fetching real users with filters:', filters);
      
      // Check connection first
      const connectionTest = await this.testConnection();
      if (!connectionTest.success) {
        throw new Error(connectionTest.error || 'Database connection failed');
      }
      
      // Get all profiles
      const allProfiles = await this.getAllProfiles();
      
      // Apply filters
      let filteredProfiles = [...allProfiles];
      
      // Role filter
      if (role !== 'all') {
        filteredProfiles = filteredProfiles.filter(p => p.role === role);
      }
      
      // Search filter
      if (search && search.trim() !== '') {
        const searchLower = search.toLowerCase();
        filteredProfiles = filteredProfiles.filter(p =>
          p.email?.toLowerCase().includes(searchLower) ||
          (p.display_name && p.display_name.toLowerCase().includes(searchLower))
        );
      }
      
      // Get enhanced data for filtered profiles (limit to improve performance)
      const profilesToEnhance = filteredProfiles.slice(offset, offset + limit);
      const enhancedUsers = await Promise.all(
        profilesToEnhance.map(profile => this.enhanceUserProfile(profile))
      );
      
      // Apply premium status filter after enhancement
      let finalUsers = enhancedUsers;
      if (premiumStatus !== 'all') {
        finalUsers = enhancedUsers.filter(user => {
          switch (premiumStatus) {
            case 'premium':
              return user.isPremium && !user.isGifted;
            case 'gifted':
              return user.isGifted;
            case 'free':
              return !user.isPremium;
            default:
              return true;
          }
        });
      }
      
      // Apply sorting
      finalUsers.sort((a, b) => {
        let aVal: any, bVal: any;
        switch (sortBy) {
          case 'email':
            aVal = a.email || '';
            bVal = b.email || '';
            break;
          case 'last_activity':
            aVal = a.lastActivity || '';
            bVal = b.lastActivity || '';
            break;
          case 'revenue':
            aVal = a.totalRevenue;
            bVal = b.totalRevenue;
            break;
          case 'created_at':
          default:
            aVal = a.created_at || '';
            bVal = b.created_at || '';
            break;
        }

        if (sortOrder === 'asc') {
          return aVal < bVal ? -1 : 1;
        } else {
          return aVal > bVal ? -1 : 1;
        }
      });
      
      const totalCount = filteredProfiles.length;
      const hasMore = (offset + limit) < totalCount;
      
      console.log(`✅ Retrieved ${finalUsers.length} users (${totalCount} total, hasMore: ${hasMore})`);
      
      return {
        users: finalUsers,
        totalCount,
        hasMore
      };
      
    } catch (error: any) {
      console.error('❌ Error fetching users:', error);
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  }

  /**
   * Enhance user profile with additional data (with error handling)
   */
  private async enhanceUserProfile(profile: Profile): Promise<RealUserDetails> {
    try {
      // Get subscription data
      const { data: subscription } = await supabase
        .from('subscribers')
        .select('*')
        .eq('user_id', profile.user_id)
        .single();

      // Get campaign statistics (with error handling)
      let campaignCount = 0;
      let lastActivity = null;
      try {
        const { data: campaigns } = await supabase
          .from('campaigns')
          .select('created_at, credits_used')
          .eq('user_id', profile.user_id)
          .order('created_at', { ascending: false });
        
        campaignCount = campaigns?.length || 0;
        lastActivity = campaigns?.[0]?.created_at || null;
      } catch (error) {
        console.warn(`⚠️ Could not fetch campaigns for ${profile.user_id}:`, error);
      }

      // Get credit statistics (with error handling)
      let totalCreditsUsed = 0;
      let currentCredits = 0;
      try {
        const { data: credits } = await supabase
          .from('credits')
          .select('balance, total_used')
          .eq('user_id', profile.user_id)
          .single();

        // Calculate balance manually since auto-calculation might not be working
        const calculatedBalance = (credits?.amount || 0) + (credits?.bonus || 0) - (credits?.total_used || 0);
        currentCredits = calculatedBalance;
        totalCreditsUsed = credits?.total_used ?? 0;
      } catch (error) {
        console.warn(`⚠️ Could not fetch credits for ${profile.user_id}:`, error);
      }

      // Get revenue from orders (with error handling)
      let totalRevenue = 0;
      try {
        const { data: orders } = await supabase
          .from('orders')
          .select('amount')
          .eq('user_id', profile.user_id)
          .eq('status', 'completed');
        
        totalRevenue = orders?.reduce((sum, order) => sum + order.amount, 0) || 0;
      } catch (error) {
        console.warn(`⚠️ Could not fetch orders for ${profile.user_id}:`, error);
      }
      
      // Determine premium status
      const isPremium = subscription?.subscribed === true;
      const isGifted = isPremium && !subscription?.stripe_subscription_id;

      return {
        ...profile,
        subscription,
        campaignCount,
        totalCreditsUsed,
        currentCredits,
        totalRevenue,
        lastActivity,
        isPremium,
        isGifted
      };
      
    } catch (error) {
      console.warn(`⚠️ Error enhancing profile for ${profile.user_id}:`, error);
      
      // Return basic profile with default values on error
      return {
        ...profile,
        subscription: null,
        campaignCount: 0,
        totalCreditsUsed: 0,
        currentCredits: 0,
        totalRevenue: 0,
        lastActivity: null,
        isPremium: false,
        isGifted: false
      };
    }
  }

  /**
   * Get individual user by ID with enhanced error handling
   */
  async getUserById(userId: string): Promise<RealUserDetails | null> {
    try {
      console.log('🔍 Fetching user by ID:', userId);
      
      // Check admin access first
      const isAdmin = await this.checkAdminAccess();
      if (!isAdmin) {
        throw new Error('Admin access required');
      }
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('📭 User not found:', userId);
          return null;
        }
        throw new Error(`Failed to fetch user: ${error.message}`);
      }

      if (!profile) {
        return null;
      }

      // Enhance profile with additional data
      const enhancedUser = await this.enhanceUserProfile(profile);
      
      console.log('✅ User fetched and enhanced successfully');
      return enhancedUser;
      
    } catch (error: any) {
      console.error('❌ Error fetching user by ID:', error);
      throw new Error(`Failed to fetch user: ${error.message}`);
    }
  }

  /**
   * Update user profile with enhanced error handling
   */
  async updateUser(userId: string, updates: UserUpdatePayload): Promise<RealUserDetails> {
    try {
      console.log('✏️ Updating user:', userId, updates);
      
      // Check admin access first
      const isAdmin = await this.checkAdminAccess();
      if (!isAdmin) {
        throw new Error('Admin access required to update users');
      }
      
      // Handle premium/subscription updates first
      if (updates.isPremium !== undefined || updates.isGifted !== undefined) {
        await this.updateUserPremiumStatus(userId, updates);
      }
      
      // Prepare profile updates
      const profileUpdates: any = {
        updated_at: new Date().toISOString()
      };
      
      if (updates.display_name !== undefined) profileUpdates.display_name = updates.display_name;
      if (updates.email !== undefined) profileUpdates.email = updates.email;
      if (updates.role !== undefined) profileUpdates.role = updates.role;
      
      // Update profile if there are changes
      if (Object.keys(profileUpdates).length > 1) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update(profileUpdates)
          .eq('user_id', userId);

        if (profileError) {
          throw new Error(`Profile update failed: ${profileError.message}`);
        }
        
        console.log('✅ Profile updated successfully');
      }
      
      // Return updated user
      const updatedUser = await this.getUserById(userId);
      if (!updatedUser) {
        throw new Error('User not found after update');
      }
      
      return updatedUser;
      
    } catch (error: any) {
      console.error('❌ Error updating user:', error);
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  /**
   * Update user premium/subscription status with enhanced error handling
   */
  private async updateUserPremiumStatus(userId: string, updates: UserUpdatePayload): Promise<void> {
    try {
      console.log('💎 Updating premium status for:', userId);
      
      // Get current subscription
      const { data: existingSubscription, error: fetchError } = await supabase
        .from('subscribers')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.warn('⚠️ Error fetching subscription:', fetchError);
      }

      if (updates.isPremium) {
        // Grant premium access
        const subscriptionData = {
          user_id: userId,
          email: updates.email || '',
          subscribed: true,
          subscription_tier: updates.isGifted ? 'premium_gifted' : 'premium',
          subscription_end: updates.subscriptionEnd || null,
          stripe_subscription_id: updates.isGifted ? null : existingSubscription?.stripe_subscription_id || null,
          payment_method: updates.isGifted ? 'gifted' : existingSubscription?.payment_method || 'stripe',
          guest_checkout: false,
          updated_at: new Date().toISOString()
        };

        if (existingSubscription) {
          // Update existing subscription
          const { error: updateError } = await supabase
            .from('subscribers')
            .update(subscriptionData)
            .eq('user_id', userId);
          
          if (updateError) {
            throw new Error(`Subscription update failed: ${updateError.message}`);
          }
        } else {
          // Create new subscription
          const { error: insertError } = await supabase
            .from('subscribers')
            .insert({
              ...subscriptionData,
              created_at: new Date().toISOString()
            });
          
          if (insertError) {
            throw new Error(`Subscription creation failed: ${insertError.message}`);
          }
        }
        
        console.log('✅ Premium status granted');
        
      } else {
        // Remove premium access
        if (existingSubscription) {
          if (existingSubscription.stripe_subscription_id) {
            console.warn('⚠️ User has paid subscription - consider manual cancellation');
          }
          
          const { error: removeError } = await supabase
            .from('subscribers')
            .update({
              subscribed: false,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', userId);
          
          if (removeError) {
            throw new Error(`Premium removal failed: ${removeError.message}`);
          }
          
          console.log('✅ Premium status removed');
        }
      }
      
    } catch (error: any) {
      console.error('❌ Error updating premium status:', error);
      throw error;
    }
  }

  /**
   * Soft delete user (deactivate) with enhanced error handling
   */
  async deleteUser(userId: string): Promise<void> {
    try {
      console.log('🗑️ Deactivating user:', userId);
      
      // Check admin access first
      const isAdmin = await this.checkAdminAccess();
      if (!isAdmin) {
        throw new Error('Admin access required to deactivate users');
      }
      
      // Deactivate profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          role: 'user',
          display_name: `[DEACTIVATED] ${Date.now()}`,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (profileError) {
        throw new Error(`Profile deactivation failed: ${profileError.message}`);
      }

      // Cancel subscription
      const { error: subscriptionError } = await supabase
        .from('subscribers')
        .update({
          subscribed: false,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (subscriptionError) {
        console.warn('⚠️ Failed to cancel subscription:', subscriptionError);
        // Don't throw as profile deactivation succeeded
      }

      console.log('✅ User deactivated successfully');
      
    } catch (error: any) {
      console.error('❌ Error deactivating user:', error);
      throw new Error(`Failed to deactivate user: ${error.message}`);
    }
  }

  /**
   * Gift credits to a user (admin only) with custom reason
   */
  async giftCredits(userId: string, amount: number, reason: string): Promise<void> {
    try {
      console.log('🎁 Gifting credits to user:', userId, 'amount:', amount, 'reason:', reason);

      // Check admin access first
      const isAdmin = await this.checkAdminAccess();
      if (!isAdmin) {
        throw new Error('Admin access required to gift credits');
      }

      // Validate input
      if (!amount || amount <= 0) {
        throw new Error('Credit amount must be greater than 0');
      }

      if (!reason || reason.trim() === '') {
        throw new Error('Reason for gifting credits is required');
      }

      // Get user details for the description
      const user = await this.getUserById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Insert credit transaction for audit trail (custom reason)
      let { error: transactionError } = await supabase
        .from('credit_transactions')
        .insert({
          user_id: userId,
          type: 'gift',
          amount: amount,
          description: `Admin gift to ${user.email}: ${reason.trim()}`,
          created_at: new Date().toISOString()
        });

      // Fallback: if RLS prevents inserting for another user, record under admin with recipient in description
      if (transactionError) {
        try {
          const current = await SafeAuth.getCurrentUser();
          const adminId = current?.user?.id;
          if (adminId) {
            const fallback = await supabase
              .from('credit_transactions')
              .insert({
                user_id: adminId,
                type: 'gift',
                amount: amount,
                description: `Admin gift to ${user.email} (recipient_id: ${userId})`,
                created_at: new Date().toISOString()
              });
            if (fallback.error) {
              console.warn('⚠️ Fallback transaction insert failed:', fallback.error.message || String(fallback.error));
            } else {
              transactionError = undefined;
            }
          }
        } catch (e) {
          console.warn('⚠️ Unable to record fallback transaction:', (e as any)?.message || String(e));
        }
      }

      // Upsert into credits table to reflect new bonus credits
      const { data: existingCredits } = await supabase
        .from('credits')
        .select('id, amount, bonus, total_purchased, total_used, balance')
        .eq('user_id', userId)
        .single();

      let newBalance = amount;
      if (existingCredits) {
        // Add to bonus column for gifted credits
        const updatedBonus = (existingCredits.bonus || 0) + amount;
        // Calculate new balance: current balance + gifted amount
        const currentBalance = (existingCredits.amount || 0) + (existingCredits.bonus || 0) - (existingCredits.total_used || 0);
        const updatedBalance = currentBalance + amount;

        const { error: updateError } = await supabase
          .from('credits')
          .update({
            bonus: updatedBonus,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);
        if (updateError) throw new Error(`Credits update failed: ${updateError.message}`);

        newBalance = updatedBalance;
        console.log(`📊 Updated user ${userId}: bonus ${existingCredits.bonus || 0} + ${amount} = ${updatedBonus}, calculated balance = ${updatedBalance}`);
      } else {
        // Create new credits record with bonus credits
        const { error: insertError } = await supabase
          .from('credits')
          .insert({
            user_id: userId,
            amount: 0, // No purchased credits
            bonus: amount, // Gifted credits go to bonus
            total_purchased: 0, // No money spent
            total_used: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        if (insertError) throw new Error(`Credits insert failed: ${insertError.message}`);
        newBalance = amount;
        console.log(`📊 Created new credits record for user ${userId}: bonus=${amount}, calculated balance=${amount}`);
      }

      console.log('✅ Credits gifted successfully - balance updated');

    } catch (error: any) {
      console.error('❌ Error gifting credits:', error);
      throw new Error(`Failed to gift credits: ${error.message}`);
    }
  }

  /**
   * Gift credits with fixed description 'Gift' (admin only)
   */
  async giftCreditsAsGift(userId: string, amount: number): Promise<void> {
    try {
      console.log('🎁 Quick gift credits (description=Gift):', { userId, amount });

      // Admin check
      const isAdmin = await this.checkAdminAccess();
      if (!isAdmin) throw new Error('Admin access required to gift credits');

      if (!amount || amount <= 0) throw new Error('Credit amount must be greater than 0');

      const user = await this.getUserById(userId);
      if (!user) throw new Error('User not found');

      // Insert credit transaction with type 'gift' and include email in description
      let { error: txError } = await supabase
        .from('credit_transactions')
        .insert({
          user_id: userId,
          type: 'gift',
          amount,
          description: `Gift to ${user.email}`,
          created_at: new Date().toISOString()
        });
      if (txError) {
        console.warn('⚠️ Credit transaction (Gift) insert failed, attempting fallback:', txError.message || String(txError));
        try {
          const current = await SafeAuth.getCurrentUser();
          const adminId = current?.user?.id;
          if (adminId) {
            const fallback = await supabase
              .from('credit_transactions')
              .insert({
                user_id: adminId,
                type: 'gift',
                amount,
                description: `Gift to ${user.email} (recipient_id: ${userId})`,
                created_at: new Date().toISOString()
              });
            if (fallback.error) {
              console.warn('⚠️ Fallback transaction (Gift) insert failed:', fallback.error.message || String(fallback.error));
            } else {
              txError = undefined;
            }
          }
        } catch (e) {
          console.warn('⚠️ Unable to record fallback transaction:', (e as any)?.message || String(e));
        }
      }

      // Update credits balance using bonus column
      const { data: existing } = await supabase
        .from('credits')
        .select('id, amount, bonus, total_purchased, total_used, balance')
        .eq('user_id', userId)
        .single();

      let newBalance = amount;
      if (existing) {
        // Add to bonus column for gifted credits
        const newBonus = (existing.bonus || 0) + amount;
        // Calculate new balance: current balance + gifted amount
        const currentBalance = (existing.amount || 0) + (existing.bonus || 0) - (existing.total_used || 0);
        const updatedBalance = currentBalance + amount;

        const { error: updErr } = await supabase
          .from('credits')
          .update({
            bonus: newBonus,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);
        if (updErr) throw new Error(`Credits update failed: ${updErr.message}`);

        newBalance = updatedBalance;
        console.log(`📊 Quick gift - Updated user ${userId}: bonus ${existing.bonus || 0} + ${amount} = ${newBonus}, calculated balance = ${updatedBalance}`);
      } else {
        // Create new credits record with bonus credits
        const { error: insErr } = await supabase
          .from('credits')
          .insert({
            user_id: userId,
            amount: 0, // No purchased credits
            bonus: amount, // Gifted credits go to bonus
            total_purchased: 0, // No money spent
            total_used: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        if (insErr) throw new Error(`Credits insert failed: ${insErr.message}`);
        newBalance = amount;
        console.log(`📊 Quick gift - Created new credits record for user ${userId}: bonus=${amount}, calculated balance=${amount}`);
      }

      console.log('✅ Quick gift credits completed');
    } catch (error: any) {
      console.error('❌ Error in giftCreditsAsGift:', error);
      throw new Error(`Failed to gift credits: ${error.message}`);
    }
  }

  /**
   * Get user statistics for dashboard
   */
  async getUserStats(): Promise<{
    totalUsers: number;
    premiumUsers: number;
    giftedUsers: number;
    totalRevenue: number;
    recentSignups: number;
  }> {
    try {
      console.log('📊 Fetching user statistics...');

      // Check admin access first
      const isAdmin = await this.checkAdminAccess();
      if (!isAdmin) {
        throw new Error('Admin access required to view statistics');
      }

      const allUsers = await this.getUsers({ limit: 1000 }); // Get a large batch for stats
      const users = allUsers.users;

      const stats = {
        totalUsers: users.length,
        premiumUsers: users.filter(u => u.isPremium && !u.isGifted).length,
        giftedUsers: users.filter(u => u.isGifted).length,
        totalRevenue: users.reduce((sum, u) => sum + u.totalRevenue, 0),
        recentSignups: users.filter(u => {
          const signupDate = new Date(u.created_at);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return signupDate > weekAgo;
        }).length
      };

      console.log('✅ User statistics calculated:', stats);
      return stats;

    } catch (error: any) {
      console.error('❌ Error fetching user stats:', error);
      throw new Error(`Failed to fetch user statistics: ${error.message}`);
    }
  }
  /**
   * Sync balances from credits/user_credits into profiles.credits
   */
  async syncCreditsToProfiles(): Promise<{ updated: number; failed: number; total: number }> {
    const isAdmin = await this.checkAdminAccess();
    if (!isAdmin) {
      throw new Error('Admin access required to sync credits');
    }

    const { data: profilesList, error: profErr } = await supabase
      .from('profiles')
      .select('user_id');
    if (profErr) throw new Error(`Failed to fetch profiles: ${profErr.message}`);

    const balanceMap = new Map<string, number>();
    try {
      const { data: cr } = await supabase.from('credits').select('user_id, balance');
      cr?.forEach((r: any) => balanceMap.set(r.user_id, r.balance || 0));
    } catch (e) {
      console.warn('credits fetch failed during sync:', e);
    }
    try {
      const { data: uc } = await supabase.from('user_credits').select('user_id, credits');
      uc?.forEach((r: any) => {
        if (!balanceMap.has(r.user_id)) balanceMap.set(r.user_id, r.credits || 0);
      });
    } catch (e) {
      console.warn('user_credits fetch failed during sync:', e);
    }

    let updated = 0;
    let failed = 0;
    const total = profilesList?.length || 0;

    const concurrency = 8;
    const queue = [...(profilesList || [])];
    const workers: Promise<void>[] = [];

    const runWorker = async () => {
      while (queue.length) {
        const item = queue.shift();
        if (!item) break;
        const userId = (item as any).user_id as string;
        const val = balanceMap.get(userId) ?? 0;
        try {
          const { error } = await supabase
            .from('profiles')
            .update({ credits: val, updated_at: new Date().toISOString() })
            .eq('user_id', userId);
          if (error) {
            failed += 1;
            console.warn(`Failed to update profile ${userId}:`, error.message || String(error));
          } else {
            updated += 1;
          }
        } catch (e: any) {
          failed += 1;
          console.warn(`Error updating profile ${userId}:`, e?.message || String(e));
        }
      }
    };

    for (let i = 0; i < concurrency; i++) workers.push(runWorker());
    await Promise.all(workers);

    return { updated, failed, total };
  }
}

export const realAdminUserService = new RealAdminUserService();
