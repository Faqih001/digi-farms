"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { formatPrismaError, retryAsync } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { LoanStatus, ClaimStatus } from "@prisma/client";

// ─── Analytics ────────────────────────────────────────────────────────────────

export async function getLenderAnalytics() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const [
    totalLoans,
    defaultedLoans,
    activeLoans,
    creditScores,
    loansByStatus,
    recentLoans,
  ] = await Promise.all([
    retryAsync(() => db.loanApplication.count()),
    retryAsync(() => db.loanApplication.count({ where: { status: "DEFAULTED" } })),
    retryAsync(() => db.loanApplication.count({ where: { status: { in: ["DISBURSED", "APPROVED"] } } })),
    retryAsync(() => db.creditScore.findMany({
      orderBy: { calculatedAt: "desc" },
      take: 200,
      select: { score: true, riskLevel: true, userId: true },
      distinct: ["userId"],
    })),
    retryAsync(() => db.loanApplication.groupBy({
      by: ["status"],
      _count: { status: true },
      _sum: { amount: true },
    })),
    retryAsync(() => db.loanApplication.findMany({
      take: 6,
      orderBy: { createdAt: "asc" },
      select: { createdAt: true, status: true, amount: true },
    })),
  ]);

  const avgCreditScore =
    creditScores.length > 0
      ? creditScores.reduce((s, c) => s + c.score, 0) / creditScores.length
      : 0;

  const defaultRate = totalLoans > 0 ? (defaultedLoans / totalLoans) * 100 : 0;

  // Group credit scores by risk level
  const riskDistribution = creditScores.reduce(
    (acc, cs) => {
      const key = cs.riskLevel?.toLowerCase() ?? "unknown";
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return {
    totalLoans,
    defaultedLoans,
    activeLoans,
    avgCreditScore: Math.round(avgCreditScore * 10) / 10,
    defaultRate: Math.round(defaultRate * 10) / 10,
    loansByStatus,
    riskDistribution,
    recentLoans,
  };
}

// ─── Revenue ──────────────────────────────────────────────────────────────────

export async function getLenderRevenue() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Get loan payments grouped by month (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const [payments, loanStats] = await Promise.all([
    retryAsync(() =>
      db.payment.findMany({
        where: {
          loanId: { not: null },
          status: "COMPLETED",
          createdAt: { gte: sixMonthsAgo },
        },
        select: { amount: true, createdAt: true, loanId: true },
        orderBy: { createdAt: "asc" },
      })
    ),
    retryAsync(() =>
      db.loanApplication.aggregate({
        _sum: { amount: true, approvedAmount: true },
        _avg: { interestRate: true },
        _count: { id: true },
      })
    ),
  ]);

  // Group payments by month
  const byMonth: Record<string, { payments: number; total: number }> = {};
  for (const p of payments) {
    const key = p.createdAt.toISOString().slice(0, 7); // "YYYY-MM"
    if (!byMonth[key]) byMonth[key] = { payments: 0, total: 0 };
    byMonth[key].payments += 1;
    byMonth[key].total += p.amount;
  }

  const monthlyData = Object.entries(byMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => ({
      month,
      totalRepaid: data.total,
      paymentCount: data.payments,
      // Estimate interest portion as ~5% of repaid (interest embedded in payment)
      interestEstimate: data.total * 0.05,
    }));

  return {
    monthlyData,
    totalDisbursed: loanStats._sum.amount ?? 0,
    totalApproved: loanStats._sum.approvedAmount ?? 0,
    avgInterestRate: loanStats._avg.interestRate ?? 0,
    totalLoanCount: loanStats._count.id,
    totalRepaid: payments.reduce((s, p) => s + p.amount, 0),
  };
}

// ─── Claims ───────────────────────────────────────────────────────────────────

export async function getLenderClaims(filters?: { status?: ClaimStatus; search?: string }) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const claims = await retryAsync(() =>
    db.insuranceClaim.findMany({
      where: {
        ...(filters?.status ? { status: filters.status } : {}),
        ...(filters?.search
          ? {
              OR: [
                { farmerName: { contains: filters.search, mode: "insensitive" } },
                { type: { contains: filters.search, mode: "insensitive" } },
                { insurer: { contains: filters.search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
      include: { loanApplication: { select: { id: true, amount: true, status: true } } },
    })
  );

  const [total, underReview, approved, totalPaidOut] = await Promise.all([
    retryAsync(() => db.insuranceClaim.count()),
    retryAsync(() => db.insuranceClaim.count({ where: { status: "UNDER_REVIEW" } })),
    retryAsync(() => db.insuranceClaim.count({ where: { status: "APPROVED" } })),
    retryAsync(() =>
      db.insuranceClaim.aggregate({
        where: { status: { in: ["APPROVED", "SETTLED"] } },
        _sum: { amount: true },
      })
    ),
  ]);

  return {
    claims,
    stats: {
      total,
      underReview,
      approved,
      totalPaidOut: totalPaidOut._sum.amount ?? 0,
    },
  };
}

export async function updateClaimStatus(
  id: string,
  status: ClaimStatus,
  notes?: string
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  try {
    const claim = await retryAsync(() =>
      db.insuranceClaim.update({
        where: { id },
        data: {
          status,
          resolvedAt: ["APPROVED", "REJECTED", "SETTLED"].includes(status)
            ? new Date()
            : undefined,
        },
      })
    );
    revalidatePath("/lender/claims");
    return { success: true, claim };
  } catch (error) {
    throw new Error(formatPrismaError(error).message);
  }
}

export async function createClaim(data: {
  farmerId: string;
  farmerName: string;
  type: string;
  description: string;
  amount: number;
  insurer?: string;
  loanId?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  try {
    const claim = await retryAsync(() =>
      db.insuranceClaim.create({
        data: {
          farmerId: data.farmerId,
          farmerName: data.farmerName,
          type: data.type,
          description: data.description,
          amount: data.amount,
          insurer: data.insurer,
          loanId: data.loanId,
          status: "FILED",
          evidenceUrls: [],
        },
      })
    );
    revalidatePath("/lender/claims");
    return { success: true, claim };
  } catch (error) {
    throw new Error(formatPrismaError(error).message);
  }
}

export async function deleteClaim(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  try {
    await retryAsync(() => db.insuranceClaim.delete({ where: { id } }));
    revalidatePath("/lender/claims");
    return { success: true };
  } catch (error) {
    throw new Error(formatPrismaError(error).message);
  }
}

// ─── Portfolio ────────────────────────────────────────────────────────────────

export async function getLenderPortfolio(filters?: {
  status?: LoanStatus;
  search?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const statusFilter: LoanStatus[] = filters?.status
    ? [filters.status]
    : ["DISBURSED", "APPROVED", "REPAID", "DEFAULTED"];

  const loans = await retryAsync(() =>
    db.loanApplication.findMany({
      where: {
        status: { in: statusFilter },
        ...(filters?.search
          ? {
              OR: [
                { user: { name: { contains: filters.search, mode: "insensitive" } } },
                { purpose: { contains: filters.search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            farm: { select: { name: true, location: true } },
          },
        },
        payments: {
          where: { status: "COMPLETED" },
          select: { amount: true },
        },
      },
    })
  );

  const [activeCount, overdueLoans, totalDisbursed] = await Promise.all([
    retryAsync(() => db.loanApplication.count({ where: { status: "DISBURSED" } })),
    retryAsync(() =>
      db.loanApplication.findMany({
        where: { status: "DISBURSED", dueDate: { lt: new Date() } },
        select: { id: true },
      })
    ),
    retryAsync(() =>
      db.loanApplication.aggregate({
        where: { status: { in: ["DISBURSED", "REPAID"] } },
        _sum: { approvedAmount: true, amount: true },
      })
    ),
  ]);

  const loansWithProgress = loans.map((l) => {
    const totalPaid = l.payments.reduce((s, p) => s + p.amount, 0);
    const principal = l.approvedAmount ?? l.amount;
    const pct = principal > 0 ? Math.min((totalPaid / principal) * 100, 100) : 0;
    return { ...l, totalPaid, repaymentPct: Math.round(pct * 10) / 10 };
  });

  return {
    loans: loansWithProgress,
    stats: {
      activeCount,
      overdueCount: overdueLoans.length,
      totalDisbursed: totalDisbursed._sum.approvedAmount ?? totalDisbursed._sum.amount ?? 0,
    },
  };
}

export async function updateLoanStatus(
  id: string,
  status: LoanStatus,
  notes?: string
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  try {
    const loan = await retryAsync(() =>
      db.loanApplication.update({
        where: { id },
        data: {
          status,
          notes: notes ?? undefined,
          ...(status === "DISBURSED" ? { disbursedAt: new Date() } : {}),
          ...(status === "REPAID" ? { repaidAt: new Date() } : {}),
        },
      })
    );
    revalidatePath("/lender/portfolio");
    return { success: true, loan };
  } catch (error) {
    throw new Error(formatPrismaError(error).message);
  }
}

// ─── Underwriting ─────────────────────────────────────────────────────────────

export async function getUnderwritingQueue() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const applications = await retryAsync(() =>
    db.loanApplication.findMany({
      where: { status: { in: ["SUBMITTED", "UNDER_REVIEW"] } },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            farm: { select: { name: true, location: true, sizeHectares: true } },
            creditScores: {
              orderBy: { calculatedAt: "desc" },
              take: 1,
              select: { score: true, riskLevel: true, repaymentCapacity: true, farmViability: true },
            },
          },
        },
      },
    })
  );

  const [totalDecisions, autoApproved, manualReview] = await Promise.all([
    retryAsync(() =>
      db.loanApplication.count({ where: { status: { in: ["APPROVED", "REJECTED"] } } })
    ),
    retryAsync(() => db.loanApplication.count({ where: { status: "APPROVED" } })),
    retryAsync(() => db.loanApplication.count({ where: { status: "UNDER_REVIEW" } })),
  ]);

  return {
    applications,
    stats: {
      totalDecisions,
      autoApproved,
      manualReview,
      pending: applications.length,
    },
  };
}

export async function approveApplication(
  id: string,
  approvedAmount: number,
  interestRate: number,
  notes?: string
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  try {
    const loan = await retryAsync(() =>
      db.loanApplication.update({
        where: { id },
        data: {
          status: "APPROVED",
          approvedAmount,
          interestRate,
          notes: notes ?? undefined,
          dueDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        },
      })
    );
    revalidatePath("/lender/underwriting");
    revalidatePath("/lender/portfolio");
    return { success: true, loan };
  } catch (error) {
    throw new Error(formatPrismaError(error).message);
  }
}

export async function rejectApplication(id: string, notes: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  try {
    const loan = await retryAsync(() =>
      db.loanApplication.update({
        where: { id },
        data: { status: "REJECTED", notes },
      })
    );
    revalidatePath("/lender/underwriting");
    return { success: true, loan };
  } catch (error) {
    throw new Error(formatPrismaError(error).message);
  }
}

export async function setUnderReview(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  try {
    const loan = await retryAsync(() =>
      db.loanApplication.update({
        where: { id },
        data: { status: "UNDER_REVIEW" },
      })
    );
    revalidatePath("/lender/underwriting");
    return { success: true, loan };
  } catch (error) {
    throw new Error(formatPrismaError(error).message);
  }
}

// ─── Forecasts ────────────────────────────────────────────────────────────────

export async function getLenderForecasts(search?: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const forecasts = await retryAsync(() =>
    db.yieldForecast.findMany({
      where: search
        ? {
            OR: [
              { cropName: { contains: search, mode: "insensitive" } },
              { season: { contains: search, mode: "insensitive" } },
              { farm: { location: { contains: search, mode: "insensitive" } } },
            ],
          }
        : {},
      orderBy: { forecastDate: "desc" },
      include: {
        farm: {
          select: {
            name: true,
            location: true,
            sizeHectares: true,
            user: { select: { name: true, id: true } },
          },
        },
      },
    })
  );

  const stats = {
    total: forecasts.length,
    avgConfidence:
      forecasts.length > 0
        ? forecasts.reduce((s, f) => s + (f.confidence ?? 0), 0) / forecasts.length
        : 0,
    highRisk: forecasts.filter((f) => (f.healthScore ?? 0) < 50).length,
    goodMoisture: forecasts.filter((f) => (f.moisture ?? 0) >= 50).length,
  };

  return { forecasts, stats };
}

export async function createForecast(data: {
  farmId: string;
  cropName: string;
  season: string;
  predictedYield: number;
  confidence?: number;
  moisture?: number;
  healthScore?: number;
  factors?: Record<string, unknown>;
  forecastDate: Date;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const { factors, ...rest } = data;
  try {
    const forecast = await retryAsync(() =>
      db.yieldForecast.create({
        data: {
          ...rest,
          ...(factors !== undefined ? { factors: factors as object } : {}),
        },
      })
    );
    revalidatePath("/lender/forecasts");
    return { success: true, forecast };
  } catch (error) {
    throw new Error(formatPrismaError(error).message);
  }
}

export async function deleteForecast(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  try {
    await retryAsync(() => db.yieldForecast.delete({ where: { id } }));
    revalidatePath("/lender/forecasts");
    return { success: true };
  } catch (error) {
    throw new Error(formatPrismaError(error).message);
  }
}

// ─── Risk Profiles ────────────────────────────────────────────────────────────

export async function getRiskProfiles(filters?: { riskLevel?: string; search?: string }) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Get latest credit score per user
  const scores = await retryAsync(() =>
    db.creditScore.findMany({
      orderBy: { calculatedAt: "desc" },
      distinct: ["userId"],
      where: filters?.riskLevel
        ? { riskLevel: { equals: filters.riskLevel, mode: "insensitive" } }
        : {},
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            farm: {
              select: {
                name: true,
                location: true,
                sizeHectares: true,
                crops: { select: { name: true }, take: 3 },
              },
            },
            loanApplications: {
              select: { id: true, status: true, amount: true },
            },
          },
        },
      },
    })
  );

  const filtered = filters?.search
    ? scores.filter(
        (s) =>
          s.user?.name?.toLowerCase().includes(filters.search!.toLowerCase()) ||
          s.user?.farm?.name?.toLowerCase().includes(filters.search!.toLowerCase()) ||
          s.user?.farm?.location?.toLowerCase().includes(filters.search!.toLowerCase())
      )
    : scores;

  const stats = {
    total: filtered.length,
    low: filtered.filter((s) => s.riskLevel?.toLowerCase() === "low").length,
    medium: filtered.filter((s) => s.riskLevel?.toLowerCase() === "medium").length,
    high: filtered.filter((s) => s.riskLevel?.toLowerCase() === "high").length,
  };

  return { profiles: filtered, stats };
}

export async function recalculateCreditScore(userId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Gather data for score calculation
  const [loans, farm] = await Promise.all([
    retryAsync(() =>
      db.loanApplication.findMany({
        where: { userId },
        select: { status: true, amount: true, riskScore: true },
      })
    ),
    retryAsync(() =>
      db.farm.findUnique({
        where: { userId },
        select: { sizeHectares: true, crops: { select: { status: true } } },
      })
    ),
  ]);

  const totalLoans = loans.length;
  const defaults = loans.filter((l) => l.status === "DEFAULTED").length;
  const repaid = loans.filter((l) => l.status === "REPAID").length;
  const repaymentRate = totalLoans > 0 ? (repaid / totalLoans) * 100 : 50;
  const defaultPenalty = defaults * 15;
  const farmSize = farm?.sizeHectares ?? 0;
  const farmBonus = Math.min(farmSize * 2, 20);
  const healthyCrops = farm?.crops.filter((c) => c.status === "HEALTHY").length ?? 0;
  const cropBonus = Math.min(healthyCrops * 3, 15);

  const rawScore = Math.min(
    Math.max(repaymentRate * 0.6 + farmBonus + cropBonus - defaultPenalty + 20, 10),
    100
  );
  const score = Math.round(rawScore);
  const riskLevel =
    score >= 75 ? "Low" : score >= 55 ? "Medium" : "High";

  try {
    const cs = await retryAsync(() =>
      db.creditScore.create({
        data: {
          userId,
          score,
          riskLevel,
          repaymentCapacity: Math.min(repaymentRate * 0.8, 100),
          farmViability: Math.min(farmBonus * 4, 100),
          factors: { totalLoans, defaults, repaid, farmSize, healthyCrops },
          calculatedAt: new Date(),
        },
      })
    );
    revalidatePath("/lender/risk-profiles");
    return { success: true, score: cs };
  } catch (error) {
    throw new Error(formatPrismaError(error).message);
  }
}

export async function getFarmsForSelect() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const farms = await retryAsync(() =>
    db.farm.findMany({
      select: { id: true, name: true, location: true, user: { select: { name: true } } },
      take: 100,
    })
  );
  return farms;
}

export async function getFarmersForSelect() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const farmers = await retryAsync(() =>
    db.user.findMany({
      where: { role: "FARMER" },
      select: { id: true, name: true, email: true },
      take: 100,
    })
  );
  return farmers;
}
