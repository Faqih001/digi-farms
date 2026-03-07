"use client";

import { useState, useEffect, useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Search, ShoppingBag, CheckCircle, XCircle, Star, Loader2, X, ChevronDown, Package, Shield } from "lucide-react";
import { getProducts, toggleProductFeatured, toggleProductActive } from "@/lib/actions/admin";

type Product = Awaited<ReturnType<typeof getProducts>>[number];

const CATEGORIES = ["all", "Seeds", "Fertilizers", "Pesticides", "Equipment", "Feed", "Veterinary", "Other"];

export default function AdminMarketplacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [pending, startTransition] = useTransition();

  async function load(s = search, cat = category) {
    setLoading(true);
    try {
      const data = await getProducts({
        search: s || undefined,
        category: cat !== "all" ? cat : undefined,
      });
      setProducts(data);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const t = setTimeout(() => load(search, category), 350);
    return () => clearTimeout(t);
  }, [search, category]);

  const handleToggleActive = (product: Product) => {
    startTransition(async () => {
      try {
        await toggleProductActive(product.id, !product.isActive);
        toast.success(product.isActive ? "Product deactivated" : "Product activated");
        await load();
        if (selectedProduct?.id === product.id) {
          setSelectedProduct(prev => prev ? { ...prev, isActive: !product.isActive } : null);
        }
      } catch (err) { toast.error((err as Error).message); }
    });
  };

  const handleToggleFeatured = (product: Product) => {
    startTransition(async () => {
      try {
        await toggleProductFeatured(product.id, !product.isFeatured);
        toast.success(product.isFeatured ? "Removed from featured" : "Marked as featured");
        await load();
        if (selectedProduct?.id === product.id) {
          setSelectedProduct(prev => prev ? { ...prev, isFeatured: !product.isFeatured } : null);
        }
      } catch (err) { toast.error((err as Error).message); }
    });
  };

  const stats = {
    total: products.length,
    active: products.filter(p => p.isActive).length,
    featured: products.filter(p => p.isFeatured).length,
    inactive: products.filter(p => !p.isActive).length,
  };

  if (loading && products.length === 0) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Marketplace</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Review, moderate, and manage marketplace products</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Products", value: stats.total, color: "text-slate-700 dark:text-slate-300" },
          { label: "Active Listings", value: stats.active, color: "text-green-600" },
          { label: "Featured", value: stats.featured, color: "text-amber-600" },
          { label: "Inactive", value: stats.inactive, color: "text-red-600" },
        ].map(({ label, value, color }) => (
          <Card key={label}>
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search + Category Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input className="pl-9 rounded-xl" placeholder="Search products or suppliers..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="relative">
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="h-10 pl-3 pr-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none"
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c === "all" ? "All Categories" : c}</option>)}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>
      ) : products.length === 0 ? (
        <Card className="p-12 text-center">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">No products found</h3>
          <p className="text-sm text-slate-400">Try adjusting your search or category filter</p>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    {["Product", "Supplier", "Category", "Price", "Stock", "Status", "Actions"].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {products.map((p) => (
                    <tr key={p.id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${!p.isActive ? "opacity-60" : ""}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {p.isFeatured && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 flex-shrink-0" />}
                          <div>
                            <button
                              onClick={() => setSelectedProduct(p)}
                              className="font-semibold text-slate-900 dark:text-white hover:text-green-600 dark:hover:text-green-400 line-clamp-1 text-left"
                            >
                              {p.name}
                            </button>
                            <p className="text-xs text-slate-400">{p.unit}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400 text-xs">
                        {p.supplier.companyName}
                        {p.supplier.isVerified && <span className="ml-1 text-green-500">✓</span>}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{p.category}</td>
                      <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">KES {p.price.toLocaleString()}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{p.stock}</td>
                      <td className="px-4 py-3">
                        <Badge variant={p.isActive ? "success" : "destructive"} className="text-xs">{p.isActive ? "Active" : "Inactive"}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" disabled={pending} title={p.isFeatured ? "Remove from featured" : "Feature product"} onClick={() => handleToggleFeatured(p)}>
                            <Star className={`w-3.5 h-3.5 ${p.isFeatured ? "text-amber-400 fill-amber-400" : "text-slate-400"}`} />
                          </Button>
                          <Button variant="ghost" size="sm" disabled={pending} title={p.isActive ? "Deactivate" : "Activate"} onClick={() => handleToggleActive(p)}>
                            {p.isActive ? <XCircle className="w-3.5 h-3.5 text-red-500" /> : <CheckCircle className="w-3.5 h-3.5 text-green-600" />}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => !pending && setSelectedProduct(null)} />
          <div className="relative z-10 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-900">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Product Details</h2>
              {!pending && (
                <button onClick={() => setSelectedProduct(null)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                  <Package className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-slate-900 dark:text-white">{selectedProduct.name}</p>
                    {selectedProduct.isFeatured && <Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
                    {selectedProduct.isAntiCounterfeit && (
                      <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-1.5 py-0.5 rounded-full">
                        <Shield className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">{selectedProduct.category}{selectedProduct.subcategory ? ` › ${selectedProduct.subcategory}` : ""}</p>
                </div>
              </div>

              {selectedProduct.description && (
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Description</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{selectedProduct.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Price</p>
                  <p className="font-bold text-green-700 dark:text-green-400">KES {selectedProduct.price.toLocaleString()} / {selectedProduct.unit}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Stock</p>
                  <p className="font-semibold">{selectedProduct.stock} {selectedProduct.unit}s</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Supplier</p>
                  <p className="font-semibold">{selectedProduct.supplier.companyName}</p>
                  {selectedProduct.supplier.isVerified && <p className="text-xs text-green-600 dark:text-green-400">✓ Verified</p>}
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Status</p>
                  <Badge variant={selectedProduct.isActive ? "success" : "destructive"} className="text-xs">{selectedProduct.isActive ? "Active" : "Inactive"}</Badge>
                </div>
              </div>

              {selectedProduct.tags?.length > 0 && (
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Tags</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedProduct.tags.map(tag => (
                      <span key={tag} className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  disabled={pending}
                  onClick={() => handleToggleFeatured(selectedProduct)}
                  variant="outline"
                  className="flex-1"
                >
                  <Star className={`w-4 h-4 mr-1 ${selectedProduct.isFeatured ? "text-amber-400 fill-amber-400" : ""}`} />
                  {selectedProduct.isFeatured ? "Unfeature" : "Feature"}
                </Button>
                <Button
                  disabled={pending}
                  onClick={() => handleToggleActive(selectedProduct)}
                  className={`flex-1 ${selectedProduct.isActive ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"} text-white`}
                >
                  {selectedProduct.isActive ? <><XCircle className="w-4 h-4 mr-1" /> Deactivate</> : <><CheckCircle className="w-4 h-4 mr-1" /> Activate</>}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

