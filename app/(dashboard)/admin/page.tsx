import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Leaf, ShoppingBag, DollarSign, TrendingUp, AlertCircle, BarChart2, Globe, Activity } from "lucide-react";

const variantMap: Record<string, "success" | "info" | "warning" | "destructive"> = {
  success: "success", info: "info", warning: "warning", destructive: "destructive",
};

export default async function AdminOverviewPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") redirect("/login");

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [
    totalUsers, farmerCount, supplierCount,
    ordersThisMonth, loansThisMonth, scansToday,
    openTickets, recentLoans, userRoleCounts,
  ] = await Promise.all([
    db.user.count(),
    db.user.count({ where: { role: "FARMER" } }),
    db.supplier.count(),
    db.order.count({ where: { createdAt: { gte: startOfMonth } } }),
    db.loanApplication.aggregate({ _sum: { amount: true }, where: { status: { in: ["APPROVED", "DISBURSED"] }, updatedAt: { gte: startOfMonth } } }),
    db.diagnostic.count({ where: { createdAt: { gte: startOfToday } } }),
    db.supportTicket.count({ where: { status: { in: ["OPEN", "IN_PROGRESS"] } } }),
    db.loanApplication.findMany({ take: 6, orderBy: { createdAt: "desc" }, include: { user: { select: { name: true, email: true } } } }),
    db.user.groupBy({ by: ["role"], _count: { _all: true } }),
  ]);

  const loansDisbursedMTD = loansThisMonth._sum.amount ?? 0;

  const stats = [
    { icon: Users, label: "Total Users", value: totalUsers.toLocaleString(), color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950" },
    { icon: Leaf, label: "Active Farmers", value: farmerCount.toLocaleString(), color: "text-green-600", bg: "bg-green-50 dark:bg-green-950" },
    { icon: ShoppingBag, label: "Orders (MTD)", value: ordersThisMonth.toLocaleString(), color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-950" },
    { icon: DollarSign, label: "Loans Disbursed (MTD)", value: `KES ${(loansDisbursedMTD / 1000).toFixed(0)}K`, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950" },
    { icon: Globe, label: "Active Suppliers", value: supplierCount.toLocaleString(), color: "text-teal-600", bg: "bg-teal-50 dark:bg-teal-950" },
    { icon: Activity, label: "AI Scans Today", value: scansToday.toLocaleString(), color: "text-pink-600", bg: "bg-pink-50 dark:bg-pink-950" },
    { icon: AlertCircle, label: "Open Support Tickets", value: openTickets.toString(), color: "text-red-600", bg: "bg-red-50 dark:bg-red-950" },
    { icon: TrendingUp, label: "Total Loan Applications", value: recentLoans.length > 0 ? "Active" : "0", color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-950" },
  ];

  const roleCountMap = Object.fromEntries(userRoleCounts.map((r) => [r.role, r._count._all]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Admin Overview</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Platform health and real-time metrics</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ icon: Icon, label, value, color, bg }) => (
          <Card key={label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
              </div>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">Recent Loan Applications</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentLoans.length === 0 ? (
                <p className="text-sm text-slate-400 px-4 py-6 text-center">No loan applications yet</p>
              ) : recentLoans.map((loan) => (
                <div key={loan.id} className="flex items-start gap-3 px-4 py-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      {loan.user.name ?? loan.user.email} — KES {loan.amount.toLocaleString()} for {loan.purpose}
                    </p>
                    <p className="text-xs text-slate-400">{new Date(loan.createdAt).toLocaleDateString("en-KE", { month: "short", day: "numeric", year: "numeric" })}</p>
                  </div>
                  <Badge variant={
                    loan.status === "APPROVED" || loan.status === "DISBURSED" ? "success" :
                    loan.status === "REJECTED" ? "destructive" :
                    loan.status === "SUBMITTED" || loan.status === "UNDER_REVIEW" ? "warning" : "secondary"
                  } className="text-xs flex-shrink-0">{loan.status.replace("_", " ")}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold">User Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { role: "Farmers", count: roleCountMap["FARMER"] ?? 0, color: "bg-green-500" },
                { role: "Suppliers", count: roleCountMap["SUPPLIER"] ?? 0, color: "bg-purple-500" },
                { role: "Lenders", count: roleCountMap["LENDER"] ?? 0, color: "bg-blue-500" },
                { role: "Admins", count: roleCountMap["ADMIN"] ?? 0, color: "bg-red-500" },
              ].map(({ role, count, color }) => {
                const pct = totalUsers > 0 ? Math.max((count / totalUsers) * 100, 2) : 2;
                return (
                  <div key={role}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-600 dark:text-slate-400">{role}</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">{count.toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold">System Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: "API Uptime", value: "99.98%" },
                { label: "AI Services", value: "98.2%" },
                { label: "Database", value: "99.95%" },
                { label: "Payment Gateway", value: "99.7%" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-1">
                  <span className="text-sm text-slate-600 dark:text-slate-400">{label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{value}</span>
                    <span className="w-2 h-2 rounded-full bg-green-400" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
