"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { formatPrismaError, retryAsync } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { createNotification } from "@/lib/actions/notifications";

// ─── Notification Preferences ─────────────────────────────────────────────────

export async function getNotificationPrefs() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const prefs = await retryAsync(() => db.notificationPreference.findUnique({
    where: { userId: session.user.id },
  })).catch(() => null);

  // Return defaults if no record yet
  return prefs ?? {
    emailEnabled: true,
    smsEnabled: false,
    pushEnabled: true,
    weatherAlerts: true,
    marketplaceAlerts: true,
    diagnosticAlerts: true,
  };
}

export async function updateNotificationPrefs(data: {
  emailEnabled?: boolean;
  smsEnabled?: boolean;
  pushEnabled?: boolean;
  weatherAlerts?: boolean;
  marketplaceAlerts?: boolean;
  diagnosticAlerts?: boolean;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  try {
    const prefs = await retryAsync(() => db.notificationPreference.upsert({
      where: { userId: session.user.id },
      create: { userId: session.user.id, ...data },
      update: data,
    }));
    revalidatePath("/farmer/settings");
    return { success: true, prefs };
  } catch (error) {
    console.error("prisma:error", formatPrismaError(error));
    throw new Error(formatPrismaError(error));
  }
}

// ─── Activity Log / Security ──────────────────────────────────────────────────

export async function getRecentActivity() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  return retryAsync(() => db.activityLog.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true,
      action: true,
      entity: true,
      ipAddress: true,
      userAgent: true,
      createdAt: true,
      metadata: true,
    },
  })).catch(() => []);
}

export async function getCurrentUserRole(): Promise<string | null> {
  const session = await auth();
  return (session?.user?.role as string) ?? null;
}

export async function getUserProfile() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return retryAsync(() => db.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, phone: true, country: true, image: true, role: true },
  })).catch(() => null);
}

export async function updateUserProfile(data: {
  name?: string;
  phone?: string;
  country?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  try {
    const user = await retryAsync(() => db.user.update({
      where: { id: session.user.id },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.phone !== undefined ? { phone: data.phone } : {}),
        ...(data.country !== undefined ? { country: data.country } : {}),
      },
      select: { id: true, name: true, email: true, phone: true, country: true },
    }));
    revalidatePath("/farmer/settings");
    revalidatePath("/supplier/settings");
    revalidatePath("/lender/settings");
    await createNotification({ userId: session.user.id, title: "Profile Updated", message: "Your profile information has been saved.", type: "profile", link: `/${(session.user.role ?? "farmer").toLowerCase()}/settings` });
    return { success: true, user };
  } catch (error) {
    console.error("prisma:error", formatPrismaError(error));
    throw new Error(formatPrismaError(error));
  }
}

export async function updatePassword(currentPassword: string, newPassword: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  if (newPassword.length < 8) throw new Error("Password must be at least 8 characters");

  const user = await retryAsync(() => db.user.findUnique({
    where: { id: session.user.id },
    select: { password: true },
  }));

  if (!user?.password) throw new Error("No password set — use social login");

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) throw new Error("Current password is incorrect");

  const hashed = await bcrypt.hash(newPassword, 12);
  try {
    await retryAsync(() => db.user.update({ where: { id: session.user.id }, data: { password: hashed } }));
    // Log the security event
    await retryAsync(() => db.activityLog.create({
      data: {
        userId: session.user.id,
        action: "PASSWORD_CHANGED",
        entity: "User",
        entityId: session.user.id,
        metadata: { timestamp: new Date().toISOString() },
      },
    })).catch(() => null);
  } catch (error) {
    console.error("prisma:error", formatPrismaError(error));
    throw new Error(formatPrismaError(error));
  }

  await createNotification({
    userId: session.user.id,
    title: "Password Changed",
    message: "Your account password was changed successfully. If this wasn't you, contact support immediately.",
    type: "warning",
  });

  return { success: true };
}

export async function updateSupplierProfile(data: {
  companyName?: string;
  description?: string;
  phone?: string;
  address?: string;
  website?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Try to fetch supplier with transient retry (Neon may occasionally timeout)
  const supplier = await retryAsync(() => db.supplier.findUnique({ where: { userId: session.user.id } }));
  if (!supplier) throw new Error("Supplier profile not found");

  try {
    const updated = await retryAsync(() => db.supplier.update({
      where: { id: supplier.id },
      data: {
        ...(data.companyName !== undefined ? { companyName: data.companyName } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.phone !== undefined ? { phone: data.phone } : {}),
        ...(data.address !== undefined ? { address: data.address } : {}),
        ...(data.website !== undefined ? { website: data.website } : {}),
      },
    }));

    revalidatePath("/supplier/settings");
    return { success: true, supplier: updated };
  } catch (error) {
    const info = formatPrismaError(error);
    try {
      // eslint-disable-next-line no-console
      console.error("prisma:error", info);
    } catch (logErr) {
      // eslint-disable-next-line no-console
      console.error("prisma:error (logging failed)", String(logErr));
    }
    throw error;
  }
}

export async function getSupplierProfile() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return retryAsync(() => db.supplier.findUnique({
    where: { userId: session.user.id },
    select: { companyName: true, description: true, phone: true, address: true, website: true, logoUrl: true, rating: true, isVerified: true, shippingSettings: true },
  })).catch(() => null);
}

export async function saveSupplierShipping(data: {
  shippingFee: number;
  freeShippingThreshold: number;
  deliveryDays: string;
  deliveryCounties: string[];
}) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };
  try {
    await retryAsync(() =>
      db.supplier.update({
        where: { userId: session.user.id },
        data: { shippingSettings: data },
      })
    );
    revalidatePath("/supplier/settings");
    return { success: true };
  } catch (error) {
    console.error("prisma:error", formatPrismaError(error));
    return { error: formatPrismaError(error) };
  }
}

export async function updateAvatar(imageUrl: string | null) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  try {
    await retryAsync(() => db.user.update({
      where: { id: session.user.id },
      data: { image: imageUrl },
    }));
  } catch (error) {
    console.error("prisma:error", formatPrismaError(error));
    throw new Error(formatPrismaError(error));
  }

  revalidatePath("/farmer/settings");
  revalidatePath("/supplier/settings");
  revalidatePath("/lender/settings");
  revalidatePath("/admin/settings");
  return { success: true, imageUrl };
}
