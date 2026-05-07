/**
 * Server-side usage and subscription helpers.
 *
 * These functions run only in server contexts (API routes, server components).
 * In production, usage checks fail closed when the database is unavailable so
 * free limits and paid gating cannot be bypassed.
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

function strictUsageEnforcement(): boolean {
  return process.env.NODE_ENV === 'production';
}

function dbUnavailableCheck(): UsageCheckResult {
  return strictUsageEnforcement()
    ? { allowed: false, remaining: 0, limit: FREE_TIER_README_LIMIT, plan: 'free' }
    : { allowed: true, remaining: FREE_TIER_README_LIMIT, limit: FREE_TIER_README_LIMIT, plan: 'free' };
}

function dbUnavailableSnapshot() {
  return {
    plan: 'free' as const,
    readmeGenerationsUsed: 0,
    readmeGenerationsLimit: FREE_TIER_README_LIMIT,
    readmeGenerationsRemaining: strictUsageEnforcement() ? 0 : FREE_TIER_README_LIMIT,
    creditsRemaining: 0,
    month: currentMonth(),
    dbAvailable: false,
  };
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
  creditsRemaining?: number;
}

export async function getCreditBalance(userId: string): Promise<number> {
  if (!dbAvailable()) return 0;
  try {
    const balance = await db.creditBalance.findUnique({
      where: { userId },
      select: { credits: true },
    });
    return balance?.credits ?? 0;
  } catch {
    return 0;
  }
}

export async function grantCredits(params: {
  userId: string;
  amount: number;
  reason: string;
  stripeSessionId?: string;
}): Promise<void> {
  if (!dbAvailable() || params.amount <= 0) return;

  await db.$transaction([
    db.creditBalance.upsert({
      where: { userId: params.userId },
      update: { credits: { increment: params.amount } },
      create: { userId: params.userId, credits: params.amount },
    }),
    db.creditTransaction.create({
      data: {
        userId: params.userId,
        amount: params.amount,
        reason: params.reason,
        stripeSessionId: params.stripeSessionId,
      },
    }),
  ]);
}

async function checkReadmeAllowedForUserId(userId: string): Promise<UsageCheckResult> {
  const plan = await getUserPlanById(userId);
  const limit = plan === 'pro' ? PRO_TIER_README_LIMIT : FREE_TIER_README_LIMIT;

  if (plan === 'pro') {
    return { allowed: true, remaining: limit, limit, plan };
  }

  const month = currentMonth();
  const usage = await db.usage.findUnique({
    where: { userId_month: { userId, month } },
    select: { readmeGenerationsUsed: true },
  });

  const used = usage?.readmeGenerationsUsed ?? 0;
  const freeRemaining = Math.max(0, limit - used);
  const creditsRemaining = await getCreditBalance(userId);
  return {
    allowed: freeRemaining > 0 || creditsRemaining > 0,
    remaining: freeRemaining > 0 ? freeRemaining : creditsRemaining,
    limit,
    plan,
    creditsRemaining,
  };
}

export async function checkReadmeAllowedById(userId: string): Promise<UsageCheckResult> {
  if (!dbAvailable()) {
    return dbUnavailableCheck();
  }

  try {
    return await checkReadmeAllowedForUserId(userId);
  } catch {
    return { allowed: false, remaining: 0, limit: FREE_TIER_README_LIMIT, plan: 'free' };
  }
}

/**
 * Check whether a user is allowed to generate a README.
 * Falls back to a lenient in-memory limit when DB is unavailable.
 */
export async function checkReadmeAllowed(username: string): Promise<UsageCheckResult> {
  if (!dbAvailable()) {
    return dbUnavailableCheck();
  }

  try {
    const plan = await getUserPlanFromDB(username);
    const limit = plan === 'pro' ? PRO_TIER_README_LIMIT : FREE_TIER_README_LIMIT;

    if (plan === 'pro') {
      return { allowed: true, remaining: limit, limit, plan };
    }

    const userId = await getUserId(username);
    if (!userId) {
      return { allowed: false, remaining: 0, limit: FREE_TIER_README_LIMIT, plan: 'free' };
    }

    const month = currentMonth();
    const usage = await db.usage.findUnique({
      where: { userId_month: { userId, month } },
      select: { readmeGenerationsUsed: true },
    });

    const used = usage?.readmeGenerationsUsed ?? 0;
    const freeRemaining = Math.max(0, limit - used);
    const creditsRemaining = await getCreditBalance(userId);
    return {
      allowed: freeRemaining > 0 || creditsRemaining > 0,
      remaining: freeRemaining > 0 ? freeRemaining : creditsRemaining,
      limit,
      plan,
      creditsRemaining,
    };
  } catch {
    return dbUnavailableCheck();
  }
}

