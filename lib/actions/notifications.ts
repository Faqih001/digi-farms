"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export type NotificationType =
  | "info"
  | "success"
  | "warning"
  | "error"
  | "order"
  | "loan"
  | "farm"
  | "diagnostic"
  | "product"
  | "profile";

// ─── Internal helper called from other server actions ─────────────────────────
// Intentionally not exported as a "use server" function since it's called
// server-side inside other server actions (not from the client).
export async function createNotification({
  userId,
  title,
  message,
  type = "info",
  link,
}: {
  userId: string;
  title: string;
  message: string;
  type?: NotificationType;
  link?: string;
}) {
  try {
    return await db.notification.create({
      data: { userId, title, message, type, link: link ?? null },
    });
  } catch {
    // Notification failures should never break the primary operation
    console.error("[notification] failed to create:", title);
    return null;
  }
}

// ─── Client-callable server actions ───────────────────────────────────────────
export async function getNotifications() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  return db.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 30,
  });
}

export async function getUnreadCount() {
  const session = await auth();
  if (!session?.user?.id) return 0;

  return db.notification.count({
    where: { userId: session.user.id, isRead: false },
  });
}

export async function markNotificationRead(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  return db.notification.update({
    where: { id, userId: session.user.id },
    data: { isRead: true },
  });
}

export async function markAllNotificationsRead() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db.notification.updateMany({
    where: { userId: session.user.id, isRead: false },
    data: { isRead: true },
  });

  return { success: true };
}

export async function deleteNotification(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db.notification.delete({
    where: { id, userId: session.user.id },
  });

  return { success: true };
}
