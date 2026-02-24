"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  if (session.user.role !== "ADMIN") throw new Error("Forbidden");
  return session;
}

export async function getUsers(filters?: { role?: string; search?: string }) {
  await requireAdmin();
  return db.user.findMany({
    where: {
      ...(filters?.role ? { role: filters.role as "FARMER" | "SUPPLIER" | "LENDER" | "ADMIN" } : {}),
      ...(filters?.search
        ? {
            OR: [
              { name: { contains: filters.search, mode: "insensitive" } },
              { email: { contains: filters.search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: { subscription: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

export async function updateUserRole(userId: string, role: "FARMER" | "SUPPLIER" | "LENDER" | "ADMIN") {
  await requireAdmin();
  const user = await db.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin/users");
  return { success: true, user };
}

export async function deleteUser(userId: string) {
  await requireAdmin();
  await db.user.delete({ where: { id: userId } });
  revalidatePath("/admin/users");
  return { success: true };
}

export async function getProducts(filters?: { category?: string; search?: string }) {
  await requireAdmin();
  return db.product.findMany({
    where: {
      ...(filters?.category ? { category: filters.category } : {}),
      ...(filters?.search
        ? {
            OR: [
              { name: { contains: filters.search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: { supplier: { select: { companyName: true, isVerified: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

export async function toggleProductFeatured(productId: string, isFeatured: boolean) {
  await requireAdmin();
  await db.product.update({ where: { id: productId }, data: { isFeatured } });
  revalidatePath("/admin/marketplace");
  return { success: true };
}

export async function toggleProductActive(productId: string, isActive: boolean) {
  await requireAdmin();
  await db.product.update({ where: { id: productId }, data: { isActive } });
  revalidatePath("/admin/marketplace");
  return { success: true };
}

export async function verifySupplier(supplierId: string, isVerified: boolean) {
  await requireAdmin();
  await db.supplier.update({ where: { id: supplierId }, data: { isVerified } });
  revalidatePath("/admin/marketplace");
  return { success: true };
}
