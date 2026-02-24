"use client";

import { useState, useTransition, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart, Eye, X, Loader2, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { getAdminOrders, updateAdminOrderStatus } from "@/lib/actions/admin";

type Order = Awaited<ReturnType<typeof getAdminOrders>>[number];

const STATUS_OPTIONS = ["all", "PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

const statusCls: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  CONFIRMED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  SHIPPED: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  DELIVERED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isPending, startTransition] = useTransition();

  async function load() {
    setLoading(true);
    try {
      const data = await getAdminOrders({ status: filterStatus !== "all" ? filterStatus : undefined, search: search || undefined });
      setOrders(data);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [filterStatus]);

  useEffect(() => {
    const t = setTimeout(load, 400);
    return () => clearTimeout(t);
  }, [search]);

  function updateStatus(orderId: string, status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED") {
    startTransition(async () => {
      try {
        await updateAdminOrderStatus(orderId, status);
        toast.success("Order status updated");
        await load();
        if (selectedOrder?.id === orderId) {
          setSelectedOrder((prev) => prev ? { ...prev, status } : null);
        }
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to update status");
      }
    });
  }

  const totalOrders = orders.length;
  const pendingCount = orders.filter((o) => o.status === "PENDING").length;
  const deliveredCount = orders.filter((o) => o.status === "DELIVERED").length;
  const cancelledCount = orders.filter((o) => o.status === "CANCELLED").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Orders</h1>
        <p className="text-sm text-slate-500">Platform-wide order monitoring and management</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Orders", value: totalOrders, color: "text-slate-700 dark:text-slate-200", filter: "all" },
          { label: "Pending", value: pendingCount, color: "text-amber-600", filter: "PENDING" },
          { label: "Delivered", value: deliveredCount, color: "text-green-600", filter: "DELIVERED" },
          { label: "Cancelled", value: cancelledCount, color: "text-red-600", filter: "CANCELLED" },
        ].map(({ label, value, color, filter }) => (
          <Card
            key={label}
            onClick={() => setFilterStatus(filterStatus === filter ? "all" : filter)}
            className={`cursor-pointer transition-all hover:shadow-md ${filterStatus === filter ? "ring-2 ring-green-500" : ""}`}
          >
            <CardContent className="p-4 text-center">
              {loading ? <div className="h-7 w-12 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mx-auto mb-1" /> : <p className={`text-2xl font-bold ${color}`}>{value}</p>}
              <p className="text-xs text-slate-500">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input className="pl-9 rounded-xl" placeholder="Search by order ID, buyer name or email…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="appearance-none h-10 pl-3 pr-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s === "all" ? "All Status" : s}</option>)}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <ShoppingCart className="w-12 h-12 text-slate-300 mb-3" />
          <p className="text-slate-500 font-medium">No orders found</p>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    {["Order ID", "Buyer", "Items", "Total (KES)", "Date", "Status", ""].map((h) => (
                      <th key={h} className="px-4 py-3 text-left font-semibold text-slate-500 text-xs uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-slate-600 dark:text-slate-400">{order.id.slice(0, 10)}…</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-900 dark:text-white text-sm">{order.user.name ?? "—"}</p>
                        <p className="text-xs text-slate-400">{order.user.email}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{order.items.length}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{order.totalAmount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{new Date(order.createdAt).toLocaleDateString("en-KE")}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusCls[order.status] ?? ""}`}>{order.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => setSelectedOrder(order)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => !isPending && setSelectedOrder(null)} />
          <div className="relative z-10 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-900">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Order Details</h2>
              {!isPending && (
                <button onClick={() => setSelectedOrder(null)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-1">Order ID</p>
                  <p className="font-mono text-xs font-bold">{selectedOrder.id}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-1">Total</p>
                  <p className="font-bold text-green-700 dark:text-green-400">KES {selectedOrder.totalAmount.toLocaleString()}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-1">Buyer</p>
                  <p className="font-semibold">{selectedOrder.user.name ?? selectedOrder.user.email}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-1">Date</p>
                  <p className="font-semibold">{new Date(selectedOrder.createdAt).toLocaleDateString("en-KE")}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Items</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                      <div>
                        <p className="text-sm font-medium">{item.product.name}</p>
                        <p className="text-xs text-slate-500">× {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold">KES {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {(["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"] as const).map((s) => (
                    <button
                      key={s}
                      disabled={isPending || selectedOrder.status === s}
                      onClick={() => updateStatus(selectedOrder.id, s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-40 ${
                        selectedOrder.status === s
                          ? `${statusCls[s]} ring-2 ring-current ring-offset-1`
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
