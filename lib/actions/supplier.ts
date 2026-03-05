"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { PaymentStatus } from "@prisma/client";

async function getSupplier() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const supplier = await db.supplier.findUnique({ where: { userId: session.user.id } });
  if (!supplier) throw new Error("Supplier profile not found");
  return supplier;
}

// ─── Payouts ──────────────────────────────────────────────────────────────────

export async function getSupplierPayouts() {
  const supplier = await getSupplier();
  return db.payout.findMany({
    where: { supplierId: supplier.id },
    orderBy: { createdAt: "desc" },
  });
}

export async function requestPayout(data: { amount: number; method?: string }) {
  const supplier = await getSupplier();
  if (data.amount <= 0) throw new Error("Amount must be greater than 0");

  const payout = await db.payout.create({
    data: {
      supplierId: supplier.id,
      amount: data.amount,
      status: PaymentStatus.PENDING,
      reference: `REQ-${Date.now().toString(36).toUpperCase()}`,
    },
  });

  revalidatePath("/supplier/payouts");
  return { success: true, payout };
}

// ─── Revenue / Orders analytics ───────────────────────────────────────────────

export async function getSupplierRevenueStats(period: "week" | "month" | "year" | "all" = "month") {
  const supplier = await getSupplier();

  const productIds = (
    await db.product.findMany({ where: { supplierId: supplier.id }, select: { id: true } })
  ).map((p) => p.id);

  const now = new Date();
  let since: Date | undefined;
  if (period === "week") since = new Date(now.getTime() - 7 * 86400000);
  else if (period === "month") since = new Date(now.getFullYear(), now.getMonth(), 1);
  else if (period === "year") since = new Date(now.getFullYear(), 0, 1);

  const whereClause = {
    productId: { in: productIds },
    ...(since ? { order: { createdAt: { gte: since } } } : {}),
  };

  const [items, payouts] = await Promise.all([
    db.orderItem.findMany({
      where: whereClause,
      include: { order: { select: { createdAt: true, status: true, userId: true } }, product: { select: { name: true, category: true } } },
    }),
    db.payout.findMany({ where: { supplierId: supplier.id }, orderBy: { createdAt: "desc" } }),
  ]);

  const deliveredItems = items.filter((i) => i.order.status === "DELIVERED");
  const totalRevenue = deliveredItems.reduce((s, i) => s + i.quantity * i.price, 0);
  const pendingRevenue = items
    .filter((i) => ["PENDING", "CONFIRMED", "SHIPPED"].includes(i.order.status))
    .reduce((s, i) => s + i.quantity * i.price, 0);
  const totalPaidOut = payouts
    .filter((p) => p.status === "COMPLETED")
    .reduce((s, p) => s + p.amount, 0);

  // Monthly grouping for chart
  const monthly: Record<string, { revenue: number; orders: number }> = {};
  for (const item of deliveredItems) {
    const key = new Date(item.order.createdAt).toLocaleDateString("en-KE", { month: "short", year: "numeric" });
    if (!monthly[key]) monthly[key] = { revenue: 0, orders: 0 };
    monthly[key].revenue += item.quantity * item.price;
    monthly[key].orders += 1;
  }

  // Category breakdown
  const catMap: Record<string, number> = {};
  for (const item of deliveredItems) {
    const cat = item.product.category;
    catMap[cat] = (catMap[cat] ?? 0) + item.quantity * item.price;
  }

  return {
    totalRevenue,
    pendingRevenue,
    totalPaidOut,
    orderCount: deliveredItems.length,
    monthly: Object.entries(monthly).map(([month, d]) => ({ month, ...d })),
    byCategory: Object.entries(catMap).map(([category, revenue]) => ({ category, revenue })).sort((a, b) => b.revenue - a.revenue),
    payouts: payouts.slice(0, 10),
  };
}

// ─── Customers ────────────────────────────────────────────────────────────────

