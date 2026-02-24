import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Package, DollarSign, Truck, TrendingUp, ShoppingCart, Eye, BarChart3,
  ArrowUpRight, ArrowDownRight, Users, Star, Clock
} from "lucide-react";

const stats = [
  { label: "Total Revenue", value: "KES 1.24M", change: "+18.2%", up: true, icon: DollarSign, color: "text-green-600 bg-green-100 dark:bg-green-900/30" },
  { label: "Active Orders", value: "23", change: "+5", up: true, icon: Truck, color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30" },
  { label: "Products Listed", value: "48", change: "+3", up: true, icon: Package, color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30" },
  { label: "Avg Rating", value: "4.7", change: "+0.2", up: true, icon: Star, color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30" },
];

const recentOrders = [
  { id: "ORD-4021", customer: "John Kamau", items: "NPK Fertilizer x5", amount: "KES 12,500", status: "Processing", time: "2h ago" },
  { id: "ORD-4020", customer: "Mary Wanjiku", items: "Maize Seeds (10kg)", amount: "KES 3,200", status: "Shipped", time: "4h ago" },
  { id: "ORD-4019", customer: "Peter Odhiambo", items: "Pesticide Bundle", amount: "KES 8,750", status: "Delivered", time: "1d ago" },
  { id: "ORD-4018", customer: "Grace Akinyi", items: "Drip Irrigation Kit", amount: "KES 45,000", status: "Processing", time: "1d ago" },
  { id: "ORD-4017", customer: "James Mwangi", items: "DAP Fertilizer x10", amount: "KES 28,000", status: "Delivered", time: "2d ago" },
];

const topProducts = [
  { name: "NPK 17:17:17 (50kg)", sales: 142, revenue: "KES 355,000", stock: 85 },
  { name: "Hybrid Maize Seeds", sales: 98, revenue: "KES 196,000", stock: 42 },
  { name: "Tuta Absoluta Trap", sales: 76, revenue: "KES 91,200", stock: 120 },
  { name: "Drip Irrigation Kit", sales: 23, revenue: "KES 1,035,000", stock: 8 },
];

export default function SupplierOverviewPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Supplier Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Welcome back, Wanjiku — here&apos;s your store performance</p>
        </div>
        <Button><Package className="w-4 h-4" /> Add Product</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, change, up, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <Badge variant={up ? "success" : "destructive"} className="text-xs">
                  {up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />} {change}
                </Badge>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Button variant="ghost" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.map((o) => (
                <div key={o.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">{o.id}</span>
                      <Badge variant={o.status === "Delivered" ? "success" : o.status === "Shipped" ? "info" : "warning"} className="text-xs">{o.status}</Badge>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{o.customer} • {o.items}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{o.amount}</p>
                    <p className="text-xs text-slate-400">{o.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Top Products</CardTitle>
            <Button variant="ghost" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={p.name} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{p.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{p.sales} sold • {p.stock} in stock</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-green-600">{p.revenue}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart Placeholder */}
      <Card>
        <CardHeader><CardTitle>Revenue Trend (30 Days)</CardTitle></CardHeader>
        <CardContent>
          <div className="h-48 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/10 dark:to-emerald-950/10 rounded-xl flex items-center justify-center border border-dashed border-green-200 dark:border-green-800">
            <div className="text-center">
              <BarChart3 className="w-10 h-10 text-green-300 mx-auto mb-2" />
              <p className="text-sm text-slate-400">Revenue chart renders with live data</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
