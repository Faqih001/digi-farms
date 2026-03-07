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

export async function getAdminOrders(filters?: { status?: string; search?: string }) {
  await requireAdmin();
  return db.order.findMany({
    where: {
      ...(filters?.status && filters.status !== "all" ? { status: filters.status as "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED" } : {}),
      ...(filters?.search
        ? {
            OR: [
              { id: { contains: filters.search, mode: "insensitive" } },
              { user: { name: { contains: filters.search, mode: "insensitive" } } },
              { user: { email: { contains: filters.search, mode: "insensitive" } } },
            ],
          }
        : {}),
    },
    include: {
      user: { select: { name: true, email: true } },
      items: { include: { product: { select: { name: true, supplierId: true } } } },
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
}

export async function updateAdminOrderStatus(
  orderId: string,
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED"
) {
  await requireAdmin();
  await db.order.update({ where: { id: orderId }, data: { status } });
  revalidatePath("/admin/orders");
  return { success: true };
}

export async function getSupportTickets(filters?: { status?: string; priority?: string }) {
  await requireAdmin();
  return db.supportTicket.findMany({
    where: {
      ...(filters?.status && filters.status !== "all" ? { status: filters.status as "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED" } : {}),
      ...(filters?.priority && filters.priority !== "all" ? { priority: filters.priority } : {}),
    },
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
}

export async function updateSupportTicketStatus(
  ticketId: string,
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED"
) {
  await requireAdmin();
  await db.supportTicket.update({
    where: { id: ticketId },
    data: {
      status,
      ...(status === "RESOLVED" || status === "CLOSED" ? { resolvedAt: new Date() } : {}),
    },
  });
  revalidatePath("/admin/support");
  return { success: true };
}

export async function getAdminSubscriptions() {
  await requireAdmin();
  return db.subscription.findMany({
    include: { user: { select: { name: true, email: true, role: true } } },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
}

export async function getRoleUserCounts(): Promise<Record<string, number>> {
  await requireAdmin();
  const counts = await db.user.groupBy({ by: ["role"], _count: { id: true } });
  const result: Record<string, number> = { FARMER: 0, SUPPLIER: 0, LENDER: 0, ADMIN: 0 };
  for (const c of counts) result[c.role] = c._count.id;
  return result;
}

export async function getAdminRevenueStats() {
  await requireAdmin();
  const [orderAgg, paymentAgg, activeSubCount, loanAgg] = await Promise.all([
    db.order.aggregate({ _sum: { totalAmount: true }, _count: { id: true } }),
    db.payment.aggregate({
      _sum: { amount: true },
      _count: { id: true },
      where: { status: "COMPLETED" },
    }),
    db.subscription.count({ where: { status: "ACTIVE" } }),
    db.loanApplication.aggregate({
      _sum: { amount: true },
      _count: { id: true },
      where: { status: { in: ["DISBURSED", "REPAID"] } },
    }),
  ]);
  return {
    totalOrderRevenue: orderAgg._sum.totalAmount ?? 0,
    totalOrders: orderAgg._count.id,
    totalPayments: paymentAgg._sum.amount ?? 0,
    completedPayments: paymentAgg._count.id,
    activeSubscriptions: activeSubCount,
    totalLoanVolume: loanAgg._sum.amount ?? 0,
    disbursedLoans: loanAgg._count.id,
  };
}

export async function getAdminRevenuePlatform() {
  await requireAdmin();
  return db.platformRevenue.findMany({ orderBy: { createdAt: "desc" }, take: 500 });
}

export async function getPartnerships() {
  await requireAdmin();
  return db.partnership.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createPartnership(data: {
  name: string;
  type: string;
  tier?: string;
  contactName?: string;
  contactEmail?: string;
  country?: string;
  notes?: string;
}) {
  await requireAdmin();
  const partner = await db.partnership.create({ data });
  revalidatePath("/admin/partnerships");
  return { success: true, partner };
}

export async function updatePartnership(
  id: string,
  data: Partial<{
    name: string;
    type: string;
    tier: string;
    contactName: string;
    contactEmail: string;
    country: string;
    isActive: boolean;
    revenue: number;
    notes: string;
  }>
) {
  await requireAdmin();
  const partner = await db.partnership.update({ where: { id }, data });
  revalidatePath("/admin/partnerships");
  return { success: true, partner };
}

export async function deletePartnership(id: string) {
  await requireAdmin();
  await db.partnership.delete({ where: { id } });
  revalidatePath("/admin/partnerships");
  return { success: true };
}

export async function getActivityLogs(filters?: { search?: string; limit?: number }) {
  await requireAdmin();
  return db.activityLog.findMany({
    where: filters?.search
      ? {
          OR: [
            { action: { contains: filters.search, mode: "insensitive" } },
            { entity: { contains: filters.search, mode: "insensitive" } },
            { user: { email: { contains: filters.search, mode: "insensitive" } } },
          ],
        }
      : undefined,
    include: { user: { select: { email: true, name: true, role: true } } },
    orderBy: { createdAt: "desc" },
    take: filters?.limit ?? 200,
  });
}

