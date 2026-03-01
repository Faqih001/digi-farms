"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { loanApplicationSchema } from "@/lib/validations";
import { z } from "zod";
import { createNotification } from "@/lib/actions/notifications";

export async function submitLoanApplication(data: z.infer<typeof loanApplicationSchema>) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const validated = loanApplicationSchema.parse(data);

  const application = await db.loanApplication.create({
    data: {
      ...validated,
      userId: session.user.id,
    },
  });

  await createNotification({
    userId: session.user.id,
    title: "Loan Application Submitted",
    message: `Your application for KES ${validated.amount.toLocaleString()} has been submitted and is under review.`,
    type: "loan",
    link: "/farmer/loans",
  });

  revalidatePath("/farmer/loans");
  return { success: true, application };
}

export async function updateLoanStatus(
  applicationId: string,
  status: "APPROVED" | "REJECTED" | "DISBURSED",
  notes?: string
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  if (session.user.role !== "LENDER" && session.user.role !== "ADMIN") throw new Error("Forbidden");

  const updated = await db.loanApplication.update({
    where: { id: applicationId },
    data: { status, notes },
  });

  const statusMsg: Record<string, string> = {
    APPROVED: "approved! Funds will be disbursed shortly.",
    REJECTED: "unfortunately rejected. Contact support for details.",
    DISBURSED: "disbursed to your account.",
  };
  await createNotification({
    userId: updated.userId,
    title: `Loan ${status.charAt(0) + status.slice(1).toLowerCase()}`,
    message: `Your loan application has been ${statusMsg[status] ?? status.toLowerCase()}.`,
    type: status === "APPROVED" || status === "DISBURSED" ? "success" : "error",
    link: "/farmer/loans",
  });

  revalidatePath("/lender/applications");
  return { success: true, application: updated };
}

export async function getFarmerLoans() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  return db.loanApplication.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
}

export async function cancelLoanApplication(applicationId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const existing = await db.loanApplication.findUnique({ where: { id: applicationId } });
  if (!existing || existing.userId !== session.user.id) throw new Error("Forbidden");
  if (!["DRAFT", "SUBMITTED"].includes(existing.status)) throw new Error("Cannot cancel at this stage");
  await db.loanApplication.delete({ where: { id: applicationId } });
  await createNotification({
    userId: session.user.id,
    title: "Loan Application Cancelled",
    message: "Your loan application has been cancelled.",
    type: "warning",
    link: "/farmer/loans",
  });
  revalidatePath("/farmer/loans");
  return { success: true };
}

export async function submitDraftLoan(applicationId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const existing = await db.loanApplication.findUnique({ where: { id: applicationId } });
  if (!existing || existing.userId !== session.user.id) throw new Error("Forbidden");
  if (existing.status !== "DRAFT") throw new Error("Only DRAFT applications can be submitted");

  const updated = await db.loanApplication.update({
    where: { id: applicationId },
    data: { status: "SUBMITTED" },
  });

  await createNotification({
    userId: session.user.id,
    title: "Loan Application Submitted",
    message: `Your application for KES ${existing.amount.toLocaleString()} has been submitted and is under review.`,
    type: "loan",
    link: "/farmer/loans",
  });

  revalidatePath("/farmer/loans");
  return { success: true, application: updated };
}

export async function getLenderApplications() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  if (session.user.role !== "LENDER" && session.user.role !== "ADMIN") throw new Error("Forbidden");

  return db.loanApplication.findMany({
    include: {
      user: {
        select: { name: true, email: true, farm: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}
