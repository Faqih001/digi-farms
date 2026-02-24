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

export default async function FarmerOverviewPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userId = (session.user as { id: string }).id;

  const [farms, recentScans, crops] = await Promise.all([
    db.farm.findMany({ where: { userId }, take: 3 }),
    db.diagnostic.findMany({ where: { farm: { userId } }, take: 5, orderBy: { createdAt: "desc" }, include: { farm: true } }),
    db.crop.findMany({ where: { farm: { userId } }, take: 6, orderBy: { plantedAt: "desc" } }),
  ]);

  const totalHectares = farms.reduce((s, f) => s + (f.sizeHectares ?? 0), 0);
  const activeCrops = crops.filter((c) => c.status === "HEALTHY").length;

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black mb-1">Welcome back, {session.user.name?.split(" ")[0]}! 👋</h2>
            <p className="text-green-200/80 text-sm">Here&apos;s your farm at a glance</p>
          </div>
          <Button variant="hero" asChild>
            <Link href="/farmer/diagnostics"><ScanLine className="w-4 h-4" /> New Scan</Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Sprout, label: "Total Farms", value: farms.length, sub: `${totalHectares.toFixed(1)} ha`, color: "text-green-600" },
          { icon: TrendingUp, label: "Active Crops", value: activeCrops, sub: `${crops.length} total`, color: "text-blue-600" },
          { icon: ScanLine, label: "Scans This Month", value: recentScans.length, sub: "Last 30 days", color: "text-purple-600" },
          { icon: CheckCircle, label: "Health Score", value: "87%", sub: "Farm average", color: "text-amber-600" },
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
            ) : crops.slice(0, 4).map((crop) => (
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
            {[
              { icon: AlertTriangle, label: "Soil pH low in Plot B", type: "warning", time: "2h ago" },
              { icon: Droplets, label: "Irrigation due tomorrow", type: "info", time: "Today" },
              { icon: CloudSun, label: "Rain expected Fri–Sat", type: "success", time: "Forecast" },
              { icon: Clock, label: "Loan repayment in 5 days", type: "warning", time: "Aug 15" },
            ].map(({ icon: Icon, label, type, time }) => (
              <div key={label} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
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
              {recentScans.map((scan) => (
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
