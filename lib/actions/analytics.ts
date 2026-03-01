"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function getYieldAnalytics(startDate?: string, endDate?: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const farms = await db.farm.findMany({
    where: { userId: session.user.id },
    select: { id: true },
  });
  if (farms.length === 0) return { crops: [], yieldByMonth: [], revenueByMonth: [], stats: { totalYield: 0, totalRevenue: 0, bestCrop: "–", avgYieldPerHa: 0, cropCount: 0 } };

  const farmIds = farms.map((f) => f.id);

  const dateFilter = startDate && endDate
    ? { gte: new Date(startDate), lte: new Date(endDate) }
    : undefined;

  // Get all crops for the user's farms
  const crops = await db.crop.findMany({
    where: {
      farmId: { in: farmIds },
      ...(dateFilter ? { plantedAt: dateFilter } : {}),
    },
    orderBy: { plantedAt: "asc" },
  });

  // Build monthly yield grouped by crop name
  const yieldMap = new Map<string, Map<string, number>>();
  const cropNames = new Set<string>();
  for (const c of crops) {
    if (c.actualYield == null) continue;
    cropNames.add(c.name);
    const month = c.plantedAt.toLocaleString("en", { month: "short" });
    if (!yieldMap.has(month)) yieldMap.set(month, new Map());
    const m = yieldMap.get(month)!;
    m.set(c.name, (m.get(c.name) ?? 0) + c.actualYield);
  }
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const yieldByMonth = months
    .filter((m) => yieldMap.has(m))
    .map((month) => {
      const entry: Record<string, string | number> = { month };
      const m = yieldMap.get(month)!;
      for (const name of cropNames) entry[name] = m.get(name) ?? 0;
      return entry;
    });

  // Revenue from orders
  const orders = await db.order.findMany({
    where: {
      userId: session.user.id,
      status: { not: "CANCELLED" },
      ...(dateFilter ? { createdAt: dateFilter } : {}),
    },
    orderBy: { createdAt: "asc" },
  });

  const revMap = new Map<string, number>();
  for (const o of orders) {
    const month = o.createdAt.toLocaleString("en", { month: "short" });
    revMap.set(month, (revMap.get(month) ?? 0) + o.totalAmount);
  }
  const revenueByMonth = months
    .filter((m) => revMap.has(m))
    .map((month) => ({ month, revenue: revMap.get(month)! }));

  // Stats
  const totalYield = crops.reduce((s, c) => s + (c.actualYield ?? 0), 0);
  const totalHa = crops.reduce((s, c) => s + c.areaHectares, 0);
  const totalRevenue = orders.reduce((s, o) => s + o.totalAmount, 0);

  // Best crop by total yield
  const yieldByCrop = new Map<string, number>();
  for (const c of crops) {
    if (c.actualYield == null) continue;
    yieldByCrop.set(c.name, (yieldByCrop.get(c.name) ?? 0) + c.actualYield);
  }
  const bestCrop = [...yieldByCrop.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "–";

  return {
    crops: [...cropNames],
    yieldByMonth,
    revenueByMonth,
    cropsRaw: crops,
    stats: {
      totalYield: Math.round(totalYield),
      totalRevenue: Math.round(totalRevenue),
      bestCrop,
      avgYieldPerHa: totalHa > 0 ? Math.round(totalYield / totalHa) : 0,
      cropCount: crops.length,
    },
  };
}

export async function getYieldAnalytics() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const farms = await db.farm.findMany({
    where: { userId: session.user.id },
    select: { id: true },
  });
  if (farms.length === 0) return { crops: [], yieldByMonth: [], revenueByMonth: [], stats: { totalYield: 0, totalRevenue: 0, bestCrop: "–", avgYieldPerHa: 0, cropCount: 0 } };

  const farmIds = farms.map((f) => f.id);

  // Get all crops for the user's farms
  const crops = await db.crop.findMany({
    where: { farmId: { in: farmIds } },
    orderBy: { plantedAt: "desc" },
  });

  // Build monthly yield grouped by crop name
  const yieldMap = new Map<string, Map<string, number>>();
  const cropNames = new Set<string>();
  for (const c of crops) {
    if (c.actualYield == null) continue;
    cropNames.add(c.name);
    const month = c.plantedAt.toLocaleString("en", { month: "short" });
    if (!yieldMap.has(month)) yieldMap.set(month, new Map());
    const m = yieldMap.get(month)!;
    m.set(c.name, (m.get(c.name) ?? 0) + c.actualYield);
  }
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const yieldByMonth = months
    .filter((m) => yieldMap.has(m))
    .map((month) => {
      const entry: Record<string, string | number> = { month };
      const m = yieldMap.get(month)!;
      for (const name of cropNames) entry[name] = m.get(name) ?? 0;
      return entry;
    });

  // Revenue from orders
  const orders = await db.order.findMany({
    where: { userId: session.user.id, status: { not: "CANCELLED" } },
    orderBy: { createdAt: "asc" },
  });

  const revMap = new Map<string, number>();
  for (const o of orders) {
    const month = o.createdAt.toLocaleString("en", { month: "short" });
    revMap.set(month, (revMap.get(month) ?? 0) + o.totalAmount);
  }
  const revenueByMonth = months
    .filter((m) => revMap.has(m))
    .map((month) => ({ month, revenue: revMap.get(month)! }));

  // Stats
  const totalYield = crops.reduce((s, c) => s + (c.actualYield ?? 0), 0);
  const totalHa = crops.reduce((s, c) => s + c.areaHectares, 0);
  const totalRevenue = orders.reduce((s, o) => s + o.totalAmount, 0);

  // Best crop by total yield
  const yieldByCrop = new Map<string, number>();
  for (const c of crops) {
    if (c.actualYield == null) continue;
    yieldByCrop.set(c.name, (yieldByCrop.get(c.name) ?? 0) + c.actualYield);
  }
  const bestCrop = [...yieldByCrop.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "–";

  return {
    crops: [...cropNames],
    yieldByMonth,
    revenueByMonth,
    stats: {
      totalYield: Math.round(totalYield),
      totalRevenue: Math.round(totalRevenue),
      bestCrop,
      avgYieldPerHa: totalHa > 0 ? Math.round(totalYield / totalHa) : 0,
      cropCount: crops.length,
    },
  };
}
