import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Package, DollarSign, Truck, Star, BarChart3, ArrowUpRight } from "lucide-react";

export default async function SupplierOverviewPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const supplier = await db.supplier.findUnique({
    where: { userId: session.user.id },
    include: { products: { orderBy: { createdAt: "desc" }, take: 5 } },
  });

  if (!supplier) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Supplier Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Your supplier profile is not set up yet.</p>
        </div>
        <div className="p-8 text-center bg-slate-50 dark:bg-slate-800 rounded-2xl">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400 mb-4">No supplier profile found. Please contact support.</p>
        </div>
      </div>
    );
  }

  // Fetch orders that contain this supplier's products
  const supplierProductIds = (await db.product.findMany({
    where: { supplierId: supplier.id },
    select: { id: true },
  })).map((p) => p.id);

  const [recentOrders, productCount, totalRevenue] = await Promise.all([
    db.order.findMany({
      where: { items: { some: { productId: { in: supplierProductIds } } } },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true } },
        items: { where: { productId: { in: supplierProductIds } }, include: { product: { select: { name: true } } } },
      },
    }),
    db.product.count({ where: { supplierId: supplier.id } }),
    db.orderItem.aggregate({
      _sum: { price: true },
      where: { productId: { in: supplierProductIds } },
    }),
  ]);

  const revenue = (totalRevenue._sum.price ?? 0) * 1; // price per item already includes quantity multiplier in OrderItem
  const activeOrderCount = recentOrders.filter((o) => ["PENDING", "CONFIRMED", "SHIPPED"].includes(o.status)).length;

  const stats = [
    { label: "Total Revenue", value: `KES ${(revenue / 1000).toFixed(0)}K`, icon: DollarSign, color: "text-green-600 bg-green-100 dark:bg-green-900/30" },
    { label: "Active Orders", value: activeOrderCount.toString(), icon: Truck, color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30" },
    { label: "Products Listed", value: productCount.toString(), icon: Package, color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30" },
    { label: "Store Rating", value: supplier.rating.toFixed(1), icon: Star, color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30" },
  ];

  const orderStatusVariant = (s: string): "success" | "info" | "warning" | "destructive" | "secondary" =>
    s === "DELIVERED" ? "success" : s === "SHIPPED" ? "info" : s === "CONFIRMED" ? "warning" : s === "CANCELLED" ? "destructive" : "secondary";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Supplier Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{supplier.companyName} — store performance</p>
        </div>
        <Button asChild><Link href="/supplier/products"><Package className="w-4 h-4" /> Manage Products</Link></Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}><Icon className="w-5 h-5" /></div>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Button variant="ghost" size="sm" asChild><Link href="/supplier/orders">View All</Link></Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4">No orders yet</p>
              ) : recentOrders.map((o) => {
                const itemName = o.items[0]?.product.name ?? "Product";
                const itemCount = o.items.reduce((s, i) => s + i.quantity, 0);
                return (
                  <div key={o.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">{o.id.slice(-6).toUpperCase()}</span>
                        <Badge variant={orderStatusVariant(o.status)} className="text-xs">{o.status}</Badge>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{o.user.name ?? "Customer"} · {itemName}{itemCount > 1 ? ` +${itemCount - 1}` : ""}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">KES {o.totalAmount.toLocaleString()}</p>
                      <p className="text-xs text-slate-400">{new Date(o.createdAt).toLocaleDateString("en-KE", { month: "short", day: "numeric" })}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Top Products</CardTitle>
            <Button variant="ghost" size="sm" asChild><Link href="/supplier/products">View All</Link></Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {supplier.products.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4">No products listed yet</p>
              ) : supplier.products.map((p, i) => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white line-clamp-1">{p.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{p.stock} in stock · {p.category}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-green-600">KES {p.price.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
