import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  DollarSign, TrendingUp, Users, FileText, Shield, PieChart,
  ArrowUpRight, BarChart3, AlertTriangle, CheckCircle
} from "lucide-react";

export default async function LenderOverviewPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [
    activeLoans, submittedLoans, recentApplications, disbursedAgg, uniqueFarmers,
  ] = await Promise.all([
    db.loanApplication.count({ where: { status: { in: ["APPROVED", "DISBURSED"] } } }),
    db.loanApplication.count({ where: { status: { in: ["SUBMITTED", "UNDER_REVIEW"] } } }),
    db.loanApplication.findMany({
      take: 5,
      orderBy: { updatedAt: "desc" },
      where: { status: { in: ["SUBMITTED", "UNDER_REVIEW", "APPROVED", "REJECTED", "DISBURSED"] } },
      include: { user: { select: { name: true, email: true } } },
    }),
    db.loanApplication.aggregate({ _sum: { amount: true }, where: { status: { in: ["DISBURSED", "APPROVED"] } } }),
    db.loanApplication.findMany({ distinct: ["userId"], select: { userId: true }, where: { status: { not: "DRAFT" } } }),
  ]);

  const portfolioValue = disbursedAgg._sum.amount ?? 0;

  const stats = [
    { label: "Active Portfolio", value: `KES ${(portfolioValue / 1000).toFixed(0)}K`, icon: DollarSign, color: "text-green-600 bg-green-100 dark:bg-green-900/30" },
    { label: "Active Loans", value: activeLoans.toString(), icon: FileText, color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30" },
    { label: "Farmers Served", value: uniqueFarmers.length.toLocaleString(), icon: Users, color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30" },
    { label: "Pending Review", value: submittedLoans.toString(), icon: Shield, color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30" },
  ];

  const statusVariant = (s: string): "success" | "warning" | "destructive" | "secondary" | "info" =>
    s === "APPROVED" || s === "DISBURSED" ? "success" : s === "SUBMITTED" || s === "UNDER_REVIEW" ? "warning" : s === "REJECTED" ? "destructive" : "secondary";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Lender Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Portfolio overview and loan management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild><Link href="/lender/revenue"><BarChart3 className="w-4 h-4" /> Reports</Link></Button>
          <Button asChild><Link href="/lender/applications"><FileText className="w-4 h-4" /> Review Applications</Link></Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}><Icon className="w-5 h-5" /></div>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Applications</CardTitle>
            <Button variant="ghost" size="sm" asChild><Link href="/lender/applications">View All</Link></Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentApplications.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4">No applications yet</p>
              ) : recentApplications.map((a) => (
                <div key={a.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {a.user.name ?? a.user.email?.split("@")[0]}
                      </span>
                      <Badge variant={statusVariant(a.status)} className="text-xs">{a.status.replace("_", " ")}</Badge>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{a.purpose}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">KES {a.amount.toLocaleString()}</p>
                    <p className="text-xs text-slate-400">{new Date(a.updatedAt).toLocaleDateString("en-KE", { month: "short", day: "numeric" })}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Key Risk Indicators</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Active Loans", value: activeLoans.toString(), icon: CheckCircle, iconColor: "text-green-600" },
                { label: "Pending Review", value: submittedLoans.toString(), icon: TrendingUp, iconColor: "text-blue-600" },
                { label: "Farmers Served", value: uniqueFarmers.length.toString(), icon: Users, iconColor: "text-purple-600" },
                { label: "Total Portfolio", value: `KES ${(portfolioValue / 1000).toFixed(0)}K`, icon: DollarSign, iconColor: "text-amber-500" },
              ].map(({ label, value, icon: Icon, iconColor }) => (
                <div key={label} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-center">
                  <Icon className={`w-6 h-6 ${iconColor} mx-auto mb-2`} />
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{value}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const stats = [
  { label: "Active Portfolio", value: "KES 48.2M", change: "+22%", up: true, icon: DollarSign, color: "text-green-600 bg-green-100 dark:bg-green-900/30" },
  { label: "Active Loans", value: "142", change: "+18", up: true, icon: FileText, color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30" },
  { label: "Farmers Served", value: "1,284", change: "+156", up: true, icon: Users, color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30" },
  { label: "Default Rate", value: "3.2%", change: "-0.8%", up: true, icon: Shield, color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30" },
];

const recentApplications = [
  { id: "LA-3045", farmer: "John Kamau", amount: "KES 150,000", purpose: "Input Financing", score: 82, status: "Under Review", date: "Feb 24, 2026" },
  { id: "LA-3044", farmer: "Mary Wanjiku", amount: "KES 85,000", purpose: "Equipment Lease", score: 76, status: "Approved", date: "Feb 23, 2026" },
  { id: "LA-3043", farmer: "Peter Odhiambo", amount: "KES 250,000", purpose: "Working Capital", score: 91, status: "Approved", date: "Feb 22, 2026" },
  { id: "LA-3042", farmer: "Grace Akinyi", amount: "KES 45,000", purpose: "Seed Purchase", score: 58, status: "Rejected", date: "Feb 21, 2026" },
  { id: "LA-3041", farmer: "James Mwangi", amount: "KES 500,000", purpose: "Land Expansion", score: 88, status: "Disbursed", date: "Feb 20, 2026" },
];

const portfolioBreakdown = [
  { type: "Input Financing", amount: "KES 18.5M", count: 62, share: 38 },
  { type: "Equipment Lease", amount: "KES 12.2M", count: 28, share: 25 },
  { type: "Working Capital", amount: "KES 10.8M", count: 34, share: 22 },
  { type: "Land Development", amount: "KES 6.7M", count: 18, share: 14 },
];

export default function LenderOverviewPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Lender Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Portfolio overview — Equity Agri Finance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><BarChart3 className="w-4 h-4" /> Reports</Button>
          <Button><FileText className="w-4 h-4" /> Review Applications</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, change, up, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}><Icon className="w-5 h-5" /></div>
                <Badge variant={up ? "success" : "destructive"} className="text-xs">
                  {up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />} {change}
                </Badge>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Applications</CardTitle>
            <Button variant="ghost" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentApplications.map((a: any) => (
                <div key={a.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">{a.farmer}</span>
                      <Badge variant={a.status === "Approved" || a.status === "Disbursed" ? "success" : a.status === "Under Review" ? "warning" : "destructive"} className="text-xs">{a.status}</Badge>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{a.id} • {a.purpose}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{a.amount}</p>
                    <p className="text-xs text-slate-400">Score: {a.score}/100</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Portfolio Breakdown</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {portfolioBreakdown.map(({ type, amount, count, share }) => (
                <div key={type}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{type}</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{amount}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${share}%` }} />
                    </div>
                    <span className="text-xs text-slate-400 w-20 text-right">{count} loans</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Key Risk Indicators</CardTitle></CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "PAR > 30 Days", value: "4.1%", status: "success", icon: CheckCircle, iconColor: "text-green-600" },
              { label: "Average Loan Duration", value: "8.5 months", status: "info", icon: TrendingUp, iconColor: "text-blue-600" },
              { label: "Collection Rate", value: "96.8%", status: "success", icon: DollarSign, iconColor: "text-green-600" },
              { label: "At-Risk Loans", value: "12", status: "warning", icon: AlertTriangle, iconColor: "text-amber-500" },
            ].map(({ label, value, status, icon: Icon, iconColor }) => (
              <div key={label} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-center">
                <Icon className={`w-6 h-6 ${iconColor} mx-auto mb-2`} />
                <p className="text-xl font-bold text-slate-900 dark:text-white">{value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
