"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, CreditCard,
  Clock, Loader2, RefreshCw, BarChart3,
} from "lucide-react";
import { toast } from "sonner";
import { getSupplierRevenueStats } from "@/lib/actions/supplier";

type Stats = Awaited<ReturnType<typeof getSupplierRevenueStats>>;
type Period = "week" | "month" | "year" | "all";

const PERIODS: { value: Period; label: string }[] = [
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "year", label: "This Year" },
  { value: "all", label: "All Time" },
];

export default function RevenuePage() {
  const [period, setPeriod] = useState<Period>("month");
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  async function load(p: Period) {
    setLoading(true);
    try {
      const data = await getSupplierRevenueStats(p);
      setStats(data);
    } catch {
      toast.error("Failed to load revenue data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(period); }, [period]);

  const maxMonthlyRevenue = stats?.monthly.length ? Math.max(...stats.monthly.map((m) => m.revenue), 1) : 1;
  const totalCategoryRevenue = stats?.byCategory.reduce((s, c) => s + c.revenue, 0) ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Revenue</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Track your earnings and financial performance</p>
        </div>
        <Button variant="outline" onClick={() => load(period)} disabled={loading} className="rounded-xl self-start sm:self-auto">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      {/* Period selector */}
      <div className="flex gap-2 flex-wrap">
        {PERIODS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setPeriod(value)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${period === value ? "bg-green-600 text-white shadow-sm" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: stats?.totalRevenue, icon: DollarSign, color: "text-green-600 bg-green-100 dark:bg-green-900/30" },
          { label: "Orders Completed", value: stats?.orderCount, icon: TrendingUp, color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30", isCount: true },
          { label: "Total Paid Out", value: stats?.totalPaidOut, icon: CreditCard, color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30" },
          { label: "Pending Revenue", value: stats?.pendingRevenue, icon: Clock, color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30" },
        ].map(({ label, value, icon: Icon, color, isCount }) => (
          <Card key={label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}><Icon className="w-5 h-5" /></div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
                  {loading
                    ? <div className="h-5 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mt-1" />
                    : <p className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                        {value !== undefined ? (isCount ? value : `KES ${value.toLocaleString()}`) : "—"}
                      </p>
                  }
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Revenue by Month</CardTitle>
          {stats && <Badge variant="secondary" className="text-xs">{stats.monthly.length} months</Badge>}
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-48"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>
          ) : !stats?.monthly.length ? (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <BarChart3 className="w-10 h-10 text-slate-300 mb-2" />
              <p className="text-slate-500 dark:text-slate-400 text-sm">No revenue data for this period</p>
            </div>
          ) : (
            <div className="flex items-end gap-2 h-48 overflow-x-auto pb-2">
              {stats.monthly.map(({ month, revenue, orders }) => (
                <div key={month} className="flex-shrink-0 flex flex-col items-center gap-1 min-w-[44px]">
                  <span className="text-xs font-bold text-green-700 dark:text-green-400 whitespace-nowrap">
                    {revenue >= 1000 ? `${(revenue / 1000).toFixed(0)}K` : revenue}
                  </span>
                  <div
                    className="w-full bg-green-500 rounded-t-lg transition-all hover:bg-green-600 cursor-pointer group relative"
                    style={{ height: `${Math.max((revenue / maxMonthlyRevenue) * 160, 4)}px` }}
                    title={`${month}: KES ${revenue.toLocaleString()} · ${orders} orders`}
                  />
                  <span className="text-xs text-slate-400 whitespace-nowrap">{month.split(" ")[0]}</span>
                  <span className="text-xs text-slate-300 dark:text-slate-600">{orders}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Category breakdown */}
        <Card>
          <CardHeader><CardTitle>Revenue by Category</CardTitle></CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1,2,3].map((i) => (
                  <div key={i} className="animate-pulse space-y-1">
                    <div className="flex justify-between">
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24" />
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16" />
                    </div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-full" />
                  </div>
                ))}
              </div>
            ) : !stats?.byCategory.length ? (
              <p className="text-sm text-slate-400 text-center py-8">No category data yet</p>
            ) : (
              <div className="space-y-4">
                {stats.byCategory.map(({ category, revenue }) => {
                  const pct = totalCategoryRevenue ? (revenue / totalCategoryRevenue) * 100 : 0;
                  return (
                    <div key={category}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{category}</span>
                        <div className="text-right">
                          <span className="text-sm font-bold text-slate-900 dark:text-white">KES {revenue.toLocaleString()}</span>
                          <span className="text-xs text-slate-400 ml-1">({pct.toFixed(0)}%)</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent payouts */}
        <Card>
          <CardHeader><CardTitle>Recent Payouts</CardTitle></CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-green-600" /></div>
            ) : !stats?.payouts.length ? (
              <p className="text-sm text-slate-400 text-center py-8">No payouts yet</p>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {stats.payouts.map((p) => (
                  <div key={p.id} className="flex items-center justify-between px-6 py-3">
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{p.reference ?? `PAY-${p.id.slice(-6).toUpperCase()}`}</p>
                      <p className="text-xs text-slate-400">{new Date(p.createdAt).toLocaleDateString("en-KE", { month: "short", day: "numeric", year: "numeric" })}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">KES {p.amount.toLocaleString()}</p>
                      <p className={`text-xs font-semibold ${p.status === "COMPLETED" ? "text-green-600" : p.status === "PENDING" ? "text-amber-600" : "text-red-500"}`}>
                        {p.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Revenue table */}
      {!loading && stats?.monthly && stats.monthly.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Monthly Breakdown</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left p-4 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase">Month</th>
                    <th className="text-left p-4 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase">Revenue</th>
                    <th className="text-left p-4 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase">Orders</th>
                    <th className="text-left p-4 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase hidden sm:table-cell">Avg. Order</th>
                  </tr>
                </thead>
                <tbody>
                  {[...stats.monthly].reverse().map((m, i, arr) => {
                    const prev = arr[i + 1];
                    const growth = prev && prev.revenue > 0 ? ((m.revenue - prev.revenue) / prev.revenue) * 100 : null;
                    return (
                      <tr key={m.month} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-4 font-medium text-slate-900 dark:text-white">{m.month}</td>
                        <td className="p-4 font-bold text-green-600">KES {m.revenue.toLocaleString()}</td>
                        <td className="p-4 text-slate-500 dark:text-slate-400">{m.orders}</td>
                        <td className="p-4 hidden sm:table-cell">
                          {growth !== null ? (
                            <span className={`flex items-center gap-1 text-xs font-semibold ${growth >= 0 ? "text-green-600" : "text-red-500"}`}>
                              {growth >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                              {Math.abs(growth).toFixed(0)}%
                            </span>
                          ) : <span className="text-xs text-slate-400">—</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