export interface UsageIncrementResult {
  usedFreeGeneration: boolean;
  usedCredit: boolean;
  usageUsed: number;
  creditsRemaining: number;
}

export async function incrementReadmeUsageById(userId: string): Promise<UsageIncrementResult | null> {
  if (!dbAvailable()) return null;

  try {
    const plan = await getUserPlanById(userId);
    if (plan === 'pro') return null;

    const month = currentMonth();
    return await db.$transaction(async (tx) => {
      const usage = await tx.usage.upsert({
        where: { userId_month: { userId, month } },
        update: {},
        create: { userId, month, readmeGenerationsUsed: 0 },
        select: { readmeGenerationsUsed: true },
      });

      if (usage.readmeGenerationsUsed < FREE_TIER_README_LIMIT) {
        const updated = await tx.usage.update({
          where: { userId_month: { userId, month } },
          data: { readmeGenerationsUsed: { increment: 1 } },
          select: { readmeGenerationsUsed: true },
        });
        const balance = await tx.creditBalance.findUnique({
          where: { userId },
          select: { credits: true },
        });
        return {
          usedFreeGeneration: true,
          usedCredit: false,
          usageUsed: updated.readmeGenerationsUsed,
          creditsRemaining: balance?.credits ?? 0,
        };
      }

      const balance = await tx.creditBalance.findUnique({
        where: { userId },
        select: { credits: true },
      });

      if ((balance?.credits ?? 0) <= 0) {
        throw new Error('No README credits available');
      }

      const updatedBalance = await tx.creditBalance.update({
        where: { userId },
        data: { credits: { decrement: 1 } },
        select: { credits: true },
      });
      await tx.creditTransaction.create({
        data: { userId, amount: -1, reason: 'readme_generation' },
      });
      return {
        usedFreeGeneration: false,
        usedCredit: true,
        usageUsed: usage.readmeGenerationsUsed,
        creditsRemaining: updatedBalance.credits,
      };
    });
  } catch (err) {
    console.error('[server-usage] incrementReadmeUsageById failed:', err);
    return null;
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

    await incrementReadmeUsageById(userId);
  } catch (err) {
    console.error('[server-usage] incrementReadmeUsage failed:', err);
  }
}

/**
 * Full usage snapshot looked up by DB userId (works for all auth providers).
 */
export async function getUsageSnapshotById(userId: string) {
  if (!dbAvailable()) {
    return dbUnavailableSnapshot();
  }

  try {
    const sub = await db.subscription.findFirst({
      where: { userId, status: 'active' },
      select: { plan: true },
    });
    const plan = sub?.plan === 'pro' ? 'pro' : 'free';
    const limit = plan === 'pro' ? PRO_TIER_README_LIMIT : FREE_TIER_README_LIMIT;
    const month = currentMonth();

    const usage = await db.usage.findUnique({
      where: { userId_month: { userId, month } },
      select: { readmeGenerationsUsed: true },
    });
    const used = usage?.readmeGenerationsUsed ?? 0;
    const creditsRemaining = await getCreditBalance(userId);

    return {
      plan,
      readmeGenerationsUsed: used,
      readmeGenerationsLimit: limit,
      readmeGenerationsRemaining: plan === 'pro' ? limit : Math.max(0, limit - used) + creditsRemaining,
      creditsRemaining,
      month,
      dbAvailable: true,
    };
  } catch {
    return dbUnavailableSnapshot();
  }
}

/**
 * Full usage snapshot for the dashboard /api/usage route.
 */
export async function getUsageSnapshot(username: string) {
  if (!dbAvailable()) {
    return dbUnavailableSnapshot();
  }

  try {
    const plan = await getUserPlanFromDB(username);
    const limit = plan === 'pro' ? PRO_TIER_README_LIMIT : FREE_TIER_README_LIMIT;
    const userId = await getUserId(username);
    const month = currentMonth();

    let used = 0;
    let creditsRemaining = 0;
    if (userId) {
      const usage = await db.usage.findUnique({
        where: { userId_month: { userId, month } },
        select: { readmeGenerationsUsed: true },
      });
      used = usage?.readmeGenerationsUsed ?? 0;
      creditsRemaining = await getCreditBalance(userId);
    }

    return {
      plan,
      readmeGenerationsUsed: used,
      readmeGenerationsLimit: limit,
      readmeGenerationsRemaining: plan === 'pro' ? limit : Math.max(0, limit - used) + creditsRemaining,
      creditsRemaining,
      month,
      dbAvailable: true,
    };
  } catch {
    return dbUnavailableSnapshot();
  }
}
