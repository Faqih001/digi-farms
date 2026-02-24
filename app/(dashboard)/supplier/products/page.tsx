import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Plus, Edit, Trash2, Eye, Search, Filter, MoreVertical, Star } from "lucide-react";
import Link from "next/link";

const products = [
  { id: 1, name: "NPK 17:17:17 Fertilizer (50kg)", price: "KES 2,500", stock: 85, sold: 142, rating: 4.8, category: "Fertilizers", status: "Active", image: "🌱" },
  { id: 2, name: "Hybrid Maize Seeds (2kg)", price: "KES 2,000", stock: 42, sold: 98, rating: 4.6, category: "Seeds", status: "Active", image: "🌽" },
  { id: 3, name: "Tuta Absoluta Pheromone Trap", price: "KES 1,200", stock: 120, sold: 76, rating: 4.5, category: "Pest Control", status: "Active", image: "🪤" },
  { id: 4, name: "Drip Irrigation Kit (1 Acre)", price: "KES 45,000", stock: 8, sold: 23, rating: 4.9, category: "Equipment", status: "Active", image: "💧" },
  { id: 5, name: "CAN Fertilizer (50kg)", price: "KES 2,200", stock: 0, sold: 67, rating: 4.3, category: "Fertilizers", status: "Out of Stock", image: "🧪" },
  { id: 6, name: "Organic Neem Oil (1L)", price: "KES 800", stock: 35, sold: 44, rating: 4.7, category: "Pest Control", status: "Active", image: "🍃" },
  { id: 7, name: "Knapsack Sprayer (20L)", price: "KES 3,500", stock: 15, sold: 31, rating: 4.4, category: "Equipment", status: "Active", image: "🔫" },
  { id: 8, name: "Tomato Seeds F1 Hybrid", price: "KES 1,800", stock: 3, sold: 55, rating: 4.8, category: "Seeds", status: "Low Stock", image: "🍅" },
];

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Products</h1>
          <p className="text-sm text-slate-500">{products.length} products listed</p>
        </div>
        <Button asChild><Link href="/supplier/products/new"><Plus className="w-4 h-4" /> Add Product</Link></Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Search products..." />
            </div>
            <select className="h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm">
              <option>All Categories</option>
              <option>Fertilizers</option>
              <option>Seeds</option>
              <option>Pest Control</option>
              <option>Equipment</option>
            </select>
            <select className="h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm">
              <option>All Status</option>
              <option>Active</option>
              <option>Out of Stock</option>
              <option>Low Stock</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Product Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((p) => (
          <Card key={p.id} className="card-hover">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl">{p.image}</div>
                <Badge variant={p.status === "Active" ? "success" : p.status === "Low Stock" ? "warning" : "destructive"} className="text-xs">{p.status}</Badge>
              </div>
              <h3 className="font-semibold text-sm text-slate-900 dark:text-white mb-1 line-clamp-2">{p.name}</h3>
              <p className="text-xs text-slate-500 mb-2">{p.category}</p>
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-green-600">{p.price}</span>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-xs text-slate-500">{p.rating}</span>
                </div>
              </div>
              <div className="flex justify-between text-xs text-slate-500 mb-3">
                <span>{p.stock} in stock</span>
                <span>{p.sold} sold</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1"><Edit className="w-3 h-3" /> Edit</Button>
                <Button variant="outline" size="sm"><Eye className="w-3 h-3" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
