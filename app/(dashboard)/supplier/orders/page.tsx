import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Truck, Eye, Package, Clock, CheckCircle, XCircle, Search } from "lucide-react";

const orders = [
  { id: "ORD-4021", customer: "John Kamau", phone: "+254 700 123 456", items: [{ name: "NPK Fertilizer x5", price: "KES 12,500" }], total: "KES 12,500", status: "Processing", date: "Feb 24, 2026", county: "Nakuru" },
  { id: "ORD-4020", customer: "Mary Wanjiku", phone: "+254 711 234 567", items: [{ name: "Maize Seeds (10kg)", price: "KES 3,200" }], total: "KES 3,200", status: "Shipped", date: "Feb 24, 2026", county: "Kiambu" },
  { id: "ORD-4019", customer: "Peter Odhiambo", phone: "+254 722 345 678", items: [{ name: "Pesticide Bundle", price: "KES 8,750" }], total: "KES 8,750", status: "Delivered", date: "Feb 23, 2026", county: "Kisumu" },
  { id: "ORD-4018", customer: "Grace Akinyi", phone: "+254 733 456 789", items: [{ name: "Drip Kit", price: "KES 45,000" }], total: "KES 45,000", status: "Processing", date: "Feb 23, 2026", county: "Nairobi" },
  { id: "ORD-4017", customer: "James Mwangi", phone: "+254 744 567 890", items: [{ name: "DAP Fertilizer x10", price: "KES 28,000" }], total: "KES 28,000", status: "Delivered", date: "Feb 22, 2026", county: "Meru" },
  { id: "ORD-4016", customer: "Alice Chebet", phone: "+254 755 678 901", items: [{ name: "Tomato Seeds x3", price: "KES 5,400" }], total: "KES 5,400", status: "Cancelled", date: "Feb 22, 2026", county: "Uasin Gishu" },
];

const statusConfig: Record<string, { variant: "success" | "info" | "warning" | "destructive"; icon: typeof CheckCircle }> = {
  Delivered: { variant: "success", icon: CheckCircle },
  Shipped: { variant: "info", icon: Truck },
  Processing: { variant: "warning", icon: Clock },
  Cancelled: { variant: "destructive", icon: XCircle },
};

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Orders</h1>
          <p className="text-sm text-slate-500">Manage incoming orders and fulfillment</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Orders", value: "247", color: "text-green-600" },
          { label: "Processing", value: "8", color: "text-amber-600" },
          { label: "Shipped", value: "12", color: "text-blue-600" },
          { label: "Cancelled", value: "3", color: "text-red-600" },
        ].map(({ label, value, color }) => (
          <Card key={label}>
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-slate-500">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Search by order ID or customer..." />
            </div>
            <select className="h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm">
              <option>All Status</option>
              <option>Processing</option>
              <option>Shipped</option>
              <option>Delivered</option>
              <option>Cancelled</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {orders.map((o) => {
              const sc = statusConfig[o.status];
              return (
                <div key={o.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                        <Package className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">{o.id}</span>
                          <Badge variant={sc.variant} className="text-xs">{o.status}</Badge>
                        </div>
                        <p className="text-xs text-slate-500">{o.customer} • {o.county}</p>
                        <p className="text-xs text-slate-400">{o.items.map((i) => i.name).join(", ")}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-bold text-sm text-slate-900 dark:text-white">{o.total}</p>
                        <p className="text-xs text-slate-400">{o.date}</p>
                      </div>
                      <div className="flex gap-1.5">
                        <Button variant="outline" size="sm"><Eye className="w-3 h-3" /></Button>
                        {o.status === "Processing" && <Button size="sm"><Truck className="w-3 h-3" /> Ship</Button>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
