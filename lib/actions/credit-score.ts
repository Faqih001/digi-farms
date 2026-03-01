"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export interface CreditScoreResult {
  score: number;
  riskLevel: string;
  repaymentCapacity: number;
  farmViability: number;
  factors: {
    farmCompleteness: number;
    diagnosticActivity: number;
    paymentHistory: number;
    yieldPerformance: number;
    subscriptionStatus: number;
  };
  maxLoanEligible: number;
  calculatedAt: Date;
  isNew: boolean;
}

const WEIGHT = {
  farmCompleteness: 0.20,
  diagnosticActivity: 0.20,
  paymentHistory: 0.25,
  yieldPerformance: 0.20,
  subscriptionStatus: 0.15,
};

/** Compute a 300-850 credit score from the user's farming activity. */
async function computeScore(userId: string): Promise<CreditScoreResult> {
  const [farms, diagnostics, loans, crops, subscription] = await Promise.all([
    db.farm.findMany({ where: { userId } }),
    db.diagnostic.findMany({ where: { farm: { userId } }, orderBy: { createdAt: "desc" }, take: 50 }),
    db.loanApplication.findMany({ where: { userId } }),
    db.crop.findMany({ where: { farm: { userId } } }),
    db.subscription.findFirst({ where: { userId } }).catch(() => null),
  ]);

  // 1. Farm completeness (0–100)
  let farmCompleteness = 0;
  if (farms.length > 0) {
    const farm = farms[0];
    const fields = [farm.name, farm.location, farm.sizeHectares, farm.soilType, farm.waterSource, farm.description];
    const filled = fields.filter((v) => v !== null && v !== undefined && v !== "").length;
    farmCompleteness = Math.round((filled / fields.length) * 100);
    // Bonus for having crops
    if (crops.length >= 3) farmCompleteness = Math.min(100, farmCompleteness + 10);
  }

  // 2. Diagnostic activity (0–100): 5+ diagnostics in last 90 days = 100
  const recent = diagnostics.filter((d) => {
    const daysAgo = (Date.now() - new Date(d.createdAt).getTime()) / 86400000;
    return daysAgo <= 90;
  }).length;
  const diagnosticActivity = Math.min(100, recent * 20); // 5 = 100

  // 3. Payment history (0–100)
  let paymentHistory = 80; // default for no loan history
  if (loans.length > 0) {
    const repaid = loans.filter((l) => l.status === "REPAID").length;
    const defaulted = loans.filter((l) => l.status === "DEFAULTED").length;
    const approved = loans.filter((l) => ["APPROVED", "DISBURSED", "REPAID"].includes(l.status)).length;
    if (defaulted > 0) {
      paymentHistory = Math.max(20, 80 - defaulted * 25);
    } else if (repaid > 0) {
      paymentHistory = Math.min(100, 80 + repaid * 5);
    } else {
      paymentHistory = 75; // submitted but no repayment history yet
    }
  }

  // 4. Yield performance (0–100): compare actual vs expected yield
  let yieldPerformance = 50; // default
  const cropsWithYield = crops.filter((c) => c.expectedYield && c.actualYield);
  if (cropsWithYield.length > 0) {
    const ratios = cropsWithYield.map((c) => Math.min(1.2, c.actualYield! / c.expectedYield!));
    const avg = ratios.reduce((a, b) => a + b, 0) / ratios.length;
    yieldPerformance = Math.round(avg * 80); // 100% yield = 80 points
    if (cropsWithYield.length >= 3) yieldPerformance = Math.min(100, yieldPerformance + 10); // consistency bonus
  } else if (crops.length > 0) {
    yieldPerformance = 45; // has crops but no yield data yet
  }

  // 5. Subscription status (0–100)
  const hasSub = subscription?.status === "ACTIVE";
  const subscriptionStatus = hasSub ? 100 : 0;

  // Weighted raw score (0–100)
  const raw =
    farmCompleteness * WEIGHT.farmCompleteness +
    diagnosticActivity * WEIGHT.diagnosticActivity +
    paymentHistory * WEIGHT.paymentHistory +
    yieldPerformance * WEIGHT.yieldPerformance +
    subscriptionStatus * WEIGHT.subscriptionStatus;

  // Map 0-100 → 300-850
  const score = Math.round(300 + (raw / 100) * 550);

  const riskLevel =
    score >= 750 ? "Excellent" :
    score >= 700 ? "Very Good" :
    score >= 650 ? "Good" :
    score >= 600 ? "Fair" :
    score >= 550 ? "Poor" : "Very Poor";

  // Max loan eligibility (KES) — proportional
  const maxLoanEligible = Math.round(((score - 300) / 550) * 700000); // up to KES 700K

  const repaymentCapacity = Math.round(paymentHistory);
  const farmViability = Math.round((farmCompleteness * 0.5 + yieldPerformance * 0.5));

  return {
    score,
    riskLevel,
    repaymentCapacity,
    farmViability,
    factors: { farmCompleteness, diagnosticActivity, paymentHistory, yieldPerformance, subscriptionStatus },
    maxLoanEligible,
    calculatedAt: new Date(),
    isNew: false,
  };
}

export async function getCreditScore(): Promise<CreditScoreResult> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const userId = session.user.id;

  // Check for a cached score computed today
  const cached = await db.creditScore.findFirst({
    where: { userId },
    orderBy: { calculatedAt: "desc" },
  });

  const isStale =
    !cached ||
    Date.now() - new Date(cached.calculatedAt).getTime() > 24 * 60 * 60 * 1000; // older than 24h

  if (!isStale && cached) {
    const factors = (cached.factors as any) ?? {};
    return {
      score: cached.score,
      riskLevel: cached.riskLevel,
      repaymentCapacity: cached.repaymentCapacity ?? 75,
      farmViability: cached.farmViability ?? 60,
      factors: {
        farmCompleteness: factors.farmCompleteness ?? 0,
        diagnosticActivity: factors.diagnosticActivity ?? 0,
        paymentHistory: factors.paymentHistory ?? 80,
        yieldPerformance: factors.yieldPerformance ?? 50,
        subscriptionStatus: factors.subscriptionStatus ?? 0,
      },
      maxLoanEligible: factors.maxLoanEligible ?? Math.round(((cached.score - 300) / 550) * 700000),
      calculatedAt: cached.calculatedAt,
      isNew: false,
    };
  }

  const result = await computeScore(userId);

  // Upsert (delete old, create new to avoid unique constraint issues)
  await db.creditScore.create({
    data: {
      userId,
      score: result.score,
      riskLevel: result.riskLevel,
      repaymentCapacity: result.repaymentCapacity,
      farmViability: result.farmViability,
      factors: { ...result.factors, maxLoanEligible: result.maxLoanEligible },
      calculatedAt: result.calculatedAt,
    },
  });

  return { ...result, isNew: true };
}
