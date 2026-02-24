"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { productSchema } from "@/lib/validations";
import { z } from "zod";

export async function createProduct(data: z.infer<typeof productSchema>) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const validated = productSchema.parse(data);

  const supplier = await db.supplier.findUnique({ where: { userId: session.user.id } });
  if (!supplier) throw new Error("Supplier profile not found");

  const product = await db.product.create({
    data: {
      ...validated,
      supplierId: supplier.id,
    },
  });

  revalidatePath("/supplier/products");
  return { success: true, product };
}

export async function updateProduct(productId: string, data: z.infer<typeof productSchema>) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const supplier = await db.supplier.findUnique({ where: { userId: session.user.id } });
  if (!supplier) throw new Error("Supplier profile not found");

  const existing = await db.product.findUnique({ where: { id: productId } });
  if (!existing || existing.supplierId !== supplier.id) throw new Error("Not found or forbidden");

  const validated = productSchema.parse(data);
  const product = await db.product.update({ where: { id: productId }, data: validated });

  revalidatePath("/supplier/products");
  return { success: true, product };
}

export async function deleteProduct(productId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const supplier = await db.supplier.findUnique({ where: { userId: session.user.id } });
  if (!supplier) throw new Error("Supplier profile not found");

  const existing = await db.product.findUnique({ where: { id: productId } });
  if (!existing || existing.supplierId !== supplier.id) throw new Error("Not found or forbidden");

  await db.product.delete({ where: { id: productId } });

  revalidatePath("/supplier/products");
  return { success: true };
}

export async function getSupplierProducts() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const supplier = await db.supplier.findUnique({ where: { userId: session.user.id } });
  if (!supplier) return [];

  return db.product.findMany({
    where: { supplierId: supplier.id },
    orderBy: { createdAt: "desc" },
  });
}
