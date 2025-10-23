/**
 * Centralized Credits Balance Calculation Utility
 * 
 * This ensures that balance is calculated consistently across the entire application
 * like an Excel formula: balance = amount + bonus - total_used
 */

export interface CreditsData {
  amount?: number | null;
  bonus?: number | null;
  total_used?: number | null;
  total_purchased?: number | null;
}

/**
 * Calculate total available balance (like Excel formula)
 * Formula: amount + bonus - total_used
 * 
 * @param credits The credits data from database
 * @returns The calculated balance
 */
export function calculateBalance(credits: CreditsData | null | undefined): number {
  if (!credits) return 0;
  
  const amount = Number(credits.amount || 0);
  const bonus = Number(credits.bonus || 0);
  const totalUsed = Number(credits.total_used || 0);
  
  return amount + bonus - totalUsed;
}

/**
 * Calculate only purchased credits balance (excludes bonuses)
 * Formula: amount - total_used
 * 
 * @param credits The credits data from database
 * @returns The purchased credits balance
 */
export function calculatePurchasedBalance(credits: CreditsData | null | undefined): number {
  if (!credits) return 0;
  
  const amount = Number(credits.amount || 0);
  const totalUsed = Number(credits.total_used || 0);
  
  return Math.max(0, amount - totalUsed);
}

/**
 * Calculate only bonus credits balance
 * 
 * @param credits The credits data from database
 * @returns The bonus credits amount
 */
export function calculateBonusBalance(credits: CreditsData | null | undefined): number {
  if (!credits) return 0;
  
  return Number(credits.bonus || 0);
}

/**
 * Get detailed balance breakdown
 * 
 * @param credits The credits data from database
 * @returns Object with detailed breakdown
 */
export function getBalanceBreakdown(credits: CreditsData | null | undefined) {
  if (!credits) {
    return {
      total: 0,
      purchased: 0,
      bonus: 0,
      used: 0,
      available: 0
    };
  }
  
  const amount = Number(credits.amount || 0);
  const bonus = Number(credits.bonus || 0);
  const totalUsed = Number(credits.total_used || 0);
  const total = amount + bonus;
  const available = total - totalUsed;
  
  return {
    total: total,
    purchased: amount,
    bonus: bonus,
    used: totalUsed,
    available: Math.max(0, available)
  };
}

/**
 * Standard database query fields for credits
 * Use this to ensure all queries fetch the required fields
 */
export const CREDITS_QUERY_FIELDS = 'amount, bonus, total_used, total_purchased, created_at, updated_at';

/**
 * Validate that credits data has required fields for calculation
 * 
 * @param credits The credits data to validate
 * @returns True if valid, false otherwise
 */
export function validateCreditsData(credits: any): credits is CreditsData {
  return credits !== null && 
         credits !== undefined && 
         typeof credits === 'object';
}

/**
 * Format balance for display with proper number formatting
 * 
 * @param balance The balance number
 * @returns Formatted string
 */
export function formatBalance(balance: number): string {
  return balance.toLocaleString();
}

/**
 * Calculate the cost of credits in USD
 * 
 * @param credits Number of credits
 * @param pricePerCredit Price per credit in USD (default: 1.40)
 * @returns Cost in USD
 */
export function calculateCreditsCost(credits: number, pricePerCredit: number = 1.40): number {
  return credits * pricePerCredit;
}

/**
 * Simulate what the balance would be after a transaction
 * 
 * @param currentCredits Current credits data
 * @param transaction Transaction details
 * @returns Projected balance after transaction
 */
export function simulateBalanceAfterTransaction(
  currentCredits: CreditsData | null | undefined,
  transaction: {
    type: 'purchase' | 'bonus' | 'usage';
    amount: number;
  }
): number {
  const current = currentCredits || { amount: 0, bonus: 0, total_used: 0 };
  
  let newAmount = Number(current.amount || 0);
  let newBonus = Number(current.bonus || 0);
  let newUsed = Number(current.total_used || 0);
  
  switch (transaction.type) {
    case 'purchase':
      newAmount += transaction.amount;
      break;
    case 'bonus':
      newBonus += transaction.amount;
      break;
    case 'usage':
      newUsed += transaction.amount;
      break;
  }
  
  return newAmount + newBonus - newUsed;
}

// Export commonly used calculation as default
export default calculateBalance;
