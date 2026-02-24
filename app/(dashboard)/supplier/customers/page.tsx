import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Search, Eye, ShoppingCart, Star, MapPin } from "lucide-react";

const customers = [
  { name: "John Kamau", email: "john.kamau@email.com", county: "Nakuru", totalOrders: 12, totalSpent: "KES 156,000", lastOrder: "Feb 24, 2026", rating: 5, status: "Active" },
  { name: "Mary Wanjiku", email: "mary.w@email.com", county: "Kiambu", totalOrders: 8, totalSpent: "KES 89,000", lastOrder: "Feb 23, 2026", rating: 4, status: "Active" },
  { name: "Peter Odhiambo", email: "peter.o@email.com", county: "Kisumu", totalOrders: 15, totalSpent: "KES 210,000", lastOrder: "Feb 22, 2026", rating: 5, status: "Active" },
  { name: "Grace Akinyi", email: "grace.a@email.com", county: "Nairobi", totalOrders: 3, totalSpent: "KES 52,000", lastOrder: "Feb 20, 2026", rating: 4, status: "Active" },
  { name: "James Mwangi", email: "james.m@email.com", county: "Meru", totalOrders: 20, totalSpent: "KES 380,000", lastOrder: "Feb 18, 2026", rating: 5, status: "VIP" },
  { name: "Alice Chebet", email: "alice.c@email.com", county: "Uasin Gishu", totalOrders: 2, totalSpent: "KES 15,400", lastOrder: "Jan 15, 2026", rating: 3, status: "Inactive" },
];

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Customers</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage your customer relationships</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Customers", value: "186", icon: Users },
          { label: "Active This Month", value: "124", icon: ShoppingCart },
          { label: "VIP Customers", value: "18", icon: Star },
          { label: "Avg Lifetime Value", value: "KES 45K", icon: MapPin },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="p-4 text-center">
              <Icon className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-lg font-bold text-slate-900 dark:text-white">{value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Search customers..." />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left p-4 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase">Customer</th>
                  <th className="text-left p-4 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase">County</th>
                  <th className="text-left p-4 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase">Orders</th>
                  <th className="text-left p-4 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase">Total Spent</th>
                  <th className="text-left p-4 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase">Last Order</th>
                  <th className="text-left p-4 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase">Status</th>
                  <th className="text-right p-4 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase">Action</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.email} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{c.name}</p>
                        <p className="text-xs text-slate-400">{c.email}</p>
                      </div>
                    </td>
                    <td className="p-4 text-slate-500 dark:text-slate-400">{c.county}</td>
                    <td className="p-4 text-slate-500 dark:text-slate-400">{c.totalOrders}</td>
                    <td className="p-4 font-semibold text-slate-900 dark:text-white">{c.totalSpent}</td>
                    <td className="p-4 text-slate-400 text-xs">{c.lastOrder}</td>
                    <td className="p-4">
                      <Badge variant={c.status === "VIP" ? "default" : c.status === "Active" ? "success" : "secondary"} className="text-xs">{c.status}</Badge>
                    </td>
                    <td className="p-4 text-right">
                      <Button variant="outline" size="sm"><Eye className="w-3 h-3" /> View</Button>
                    </td>
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
