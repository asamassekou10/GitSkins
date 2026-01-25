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
 * Free tier themes (5 themes)
 */
export const FREE_THEMES = ['github-dark', 'minimal', 'ocean', 'forest', 'midnight'] as const;

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
 */
export const PLANS: Record<'free' | 'pro', Plan> = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    priceLabel: 'Free forever',
    description: 'Perfect for getting started',
    features: [
      'All basic widgets (card, stats, languages, streak)',
      '5 themes (GitHub Dark, Minimal, Ocean, Forest, Midnight)',
      '3 README generations per month',
      'GitSkins watermark on widgets',
    ],
    limits: {
      readmeGenerations: 3,
      themes: [...FREE_THEMES],
      hasWatermark: true,
      hasPriorityRendering: false,
      hasCustomColors: false,
    },
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 29,
    priceLabel: '$29 one-time',
    description: 'Lifetime access to everything',
    features: [
      'All basic widgets (card, stats, languages, streak)',
      'All 20 premium themes',
      '10 README generations per month',
      'No watermark on widgets',
      'Priority widget rendering',
      'Custom theme colors (coming soon)',
      'Early access to new features',
    ],
    limits: {
      readmeGenerations: 10,
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
 * Stripe configuration
 */
export const STRIPE_CONFIG = {
  // These would be your actual Stripe price IDs
  priceIds: {
    proLifetime: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || 'price_pro_lifetime',
    credits50: process.env.NEXT_PUBLIC_STRIPE_CREDITS_50_PRICE_ID || 'price_credits_50',
    credits150: process.env.NEXT_PUBLIC_STRIPE_CREDITS_150_PRICE_ID || 'price_credits_150',
  },
  successUrl: '/pricing?success=true',
  cancelUrl: '/pricing?canceled=true',
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
