/**
 * Server-side usage and subscription helpers.
 *
 * These functions run only in server contexts (API routes, server components).
 * When DATABASE_URL is not set they fall back to permissive in-memory limits so
 * the app still works in local development without a database.
 */

import { db } from '@/lib/db';
import { FREE_TIER_README_LIMIT, PRO_TIER_README_LIMIT } from '@/config/subscription';

// ─── Plan management (called by Stripe webhook) ──────────────────────────────

export async function upgradeToPro(params: {
  userId?: string;
  githubId?: string;
  username?: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string | null;
  stripePriceId: string;
  stripeCurrentPeriodEnd: Date | null;
}): Promise<void> {
  let userId = params.userId;

  if (!userId) {
    const where = params.githubId
      ? { githubId: params.githubId }
      : { username: params.username! };
    const user = await db.user.findUnique({ where, select: { id: true } });
    if (!user) return;
    userId = user.id;
  }

  await db.subscription.upsert({
    where: { userId },
    update: {
      plan: 'pro',
      status: 'active',
      stripeCustomerId: params.stripeCustomerId,
      stripeSubscriptionId: params.stripeSubscriptionId,
      stripePriceId: params.stripePriceId,
      stripeCurrentPeriodEnd: params.stripeCurrentPeriodEnd,
    },
    create: {
      userId,
      plan: 'pro',
      status: 'active',
      stripeCustomerId: params.stripeCustomerId,
      stripeSubscriptionId: params.stripeSubscriptionId,
      stripePriceId: params.stripePriceId,
      stripeCurrentPeriodEnd: params.stripeCurrentPeriodEnd,
    },
  });
}

export async function updateSubscriptionFromStripe(params: {
  stripeSubscriptionId: string;
  status: string;
  stripeCurrentPeriodEnd?: Date | null;
}): Promise<void> {
  await db.subscription.updateMany({
    where: { stripeSubscriptionId: params.stripeSubscriptionId },
    data: {
      status: params.status,
      ...(params.stripeCurrentPeriodEnd !== undefined && {
        stripeCurrentPeriodEnd: params.stripeCurrentPeriodEnd,
      }),
    },
  });
}

export async function cancelSubscription(stripeSubscriptionId: string): Promise<void> {
  await db.subscription.updateMany({
    where: { stripeSubscriptionId },
    data: { plan: 'free', status: 'canceled' },
  });
}

export async function getStripeCustomerId(username: string): Promise<string | null> {
  if (!dbAvailable()) return null;
  try {
    const sub = await db.subscription.findFirst({
      where: { user: { username } },
      select: { stripeCustomerId: true },
    });
    return sub?.stripeCustomerId ?? null;
  } catch {
    return null;
  }
}

export async function getStripeCustomerIdByUserId(userId: string): Promise<string | null> {
  if (!dbAvailable()) return null;
  try {
    const sub = await db.subscription.findFirst({
      where: { userId },
      select: { stripeCustomerId: true },
    });
    return sub?.stripeCustomerId ?? null;
  } catch {
    return null;
  }
}

export async function getUserPlanById(userId: string): Promise<'free' | 'pro'> {
  if (!dbAvailable()) return 'free';
  try {
    const sub = await db.subscription.findFirst({
      where: { userId, status: 'active' },
      select: { plan: true },
    });
    return sub?.plan === 'pro' ? 'pro' : 'free';
  } catch {
    return 'free';
  }
}

function currentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function dbAvailable(): boolean {
  return !!process.env.DATABASE_URL;
}

/** Resolve our internal DB user id from a GitHub username. */
async function getUserId(username: string): Promise<string | null> {
  const user = await db.user.findUnique({
    where: { username },
    select: { id: true },
  });
  return user?.id ?? null;
}

/**
 * Get the active plan for a user.
 * Returns 'free' when the DB is unavailable or the user has no subscription.
 */
