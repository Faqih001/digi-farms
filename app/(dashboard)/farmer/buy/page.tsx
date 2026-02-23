"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ShoppingCart, Star, Search, Filter, Package } from "lucide-react";

const products = [
  { id: 1, name: "Mancozeb Fungicide 1kg", price: 450, unit: "per pack", category: "Fungicide", rating: 4.5, reviews: 128, supplier: "Elgon Kenya", badge: "Best Seller" },
  { id: 2, name: "CAN Fertilizer 50kg", price: 3200, unit: "per bag", category: "Fertilizer", rating: 4.8, reviews: 342, supplier: "MEA Fertilizers", badge: "Top Rated" },
  { id: 3, name: "Dimethoate Insecticide 1L", price: 680, unit: "per bottle", category: "Insecticide", rating: 4.2, reviews: 89, supplier: "Tiara Spray", badge: null },
  { id: 4, name: "DAP Fertilizer 50kg", price: 4500, unit: "per bag", category: "Fertilizer", rating: 4.6, reviews: 210, supplier: "MEA Fertilizers", badge: "New Arrival" },
  { id: 5, name: "Ridomil Gold Fungicide", price: 1200, unit: "per pack", category: "Fungicide", rating: 4.7, reviews: 156, supplier: "Syngenta Kenya", badge: null },
  { id: 6, name: "Maize Hybrid H614D (2kg)", price: 1800, unit: "per pack", category: "Seeds", rating: 4.9, reviews: 423, supplier: "Kenya Seed Company", badge: "Best Seller" },
];

const categories = ["All", "Fertilizer", "Fungicide", "Insecticide", "Seeds", "Equipment"];

export default function BuyInputsPage() {
  const [cart, setCart] = useState<number[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");

  const addToCart = (id: number, name: string) => {
    setCart([...cart, id]);
    toast.success(`${name} added to cart`);
  };

  const filtered = activeCategory === "All" ? products : products.filter(p => p.category === activeCategory);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Buy Farm Inputs</h2>
          <p className="text-slate-500 text-sm">Order quality inputs from verified suppliers</p>
        </div>
        <Button asChild>
          <a href="#cart"><ShoppingCart className="w-4 h-4" /> Cart ({cart.length})</a>
        </Button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input className="pl-9" placeholder="Search fertilizers, pesticides, seeds..." />
        </div>
        <Button variant="outline"><Filter className="w-4 h-4" /> Filter</Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeCategory === cat ? "bg-green-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"}`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(({ id, name, price, unit, category, rating, reviews, supplier, badge }) => (
          <Card key={id} className="group overflow-hidden">
            <div className="h-32 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/10 flex items-center justify-center relative">
              <Package className="w-12 h-12 text-green-300" />
              {badge && <Badge className="absolute top-2 right-2 text-xs">{badge}</Badge>}
            </div>
            <CardContent className="p-4">
              <div className="text-xs text-slate-400 mb-1">{category} · {supplier}</div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-2 leading-tight">{name}</h3>
              <div className="flex items-center gap-1 mb-3">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs font-semibold">{rating}</span>
                <span className="text-xs text-slate-400">({reviews})</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-black text-green-600">KES {price.toLocaleString()}</span>
                  <span className="text-xs text-slate-400 ml-1">{unit}</span>
                </div>
                <Button size="sm" onClick={() => addToCart(id, name)} disabled={cart.includes(id)}>
                  {cart.includes(id) ? "In Cart" : "Add"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
