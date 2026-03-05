"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3, TrendingUp, TrendingDown, ShoppingCart, Users, DollarSign,
  ArrowUpRight, ArrowDownRight, Loader2, RefreshCw, Package,
} from "lucide-react";
import { toast } from "sonner";
import { getSupplierAnalytics } from "@/lib/actions/supplier";

type Analytics = Awaited<ReturnType<typeof getSupplierAnalytics>>;
type Period = "week" | "month" | "year" | "all";

const PERIODS: { value: Period; label: string }[] = [
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "year", label: "This Year" },
  { value: "all", label: "All Time" },
];

function ChangeChip({ pct }: { pct: number }) {
  if (pct === 0) return <span className="text-xs text-slate-400">No change</span>;
  const up = pct > 0;
  return (
    <span className={`flex items-center gap-0.5 text-xs font-semibold ${up ? "text-green-600" : "text-red-500"}`}>
      {up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
      {Math.abs(pct).toFixed(1)}%
    </span>
  );
}

export default function SupplierAnalyticsPage() {
  const [period, setPeriod] = useState<Period>("month");
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  async function load(p: Period) {
    setLoading(true);
    try {
      const result = await getSupplierAnalytics(p);
      setData(result);
    } catch {
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(period); }, [period]);

  const maxTrend = data?.trend.length ? Math.max(...data.trend.map((t) => t.count), 1) : 1;
  const totalCatRevenue = data?.categories.reduce((s, c) => s + c.revenue, 0) ?? 0;

  const metricCards = [
    {
      label: "Total Revenue",
      value: data ? `KES ${data.revenue.toLocaleString()}` : "—",
      change: data?.revenueChange ?? 0,
      icon: DollarSign,
      color: "text-green-600 bg-green-100 dark:bg-green-900/30",
    },
    {
      label: "Orders",
      value: data ? data.orderCount.toString() : "—",
      change: data?.orderCountChange ?? 0,
      icon: ShoppingCart,
      color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
    },
    {
      label: "Avg. Order Value",
      value: data && data.avgOrderValue > 0 ? `KES ${Math.round(data.avgOrderValue).toLocaleString()}` : "—",
      change: 0,
      icon: TrendingUp,
      color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30",
    },
    {
      label: "Top Category",
      value: data?.categories[0]?.category ?? "—",
      change: 0,
      icon: Package,
      color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Analytics</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Insights into your store performance</p>
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

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map(({ label, value, change, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}><Icon className="w-5 h-5" /></div>
                {change !== 0 && <ChangeChip pct={change} />}
              </div>
              {loading
                ? <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                : <p className="text-xl font-bold text-slate-900 dark:text-white">{value}</p>
              }
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
              {change !== 0 && (
                <p className="text-xs text-slate-400 mt-0.5">vs previous {period}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Order Trend Chart */}
        <Card>
          <CardHeader><CardTitle>Order Trend</CardTitle></CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-48"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>
            ) : !data?.trend.length ? (
              <div className="flex flex-col items-center justify-center h-48 text-center">
                <BarChart3 className="w-10 h-10 text-slate-300 mb-2" />
                <p className="text-slate-500 dark:text-slate-400 text-sm">No order data for this period</p>
              </div>
            ) : (
              <div className="flex items-end gap-1.5 h-48 overflow-x-auto pb-2">
                {data.trend.map(({ label, count }) => (
                  <div key={label} className="flex-shrink-0 flex flex-col items-center gap-1 min-w-[36px]">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">{count}</span>
                    <div
                      className="w-full bg-green-500 hover:bg-green-600 rounded-t-lg transition-all cursor-pointer"
                      style={{ height: `${Math.max((count / maxTrend) * 140, 4)}px` }}
                      title={`${label}: ${count} orders`}
                    />
                    <span className="text-xs text-slate-400 whitespace-nowrap" style={{ fontSize: "9px" }}>{label}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Revenue by Category */}
        <Card>
          <CardHeader><CardTitle>Revenue by Category</CardTitle></CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1,2,3].map((i) => (
                  <div key={i} className="animate-pulse space-y-1.5">
                    <div className="flex justify-between">
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-28" />
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20" />
                    </div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-full" />
                  </div>
                ))}
              </div>
            ) : !data?.categories.length ? (
              <p className="text-sm text-slate-400 text-center py-8">No category data yet</p>
            ) : (
              <div className="space-y-4">
                {data.categories.map(({ category, revenue, orders }) => {
                  const pct = totalCatRevenue ? (revenue / totalCatRevenue) * 100 : 0;
                  return (
                    <div key={category}>
                      <div className="flex justify-between mb-1.5">
                        <div>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{category}</span>
                          <span className="text-xs text-slate-400 ml-1.5">{orders} orders</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-slate-900 dark:text-white">KES {revenue.toLocaleString()}</span>
                          <span className="text-xs text-slate-400 ml-1">({pct.toFixed(0)}%)</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Period comparison callout */}
      {!loading && data && (data.revenueChange !== 0 || data.orderCountChange !== 0) && (
        <Card className={`border-2 ${data.revenueChange >= 0 ? "border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/10" : "border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/10"}`}>
          <CardContent className="p-4 flex items-center gap-4">
            {data.revenueChange >= 0
              ? <TrendingUp className="w-6 h-6 text-green-600 flex-shrink-0" />
              : <TrendingDown className="w-6 h-6 text-red-500 flex-shrink-0" />
            }
            <div>
              <p className={`text-sm font-semibold ${data.revenueChange >= 0 ? "text-green-800 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}>
                Revenue is {data.revenueChange >= 0 ? "up" : "down"} {Math.abs(data.revenueChange).toFixed(1)}% compared to the previous {period}
                {data.orderCountChange !== 0 && `, with ${Math.abs(data.orderCountChange).toFixed(1)}% ${data.orderCountChange >= 0 ? "more" : "fewer"} customers.`}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {data.revenueChange >= 0 ? "Great momentum! Keep up the good work." : "Consider reviewing pricing or product visibility."}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
