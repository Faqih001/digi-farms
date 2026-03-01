"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { createNotification } from "@/lib/actions/notifications";

export async function createPolicy(data: {
  provider: string;
  cropCovered: string;
  coverageAmount: number;
  premium: number;
  startDate: string;
  endDate: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  if (!data.provider || !data.cropCovered || !data.coverageAmount || !data.premium || !data.startDate || !data.endDate)
    throw new Error("All fields are required");

  const policyNumber = `POL-${Date.now().toString(36).toUpperCase()}`;

  const policy = await db.insurancePolicies.create({
    data: {
      userId: session.user.id,
      policyNumber,
      provider: data.provider,
      cropCovered: data.cropCovered,
      coverageAmount: data.coverageAmount,
      premium: data.premium,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      status: "ACTIVE",
    },
  });

  await createNotification({
    userId: session.user.id,
    title: "Insurance Policy Activated",
    message: `Your ${data.cropCovered} policy (${policyNumber}) with ${data.provider} is now active.`,
    type: "info",
    link: "/farmer/insurance",
  });

  revalidatePath("/farmer/insurance");
  return { success: true, policy };
}

export async function deletePolicy(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const policy = await db.insurancePolicies.findFirst({ where: { id, userId: session.user.id } });
  if (!policy) throw new Error("Policy not found or access denied");

  await db.insurancePolicies.delete({ where: { id } });
  revalidatePath("/farmer/insurance");
  return { success: true };
}

export async function getUserPolicies() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return db.insurancePolicies.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
}

export async function getUserClaims() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return db.insuranceClaim.findMany({
    where: { farmerId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
}

export async function fileClaim(data: {
  type: string;
  description: string;
  amount: number;
  insurer?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  if (!data.type || !data.description || !data.amount) {
    throw new Error("Type, description, and amount are required");
  }

  const claim = await db.insuranceClaim.create({
    data: {
      farmerId: session.user.id,
      farmerName: session.user.name ?? undefined,
      type: data.type,
      description: data.description,
      amount: data.amount,
      insurer: data.insurer,
    },
  });

  await createNotification({
    userId: session.user.id,
    title: "Insurance Claim Filed",
    message: `Your claim for KES ${data.amount.toLocaleString()} (${data.type}) has been filed.`,
    type: "info",
    link: "/farmer/insurance",
  });

  revalidatePath("/farmer/insurance");
  return { success: true, claim };
}
