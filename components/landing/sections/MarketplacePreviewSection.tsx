import Link from "next/link";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const categories = [
  { name: "Hybrid Seeds", icon: "🌱", products: "2,400+ products", color: "bg-green-50 dark:bg-green-950/30" },
  { name: "Fertilizers", icon: "🧪", products: "890+ products", color: "bg-blue-50 dark:bg-blue-950/30" },
  { name: "Pesticides", icon: "🛡️", products: "1,200+ products", color: "bg-amber-50 dark:bg-amber-950/30" },
  { name: "Farm Tools", icon: "🔧", products: "650+ products", color: "bg-orange-50 dark:bg-orange-950/30" },
  { name: "Irrigation", icon: "💧", products: "340+ products", color: "bg-cyan-50 dark:bg-cyan-950/30" },
  { name: "Produce Sale", icon: "🌾", products: "Sell direct", color: "bg-purple-50 dark:bg-purple-950/30" },
];

export function MarketplacePreviewSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <Badge variant="earth" className="mb-4">Marketplace</Badge>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4">
            Africa&apos;s Largest AgriMarket
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            5,000+ verified products from 200+ certified suppliers across East Africa — with
            anti-counterfeit guarantees and price comparison tools.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {categories.map(({ name, icon, products, color }) => (
            <Link
              href="/marketplace"
              key={name}
              className={`${color} rounded-2xl p-5 text-center border border-transparent hover:border-green-300 dark:hover:border-green-700 transition-all card-hover`}
            >
              <div className="text-3xl mb-2">{icon}</div>
              <div className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-1">{name}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{products}</div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" asChild>
            <Link href="/marketplace">
              <ShoppingBag className="w-5 h-5" />
              Explore All Products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
