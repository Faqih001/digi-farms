import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ShoppingCart, TrendingUp, ShieldCheck, Truck, ArrowRight,
  Star, Package, CreditCard, Users, Search, Store, BarChart3,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Buy certified farm inputs and sell your produce directly to buyers. Transparent pricing, verified suppliers, doorstep delivery.",
};

const features = [
  { icon: ShieldCheck, title: "Verified Suppliers", desc: "Every supplier is vetted and certified. No counterfeits — only genuine inputs from trusted brands." },
  { icon: TrendingUp, title: "Transparent Pricing", desc: "Real-time market prices updated daily. Compare across suppliers and get the best deal." },
  { icon: Truck, title: "Doorstep Delivery", desc: "Last-mile logistics partnerships deliver inputs directly to your farm, even in remote areas." },
  { icon: CreditCard, title: "Flexible Payments", desc: "Pay via M-Pesa, bank transfer, or buy-now-pay-later through integrated agricultural lenders." },
  { icon: Store, title: "Sell Your Produce", desc: "List your harvest and connect with verified buyers, cooperatives, and export aggregators." },
  { icon: BarChart3, title: "Price Intelligence", desc: "AI-powered price forecasting helps you time your sales for maximum profit." },
];

const categories = [
  { name: "Seeds & Seedlings", count: "2,400+", color: "bg-green-100 dark:bg-green-900/30 text-green-600" },
  { name: "Fertilizers", count: "1,800+", color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600" },
  { name: "Crop Protection", count: "3,200+", color: "bg-amber-100 dark:bg-amber-900/30 text-amber-600" },
  { name: "Farm Equipment", count: "900+", color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600" },
  { name: "Animal Feed", count: "1,100+", color: "bg-red-100 dark:bg-red-900/30 text-red-600" },
  { name: "Irrigation Systems", count: "600+", color: "bg-teal-100 dark:bg-teal-900/30 text-teal-600" },
];

const stats = [
  { value: "500+", label: "Verified Suppliers" },
  { value: "10K+", label: "Products Listed" },
  { value: "KES 200M+", label: "Transaction Volume" },
  { value: "98%", label: "Delivery Success" },
];

export default function MarketplacePage() {
  return (
    <>
      {/* Hero */}
      <section className="gradient-hero py-20 lg:py-28">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <Badge className="mb-6 bg-green-600/10 text-green-800 border-green-200 dark:bg-white/20 dark:text-white dark:border-white/30">Marketplace</Badge>
          <h1 className="text-4xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
            Buy Smart. <span className="text-green-600 dark:text-green-300">Sell Direct.</span>
          </h1>
          <p className="text-lg text-green-800 dark:text-green-100 max-w-2xl mx-auto mb-8">
            East Africa&apos;s most trusted agricultural marketplace. Verified inputs, transparent prices, and direct market access — all in one platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-white text-green-700 hover:bg-green-50">
              <Link href="/register">Start Shopping <ShoppingCart className="ml-2 w-4 h-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-green-600 text-green-700 hover:bg-green-50 dark:border-white/40 dark:text-white dark:hover:bg-white/10">
              <Link href="/register">List Your Produce</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl lg:text-4xl font-black text-green-600">{s.value}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section
        className="py-20 bg-image-overlay"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1600&q=80&auto=format&fit=crop')" }}
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4">Browse Categories</Badge>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">Everything Your Farm Needs</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((c) => (
              <Card key={c.name} className="group hover:shadow-xl transition-all cursor-pointer dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-green-400">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${c.color}`}>
                    <Package className="w-7 h-7" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 dark:text-white">{c.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{c.count} products</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4">Why Our Marketplace</Badge>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">Built for African Agriculture</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <Card key={f.title} className="group hover:shadow-xl transition-shadow dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <f.icon className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How to sell */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="secondary" className="mb-4">For Sellers</Badge>
              <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mb-6">Turn Your Harvest Into Revenue</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                List your produce, set your price, and connect with verified buyers across East Africa. No middlemen, no hidden fees.
              </p>
              <ul className="space-y-4 mb-8">
                {["Create a free seller account", "Upload photos & set your price", "Receive orders from verified buyers", "Get paid via M-Pesa or bank transfer"].map((step, i) => (
                  <li key={step} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">{i + 1}</div>
                    <span className="text-slate-700 dark:text-slate-300">{step}</span>
                  </li>
                ))}
              </ul>
              <Button size="lg" asChild>
                <Link href="/register">Start Selling <ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-700 dark:to-emerald-600 rounded-3xl p-8 border border-green-200 dark:border-transparent">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Star className="w-8 h-8 text-yellow-500 dark:text-yellow-300" />
                  <div>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">0% Commission</p>
                    <p className="text-slate-600 dark:text-green-100 text-sm">For the first KES 500K in sales</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-green-600 dark:text-green-200" />
                  <div>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">50K+ Buyers</p>
                    <p className="text-slate-600 dark:text-green-100 text-sm">Active monthly on the platform</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Search className="w-8 h-8 text-green-600 dark:text-green-200" />
                  <div>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">Smart Matching</p>
                    <p className="text-slate-600 dark:text-green-100 text-sm">AI connects you to the right buyers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-800 dark:to-green-950">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mb-4">Join the Marketplace</h2>
          <p className="text-slate-600 dark:text-green-100 mb-8">Whether you&apos;re buying inputs or selling your harvest — get started in under 2 minutes.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-white text-green-700 hover:bg-green-50">
              <Link href="/register">Create Free Account <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
