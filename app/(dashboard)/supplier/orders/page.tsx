"use client";

import { useState, useEffect, useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Truck, Package, Clock, CheckCircle, XCircle, Search, Loader2, ImageIcon, RefreshCw, Filter } from "lucide-react";
import Image from "next/image";
import { getSupplierOrders, updateOrderStatus } from "@/lib/actions/order";

type Order = Awaited<ReturnType<typeof getSupplierOrders>>[number];
type OrderItem = Order["items"][number];

const STATUS_CONFIG: Record<string, { variant: "success" | "info" | "warning" | "destructive" | "secondary"; label: string }> = {
  PENDING:   { variant: "warning",     label: "Pending" },
  CONFIRMED: { variant: "info",        label: "Confirmed" },
  SHIPPED:   { variant: "info",        label: "Shipped" },
  DELIVERED: { variant: "success",     label: "Delivered" },
  CANCELLED: { variant: "destructive", label: "Cancelled" },
};

const NEXT_ACTIONS: Record<string, Array<{ status: "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED"; label: string; variant: "default" | "destructive" }>> = {
  PENDING:   [{ status: "CONFIRMED", label: "Confirm",      variant: "default" }, { status: "CANCELLED", label: "Cancel", variant: "destructive" }],
  CONFIRMED: [{ status: "SHIPPED",   label: "Mark Shipped",  variant: "default" }, { status: "CANCELLED", label: "Cancel", variant: "destructive" }],
  SHIPPED:   [{ status: "DELIVERED", label: "Mark Delivered", variant: "default" }],
};

