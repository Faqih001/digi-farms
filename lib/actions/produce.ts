"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const listingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  quantity: z.number().positive("Quantity must be positive"),
  unit: z.string().min(1, "Unit is required"),
  price: z.number().positive("Price must be positive"),
  location: z.string().optional(),
  imageUrls: z.array(z.string()).default([]),
  expiresAt: z.string().optional(),
});

export type ListingInput = z.infer<typeof listingSchema>;

export async function getProduceListings() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  return db.produceListing.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
}

export async function createProduceListing(data: ListingInput) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const validated = listingSchema.parse(data);

  const listing = await db.produceListing.create({
    data: {
      ...validated,
      userId: session.user.id,
      expiresAt: validated.expiresAt ? new Date(validated.expiresAt) : undefined,
      status: "ACTIVE",
    },
  });

  revalidatePath("/farmer/sell");
  return listing;
}

export async function updateProduceListing(id: string, data: Partial<ListingInput>) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const existing = await db.produceListing.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.user.id) throw new Error("Forbidden");

  const listing = await db.produceListing.update({
    where: { id },
    data: {
      ...data,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
    },
  });

  revalidatePath("/farmer/sell");
  return listing;
}

export async function deleteProduceListing(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const existing = await db.produceListing.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.user.id) throw new Error("Forbidden");

  await db.produceListing.delete({ where: { id } });
  revalidatePath("/farmer/sell");
  return { success: true };
}

export async function updateListingStatus(
  id: string,
  status: "ACTIVE" | "SOLD" | "EXPIRED" | "CANCELLED",
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const existing = await db.produceListing.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.user.id) throw new Error("Forbidden");

  const listing = await db.produceListing.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/farmer/sell");
  return listing;
}