export async function getSupplierCustomers() {
  const supplier = await getSupplier();

  const productIds = (
    await db.product.findMany({ where: { supplierId: supplier.id }, select: { id: true } })
  ).map((p) => p.id);

  // Get all orders that contain this supplier's products
  const orders = await db.order.findMany({
    where: { items: { some: { productId: { in: productIds } } } },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true, country: true } },
      items: { where: { productId: { in: productIds } } },
    },
    orderBy: { createdAt: "desc" },
  });

  // Group by customer
  const customerMap: Record<
    string,
    { user: { id: string; name: string | null; email: string; phone: string | null; country: string | null }; orderCount: number; totalSpent: number; lastOrderAt: Date }
  > = {};

  for (const order of orders) {
    const uid = order.userId;
    const spent = order.items.reduce((s, i) => s + i.quantity * i.price, 0);
    if (!customerMap[uid]) {
      customerMap[uid] = { user: order.user, orderCount: 0, totalSpent: 0, lastOrderAt: order.createdAt };
    }
    customerMap[uid].orderCount += 1;
    customerMap[uid].totalSpent += spent;
    if (order.createdAt > customerMap[uid].lastOrderAt) customerMap[uid].lastOrderAt = order.createdAt;
  }

  return Object.values(customerMap).sort((a, b) => b.totalSpent - a.totalSpent);
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export async function getSupplierAnalytics(period: "week" | "month" | "year" | "all" = "month") {
  const supplier = await getSupplier();

  const productIds = (
    await db.product.findMany({ where: { supplierId: supplier.id }, select: { id: true } })
  ).map((p) => p.id);

  const now = new Date();
  let since: Date | undefined;
  if (period === "week") since = new Date(now.getTime() - 7 * 86400000);
  else if (period === "month") since = new Date(now.getFullYear(), now.getMonth(), 1);
  else if (period === "year") since = new Date(now.getFullYear(), 0, 1);

  const [currentItems, prevItems, orders] = await Promise.all([
    db.orderItem.findMany({
      where: {
        productId: { in: productIds },
        ...(since ? { order: { createdAt: { gte: since } } } : {}),
      },
      include: { order: { select: { createdAt: true, status: true, userId: true } }, product: { select: { category: true } } },
    }),
    // Previous period for comparison
    db.orderItem.findMany({
      where: {
        productId: { in: productIds },
        ...(since
          ? {
              order: {
                createdAt: {
                  gte: new Date(since.getTime() - (now.getTime() - since.getTime())),
                  lt: since,
                },
              },
            }
          : {}),
      },
      include: { order: { select: { createdAt: true, status: true, userId: true } } },
    }),
    db.order.findMany({
      where: { items: { some: { productId: { in: productIds } } }, ...(since ? { createdAt: { gte: since } } : {}) },
      include: { items: { where: { productId: { in: productIds } } }, user: { select: { country: true } } },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  // Current period metrics
  const deliveredNow = currentItems.filter((i) => i.order.status === "DELIVERED");
  const revenue = deliveredNow.reduce((s, i) => s + i.quantity * i.price, 0);
  const orderCount = new Set(deliveredNow.map((i) => i.order.userId)).size; // unique customers

  // Previous period for delta
  const deliveredPrev = prevItems.filter((i) => i.order.status === "DELIVERED");
  const prevRevenue = deliveredPrev.reduce((s, i) => s + i.quantity * i.price, 0);
  const prevOrders = new Set(deliveredPrev.map((i) => i.order.userId)).size;

  // Category breakdown
  const catMap: Record<string, { revenue: number; orders: number }> = {};
  for (const item of deliveredNow) {
    const cat = item.product.category;
    if (!catMap[cat]) catMap[cat] = { revenue: 0, orders: 0 };
    catMap[cat].revenue += item.quantity * item.price;
    catMap[cat].orders += 1;
  }

  // Order trend (daily for week/month, monthly for year)
  const trendMap: Record<string, number> = {};
  for (const order of orders) {
    const key =
      period === "year"
        ? new Date(order.createdAt).toLocaleDateString("en-KE", { month: "short" })
        : new Date(order.createdAt).toLocaleDateString("en-KE", { month: "short", day: "numeric" });
    trendMap[key] = (trendMap[key] ?? 0) + 1;
  }

  return {
    revenue,
    revenueChange: prevRevenue ? ((revenue - prevRevenue) / prevRevenue) * 100 : 0,
    orderCount,
    orderCountChange: prevOrders ? ((orderCount - prevOrders) / prevOrders) * 100 : 0,
    avgOrderValue: revenue && orders.length > 0 ? revenue / orders.length : 0,
    categories: Object.entries(catMap)
      .map(([category, d]) => ({ category, ...d }))
      .sort((a, b) => b.revenue - a.revenue),
    trend: Object.entries(trendMap).map(([label, count]) => ({ label, count })),
  };
}

// ─── Dashboard overview ───────────────────────────────────────────────────────

export async function getSupplierDashboardStats() {
  const supplier = await getSupplier();

  const productIds = (
    await db.product.findMany({ where: { supplierId: supplier.id }, select: { id: true } })
  ).map((p) => p.id);

  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const lastMonthStart = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);

  const [allItems, monthItems, lastMonthItems, orders, productCount] = await Promise.all([
    db.orderItem.aggregate({ _sum: { price: true }, where: { productId: { in: productIds } } }),
    db.orderItem.findMany({
      where: { productId: { in: productIds }, order: { createdAt: { gte: monthStart } } },
      include: { order: { select: { status: true } } },
    }),
    db.orderItem.findMany({
      where: { productId: { in: productIds }, order: { createdAt: { gte: lastMonthStart, lt: monthStart } } },
      include: { order: { select: { status: true } } },
    }),
    db.order.findMany({
      where: { items: { some: { productId: { in: productIds } } } },
      include: { items: { where: { productId: { in: productIds } } }, user: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    db.product.count({ where: { supplierId: supplier.id } }),
  ]);

  const thisMonthRevenue = monthItems.filter((i) => i.order.status === "DELIVERED").reduce((s, i) => s + i.quantity * i.price, 0);
  const lastMonthRevenue = lastMonthItems.filter((i) => i.order.status === "DELIVERED").reduce((s, i) => s + i.quantity * i.price, 0);
  const revenueChange = lastMonthRevenue ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;

  const pendingRevenue = monthItems.filter((i) => ["PENDING", "CONFIRMED", "SHIPPED"].includes(i.order.status)).reduce((s, i) => s + i.quantity * i.price, 0);

  return {
    totalRevenue: allItems._sum.price ?? 0,
    thisMonthRevenue,
    lastMonthRevenue,
    revenueChange,
    pendingRevenue,
    productCount,
    activeOrderCount: orders.filter((o) => ["PENDING", "CONFIRMED", "SHIPPED"].includes(o.status)).length,
    rating: supplier.rating,
    recentOrders: orders,
  };
}
