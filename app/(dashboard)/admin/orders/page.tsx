import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, ShoppingCart, Eye, CheckCircle, XCircle } from "lucide-react";

const orders = [
  { id: "ORD-8821", buyer: "John Kamau", supplier: "Wanjiku Agro", items: 3, total: "KES 12,450", date: "Feb 24, 2026", payment: "M-Pesa", status: "Processing" },
  { id: "ORD-8820", buyer: "Mary Njeri", supplier: "Pioneer Seeds", items: 1, total: "KES 3,400", date: "Feb 24, 2026", payment: "Bank Transfer", status: "Shipped" },
  { id: "ORD-8819", buyer: "James Mwangi", supplier: "IrriTech Kenya", items: 5, total: "KES 92,500", date: "Feb 23, 2026", payment: "M-Pesa", status: "Delivered" },
  { id: "ORD-8818", buyer: "Grace Akinyi", supplier: "AgroChem Ltd", items: 2, total: "KES 8,700", date: "Feb 23, 2026", payment: "Card", status: "Cancelled" },
  { id: "ORD-8817", buyer: "David Njoroge", supplier: "GreenEarth Organics", items: 4, total: "KES 5,200", date: "Feb 22, 2026", payment: "M-Pesa", status: "Delivered" },
  { id: "ORD-8816", buyer: "Alice Chebet", supplier: "Wanjiku Agro", items: 2, total: "KES 7,800", date: "Feb 22, 2026", payment: "M-Pesa", status: "Shipped" },
  { id: "ORD-8815", buyer: "Peter Odhiambo", supplier: "Pioneer Seeds", items: 6, total: "KES 18,300", date: "Feb 21, 2026", payment: "Bank Transfer", status: "Processing" },
];

const statusConfig: Record<string, "success" | "warning" | "info" | "destructive"> = {
  Processing: "warning",
  Shipped: "info",
  Delivered: "success",
  Cancelled: "destructive",
};

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Orders</h1>
        <p className="text-sm text-slate-500">Platform-wide order monitoring and management</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Orders (MTD)", value: "4,287", color: "text-slate-700" },
          { label: "Processing", value: "312", color: "text-amber-600" },
          { label: "Delivered", value: "3,842", color: "text-green-600" },
          { label: "Cancelled", value: "133", color: "text-red-600" },
        ].map(({ label, value, color }) => (
          <Card key={label}>
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-slate-500">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Search orders..." />
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

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  {["Order ID", "Buyer", "Supplier", "Items", "Total", "Payment", "Date", "Status", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-slate-600 dark:text-slate-400">{o.id}</td>
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{o.buyer}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 text-xs">{o.supplier}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{o.items}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{o.total}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{o.payment}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{o.date}</td>
                    <td className="px-4 py-3"><Badge variant={statusConfig[o.status]} className="text-xs">{o.status}</Badge></td>
                    <td className="px-4 py-3"><Button variant="ghost" size="sm"><Eye className="w-3 h-3" /></Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
