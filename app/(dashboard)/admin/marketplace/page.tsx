"use client";

import { useState, useEffect, useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Search, ShoppingBag, CheckCircle, XCircle, Star, Loader2, Package } from "lucide-react";
import { getProducts, toggleProductFeatured, toggleProductActive } from "@/lib/actions/admin";

type Product = Awaited<ReturnType<typeof getProducts>>[number];

export default function AdminMarketplacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pending, startTransition] = useTransition();

  const load = (s = search) =>
    getProducts({ search: s || undefined }).then(setProducts).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const handleSearch = (val: string) => { setSearch(val); load(val); };

  const handleToggleActive = (product: Product) => {
    startTransition(async () => {
      try {
        await toggleProductActive(product.id, !product.isActive);
        toast.success(product.isActive ? "Product deactivated" : "Product activated");
        const data = await getProducts({ search: search || undefined }); setProducts(data);
      } catch (err) { toast.error((err as Error).message); }
    });
  };

  const handleToggleFeatured = (product: Product) => {
    startTransition(async () => {
      try {
        await toggleProductFeatured(product.id, !product.isFeatured);
        toast.success(product.isFeatured ? "Removed from featured" : "Marked as featured");
        const data = await getProducts({ search: search || undefined }); setProducts(data);
      } catch (err) { toast.error((err as Error).message); }
    });
  };

  const stats = {
    total: products.length,
    active: products.filter((p: any) => p.isActive).length,
    featured: products.filter((p: any) => p.isFeatured).length,
    inactive: products.filter((p: any) => !p.isActive).length,
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>;

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
          <Card key={label}><CardContent className="p-4 text-center"><p className={`text-2xl font-bold ${color}`}>{value}</p><p className="text-xs text-slate-500 dark:text-slate-400">{label}</p></CardContent></Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input className="pl-10" placeholder="Search products or suppliers..." value={search} onChange={e => handleSearch(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {products.length === 0 ? (
        <Card className="p-12 text-center">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">No products found</h3>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    {["Product", "Supplier", "Category", "Price", "Stock", "Status", "Actions"].map((h: any) => (
                      <th key={h} className="px-4 py-3 text-left font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {products.map((p: Product) => (
                    <tr key={p.id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${!p.isActive ? "opacity-60" : ""}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {p.isFeatured && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 flex-shrink-0" />}
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white line-clamp-1">{p.name}</p>
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
    </div>
  );
}

