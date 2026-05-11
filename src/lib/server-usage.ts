/**
 * Server-side usage and subscription helpers.
 *
 * These functions run only in server contexts (API routes, server components).
 * In production, usage checks fail closed when the database is unavailable so
 * free limits and paid gating cannot be bypassed.
 */

import { db } from '@/lib/db';
import {
  FREE_TIER_README_LIMIT,
  PRO_TIER_PORTFOLIO_DAILY_LIMIT,
  PRO_TIER_README_DAILY_LIMIT,
} from '@/config/subscription';

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

function currentDay(): string {
  return new Date().toISOString().slice(0, 10);
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
    readmeGenerationsDailyUsed: 0,
    readmeGenerationsDailyLimit: 0,
    readmeGenerationsDailyRemaining: 0,
    portfolioGenerationsDailyUsed: 0,
    portfolioGenerationsDailyLimit: 0,
    portfolioGenerationsDailyRemaining: 0,
    creditsRemaining: 0,
    month: currentMonth(),
    day: currentDay(),
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
  used?: number;
  period?: 'month' | 'day';
}

export interface DailyUsageCheckResult {
  allowed: boolean;
  used: number;
  remaining: number;
  limit: number;
  plan: 'free' | 'pro';
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
  const limit = plan === 'pro' ? PRO_TIER_README_DAILY_LIMIT : FREE_TIER_README_LIMIT;

  if (plan === 'pro') {
    const day = currentDay();
    const dailyUsage = await db.dailyUsage.findUnique({
      where: { userId_day: { userId, day } },
      select: { readmeGenerationsUsed: true },
    });
    const used = dailyUsage?.readmeGenerationsUsed ?? 0;
    return {
      allowed: used < limit,
      remaining: Math.max(0, limit - used),
      limit,
      plan,
      used,
      period: 'day',
    };
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
    used,
    period: 'month',
  };
}

