"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Package, DollarSign, Truck, Star, BarChart3, ArrowUpRight, ArrowDownRight,
  Loader2, TrendingUp, TrendingDown, Clock, RefreshCw, ShoppingBag,
} from "lucide-react";
import { toast } from "sonner";
import { getSupplierDashboardStats } from "@/lib/actions/supplier";

type Stats = Awaited<ReturnType<typeof getSupplierDashboardStats>>;

const ORDER_STATUS_CFG: Record<string, { label: string; variant: "success" | "info" | "warning" | "destructive" | "secondary" }> = {
  DELIVERED: { label: "Delivered", variant: "success" },
  SHIPPED:   { label: "Shipped",   variant: "info" },
  CONFIRMED: { label: "Confirmed", variant: "warning" },
  CANCELLED: { label: "Cancelled", variant: "destructive" },
  PENDING:   { label: "Pending",   variant: "secondary" },
};

function ChangeIndicator({ pct }: { pct: number }) {
  if (pct === 0) return <span className="text-xs text-slate-400">vs last month</span>;
  const up = pct > 0;
  return (
    <div className={`flex items-center gap-0.5 text-xs font-semibold ${up ? "text-green-600" : "text-red-500"}`}>
      {up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
      {Math.abs(pct).toFixed(1)}% vs last month
    </div>
  );
}

export default function SupplierDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const data = await getSupplierDashboardStats();
      setStats(data);
    } catch {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const statCards = [
    {
      label: "This Month Revenue",
      value: stats ? `KES ${stats.thisMonthRevenue.toLocaleString()}` : "—",
      sub: stats ? <ChangeIndicator pct={stats.revenueChange} /> : null,
      icon: DollarSign,
      color: "text-green-600 bg-green-100 dark:bg-green-900/30",
    },
    {
      label: "Active Orders",
      value: stats ? stats.activeOrderCount.toString() : "—",
      sub: <span className="text-xs text-slate-400">in progress</span>,
      icon: Truck,
      color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
    },
    {
      label: "Products Listed",
      value: stats ? stats.productCount.toString() : "—",
      sub: <Link href="/supplier/products" className="text-xs text-green-600 hover:underline">Manage</Link>,
      icon: Package,
      color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30",
    },
    {
      label: "Store Rating",
      value: stats ? stats.rating.toFixed(1) : "—",
      sub: <span className="text-xs text-slate-400">out of 5.0</span>,
      icon: Star,
      color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Supplier Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Overview of your store performance</p>
        </div>
        <div className="flex gap-2 self-start sm:self-auto">
          <Button variant="outline" onClick={load} disabled={loading} className="rounded-xl">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button asChild className="bg-green-600 hover:bg-green-700 text-white rounded-xl">
            <Link href="/supplier/products"><Package className="w-4 h-4 mr-2" /> Manage Products</Link>
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, sub, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}><Icon className="w-5 h-5" /></div>
              </div>
              {loading
                ? <div className="h-7 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-1" />
                : <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
              }
              <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
              {!loading && sub && <div className="mt-1">{sub}</div>}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Profit / loss panel */}
      {!loading && stats && (
        <div className="grid sm:grid-cols-3 gap-4">
          {/* This month */}
          <Card className={`border-2 ${stats.revenueChange >= 0 ? "border-green-200 dark:border-green-800" : "border-red-200 dark:border-red-800"}`}>
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-2">
                {stats.revenueChange >= 0
                  ? <TrendingUp className="w-5 h-5 text-green-600" />
                  : <TrendingDown className="w-5 h-5 text-red-500" />
                }
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">This Month</span>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">KES {stats.thisMonthRevenue.toLocaleString()}</p>
              <ChangeIndicator pct={stats.revenueChange} />
            </CardContent>
          </Card>

          {/* Last month */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="w-5 h-5 text-slate-400" />
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Last Month</span>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">KES {stats.lastMonthRevenue.toLocaleString()}</p>
              <span className="text-xs text-slate-400">previous period</span>
            </CardContent>
          </Card>

          {/* Pending revenue */}
          <Card className="border-amber-200 dark:border-amber-800">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-amber-600" />
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Pending Revenue</span>
              </div>
              <p className="text-2xl font-black text-amber-700 dark:text-amber-400">KES {stats.pendingRevenue.toLocaleString()}</p>
              <span className="text-xs text-slate-400">from active orders</span>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Button variant="ghost" size="sm" asChild><Link href="/supplier/orders">View All</Link></Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1,2,3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl animate-pulse">
                    <div className="space-y-1.5">
                      <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
                      <div className="h-3 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
                    </div>
                    <div className="space-y-1.5 text-right">
                      <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded ml-auto" />
                      <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded ml-auto" />
                    </div>
                  </div>
                ))}
              </div>
            ) : !stats?.recentOrders.length ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <ShoppingBag className="w-10 h-10 text-slate-300 mb-2" />
                <p className="text-sm text-slate-400">No orders yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.recentOrders.map((o) => {
                  const cfg = ORDER_STATUS_CFG[o.status] ?? ORDER_STATUS_CFG.PENDING;
                  const itemName = o.items[0]?.product?.name ?? "Product";
                  const itemCount = o.items.reduce((s: number, i: { quantity: number }) => s + i.quantity, 0);
                  return (
                    <div key={o.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-900 dark:text-white">{o.id.slice(-6).toUpperCase()}</span>
                          <Badge variant={cfg.variant} className="text-xs">{cfg.label}</Badge>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {(o as any).user?.name ?? "Customer"} · {itemName}{itemCount > 1 ? ` +${itemCount - 1}` : ""}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">KES {(o as any).totalAmount?.toLocaleString()}</p>
                        <p className="text-xs text-slate-400">
                          {new Date((o as any).createdAt).toLocaleDateString("en-KE", { month: "short", day: "numeric" })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick links */}
        <Card>
          <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {[
                { href: "/supplier/products/new", label: "Add Product", icon: Package, color: "bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-950/40 border-green-200 dark:border-green-800" },
                { href: "/supplier/orders", label: "View Orders", icon: Truck, color: "bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-950/40 border-blue-200 dark:border-blue-800" },
                { href: "/supplier/payouts", label: "Payouts", icon: DollarSign, color: "bg-purple-50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-950/40 border-purple-200 dark:border-purple-800" },
                { href: "/supplier/analytics", label: "Analytics", icon: BarChart3, color: "bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-950/40 border-amber-200 dark:border-amber-800" },
              ].map(({ href, label, icon: Icon, color }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-colors ${color}`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-sm font-semibold">{label}</span>
                </Link>
              ))}
            </div>

            {/* Lifetime revenue */}
            {!loading && stats && (
              <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800 rounded-xl">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">Lifetime Revenue</p>
                <p className="text-2xl font-black text-green-700 dark:text-green-400">KES {stats.totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-slate-400 mt-0.5">from all completed orders</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
