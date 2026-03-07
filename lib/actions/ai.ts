"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function saveAIConversation(data: {
  module: string;
  entityId?: string;
  entityLabel?: string;
  prompt: string;
  response: string;
  model?: string;
  inputTokens?: number;
  outputTokens?: number;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  return db.aIConversation.create({
    data: {
      userId: session.user.id,
      module: data.module,
      entityId: data.entityId ?? null,
      entityLabel: data.entityLabel ?? null,
      prompt: data.prompt,
      response: data.response,
      model: data.model ?? "gemini-2.5-flash",
      inputTokens: data.inputTokens ?? null,
      outputTokens: data.outputTokens ?? null,
    },
  });
}

export async function getAIConversations(module: string, entityId?: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  return db.aIConversation.findMany({
    where: {
      userId: session.user.id,
      module,
      ...(entityId ? { entityId } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 20,
    select: {
      id: true,
      prompt: true,
      response: true,
      model: true,
      entityId: true,
      entityLabel: true,
      createdAt: true,
      inputTokens: true,
      outputTokens: true,
    },
  });
}

export async function deleteAIConversation(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db.aIConversation.delete({
    where: { id, userId: session.user.id },
  });
}

// Admin: get all AI conversations across users
export async function getAdminAIConversations(filters?: { module?: string; limit?: number }) {
  const session = await auth();
  const user = session?.user as any;
  if (!session?.user?.id || user?.role !== "ADMIN") throw new Error("Unauthorized");

  return db.aIConversation.findMany({
    where: filters?.module ? { module: filters.module } : {},
    orderBy: { createdAt: "desc" },
    take: filters?.limit ?? 50,
    select: {
      id: true,
      module: true,
      entityLabel: true,
      prompt: true,
      response: true,
      model: true,
      inputTokens: true,
      outputTokens: true,
      createdAt: true,
      user: { select: { name: true, email: true, role: true } },
    },
  });
}

export async function getAIUsageStats() {
  const session = await auth();
  const user = session?.user as any;
  if (!session?.user?.id || user?.role !== "ADMIN") throw new Error("Unauthorized");

  const [total, byModule, todayCount, promptUsageAll] = await Promise.all([
    db.aIConversation.count(),
    db.aIConversation.groupBy({ by: ["module"], _count: { id: true }, orderBy: { _count: { id: "desc" } } }),
    db.aIConversation.count({ where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } } }),
    db.promptUsage.aggregate({ _sum: { used: true }, _count: { id: true } }),
  ]);

  return {
    total,
    byModule,
    todayCount,
    totalPromptsUsed: promptUsageAll._sum.used ?? 0,
    activeUsers: promptUsageAll._count.id,
  };
}

export async function getAdminAIModels() {
  const session = await auth();
  const user = session?.user as any;
  if (!session?.user?.id || user?.role !== "ADMIN") throw new Error("Unauthorized");

  return db.aIModel.findMany({
    orderBy: { createdAt: "desc" },
  });
}
