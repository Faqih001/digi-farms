"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { farmSchema } from "@/lib/validations";
import { z } from "zod";

const cropSchema = z.object({
  name: z.string().min(1),
  variety: z.string().optional(),
  areaHectares: z.number().positive(),
  plantedAt: z.string(),
  expectedYield: z.number().positive().optional(),
  season: z.string().optional(),
  notes: z.string().optional(),
});

export async function createFarm(data: z.infer<typeof farmSchema>) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const validated = farmSchema.parse(data);
  const farm = await db.farm.create({ data: { ...validated, userId: session.user.id } });
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

export async function deleteFarm(farmId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const existing = await db.farm.findUnique({ where: { id: farmId } });
  if (!existing || existing.userId !== session.user.id) throw new Error("Not found or forbidden");
  await db.farm.delete({ where: { id: farmId } });
  revalidatePath("/farmer/farm");
  return { success: true };
}

export async function getUserFarms() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return db.farm.findMany({
    where: { userId: session.user.id },
    include: { crops: { orderBy: { plantedAt: "desc" } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function createCrop(farmId: string, data: z.infer<typeof cropSchema>) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const farm = await db.farm.findUnique({ where: { id: farmId } });
  if (!farm || farm.userId !== session.user.id) throw new Error("Forbidden");
  const validated = cropSchema.parse(data);
  const crop = await db.crop.create({
    data: {
      ...validated,
      farmId,
      plantedAt: new Date(validated.plantedAt),
    },
  });
  revalidatePath("/farmer/farm");
  return { success: true, crop };
}

export async function updateCrop(cropId: string, data: z.infer<typeof cropSchema>) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const existing = await db.crop.findUnique({ where: { id: cropId }, include: { farm: true } });
  if (!existing || existing.farm.userId !== session.user.id) throw new Error("Forbidden");
  const validated = cropSchema.parse(data);
  const crop = await db.crop.update({
    where: { id: cropId },
    data: { ...validated, plantedAt: new Date(validated.plantedAt) },
  });
  revalidatePath("/farmer/farm");
  return { success: true, crop };
}

export async function deleteCrop(cropId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const existing = await db.crop.findUnique({ where: { id: cropId }, include: { farm: true } });
  if (!existing || existing.farm.userId !== session.user.id) throw new Error("Forbidden");
  await db.crop.delete({ where: { id: cropId } });
  revalidatePath("/farmer/farm");
  return { success: true };
}