const PERIODS = [
  { label: "Today",      days: 1 },
  { label: "Last 7 days", days: 7 },
  { label: "Last 30 days", days: 30 },
  { label: "All time",   days: 0 },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [periodDays, setPeriodDays] = useState(30);
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);
  const [pending, startTransition] = useTransition();

  const load = () =>
    getSupplierOrders()
      .then(setOrders)
      .catch(() => toast.error("Failed to load orders"))
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const now = Date.now();
  const filtered = orders.filter((o: any) => {
    const matchSearch = !search || o.id.includes(search) || (o.user?.name ?? "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || o.status === statusFilter;
    const matchPeriod = periodDays === 0 || (now - new Date(o.createdAt).getTime()) < periodDays * 86400000;
    return matchSearch && matchStatus && matchPeriod;
  });

  const handleStatus = (orderId: string, status: "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED") => {
    startTransition(async () => {
      try {
        await updateOrderStatus(orderId, status);
        toast.success(`Order ${status.toLowerCase()}`);
        await load();
        if (detailOrder?.id === orderId) setDetailOrder((prev) => prev ? { ...prev, status } : null);
      } catch (err) { toast.error((err as Error).message); }
    });
  };

  const totals = {
    total: orders.length,
    pending: orders.filter((o: any) => o.status === "PENDING").length,
    shipped: orders.filter((o: any) => o.status === "SHIPPED").length,
    cancelled: orders.filter((o: any) => o.status === "CANCELLED").length,
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Orders</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage incoming orders and fulfillment</p>
        </div>
        <Button variant="outline" onClick={load} size="sm"><RefreshCw className="w-4 h-4 mr-1.5" />Refresh</Button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Orders", value: totals.total, color: "text-green-600" },
          { label: "Pending", value: totals.pending, color: "text-amber-600" },
          { label: "Shipped", value: totals.shipped, color: "text-blue-600" },
          { label: "Cancelled", value: totals.cancelled, color: "text-red-600" },
        ].map(({ label, value, color }) => (
          <Card key={label}><CardContent className="p-4 text-center"><p className={`text-2xl font-bold ${color}`}>{value}</p><p className="text-xs text-slate-500 dark:text-slate-400">{label}</p></CardContent></Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Search by order ID or customer…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Status</option>
              {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
            <select
              className="h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm"
              value={periodDays}
              onChange={(e) => setPeriodDays(Number(e.target.value))}
            >
              {PERIODS.map((p) => <option key={p.days} value={p.days}>{p.label}</option>)}
            </select>
          </div>
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <Card className="p-12 text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">
            {search || statusFilter !== "ALL" ? "No matching orders" : "No orders yet"}
          </h3>
          <p className="text-slate-400">Orders from customers will appear here</p>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {filtered.map((o: any) => {
                const sc = STATUS_CONFIG[o.status] ?? STATUS_CONFIG.PENDING;
                const actions = NEXT_ACTIONS[o.status] ?? [];
                const total = o.items.reduce((s: any, i: any) => s + i.quantity * i.price, 0);
                const firstImage = o.items[0]?.product?.imageUrls?.[0];
                return (
                  <div key={o.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex gap-3">
                      {/* Product thumbnail */}
                      <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 flex-shrink-0 overflow-hidden">
                        {firstImage ? (
                          <Image src={firstImage} alt="Product" width={56} height={56} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-slate-300" />
                          </div>
                        )}
                      </div>

                      {/* Order info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-0.5">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">#{o.id.slice(-8).toUpperCase()}</span>
                          <Badge variant={sc.variant} className="text-xs">{sc.label}</Badge>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{o.user?.name ?? "Customer"} · {o.user?.email ?? ""}</p>
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                          {o.items.map((i: OrderItem) => `${i.product.name} ×${i.quantity}`).join(", ")}
                        </p>
                      </div>

                      {/* Amount + date + actions — stacked on right */}
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <div className="text-right">
                          <p className="font-bold text-sm text-slate-900 dark:text-white">KES {total.toLocaleString()}</p>
                          <p className="text-xs text-slate-400">{new Date(o.createdAt).toLocaleDateString("en-KE", { month: "short", day: "numeric" })}</p>
                        </div>
                        {/* Actions below amount */}
                        <div className="flex gap-1.5 flex-wrap justify-end">
                          <Button variant="outline" size="sm" onClick={() => setDetailOrder(o)}>Details</Button>
                          {actions.map((a: any) => (
                            <Button key={a.status} size="sm" variant={a.variant} disabled={pending} onClick={() => handleStatus(o.id, a.status)}>
                              {pending ? <Loader2 className="w-3 h-3 animate-spin" /> : a.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detail dialog */}
      <Dialog open={!!detailOrder} onOpenChange={(open) => { if (!open) setDetailOrder(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Order #{detailOrder?.id.slice(-8).toUpperCase()}</DialogTitle>
          </DialogHeader>
          {detailOrder && (
            <div className="space-y-4 pt-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Customer</span>
                <span className="font-medium">{detailOrder.user?.name ?? "Unknown"}</span>
              </div>
              {(detailOrder.user as any)?.email && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Email</span>
                  <span className="font-medium">{(detailOrder.user as any).email}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Status</span>
                <Badge variant={STATUS_CONFIG[detailOrder.status]?.variant ?? "secondary"}>{STATUS_CONFIG[detailOrder.status]?.label ?? detailOrder.status}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Date</span>
                <span>{new Date(detailOrder.createdAt).toLocaleDateString("en-KE", { month: "long", day: "numeric", year: "numeric" })}</span>
              </div>
              {(detailOrder as any).shippingAddress && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Ship to</span>
                  <span className="text-right max-w-[200px]">{(detailOrder as any).shippingAddress}</span>
                </div>
              )}

              <div className="border-t border-slate-200 dark:border-slate-700 pt-3 space-y-3">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Items</p>
                {detailOrder.items.map((i: OrderItem) => {
                  const thumb = (i as any).product?.imageUrls?.[0];
                  return (
                    <div key={i.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0">
                        {thumb ? (
                          <Image src={thumb} alt={i.product.name} width={40} height={40} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><Package className="w-4 h-4 text-slate-300" /></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-white line-clamp-1">{i.product.name}</p>
                        <p className="text-xs text-slate-400">×{i.quantity} @ KES {i.price.toLocaleString()}</p>
                      </div>
                      <span className="text-sm font-medium">KES {(i.quantity * i.price).toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between font-bold border-t border-slate-200 dark:border-slate-700 pt-3">
                <span>Total</span>
                <span>KES {detailOrder.items.reduce((s, i) => s + i.quantity * i.price, 0).toLocaleString()}</span>
              </div>

              {/* Quick action buttons in dialog */}
              {(NEXT_ACTIONS[detailOrder.status] ?? []).length > 0 && (
                <div className="flex gap-2 pt-1">
                  {(NEXT_ACTIONS[detailOrder.status] ?? []).map((a) => (
                    <Button
                      key={a.status}
                      variant={a.variant}
                      size="sm"
                      className="flex-1"
                      disabled={pending}
                      onClick={() => handleStatus(detailOrder.id, a.status)}
                    >
                      {pending ? <Loader2 className="w-3 h-3 animate-spin" /> : a.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
