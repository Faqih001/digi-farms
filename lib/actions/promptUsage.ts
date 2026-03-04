import { db } from "@/lib/db";

// Per-month prompt limits per subscription tier. 0 = unlimited.
export const TIER_LIMITS: Record<string, number> = {
  FREE:       5,
  BASIC:      200,
  PRO:        1000,
  ENTERPRISE: 0,
};

export function getTierLimit(tier: string): number {
  return TIER_LIMITS[tier] ?? TIER_LIMITS.FREE;
}

/** Fetch the user's subscription tier, then atomically consume one prompt.
 *  Call this from every AI route handler. */
export async function checkAndConsumePrompt(userId: string): Promise<{
  allowed: boolean;
  used: number;
  limit: number;
  tier: string;
}> {
  const sub = await db.subscription.findUnique({ where: { userId } });
  const tier = sub?.tier ?? "FREE";
  const limit = getTierLimit(tier);

  const result = await consumePromptIfAllowed(userId, limit);
  return { ...result, limit, tier };
}

/** Return current usage stats for a user without consuming a prompt. */
export async function getUsageStats(userId: string) {
  const sub = await db.subscription.findUnique({ where: { userId } });
  const tier = sub?.tier ?? "FREE";
  const limit = getTierLimit(tier);
  const periodStart = getMonthPeriodStart();
  const periodEnd = getMonthPeriodEnd();

  const record = await db.promptUsage.findUnique({
    where: { userId_periodStart: { userId, periodStart } },
  });

  const used = record?.used ?? 0;
  const remaining = limit === 0 ? null : Math.max(0, limit - used);

  return { used, limit, tier, remaining, periodStart, periodEnd };
}

function getMonthPeriodStart(date = new Date()) {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth();
  return new Date(Date.UTC(y, m, 1, 0, 0, 0, 0));
}

function getMonthPeriodEnd(date = new Date()) {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth();
  return new Date(Date.UTC(y, m + 1, 1, 0, 0, 0, 0));
}

export async function getPromptUsageRecord(userId: string) {
  const periodStart = getMonthPeriodStart();
  const record = await db.promptUsage.findUnique({
    where: { userId_periodStart: { userId, periodStart } },
  });
  return record;
}

export async function ensurePromptUsageRecord(userId: string) {
  const periodStart = getMonthPeriodStart();
  const periodEnd = getMonthPeriodEnd();
  const rec = await db.promptUsage.upsert({
    where: { userId_periodStart: { userId, periodStart } },
    create: { userId, used: 0, periodStart, periodEnd },
    update: {},
  });
  return rec;
}

// Atomically check and consume a single prompt. Returns the new used count.
export async function consumePromptIfAllowed(userId: string, limit: number) {
  if (limit <= 0) return { allowed: true, used: 0 };

  const periodStart = getMonthPeriodStart();

  return await db.$transaction(async (tx) => {
    const existing = await tx.promptUsage.findUnique({
      where: { userId_periodStart: { userId, periodStart } },
    });

    if (existing && existing.used >= limit) {
      return { allowed: false, used: existing.used };
    }

    if (!existing) {
      const created = await tx.promptUsage.create({
        data: { userId, used: 1, periodStart, periodEnd: getMonthPeriodEnd() },
      });
      return { allowed: true, used: created.used };
    }

    const updated = await tx.promptUsage.update({
      where: { id: existing.id },
      data: { used: existing.used + 1 },
    });

    return { allowed: true, used: updated.used };
  });
}

export async function resetPromptUsageForUser(userId: string) {
  await db.promptUsage.deleteMany({ where: { userId } });
  return { success: true };
}

export async function resetAllPromptUsage() {
  await db.promptUsage.deleteMany({});
  return { success: true };
}
