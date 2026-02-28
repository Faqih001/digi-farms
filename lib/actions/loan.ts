"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { loanApplicationSchema } from "@/lib/validations";
import { z } from "zod";

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
  revalidatePath("/farmer/loans");
  return { success: true };
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
