import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Package, AlertTriangle, CheckCircle, TrendingDown, Search } from "lucide-react";

const inventory = [
  { name: "NPK 17:17:17 (50kg)", sku: "FRT-001", stock: 85, reorder: 20, status: "In Stock", category: "Fertilizers" },
  { name: "Hybrid Maize Seeds (2kg)", sku: "SDS-001", stock: 42, reorder: 50, status: "In Stock", category: "Seeds" },
  { name: "Tuta Absoluta Trap", sku: "PST-001", stock: 120, reorder: 30, status: "In Stock", category: "Pest Control" },
  { name: "Drip Irrigation Kit", sku: "EQP-001", stock: 8, reorder: 10, status: "Low Stock", category: "Equipment" },
  { name: "CAN Fertilizer (50kg)", sku: "FRT-002", stock: 0, reorder: 25, status: "Out of Stock", category: "Fertilizers" },
  { name: "Organic Neem Oil (1L)", sku: "PST-002", stock: 35, reorder: 20, status: "In Stock", category: "Pest Control" },
  { name: "Knapsack Sprayer (20L)", sku: "EQP-002", stock: 15, reorder: 10, status: "In Stock", category: "Equipment" },
  { name: "Tomato Seeds F1 Hybrid", sku: "SDS-002", stock: 3, reorder: 15, status: "Low Stock", category: "Seeds" },
];

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Inventory</h1>
          <p className="text-sm text-slate-500">Track stock levels and reorder alerts</p>
        </div>
        <Button><Package className="w-4 h-4" /> Restock</Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Products", value: "48", icon: Package, color: "text-green-600 bg-green-100 dark:bg-green-900/30" },
          { label: "In Stock", value: "40", icon: CheckCircle, color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30" },
          { label: "Low Stock", value: "5", icon: TrendingDown, color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30" },
          { label: "Out of Stock", value: "3", icon: AlertTriangle, color: "text-red-600 bg-red-100 dark:bg-red-900/30" },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}><Icon className="w-5 h-5" /></div>
                <div><p className="text-xs text-slate-500">{label}</p><p className="text-lg font-bold text-slate-900 dark:text-white">{value}</p></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Search inventory..." />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left p-4 font-semibold text-slate-500 text-xs uppercase">Product</th>
                  <th className="text-left p-4 font-semibold text-slate-500 text-xs uppercase">SKU</th>
                  <th className="text-left p-4 font-semibold text-slate-500 text-xs uppercase">Stock</th>
                  <th className="text-left p-4 font-semibold text-slate-500 text-xs uppercase">Reorder Level</th>
                  <th className="text-left p-4 font-semibold text-slate-500 text-xs uppercase">Status</th>
                  <th className="text-right p-4 font-semibold text-slate-500 text-xs uppercase">Action</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <tr key={item.sku} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{item.name}</p>
                        <p className="text-xs text-slate-400">{item.category}</p>
                      </div>
                    </td>
                    <td className="p-4 text-slate-500 font-mono text-xs">{item.sku}</td>
                    <td className="p-4">
                      <div className="w-24">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-medium text-slate-900 dark:text-white">{item.stock}</span>
                        </div>
                        <Progress value={Math.min((item.stock / (item.reorder * 4)) * 100, 100)} className="h-1.5" />
                      </div>
                    </td>
                    <td className="p-4 text-slate-500">{item.reorder}</td>
                    <td className="p-4">
                      <Badge variant={item.status === "In Stock" ? "success" : item.status === "Low Stock" ? "warning" : "destructive"} className="text-xs">{item.status}</Badge>
                    </td>
                    <td className="p-4 text-right">
                      <Button variant="outline" size="sm" disabled={item.status === "In Stock"}>Restock</Button>
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
