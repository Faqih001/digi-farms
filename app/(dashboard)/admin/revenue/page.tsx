"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, CreditCard, Percent, ArrowDownRight, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { getAdminRevenueStats } from "@/lib/actions/admin";
import AIInsightPanel from "@/components/dashboard/ai-insight-panel";

const monthly = [
  { month: "Sep 2025", subscriptions: 842000, marketplace: 1240000, loans: 580000, total: 2662000 },
  { month: "Oct 2025", subscriptions: 918000, marketplace: 1380000, loans: 640000, total: 2938000 },
  { month: "Nov 2025", subscriptions: 965000, marketplace: 1520000, loans: 710000, total: 3195000 },
  { month: "Dec 2025", subscriptions: 1024000, marketplace: 1840000, loans: 820000, total: 3684000 },
  { month: "Jan 2026", subscriptions: 1102000, marketplace: 1960000, loans: 890000, total: 3952000 },
  { month: "Feb 2026", subscriptions: 1248000, marketplace: 2140000, loans: 1010000, total: 4398000 },
];

function fmt(n: number) {
  if (n >= 1_000_000) return `KES ${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `KES ${(n / 1000).toFixed(0)}K`;
  return `KES ${n.toLocaleString()}`;
}

const maxTotal = Math.max(...monthly.map(m => m.total));

type Stats = Awaited<ReturnType<typeof getAdminRevenueStats>>;

export default function AdminRevenuePage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      setStats(await getAdminRevenueStats());
    } catch {
      toast.error("Failed to load revenue stats");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const totalRevenue = monthly.reduce((s, m) => s + m.total, 0);
  const totalSubs = monthly.reduce((s, m) => s + m.subscriptions, 0);
  const totalMarket = monthly.reduce((s, m) => s + m.marketplace, 0);
  const totalLoans = monthly.reduce((s, m) => s + m.loans, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Revenue</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Platform-wide revenue breakdown and trends</p>
        </div>
        <button onClick={load} disabled={loading} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-green-600 disabled:opacity-50">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {/* Live DB Stats */}
      <div>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">Live Platform Stats</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}><CardContent className="p-4"><div className="h-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-2" /><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-2/3" /></CardContent></Card>
            ))
          ) : stats ? (
            [
              { icon: DollarSign, label: "Total Order Revenue", value: fmt(stats.totalOrderRevenue), sub: `${stats.totalOrders} orders`, color: "text-green-600", bg: "bg-green-50 dark:bg-green-950" },
              { icon: CreditCard, label: "Completed Payments", value: fmt(stats.totalPayments), sub: `${stats.completedPayments} transactions`, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950" },
              { icon: TrendingUp, label: "Active Subscriptions", value: stats.activeSubscriptions.toLocaleString(), sub: "platform subscribers", color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-950" },
              { icon: Percent, label: "Loan Volume Disbursed", value: fmt(stats.totalLoanVolume), sub: `${stats.disbursedLoans} loans`, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950" },
            ].map(({ icon: Icon, label, value, sub, color, bg }) => (
              <Card key={label}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <div>
                    <p className={`text-base font-bold ${color}`}>{value}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
                    <p className="text-xs text-slate-400">{sub}</p>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : null}
        </div>
      </div>

      {/* 6-month chart (demo data) */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold">Monthly Revenue Trend</CardTitle>
            <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">Demo • 6-month projection</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 h-36">
            {monthly.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="flex-1 flex items-end w-full gap-0.5">
                  <div className="flex-1 bg-blue-400 rounded-t" style={{ height: `${(m.subscriptions / maxTotal) * 100}%` }} />
                  <div className="flex-1 bg-purple-400 rounded-t" style={{ height: `${(m.marketplace / maxTotal) * 100}%` }} />
                  <div className="flex-1 bg-amber-400 rounded-t" style={{ height: `${(m.loans / maxTotal) * 100}%` }} />
                </div>
                <span className="text-xs text-slate-400">{m.month.slice(0, 6)}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1"><span className="w-3 h-2 bg-blue-400 rounded inline-block" /> Subscriptions</span>
            <span className="flex items-center gap-1"><span className="w-3 h-2 bg-purple-400 rounded inline-block" /> Marketplace</span>
            <span className="flex items-center gap-1"><span className="w-3 h-2 bg-amber-400 rounded inline-block" /> Loan Fees</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold">Monthly Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  {["Month", "Subscriptions", "Marketplace", "Loan Fees", "Total"].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {[...monthly].reverse().map((m) => (
                  <tr key={m.month} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">{m.month}</td>
                    <td className="px-4 py-3 text-blue-600">{fmt(m.subscriptions)}</td>
                    <td className="px-4 py-3 text-purple-600">{fmt(m.marketplace)}</td>
                    <td className="px-4 py-3 text-amber-600">{fmt(m.loans)}</td>
                    <td className="px-4 py-3 font-bold text-green-700">{fmt(m.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">Revenue by Source</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { source: "Subscription Fees", pct: 28, avg: fmt(totalSubs / 6) + "/mo", color: "bg-blue-500" },
              { source: "Marketplace Commission", pct: 49, avg: fmt(totalMarket / 6) + "/mo", color: "bg-purple-500" },
              { source: "Loan Origination Fees", pct: 23, avg: fmt(totalLoans / 6) + "/mo", color: "bg-amber-500" },
            ].map(({ source, pct, avg, color }) => (
              <div key={source}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 dark:text-slate-400">{source}</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">{pct}% • {avg}</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">MoM Growth</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {monthly.slice(1).map((m, i) => {
              const prev = monthly[i].total;
              const growth = (((m.total - prev) / prev) * 100).toFixed(1);
              const isPos = m.total >= prev;
              return (
                <div key={m.month} className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <span className="text-sm text-slate-600 dark:text-slate-400">{m.month}</span>
                  <span className={`text-sm font-bold flex items-center gap-1 ${isPos ? "text-green-600" : "text-red-500"}`}>
                    <ArrowDownRight className={`w-4 h-4 ${isPos ? "rotate-180" : ""}`} />
                    {isPos ? "+" : ""}{growth}%
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      {!loading && stats && (
        <AIInsightPanel
          module="admin_revenue"
          contextData={JSON.stringify({
            liveStats: stats,
            monthlyProjection: { totalRevenue, totalSubs, totalMarket, totalLoans },
            latestMonth: monthly[monthly.length - 1],
            avgMonthlyRevenue: totalRevenue / monthly.length,
          })}
          title="AI Revenue Analysis"
          description="Get AI-powered insights on revenue trends, growth opportunities, and financial health"
          defaultPrompt="Analyze the platform revenue data. Identify growth drivers, seasonal patterns, and provide strategic recommendations to increase revenue across all streams."
        />
      )}
    </div>
  );
}
