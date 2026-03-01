"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { createNotification } from "@/lib/actions/notifications";

export async function getUserProfile() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return db.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, phone: true, country: true, image: true, role: true },
  });
}

export async function updateUserProfile(data: {
  name?: string;
  phone?: string;
  country?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const user = await db.user.update({
    where: { id: session.user.id },
    data: {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.phone !== undefined ? { phone: data.phone } : {}),
      ...(data.country !== undefined ? { country: data.country } : {}),
    },
    select: { id: true, name: true, email: true, phone: true, country: true },
  });

  revalidatePath("/farmer/settings");
  revalidatePath("/supplier/settings");
  revalidatePath("/lender/settings");
  await createNotification({ userId: session.user.id, title: "Profile Updated", message: "Your profile information has been saved.", type: "profile", link: `/${(session.user.role ?? "farmer").toLowerCase()}/settings` });
  return { success: true, user };
}

export async function updatePassword(currentPassword: string, newPassword: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  if (newPassword.length < 8) throw new Error("Password must be at least 8 characters");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { password: true },
  });

  if (!user?.password) throw new Error("No password set — use social login");

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) throw new Error("Current password is incorrect");

  const hashed = await bcrypt.hash(newPassword, 12);
  await db.user.update({ where: { id: session.user.id }, data: { password: hashed } });

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

  const supplier = await db.supplier.findUnique({ where: { userId: session.user.id } });
  if (!supplier) throw new Error("Supplier profile not found");

  const updated = await db.supplier.update({
    where: { id: supplier.id },
    data: {
      ...(data.companyName !== undefined ? { companyName: data.companyName } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
      ...(data.phone !== undefined ? { phone: data.phone } : {}),
      ...(data.address !== undefined ? { address: data.address } : {}),
      ...(data.website !== undefined ? { website: data.website } : {}),
    },
  });

  revalidatePath("/supplier/settings");
  return { success: true, supplier: updated };
}

export async function getSupplierProfile() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return db.supplier.findUnique({
    where: { userId: session.user.id },
    select: { companyName: true, description: true, phone: true, address: true, website: true, logoUrl: true, rating: true, isVerified: true },
  });
}

export async function updateAvatar(imageUrl: string | null) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db.user.update({
    where: { id: session.user.id },
    data: { image: imageUrl },
  });

  revalidatePath("/farmer/settings");
  revalidatePath("/supplier/settings");
  revalidatePath("/lender/settings");
  revalidatePath("/admin/settings");
  return { success: true, imageUrl };
}
