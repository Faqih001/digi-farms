"use client";

import { useState, useTransition, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Package, AlertTriangle, CheckCircle, TrendingDown, Search, X, Loader2, Edit2 } from "lucide-react";
import { toast } from "sonner";
import { getSupplierProducts, updateProductStock } from "@/lib/actions/product";

type Product = Awaited<ReturnType<typeof getSupplierProducts>>[number];

function stockStatus(stock: number, reorderLevel = 10): { label: string; variant: string; cls: string } {
  if (stock === 0) return { label: "Out of Stock", variant: "destructive", cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" };
  if (stock <= reorderLevel) return { label: "Low Stock", variant: "warning", cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" };
  return { label: "In Stock", variant: "success", cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" };
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
    if (isNaN(qty) || qty < 0) { toast.error("Enter a valid stock quantity"); return; }
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

  const filtered = products.filter((p) => {
    const { label } = stockStatus(p.stock);
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || label === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalProducts = products.length;
  const inStockCount = products.filter((p) => p.stock > 10).length;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 10).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Inventory</h1>
          <p className="text-sm text-slate-500">Track stock levels and update quantities</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Products", value: totalProducts, icon: Package, color: "text-green-600 bg-green-100 dark:bg-green-900/30", filter: "all" },
          { label: "In Stock", value: inStockCount, icon: CheckCircle, color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30", filter: "In Stock" },
          { label: "Low Stock", value: lowStockCount, icon: TrendingDown, color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30", filter: "Low Stock" },
          { label: "Out of Stock", value: outOfStockCount, icon: AlertTriangle, color: "text-red-600 bg-red-100 dark:bg-red-900/30", filter: "Out of Stock" },
        ].map(({ label, value, icon: Icon, color, filter }) => (
          <Card
            key={label}
            onClick={() => setFilterStatus(filterStatus === filter ? "all" : filter)}
            className={`cursor-pointer transition-all hover:shadow-md ${filterStatus === filter ? "ring-2 ring-green-500" : ""}`}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}><Icon className="w-5 h-5" /></div>
                <div>
                  <p className="text-xs text-slate-500">{label}</p>
                  {loading ? <div className="h-5 w-6 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mt-1" /> : <p className="text-lg font-bold text-slate-900 dark:text-white">{value}</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input className="pl-9 rounded-xl" placeholder="Search by name or category..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Package className="w-12 h-12 text-slate-300 mb-3" />
          <p className="text-slate-500 font-medium">No products found</p>
          <p className="text-sm text-slate-400 mt-1">Add products from the Products page first</p>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left p-4 font-semibold text-slate-500 text-xs uppercase">Product</th>
                    <th className="text-left p-4 font-semibold text-slate-500 text-xs uppercase hidden sm:table-cell">Category</th>
                    <th className="text-left p-4 font-semibold text-slate-500 text-xs uppercase">Stock</th>
                    <th className="text-left p-4 font-semibold text-slate-500 text-xs uppercase">Status</th>
                    <th className="text-left p-4 font-semibold text-slate-500 text-xs uppercase hidden md:table-cell">Price</th>
                    <th className="text-right p-4 font-semibold text-slate-500 text-xs uppercase">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((product) => {
                    const { label, cls } = stockStatus(product.stock);
                    const maxStock = Math.max(product.stock, 50);
                    return (
                      <tr key={product.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-4">
                          <p className="font-medium text-slate-900 dark:text-white text-sm">{product.name}</p>
                          <p className="text-xs text-slate-400 sm:hidden">{product.category}</p>
                        </td>
                        <td className="p-4 text-slate-500 hidden sm:table-cell">{product.category}</td>
                        <td className="p-4">
                          <div className="w-28">
                            <p className="text-xs font-semibold text-slate-900 dark:text-white mb-1">{product.stock} units</p>
                            <Progress value={Math.min((product.stock / maxStock) * 100, 100)} className="h-1.5" />
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${cls}`}>{label}</span>
                        </td>
                        <td className="p-4 text-slate-600 dark:text-slate-300 hidden md:table-cell">KES {product.price.toLocaleString()}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => { setEditProduct(product); setNewStock(String(product.stock)); }}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-green-50 hover:bg-green-100 text-green-700 dark:bg-green-900/20 dark:hover:bg-green-900/40 dark:text-green-400 transition-colors ml-auto"
                          >
                            <Edit2 className="w-3.5 h-3.5" /> Update Stock
                          </button>
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
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{editProduct.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{editProduct.category} · KES {editProduct.price.toLocaleString()}</p>
                <p className="text-xs text-slate-500 mt-0.5">Current stock: <span className="font-bold">{editProduct.stock} units</span></p>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">New Stock Quantity</label>
                <Input
                  type="number"
                  min={0}
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value)}
                  className="rounded-xl"
                  placeholder="Enter quantity"
                />
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
