"use client";

import { useState, useTransition, useEffect } from "react";
import AppImage from "@/components/ui/app-image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Package, AlertTriangle, CheckCircle, TrendingDown, Search, X,
  Loader2, Edit2, DollarSign, TrendingUp, RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { getSupplierProducts, updateProductStock } from "@/lib/actions/product";

type Product = Awaited<ReturnType<typeof getSupplierProducts>>[number];

type StockInfo = { label: string; cls: string; barColor: string };

function stockStatus(stock: number, reorderLevel = 10): StockInfo {
  if (stock === 0)
    return { label: "Out of Stock", cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", barColor: "bg-red-500" };
  if (stock <= reorderLevel)
    return { label: "Low Stock", cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", barColor: "bg-amber-500" };
  return { label: "In Stock", cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", barColor: "bg-green-500" };
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [newStock, setNewStock] = useState("");
  const [isPending, startTransition] = useTransition();

  async function load() {
    setLoading(true);
    try {
      const data = await getSupplierProducts();
      setProducts(data);
    } catch {
      toast.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function handleRestock() {
    if (!editProduct) return;
    const qty = parseInt(newStock, 10);
    if (isNaN(qty) || qty < 0) { toast.error("Enter a valid quantity"); return; }
    startTransition(async () => {
      try {
        await updateProductStock(editProduct.id, qty);
        toast.success(`Stock updated to ${qty} units`);
        setEditProduct(null);
        setNewStock("");
        await load();
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to update stock");
      }
    });
  }

  const statusLabels = ["all", "In Stock", "Low Stock", "Out of Stock"];
  const filtered = products.filter((p) => {
    const { label } = stockStatus(p.stock);
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || label === filterStatus;
    return matchSearch && matchStatus;
  });

  const inStockCount = products.filter((p) => p.stock > 10).length;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 10).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;
  const totalValue = products.reduce((s, p) => s + p.stock * p.price, 0);
  const avgStock = products.length ? Math.round(products.reduce((s, p) => s + p.stock, 0) / products.length) : 0;

  const statCards = [
    { label: "Total Products", value: loading ? "—" : products.length, icon: Package, color: "text-green-600 bg-green-100 dark:bg-green-900/30", filter: "all" },
    { label: "In Stock", value: loading ? "—" : inStockCount, icon: CheckCircle, color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30", filter: "In Stock" },
    { label: "Low Stock", value: loading ? "—" : lowStockCount, icon: TrendingDown, color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30", filter: "Low Stock" },
    { label: "Out of Stock", value: loading ? "—" : outOfStockCount, icon: AlertTriangle, color: "text-red-600 bg-red-100 dark:bg-red-900/30", filter: "Out of Stock" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Inventory</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Track stock levels and update quantities</p>
        </div>
        <Button variant="outline" onClick={load} disabled={loading} className="rounded-xl self-start sm:self-auto">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, filter }) => (
          <Card
            key={label}
            onClick={() => setFilterStatus(filterStatus === filter ? "all" : filter)}
            className={`cursor-pointer transition-all hover:shadow-md ${filterStatus === filter ? "ring-2 ring-green-500" : ""}`}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}><Icon className="w-5 h-5" /></div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
                  {loading
                    ? <div className="h-5 w-6 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mt-1" />
                    : <p className="text-lg font-bold text-slate-900 dark:text-white">{value}</p>
                  }
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Inventory value panel */}
      {!loading && products.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-4">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Inventory Value</p>
                <p className="text-2xl font-black text-green-700 dark:text-green-400">KES {totalValue.toLocaleString()}</p>
                <p className="text-xs text-slate-400">{products.length} SKUs × avg KES {products.length ? Math.round(totalValue / products.length).toLocaleString() : 0} each</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Average Stock Level</p>
                <p className="text-2xl font-black text-blue-700 dark:text-blue-400">{avgStock} units</p>
                <p className="text-xs text-slate-400">{lowStockCount + outOfStockCount} products need restocking</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input className="pl-9 rounded-xl" placeholder="Search products…" value={search} onChange={(e) => setSearch(e.target.value)} />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          {statusLabels.map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${filterStatus === s ? "bg-green-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"}`}
            >
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}><CardContent className="p-4 space-y-3 animate-pulse">
              <div className="w-full aspect-video bg-slate-200 dark:bg-slate-700 rounded-xl" />
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
            </CardContent></Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Package className="w-12 h-12 text-slate-300 mb-3" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">No products found</p>
          <p className="text-sm text-slate-400 mt-1">Add products from the Products page first</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((product) => {
            const { label, cls, barColor } = stockStatus(product.stock);
            const maxStock = Math.max(product.stock, 50);
            const pct = Math.min((product.stock / maxStock) * 100, 100);
            const thumb = (product as any).imageUrls?.[0] ?? null;
            return (
              <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow">
                {/* Thumbnail */}
                <div className="relative w-full aspect-video bg-white dark:bg-slate-800">
                  {thumb ? (
                    <AppImage src={thumb} alt={product.name} fill className="object-cover" sizes="(max-width: 640px) 100vw, 33vw" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Package className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                    </div>
                  )}
                  <span className={`absolute top-2 right-2 text-xs font-semibold px-2 py-0.5 rounded-full ${cls}`}>{label}</span>
                </div>

                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-sm text-slate-900 dark:text-white truncate">{product.name}</h3>
                    <p className="text-xs text-slate-400">{product.category}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Stock: <span className="font-bold text-slate-900 dark:text-white">{product.stock} units</span></span>
                    <span className="font-semibold text-green-700 dark:text-green-400">KES {product.price.toLocaleString()}</span>
                  </div>

                  {/* Stock bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Stock level</span>
                      <span>{Math.round(pct)}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>

                  {/* Inventory value */}
                  <div className="flex items-center justify-between text-xs bg-slate-50 dark:bg-slate-800 rounded-lg p-2">
                    <span className="text-slate-500 dark:text-slate-400">Inventory value</span>
                    <span className="font-bold text-slate-900 dark:text-white">KES {(product.stock * product.price).toLocaleString()}</span>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => { setEditProduct(product); setNewStock(String(product.stock)); }}
                    className="w-full rounded-xl bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Edit2 className="w-3.5 h-3.5 mr-1.5" /> Update Stock
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Stock Update Modal */}
      {editProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => !isPending && setEditProduct(null)} />
          <div className="relative z-10 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Update Stock</h2>
              {!isPending && (
                <button onClick={() => setEditProduct(null)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                {(editProduct as any).imageUrls?.[0] ? (
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                    <AppImage src={(editProduct as any).imageUrls[0]} alt={editProduct.name} fill className="object-cover" sizes="56px" />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                    <Package className="w-7 h-7 text-slate-400" />
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{editProduct.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{editProduct.category} · KES {editProduct.price.toLocaleString()}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Current: <strong>{editProduct.stock} units</strong></p>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">New Quantity</label>
                <Input
                  type="number"
                  min={0}
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value)}
                  className="rounded-xl"
                  placeholder="Enter quantity"
                  autoFocus
                />
                {newStock && !isNaN(parseInt(newStock, 10)) && (
                  <p className="text-xs text-slate-400">
                    New inventory value: <strong className="text-green-600">KES {(parseInt(newStock, 10) * editProduct.price).toLocaleString()}</strong>
                  </p>
                )}
              </div>
            </div>
            <div className="px-5 pb-5 flex gap-3">
              <Button variant="outline" className="flex-1 rounded-xl" disabled={isPending} onClick={() => setEditProduct(null)}>Cancel</Button>
              <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl" disabled={isPending} onClick={handleRestock}>
                {isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving…</> : "Save Stock"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
