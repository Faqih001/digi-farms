import Link from "next/link";
import {
  ShoppingCart, TrendingUp, ShieldCheck, Truck, ArrowRight,
  Star, Package, CreditCard, Users, Search, Store, BarChart3,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  { icon: ShieldCheck, title: "Verified Suppliers", desc: "Every supplier is vetted and certified. No counterfeits — only genuine inputs from trusted brands." },
  { icon: TrendingUp, title: "Transparent Pricing", desc: "Real-time market prices updated daily. Compare across suppliers and get the best deal." },
  { icon: Truck, title: "Doorstep Delivery", desc: "Last-mile logistics partnerships deliver inputs directly to your farm, even in remote areas." },
  { icon: CreditCard, title: "Flexible Payments", desc: "Pay via M-Pesa, bank transfer, or buy-now-pay-later through integrated agricultural lenders." },
  { icon: BarChart3, title: "Price Analytics", desc: "Historical price charts let you time your purchases for maximum savings." },
  { icon: Users, title: "Group Buying", desc: "Join cooperative purchase groups to unlock bulk prices normally reserved for large buyers." },
];

const stats = [
  { value: "5,000+", label: "Products Listed" },
  { value: "200+", label: "Verified Suppliers" },
  { value: "47", label: "Counties Served" },
  { value: "24h", label: "Average Delivery" },
];

export function PlatformMarketHeroSection() {
  return (
    <section className="gradient-hero py-20 lg:py-28">
      <div className="container mx-auto px-4 max-w-7xl text-center">
        <Badge className="mb-6 bg-white/20 text-white border-white/30">Platform Marketplace</Badge>
        <h1 className="text-4xl lg:text-6xl font-black text-white mb-6 leading-tight">
          Shop Smart. <br className="hidden sm:block" />
          <span className="text-green-200">Farm Better.</span>
        </h1>
        <p className="text-lg text-green-100/90 max-w-2xl mx-auto mb-8">
          Buy certified farm inputs directly from verified suppliers. Real-time
          pricing, doorstep delivery, and buy-now-pay-at-harvest financing.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="hero" size="lg" asChild>
            <Link href="/register"><ShoppingCart className="w-4 h-4" />Shop Now</Link>
          </Button>
          <Button variant="hero-outline" size="lg" asChild>
            <Link href="/register#supplier">Sell Your Products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function PlatformMarketStatsSection() {
  return (
    <section className="py-12 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map(({ value, label }) => (
            <div key={label}>
              <div className="text-3xl font-black text-green-600 dark:text-green-400">{value}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PlatformMarketFeaturesSection() {
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-14">
          <Badge className="mb-4">Why Shop Here</Badge>
          <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">The Smartest Way to Buy Farm Inputs</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <Card key={f.title} className="group hover:shadow-xl transition-shadow bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <f.icon className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PlatformMarketSellSection() {
  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge className="mb-4">For Suppliers</Badge>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mb-6">Reach 60,000+ Farmers</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
              List your products on East Africa&apos;s leading agri-marketplace. Our platform handles
              payments, logistics matching, and dispute resolution so you can focus on selling.
            </p>
            <div className="space-y-3">
              {["Free listing for first 100 products", "0% commission for the first 6 months", "Integrated M-Pesa and bank payment collection", "Logistics network reaches remote areas", "Compliance with KEBS and PCK certifications"].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <Store className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />{item}
                </div>
              ))}
            </div>
            <Button size="lg" className="mt-8" asChild>
              <Link href="/register#supplier">Apply to Sell <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>
          <div className="bg-green-800 dark:bg-slate-800 rounded-3xl p-8 text-white shadow-xl border border-green-900 dark:border-slate-700">
            <h3 className="text-xl font-black mb-4">Top Seller Dashboard</h3>
            <div className="space-y-3">
              {[["Orders This Month", "284", "🛒"], ["Revenue", "KES 2.4M", "💰"], ["Active Listings", "196", "📦"], ["Avg. Rating", "4.9 ★", "⭐"], ["Delivery Rate", "98.2%", "🚚"]].map(([k, v, ic]) => (
                <div key={k as string} className="flex items-center justify-between bg-white/10 rounded-xl px-4 py-2.5">
                  <span className="text-sm text-green-200 dark:text-slate-300">{k}</span>
                  <span className="flex items-center gap-2 font-bold text-white">{ic} {v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PlatformMarketCTASection() {
  return (
    <section className="py-20 gradient-mesh">
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mb-4">Your Farm Inputs Await</h2>
        <p className="text-slate-600 dark:text-green-200/80 mb-8">5,000+ products ready to order. Free delivery on orders over KES 5,000.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/register"><Search className="w-4 h-4 mr-2" />Browse Products</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/register#supplier">List Your Products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