export async function checkPortfolioAllowedById(userId: string): Promise<DailyUsageCheckResult> {
  if (!dbAvailable()) {
    return { allowed: false, used: 0, remaining: 0, limit: 0, plan: 'free' };
  }

  try {
    const plan = await getUserPlanById(userId);
    if (plan !== 'pro') {
      return { allowed: false, used: 0, remaining: 0, limit: 0, plan };
    }

    const day = currentDay();
    const usage = await db.dailyUsage.findUnique({
      where: { userId_day: { userId, day } },
      select: { portfolioGenerationsUsed: true },
    });
    const used = usage?.portfolioGenerationsUsed ?? 0;
    const limit = PRO_TIER_PORTFOLIO_DAILY_LIMIT;

    return {
      allowed: used < limit,
      used,
      remaining: Math.max(0, limit - used),
      limit,
      plan,
    };
  } catch {
    return { allowed: false, used: 0, remaining: 0, limit: 0, plan: 'free' };
  }
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
    const limit = plan === 'pro' ? PRO_TIER_README_DAILY_LIMIT : FREE_TIER_README_LIMIT;

    if (plan === 'pro') {
      const userId = await getUserId(username);
      if (!userId) {
        return { allowed: false, remaining: 0, limit, plan, period: 'day' };
      }
      return await checkReadmeAllowedForUserId(userId);
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
      used,
      period: 'month',
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
    const month = currentMonth();
    const day = currentDay();
    return await db.$transaction(async (tx) => {
      await tx.dailyUsage.upsert({
        where: { userId_day: { userId, day } },
        update: {},
        create: { userId, day, readmeGenerationsUsed: 0, portfolioGenerationsUsed: 0 },
      });

      if (plan === 'pro') {
        const reserved = await tx.dailyUsage.updateMany({
          where: {
            userId,
            day,
            readmeGenerationsUsed: { lt: PRO_TIER_README_DAILY_LIMIT },
          },
          data: { readmeGenerationsUsed: { increment: 1 } },
        });

        if (reserved.count !== 1) {
          throw new Error('Daily README limit reached');
        }

        const updatedDailyUsage = await tx.dailyUsage.findUniqueOrThrow({
          where: { userId_day: { userId, day } },
          select: { readmeGenerationsUsed: true },
        });

        return {
          usedFreeGeneration: false,
          usedCredit: false,
          usageUsed: updatedDailyUsage.readmeGenerationsUsed,
          creditsRemaining: 0,
        };
      }

      const usage = await tx.usage.upsert({
        where: { userId_month: { userId, month } },
        update: {},
        create: { userId, month, readmeGenerationsUsed: 0 },
        select: { readmeGenerationsUsed: true },
      });

      if (usage.readmeGenerationsUsed < FREE_TIER_README_LIMIT) {
        const reserved = await tx.usage.updateMany({
          where: {
            userId,
            month,
            readmeGenerationsUsed: { lt: FREE_TIER_README_LIMIT },
          },
          data: { readmeGenerationsUsed: { increment: 1 } },
        });
        if (reserved.count === 1) {
          await tx.dailyUsage.update({
            where: { userId_day: { userId, day } },
            data: { readmeGenerationsUsed: { increment: 1 } },
          });
          const updated = await tx.usage.findUniqueOrThrow({
            where: { userId_month: { userId, month } },
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
      }

      const reservedCredit = await tx.creditBalance.updateMany({
        where: {
          userId,
          credits: { gt: 0 },
        },
        data: { credits: { decrement: 1 } },
      });

      if (reservedCredit.count !== 1) {
        throw new Error('No README credits available');
      }

      const updatedBalance = await tx.creditBalance.findUniqueOrThrow({
        where: { userId },
        select: { credits: true },
      });
      await tx.dailyUsage.update({
        where: { userId_day: { userId, day } },
        data: { readmeGenerationsUsed: { increment: 1 } },
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

export async function incrementPortfolioUsageById(userId: string): Promise<DailyUsageCheckResult | null> {
  if (!dbAvailable()) return null;

  try {
    const plan = await getUserPlanById(userId);
    if (plan !== 'pro') {
      return { allowed: false, used: 0, remaining: 0, limit: 0, plan };
    }

    const day = currentDay();
    return await db.$transaction(async (tx) => {
      await tx.dailyUsage.upsert({
        where: { userId_day: { userId, day } },
        update: {},
        create: { userId, day, readmeGenerationsUsed: 0, portfolioGenerationsUsed: 0 },
      });

      const reserved = await tx.dailyUsage.updateMany({
        where: {
          userId,
          day,
          portfolioGenerationsUsed: { lt: PRO_TIER_PORTFOLIO_DAILY_LIMIT },
        },
        data: { portfolioGenerationsUsed: { increment: 1 } },
      });

      if (reserved.count !== 1) {
        throw new Error('Daily portfolio limit reached');
      }

      const updated = await tx.dailyUsage.findUniqueOrThrow({
        where: { userId_day: { userId, day } },
        select: { portfolioGenerationsUsed: true },
      });

      return {
        allowed: updated.portfolioGenerationsUsed < PRO_TIER_PORTFOLIO_DAILY_LIMIT,
        used: updated.portfolioGenerationsUsed,
        remaining: Math.max(0, PRO_TIER_PORTFOLIO_DAILY_LIMIT - updated.portfolioGenerationsUsed),
        limit: PRO_TIER_PORTFOLIO_DAILY_LIMIT,
        plan,
      };
    });
  } catch (err) {
    console.error('[server-usage] incrementPortfolioUsageById failed:', err);
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
    const limit = plan === 'pro' ? PRO_TIER_README_DAILY_LIMIT : FREE_TIER_README_LIMIT;
    const month = currentMonth();
    const day = currentDay();

    const usage = await db.usage.findUnique({
      where: { userId_month: { userId, month } },
      select: { readmeGenerationsUsed: true },
    });
    const used = usage?.readmeGenerationsUsed ?? 0;
    const creditsRemaining = await getCreditBalance(userId);
    const dailyUsage = await db.dailyUsage.findUnique({
      where: { userId_day: { userId, day } },
      select: { readmeGenerationsUsed: true, portfolioGenerationsUsed: true },
    });
    const readmeDailyUsed = dailyUsage?.readmeGenerationsUsed ?? 0;
    const portfolioDailyUsed = dailyUsage?.portfolioGenerationsUsed ?? 0;

    return {
      plan,
      readmeGenerationsUsed: used,
      readmeGenerationsLimit: limit,
      readmeGenerationsRemaining: plan === 'pro'
        ? Math.max(0, limit - readmeDailyUsed)
        : Math.max(0, limit - used) + creditsRemaining,
      readmeGenerationsDailyUsed: readmeDailyUsed,
      readmeGenerationsDailyLimit: plan === 'pro' ? PRO_TIER_README_DAILY_LIMIT : FREE_TIER_README_LIMIT,
      readmeGenerationsDailyRemaining: plan === 'pro'
        ? Math.max(0, PRO_TIER_README_DAILY_LIMIT - readmeDailyUsed)
        : Math.max(0, FREE_TIER_README_LIMIT - readmeDailyUsed),
      portfolioGenerationsDailyUsed: portfolioDailyUsed,
      portfolioGenerationsDailyLimit: plan === 'pro' ? PRO_TIER_PORTFOLIO_DAILY_LIMIT : 0,
      portfolioGenerationsDailyRemaining: plan === 'pro'
        ? Math.max(0, PRO_TIER_PORTFOLIO_DAILY_LIMIT - portfolioDailyUsed)
        : 0,
      creditsRemaining,
      month,
      day,
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
    const limit = plan === 'pro' ? PRO_TIER_README_DAILY_LIMIT : FREE_TIER_README_LIMIT;
    const userId = await getUserId(username);
    const month = currentMonth();
    const day = currentDay();

    let used = 0;
    let creditsRemaining = 0;
    let readmeDailyUsed = 0;
    let portfolioDailyUsed = 0;
    if (userId) {
      const usage = await db.usage.findUnique({
        where: { userId_month: { userId, month } },
        select: { readmeGenerationsUsed: true },
      });
      used = usage?.readmeGenerationsUsed ?? 0;
      creditsRemaining = await getCreditBalance(userId);
      const dailyUsage = await db.dailyUsage.findUnique({
        where: { userId_day: { userId, day } },
        select: { readmeGenerationsUsed: true, portfolioGenerationsUsed: true },
      });
      readmeDailyUsed = dailyUsage?.readmeGenerationsUsed ?? 0;
      portfolioDailyUsed = dailyUsage?.portfolioGenerationsUsed ?? 0;
    }

    return {
      plan,
      readmeGenerationsUsed: used,
      readmeGenerationsLimit: limit,
      readmeGenerationsRemaining: plan === 'pro'
        ? Math.max(0, limit - readmeDailyUsed)
        : Math.max(0, limit - used) + creditsRemaining,
      readmeGenerationsDailyUsed: readmeDailyUsed,
      readmeGenerationsDailyLimit: plan === 'pro' ? PRO_TIER_README_DAILY_LIMIT : FREE_TIER_README_LIMIT,
      readmeGenerationsDailyRemaining: plan === 'pro'
        ? Math.max(0, PRO_TIER_README_DAILY_LIMIT - readmeDailyUsed)
        : Math.max(0, FREE_TIER_README_LIMIT - readmeDailyUsed),
      portfolioGenerationsDailyUsed: portfolioDailyUsed,
      portfolioGenerationsDailyLimit: plan === 'pro' ? PRO_TIER_PORTFOLIO_DAILY_LIMIT : 0,
      portfolioGenerationsDailyRemaining: plan === 'pro'
        ? Math.max(0, PRO_TIER_PORTFOLIO_DAILY_LIMIT - portfolioDailyUsed)
        : 0,
      creditsRemaining,
      month,
      day,
      dbAvailable: true,
    };
  } catch {
    return dbUnavailableSnapshot();
  }
}
