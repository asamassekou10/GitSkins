/**
 * Subscription Configuration
 *
 * Defines plans, limits, and pricing for GitSkins monetization.
 */

import type { Plan, CreditPack } from '@/types/subscription';

/**
 * All available themes organized by category
 */
export const ALL_THEMES = {
  original: ['satan', 'neon', 'zen', 'github-dark', 'dracula'],
  seasonal: ['winter', 'spring', 'summer', 'autumn'],
  holiday: ['christmas', 'halloween'],
  developer: ['ocean', 'forest', 'sunset', 'midnight', 'aurora'],
  aesthetic: ['retro', 'minimal', 'pastel', 'matrix'],
} as const;

/**
 * Free tier themes (all themes - hackathon edition)
 */
export const FREE_THEMES = [
  ...ALL_THEMES.original,
  ...ALL_THEMES.seasonal,
  ...ALL_THEMES.holiday,
  ...ALL_THEMES.developer,
  ...ALL_THEMES.aesthetic,
] as const;

/**
 * Pro tier themes (all 20 themes)
 */
export const PRO_THEMES = [
  ...ALL_THEMES.original,
  ...ALL_THEMES.seasonal,
  ...ALL_THEMES.holiday,
  ...ALL_THEMES.developer,
  ...ALL_THEMES.aesthetic,
] as const;

/**
 * Plan definitions
 * NOTE: All features are free for hackathon testing
 */
export const PLANS: Record<'free' | 'pro', Plan> = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    priceLabel: 'Free forever',
    description: 'Full access - Hackathon Edition',
    features: [
      'All widgets (card, stats, languages, streak)',
      'All 20 premium themes',
      'Unlimited README generations',
      'No watermark on widgets',
      'Priority widget rendering',
      'All AI features included',
    ],
    limits: {
      readmeGenerations: 9999,
      themes: [...PRO_THEMES],
      hasWatermark: false,
      hasPriorityRendering: true,
      hasCustomColors: true,
    },
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 0,
    priceLabel: 'Free (Hackathon)',
    description: 'Full access - Hackathon Edition',
    features: [
      'All widgets (card, stats, languages, streak)',
      'All 20 premium themes',
      'Unlimited README generations',
      'No watermark on widgets',
      'Priority widget rendering',
      'All AI features included',
    ],
    limits: {
      readmeGenerations: 9999,
      themes: [...PRO_THEMES],
      hasWatermark: false,
      hasPriorityRendering: true,
      hasCustomColors: true,
    },
  },
};

/**
 * Credit packs for additional README generations
 */
export const CREDIT_PACKS: CreditPack[] = [
  {
    id: 'credits-50',
    name: '50 Credits',
    credits: 50,
    price: 5,
    priceLabel: '$5',
  },
  {
    id: 'credits-150',
    name: '150 Credits',
    credits: 150,
    price: 12,
    priceLabel: '$12',
  },
];

/**
 * Stripe configuration (disabled for hackathon - all features are free)
 */
export const STRIPE_CONFIG = {
  priceIds: {
    proLifetime: '',
    credits50: '',
    credits150: '',
  },
  successUrl: '/',
  cancelUrl: '/',
};

/**
 * Get the reset date for monthly limits (1st of next month)
 */
export function getNextResetDate(): string {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return nextMonth.toISOString();
}

/**
 * Check if a reset is needed based on the stored reset date
 */
export function shouldResetUsage(resetDateStr: string): boolean {
  const resetDate = new Date(resetDateStr);
  const now = new Date();
  return now >= resetDate;
}

/**
 * Check if a theme is available for a plan
 */
export function isThemeAvailable(theme: string, plan: 'free' | 'pro'): boolean {
  return PLANS[plan].limits.themes.includes(theme);
}

/**
 * Check if a theme is free
 */
export function isFreeTierTheme(theme: string): boolean {
  return FREE_THEMES.includes(theme as typeof FREE_THEMES[number]);
}

/**
 * Get theme restriction message
 */
export function getThemeRestrictionMessage(theme: string): string | null {
  if (isFreeTierTheme(theme)) {
    return null;
  }
  return `${theme} theme is only available with Pro plan`;
}
