"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { farmSchema } from "@/lib/validations";
import { z } from "zod";

export async function createFarm(data: z.infer<typeof farmSchema>) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const validated = farmSchema.parse(data);

  const farm = await db.farm.create({
    data: {
      ...validated,
      userId: session.user.id,
    },
  });

  revalidatePath("/farmer/farm");
  return { success: true, farm };
}

export async function updateFarm(farmId: string, data: z.infer<typeof farmSchema>) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const existing = await db.farm.findUnique({ where: { id: farmId } });
  if (!existing || existing.userId !== session.user.id) throw new Error("Not found or forbidden");

  const validated = farmSchema.parse(data);
  const farm = await db.farm.update({ where: { id: farmId }, data: validated });

  revalidatePath("/farmer/farm");
  return { success: true, farm };
}

export async function getUserFarms() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  return db.farm.findMany({
    where: { userId: session.user.id },
    include: { crops: true },
    orderBy: { createdAt: "desc" },
  });
}
