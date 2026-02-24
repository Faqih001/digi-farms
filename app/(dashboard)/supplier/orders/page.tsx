"use client";

import { useState, useEffect, useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Truck, Package, Clock, CheckCircle, XCircle, Search, Loader2 } from "lucide-react";
import { getSupplierOrders, updateOrderStatus } from "@/lib/actions/order";

type Order = Awaited<ReturnType<typeof getSupplierOrders>>[number];
type OrderItem = Order['items'][number];

const statusConfig: Record<string, { variant: "success" | "info" | "warning" | "destructive" | "secondary"; icon: typeof CheckCircle; label: string }> = {
  PENDING:   { variant: "warning",     icon: Clock,         label: "Pending" },
  CONFIRMED: { variant: "info",        icon: CheckCircle,   label: "Confirmed" },
  SHIPPED:   { variant: "info",        icon: Truck,         label: "Shipped" },
  DELIVERED: { variant: "success",     icon: CheckCircle,   label: "Delivered" },
  CANCELLED: { variant: "destructive", icon: XCircle,       label: "Cancelled" },
};
const nextActions: Record<string, Array<{ status: "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED"; label: string; variant: "default" | "destructive" }>> = {
  PENDING:   [{ status: "CONFIRMED", label: "Confirm", variant: "default" }, { status: "CANCELLED", label: "Cancel", variant: "destructive" }],
  CONFIRMED: [{ status: "SHIPPED",   label: "Mark Shipped", variant: "default" }, { status: "CANCELLED", label: "Cancel", variant: "destructive" }],
  SHIPPED:   [{ status: "DELIVERED", label: "Mark Delivered", variant: "default" }],
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);
  const [pending, startTransition] = useTransition();

  const load = () => getSupplierOrders().then(setOrders).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const filtered = orders.filter(o => {
    const matchSearch = !search || o.id.includes(search) || (o.user?.name ?? "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleStatus = (orderId: string, status: "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED") => {
    startTransition(async () => {
      try {
        await updateOrderStatus(orderId, status);
        toast.success(`Order marked as ${status.toLowerCase()}`);
        const data = await getSupplierOrders(); setOrders(data);
      } catch (err) { toast.error((err as Error).message); }
    });
  };

  const totals = { total: orders.length, pending: orders.filter(o => o.status === "PENDING").length, shipped: orders.filter(o => o.status === "SHIPPED").length, cancelled: orders.filter(o => o.status === "CANCELLED").length };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Orders</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Manage incoming orders and fulfillment</p>
      </div>

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

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Search by order ID or customer..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="ALL">All Status</option>
              {Object.keys(statusConfig).map(s => <option key={s} value={s}>{statusConfig[s].label}</option>)}
            </select>
          </div>
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <Card className="p-12 text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">{search || statusFilter !== "ALL" ? "No matching orders" : "No orders yet"}</h3>
          <p className="text-slate-400">Orders from customers will appear here</p>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {filtered.map(o => {
                const sc = statusConfig[o.status] ?? statusConfig.PENDING;
                const actions = nextActions[o.status] ?? [];
                const total = o.items.reduce((s, i) => s + i.quantity * i.price, 0);
                return (
                  <div key={o.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0"><Package className="w-5 h-5 text-slate-400" /></div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900 dark:text-white">#{o.id.slice(-8).toUpperCase()}</span>
                            <Badge variant={sc.variant} className="text-xs">{sc.label}</Badge>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{o.user?.name ?? "Customer"}</p>
                          <p className="text-xs text-slate-400 line-clamp-1">{o.items.map((i: OrderItem) => `${i.product.name} x${i.quantity}`).join(", ")}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="font-bold text-sm text-slate-900 dark:text-white">KES {total.toLocaleString()}</p>
                          <p className="text-xs text-slate-400">{new Date(o.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex gap-1.5 flex-wrap">
                          <Button variant="outline" size="sm" onClick={() => setDetailOrder(o)}>Details</Button>
                          {actions.map(a => (
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

      <Dialog open={!!detailOrder} onOpenChange={open => { if (!open) setDetailOrder(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Order #{detailOrder?.id.slice(-8).toUpperCase()}</DialogTitle></DialogHeader>
          {detailOrder && (
            <div className="space-y-4 pt-2">
              <div className="flex justify-between text-sm"><span className="text-slate-500 dark:text-slate-400">Customer</span><span className="font-medium">{detailOrder.user?.name ?? "Unknown"}</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-500 dark:text-slate-400">Status</span><Badge variant={statusConfig[detailOrder.status]?.variant ?? "secondary"}>{statusConfig[detailOrder.status]?.label ?? detailOrder.status}</Badge></div>
              <div className="flex justify-between text-sm"><span className="text-slate-500 dark:text-slate-400">Date</span><span>{new Date(detailOrder.createdAt).toLocaleDateString()}</span></div>
              <div className="border-t border-slate-200 dark:border-slate-700 pt-3 space-y-2">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Items</p>
                {detailOrder.items.map((i: OrderItem) => (
                  <div key={i.id} className="flex justify-between text-sm">
                    <span>{i.product.name} × {i.quantity}</span>
                    <span className="font-medium">KES {(i.quantity * i.price).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-sm font-bold border-t border-slate-200 dark:border-slate-700 pt-3">
                <span>Total</span>
                <span>KES {detailOrder.items.reduce((s: number, i: OrderItem) => s + i.quantity * i.price, 0).toLocaleString()}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

