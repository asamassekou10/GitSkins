/**
 * Usage Tracker Library
 *
 * Tracks README generation usage for free/pro users.
 * Uses localStorage for anonymous users, can be extended for authenticated users.
 */

import type { UsageData, GenerationCheckResult, PlanType } from '@/types/subscription';
import { PLANS, getNextResetDate, shouldResetUsage } from '@/config/subscription';

const STORAGE_KEY = 'gitskins_usage';
const SUBSCRIPTION_KEY = 'gitskins_subscription';

/**
 * Generate a unique visitor ID
 */
function generateVisitorId(): string {
  return 'visitor_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

/**
 * Get or create visitor ID
 */
export function getVisitorId(): string {
  if (typeof window === 'undefined') return '';

  let visitorId = localStorage.getItem('gitskins_visitor_id');
  if (!visitorId) {
    visitorId = generateVisitorId();
    localStorage.setItem('gitskins_visitor_id', visitorId);
  }
  return visitorId;
}

/**
 * Get the user's current plan
 */
export function getUserPlan(): PlanType {
  if (typeof window === 'undefined') return 'free';

  const subscription = localStorage.getItem(SUBSCRIPTION_KEY);
  if (subscription) {
    try {
      const data = JSON.parse(subscription);
      if (data.plan === 'pro') {
        return 'pro';
      }
    } catch {
      // Invalid data, default to free
    }
  }
  return 'free';
}

/**
 * Set the user's plan (called after successful payment)
 */
export function setUserPlan(plan: PlanType, paymentId?: string): void {
  if (typeof window === 'undefined') return;

  const subscription = {
    visitorId: getVisitorId(),
    plan,
    purchasedAt: new Date().toISOString(),
    stripePaymentId: paymentId,
  };

  localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(subscription));
}

/**
 * Get current usage data
 */
export function getUsageData(): UsageData {
  if (typeof window === 'undefined') {
    return {
      visitorId: '',
      readmeGenerationsUsed: 0,
      readmeGenerationsReset: getNextResetDate(),
    };
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const data: UsageData = JSON.parse(stored);

      // Check if we need to reset (new month)
      if (shouldResetUsage(data.readmeGenerationsReset)) {
        const resetData: UsageData = {
          visitorId: data.visitorId || getVisitorId(),
          readmeGenerationsUsed: 0,
          readmeGenerationsReset: getNextResetDate(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(resetData));
        return resetData;
      }

      return data;
    } catch {
      // Invalid data, create fresh
    }
  }

  // Create new usage data
  const newData: UsageData = {
    visitorId: getVisitorId(),
    readmeGenerationsUsed: 0,
    readmeGenerationsReset: getNextResetDate(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  return newData;
}

/**
 * Check if user can generate a README
 */
export function checkGenerationAllowed(): GenerationCheckResult {
  const plan = getUserPlan();
  const usage = getUsageData();
  const limit = PLANS[plan].limits.readmeGenerations;
  const remaining = Math.max(0, limit - usage.readmeGenerationsUsed);

  return {
    allowed: remaining > 0,
    remaining,
    limit,
    resetDate: usage.readmeGenerationsReset,
    isPro: plan === 'pro',
  };
}

/**
 * Increment generation usage (call after successful generation)
 */
export function incrementGenerationUsage(): void {
  if (typeof window === 'undefined') return;

  const usage = getUsageData();
  usage.readmeGenerationsUsed += 1;
  usage.lastGenerationAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(usage));
}

/**
 * Add bonus credits (for credit pack purchases)
 */
export function addBonusCredits(credits: number): void {
  if (typeof window === 'undefined') return;

  const usage = getUsageData();
  // Reduce the used count (effectively adding credits)
  usage.readmeGenerationsUsed = Math.max(0, usage.readmeGenerationsUsed - credits);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(usage));
}

/**
 * Check if user has Pro status
 */
export function isPro(): boolean {
  return getUserPlan() === 'pro';
}

/**
 * Format reset date for display
 */
export function formatResetDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Get days until reset
 */
export function getDaysUntilReset(isoDate: string): number {
  const reset = new Date(isoDate);
  const now = new Date();
  const diff = reset.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}
