/**
 * Subscription & Monetization Types
 */

export type PlanType = 'free' | 'pro';

export interface Plan {
  id: PlanType;
  name: string;
  price: number;
  priceLabel: string;
  description: string;
  features: string[];
  limits: {
    readmeGenerations: number;
    themes: string[];
    hasWatermark: boolean;
    hasPriorityRendering: boolean;
    hasCustomColors: boolean;
  };
}

export interface UserSubscription {
  odp: string; // Unique user ID (stored in localStorage or from Stripe)
  plan: PlanType;
  purchasedAt?: string;
  stripeCustomerId?: string;
  stripePaymentId?: string;
}

export interface UsageData {
visitorId: string;
  readmeGenerationsUsed: number;
  readmeGenerationsReset: string; // ISO date of next reset
  lastGenerationAt?: string;
}

export interface GenerationCheckResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetDate: string;
  isPro: boolean;
}

// Credit pack for additional README generations
export interface CreditPack {
  id: string;
  name: string;
  credits: number;
  price: number;
  priceLabel: string;
}