export async function getUserPlanFromDB(username: string): Promise<'free' | 'pro'> {
  if (!dbAvailable()) return 'free';
  try {
    const sub = await db.subscription.findFirst({
      where: {
        user: { username },
        status: 'active',
      },
      select: { plan: true },
    });
    return sub?.plan === 'pro' ? 'pro' : 'free';
  } catch {
    return 'free';
  }
}

export interface UsageCheckResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  plan: 'free' | 'pro';
}

/**
 * Check whether a user is allowed to generate a README.
 * Falls back to a lenient in-memory limit when DB is unavailable.
 */
export async function checkReadmeAllowed(username: string): Promise<UsageCheckResult> {
  if (!dbAvailable()) {
    // Dev/demo mode: allow everything
    return { allowed: true, remaining: 9999, limit: 9999, plan: 'free' };
  }

  try {
    const plan = await getUserPlanFromDB(username);
    const limit = plan === 'pro' ? PRO_TIER_README_LIMIT : FREE_TIER_README_LIMIT;

    if (plan === 'pro') {
      return { allowed: true, remaining: limit, limit, plan };
    }

    const userId = await getUserId(username);
    if (!userId) {
      // User hasn't been synced to the DB yet; allow but don't count
      return { allowed: true, remaining: FREE_TIER_README_LIMIT, limit: FREE_TIER_README_LIMIT, plan: 'free' };
    }

    const month = currentMonth();
    const usage = await db.usage.findUnique({
      where: { userId_month: { userId, month } },
      select: { readmeGenerationsUsed: true },
    });

    const used = usage?.readmeGenerationsUsed ?? 0;
    const remaining = Math.max(0, limit - used);
    return { allowed: remaining > 0, remaining, limit, plan };
  } catch {
    // On any DB error, fail open so users aren't blocked
    return { allowed: true, remaining: FREE_TIER_README_LIMIT, limit: FREE_TIER_README_LIMIT, plan: 'free' };
  }
}

/**
 * Increment the README generation count for a user in the current month.
 * No-ops gracefully when the DB is unavailable or on any error.
 */
export async function incrementReadmeUsage(username: string): Promise<void> {
  if (!dbAvailable()) return;

  try {
    const userId = await getUserId(username);
    if (!userId) return;

    const month = currentMonth();
    await db.usage.upsert({
      where: { userId_month: { userId, month } },
      update: { readmeGenerationsUsed: { increment: 1 } },
      create: { userId, month, readmeGenerationsUsed: 1 },
    });
  } catch (err) {
    console.error('[server-usage] incrementReadmeUsage failed:', err);
  }
}

/**
 * Full usage snapshot for the dashboard /api/usage route.
 */
export async function getUsageSnapshot(username: string) {
  if (!dbAvailable()) {
    return {
      plan: 'free' as const,
      readmeGenerationsUsed: 0,
      readmeGenerationsLimit: FREE_TIER_README_LIMIT,
      readmeGenerationsRemaining: FREE_TIER_README_LIMIT,
      month: currentMonth(),
      dbAvailable: false,
    };
  }

  try {
    const plan = await getUserPlanFromDB(username);
    const limit = plan === 'pro' ? PRO_TIER_README_LIMIT : FREE_TIER_README_LIMIT;
    const userId = await getUserId(username);
    const month = currentMonth();

    let used = 0;
    if (userId) {
      const usage = await db.usage.findUnique({
        where: { userId_month: { userId, month } },
        select: { readmeGenerationsUsed: true },
      });
      used = usage?.readmeGenerationsUsed ?? 0;
    }

    return {
      plan,
      readmeGenerationsUsed: used,
      readmeGenerationsLimit: limit,
      readmeGenerationsRemaining: Math.max(0, limit - used),
      month,
      dbAvailable: true,
    };
  } catch {
    return {
      plan: 'free' as const,
      readmeGenerationsUsed: 0,
      readmeGenerationsLimit: FREE_TIER_README_LIMIT,
      readmeGenerationsRemaining: FREE_TIER_README_LIMIT,
      month: currentMonth(),
      dbAvailable: false,
    };
  }
}
