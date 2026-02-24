"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(orderId: string, status: "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED") {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const supplier = await db.supplier.findUnique({ where: { userId: session.user.id } });
  if (!supplier) throw new Error("Supplier profile not found");

  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { product: true },
  });
  if (!order || order.product.supplierId !== supplier.id) throw new Error("Not found or forbidden");

  const updated = await db.order.update({
    where: { id: orderId },
    data: { status },
  });

  revalidatePath("/supplier/orders");
  return { success: true, order: updated };
}

export async function getFarmerOrders() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  return db.order.findMany({
    where: { userId: session.user.id },
    include: { product: { include: { supplier: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getSupplierOrders() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const supplier = await db.supplier.findUnique({ where: { userId: session.user.id } });
  if (!supplier) return [];

  return db.order.findMany({
    where: { product: { supplierId: supplier.id } },
    include: { product: true, user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });
}
