"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { productSchema } from "@/lib/validations";
import { z } from "zod";
import { createNotification } from "@/lib/actions/notifications";

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

  await createNotification({ userId: session.user.id, title: "Product Listed", message: `"${product.name}" is now live on the marketplace.`, type: "product", link: "/supplier/products" });

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

  await createNotification({ userId: session.user.id, title: "Product Updated", message: `"${product.name}" has been updated.`, type: "product", link: "/supplier/products" });

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

  const productName = existing.name;
  await db.product.delete({ where: { id: productId } });

  await createNotification({ userId: session.user.id, title: "Product Removed", message: `"${productName}" has been removed from the marketplace.`, type: "warning" });

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

export async function getMarketplaceProducts(filters?: { category?: string; search?: string }) {
  return db.product.findMany({
    where: {
      isActive: true,
      ...(filters?.category && filters.category !== "all" ? { category: filters.category } : {}),
      ...(filters?.search
        ? { OR: [{ name: { contains: filters.search, mode: "insensitive" } }, { description: { contains: filters.search, mode: "insensitive" } }] }
        : {}),
    },
    include: { supplier: { select: { companyName: true, rating: true, isVerified: true } } },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    take: 100,
  });
}

export async function updateProductStock(productId: string, stock: number) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const supplier = await db.supplier.findUnique({ where: { userId: session.user.id } });
  if (!supplier) throw new Error("Supplier profile not found");

  const existing = await db.product.findUnique({ where: { id: productId } });
  if (!existing || existing.supplierId !== supplier.id) throw new Error("Not found or forbidden");

  const product = await db.product.update({ where: { id: productId }, data: { stock } });

  revalidatePath("/supplier/inventory");
  revalidatePath("/supplier/products");
  return { success: true, product };
}
