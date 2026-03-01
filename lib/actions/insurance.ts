"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { createNotification } from "@/lib/actions/notifications";

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
