"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(orderId: string, status: "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED") {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const supplier = await db.supplier.findUnique({ where: { userId: session.user.id } });
  if (!supplier) throw new Error("Supplier profile not found");

  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: true } } },
  });
  if (!order) throw new Error("Not found");
  const belongsToSupplier = order.items.some((item: { product: { supplierId: string } }) => item.product.supplierId === supplier.id);
  if (!belongsToSupplier) throw new Error("Forbidden");

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
    include: { items: { include: { product: { include: { supplier: true } } } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getSupplierOrders() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const supplier = await db.supplier.findUnique({ where: { userId: session.user.id } });
  if (!supplier) return [];

  return db.order.findMany({
    where: { items: { some: { product: { supplierId: supplier.id } } } },
    include: { items: { include: { product: true } }, user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function createOrder(
  items: { productId: string; quantity: number }[],
  shippingAddress?: string
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  if (!items.length) throw new Error("Cart is empty");

  // Fetch all products to calculate price and validate stock
  const products = await db.product.findMany({
    where: { id: { in: items.map((i) => i.productId) }, isActive: true },
  });

  const productMap = new Map(products.map((p) => [p.id, p]));

  for (const item of items) {
    const product = productMap.get(item.productId);
    if (!product) throw new Error(`Product not found`);
    if (product.stock < item.quantity) throw new Error(`Insufficient stock for ${product.name}`);
  }

  const totalAmount = items.reduce((sum, item) => {
    const product = productMap.get(item.productId)!;
    return sum + product.price * item.quantity;
  }, 0);

  const order = await db.order.create({
    data: {
      userId: session.user.id,
      totalAmount,
      status: "PENDING",
      paymentStatus: "PENDING",
      shippingAddress: shippingAddress ?? null,
      items: {
        create: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: productMap.get(item.productId)!.price,
        })),
      },
    },
    include: { items: true },
  });

  // Decrement stock
  await Promise.all(
    items.map((item) =>
      db.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      })
    )
  );

  revalidatePath("/farmer/buy");
  revalidatePath("/farmer/orders");
  return { success: true, order };
}
