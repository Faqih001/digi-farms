"use server";

import { db } from "@/lib/db";

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
