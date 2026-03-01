import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import {
  Sprout, ScanLine, TrendingUp, Droplets, CloudSun, ShoppingBag,
  AlertTriangle, CheckCircle, Clock, ArrowRight, Zap
} from "lucide-react";

type Period = "today" | "week" | "month" | "year";

function getPeriodRange(period: Period) {
  const now = new Date();
  const start = new Date(now);
  if (period === "today") { start.setHours(0, 0, 0, 0); }
  else if (period === "week") { start.setDate(now.getDate() - 7); }
  else if (period === "month") { start.setMonth(now.getMonth() - 1); }
  else { start.setFullYear(now.getFullYear() - 1); }
  return { gte: start, lte: now };
}

export default async function FarmerOverviewPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { period: rawPeriod } = await searchParams;
  const period: Period = (["today", "week", "month", "year"].includes(rawPeriod ?? "") ? rawPeriod : "month") as Period;
  const dateRange = getPeriodRange(period);

  const userId = (session.user as { id: string }).id;

  const [farms, recentScans, crops, loanAlerts, soilAlerts] = await Promise.all([
    db.farm.findMany({ where: { userId }, take: 5, include: { crops: { take: 1 } } }),
    db.diagnostic.findMany({
      where: { farm: { userId }, createdAt: dateRange },
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { farm: true },
    }),
    db.crop.findMany({ where: { farm: { userId } }, take: 6, orderBy: { plantedAt: "desc" } }),
    db.loanApplication.findMany({
      where: { userId, status: { in: ["SUBMITTED", "UNDER_REVIEW", "APPROVED"] } },
      orderBy: { updatedAt: "desc" },
      take: 3,
    }),
    db.soilReport.findMany({
      where: { farm: { userId }, testedAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
      take: 3,
      orderBy: { testedAt: "desc" },
    }),
  ]);

  type Farm = Awaited<ReturnType<typeof db.farm.findMany>>[number];
  type Crop = Awaited<ReturnType<typeof db.crop.findMany>>[number];

  const totalHectares = farms.reduce((s: number, f: Farm) => s + ((f as any).sizeHectares ?? 0), 0);
  const activeCrops = crops.filter((c: Crop) => c.status === "HEALTHY").length;

  // Build real alerts from DB data
  const alerts: { icon: typeof AlertTriangle; label: string; type: "warning" | "info" | "success"; time: string }[] = [];
  if (soilAlerts.some((r) => r.ph != null && (r.ph < 5.5 || r.ph > 7.5))) {
    alerts.push({ icon: AlertTriangle, label: "Soil pH out of optimal range detected", type: "warning", time: "Recent analysis" });
  }
  if (loanAlerts.find((l) => l.status === "APPROVED")) {
    alerts.push({ icon: CheckCircle, label: "Loan application approved — check financing", type: "success", time: "Check financing" });
  }
  if (loanAlerts.find((l) => ["SUBMITTED", "UNDER_REVIEW"].includes(l.status))) {
    alerts.push({ icon: Clock, label: "Loan under review", type: "info", time: "Pending" });
  }
  if (recentScans.some((s: any) => s.severity === "HIGH")) {
    alerts.push({ icon: AlertTriangle, label: "High severity disease detected in recent scan", type: "warning", time: "Check scans" });
  }
  // Fallback placeholder alerts if no real data
  if (alerts.length === 0) {
    alerts.push(
      { icon: Droplets, label: "Check soil moisture levels", type: "info", time: "Today" },
      { icon: Sprout, label: "Add crop data to track yield analytics", type: "info", time: "Tip" },
    );
  }

  const PERIODS: { label: string; value: Period }[] = [
    { label: "Today", value: "today" },
    { label: "Week", value: "week" },
    { label: "Month", value: "month" },
    { label: "Year", value: "year" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-2xl p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black mb-1">Welcome back, {session.user.name?.split(" ")[0]}! 👋</h2>
            <p className="text-green-200/80 text-sm">Here&apos;s your farm at a glance</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {PERIODS.map(({ label, value }) => (
              <Link
                key={value}
                href={`/farmer?period=${value}`}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${period === value ? "bg-white text-green-700 shadow" : "bg-green-700/40 text-green-100 hover:bg-green-700/60"}`}
              >
                {label}
              </Link>
            ))}
            <Link href="/farmer/diagnostics">
              <Button variant="hero" size="sm"><ScanLine className="w-4 h-4 mr-1" /> New Scan</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Sprout, label: "Total Farms", value: farms.length, sub: `${totalHectares.toFixed(1)} ha`, color: "text-green-600" },
          { icon: TrendingUp, label: "Active Crops", value: activeCrops, sub: `${crops.length} total`, color: "text-blue-600" },
          { icon: ScanLine, label: `Scans (${PERIODS.find(p => p.value === period)?.label})`, value: recentScans.length, sub: "diagnostic scans", color: "text-purple-600" },
          { icon: CheckCircle, label: "Healthy Crops", value: `${crops.length ? Math.round((activeCrops / crops.length) * 100) : 0}%`, sub: "of all crops", color: "text-amber-600" },
        ].map(({ icon: Icon, label, value, sub, color }) => (
          <Card key={label} className="p-4">
            <CardContent className="p-0 flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">{value}</div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</div>
                <div className="text-xs text-slate-400">{sub}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Active Crops */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Active Crops</CardTitle>
            <Button variant="ghost" size="sm" asChild><Link href="/farmer/analytics">View All <ArrowRight className="w-3 h-3" /></Link></Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {crops.slice(0, 4).length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Sprout className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No crops yet. <Link href="/farmer/farm" className="text-green-600 hover:underline">Add your farm</Link></p>
              </div>
            ) : crops.slice(0, 4).map((crop: any) => (
              <div key={crop.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Sprout className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-slate-900 dark:text-white truncate">{crop.name}</div>
                  <div className="text-xs text-slate-400">{crop.variety || "—"} · {crop.areaHectares ? `${crop.areaHectares} ha` : "—"}</div>
                </div>
                <Badge variant={crop.status === "HEALTHY" ? "success" : crop.status === "DISEASED" ? "destructive" : "warning"} className="text-xs">{crop.status}</Badge>
              </div>
            ))}
            {crops.length === 0 && null}
          </CardContent>
        </Card>

        {/* Alerts & Tasks */}
        <Card>
          <CardHeader><CardTitle className="text-base">Alerts & Tasks</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {alerts.map(({ icon: Icon, label, type, time }, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${type === "warning" ? "text-amber-500" : type === "success" ? "text-green-500" : "text-blue-500"}`} />
                <div>
                  <div className="text-sm text-slate-700 dark:text-slate-300">{label}</div>
                  <div className="text-xs text-slate-400">{time}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Scans */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Recent Diagnostic Scans</CardTitle>
          <Button variant="ghost" size="sm" asChild><Link href="/farmer/scans">View History <ArrowRight className="w-3 h-3" /></Link></Button>
        </CardHeader>
        <CardContent>
          {recentScans.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <ScanLine className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No scans yet.</p>
              <Button className="mt-4" size="sm" asChild><Link href="/farmer/diagnostics"><Zap className="w-4 h-4" /> Run First Scan</Link></Button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentScans.map((scan: any) => (
                <div key={scan.id} className="flex items-center gap-4 py-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <ScanLine className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-900 dark:text-white">{scan.disease || "Scan result"}</div>
                    <div className="text-xs text-slate-400">{scan.farm.name} · {new Date(scan.createdAt).toLocaleDateString()}</div>
                  </div>
                  <Badge variant={scan.severity === "HIGH" ? "destructive" : scan.severity === "MEDIUM" ? "warning" : "success"} className="text-xs">
                    {scan.severity || "Low"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { href: "/farmer/diagnostics", icon: ScanLine, label: "Scan Crop", color: "bg-purple-50 dark:bg-purple-950/20 text-purple-600 border-purple-200 dark:border-purple-900" },
          { href: "/farmer/buy", icon: ShoppingBag, label: "Buy Inputs", color: "bg-blue-50 dark:bg-blue-950/20 text-blue-600 border-blue-200 dark:border-blue-900" },
          { href: "/farmer/loans", icon: TrendingUp, label: "Apply for Loan", color: "bg-amber-50 dark:bg-amber-950/20 text-amber-600 border-amber-200 dark:border-amber-900" },
          { href: "/farmer/agrovets", icon: Sprout, label: "Find Agrovet", color: "bg-green-50 dark:bg-green-950/20 text-green-600 border-green-200 dark:border-green-900" },
        ].map(({ href, icon: Icon, label, color }) => (
          <Link key={href} href={href} className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all hover:scale-105 ${color}`}>
            <Icon className="w-6 h-6" />
            <span className="text-sm font-semibold">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
