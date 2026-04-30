import type { Plan, CreditPack } from '@/types/subscription';

export const ALL_THEMES = {
  original: ['satan', 'neon', 'zen', 'github-dark', 'dracula'],
  seasonal: ['winter', 'spring', 'summer', 'autumn'],
  holiday: ['christmas', 'halloween'],
  developer: ['ocean', 'forest', 'sunset', 'midnight', 'aurora'],
  aesthetic: ['retro', 'minimal', 'pastel', 'matrix'],
} as const;

/** Themes available on the free tier. */
export const FREE_THEMES = [...ALL_THEMES.original] as const;

/** All 20 themes — available on Pro. */
export const PRO_THEMES = [
  ...ALL_THEMES.original,
  ...ALL_THEMES.seasonal,
  ...ALL_THEMES.holiday,
  ...ALL_THEMES.developer,
  ...ALL_THEMES.aesthetic,
] as const;

/** Monthly README generation limits per plan. */
export const FREE_TIER_README_LIMIT = 5;
export const PRO_TIER_README_LIMIT = 9999;

export const PLANS: Record<'free' | 'pro', Plan> = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    priceLabel: 'Free forever',
    description: 'Get started with GitSkins',
    features: [
      '5 README generations per month',
      '5 themes (Satan, Neon, Zen, GitHub Dark, Dracula)',
      'All profile widgets',
      'GitHub Wrapped',
      'Repo Visualizer',
    ],
    limits: {
      readmeGenerations: FREE_TIER_README_LIMIT,
      themes: [...FREE_THEMES],
      hasWatermark: true,
      hasPriorityRendering: false,
      hasCustomColors: false,
    },
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 9,
    priceLabel: '$9 / month',
    description: 'Unlimited everything',
    features: [
      'Unlimited README generations',
      'All 20 premium themes',
      'No watermark on widgets',
      'Priority widget rendering',
      'Custom colors',
      'All AI features',
    ],
    limits: {
      readmeGenerations: PRO_TIER_README_LIMIT,
      themes: [...PRO_THEMES],
      hasWatermark: false,
      hasPriorityRendering: true,
      hasCustomColors: true,
    },
  },
};

export const CREDIT_PACKS: CreditPack[] = [
  { id: 'credits-50', name: '50 Credits', credits: 50, price: 5, priceLabel: '$5' },
  { id: 'credits-150', name: '150 Credits', credits: 150, price: 12, priceLabel: '$12' },
];

export const STRIPE_CONFIG = {
  priceIds: {
    proMonthly: process.env.STRIPE_PRICE_PRO_MONTHLY ?? '',
    proLifetime: process.env.STRIPE_PRICE_PRO_LIFETIME ?? '',
    credits50: process.env.STRIPE_PRICE_CREDITS_50 ?? '',
    credits150: process.env.STRIPE_PRICE_CREDITS_150 ?? '',
  },
  successUrl: '/dashboard?upgrade=success',
  cancelUrl: '/pricing',
};

export function getNextResetDate(): string {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return nextMonth.toISOString();
}

export function shouldResetUsage(resetDateStr: string): boolean {
  return new Date() >= new Date(resetDateStr);
}

export function isThemeAvailable(theme: string, plan: 'free' | 'pro'): boolean {
  return (PLANS[plan].limits.themes as readonly string[]).includes(theme);
}

export function isFreeTierTheme(theme: string): boolean {
  return (FREE_THEMES as readonly string[]).includes(theme);
}

export function getThemeRestrictionMessage(theme: string): string | null {
  if (isFreeTierTheme(theme)) return null;
  return `${theme} theme requires a Pro plan`;
}
