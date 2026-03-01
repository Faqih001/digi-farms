"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function getSoilReports() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const farms = await db.farm.findMany({
    where: { userId: session.user.id },
    select: { id: true, name: true },
  });

  if (farms.length === 0) return [];

  const reports = await db.soilReport.findMany({
    where: { farmId: { in: farms.map((f) => f.id) } },
    orderBy: { testedAt: "desc" },
    include: { farm: { select: { name: true } } },
  });

  return reports.map((r) => ({
    id: r.id,
    farmId: r.farmId,
    farmName: r.farm.name,
    ph: r.ph,
    nitrogen: r.nitrogen,
    phosphorus: r.phosphorus,
    potassium: r.potassium,
    organicMatter: r.organicMatter,
    moisture: r.moisture,
    recommendations: r.recommendations,
    testedAt: r.testedAt.toISOString(),
  }));
}

export async function createSoilReport(data: {
  farmId: string;
  ph?: number;
  nitrogen?: number;
  phosphorus?: number;
  potassium?: number;
  organicMatter?: number;
  moisture?: number;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const farm = await db.farm.findFirst({
    where: { id: data.farmId, userId: session.user.id },
  });
  if (!farm) throw new Error("Farm not found");

  // Generate recommendations using simple threshold logic
  const recs: string[] = [];
  if (data.ph != null) {
    if (data.ph < 5.5) recs.push("Soil is too acidic. Apply agricultural lime at 2 tons/acre to raise pH.");
    else if (data.ph > 7.5) recs.push("Soil is too alkaline. Apply sulphur or organic matter to lower pH.");
  }
  if (data.nitrogen != null && data.nitrogen < 40) recs.push("Nitrogen deficiency. Apply CAN fertilizer at 50kg/acre.");
  if (data.phosphorus != null && data.phosphorus < 30) recs.push("Low phosphorus. Apply DAP or TSP fertilizer.");
  if (data.potassium != null && data.potassium < 50) recs.push("Low potassium. Apply MOP (Muriate of Potash) fertilizer.");
  if (data.moisture != null && data.moisture < 30) recs.push("Very low soil moisture. Irrigate immediately.");

  const report = await db.soilReport.create({
    data: {
      farmId: data.farmId,
      ph: data.ph,
      nitrogen: data.nitrogen,
      phosphorus: data.phosphorus,
      potassium: data.potassium,
      organicMatter: data.organicMatter,
      moisture: data.moisture,
      recommendations: recs.length > 0 ? JSON.stringify(recs) : null,
    },
  });

  return report;
}

export async function deleteSoilReport(reportId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const report = await db.soilReport.findUnique({
    where: { id: reportId },
    include: { farm: { select: { userId: true } } },
  });
  if (!report || report.farm.userId !== session.user.id) throw new Error("Not authorized");

  await db.soilReport.delete({ where: { id: reportId } });
}
