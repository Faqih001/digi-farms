import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Search, SlidersHorizontal, Star, Shield, ArrowRight,
  ShoppingBag, TrendingUp, Package, Truck, Lock, QrCode
} from "lucide-react";

export const metadata: Metadata = {
  title: "Marketplace – DIGI-FARMS",
  description: "Buy certified farm inputs and sell your produce on Africa's largest verified agricultural marketplace.",
};

const categories = [
  { name: "Hybrid Seeds", icon: "🌱", count: 2400, bg: "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800" },
  { name: "Fertilizers", icon: "🧪", count: 890, bg: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800" },
  { name: "Pesticides & Herbicides", icon: "🛡️", count: 1200, bg: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800" },
  { name: "Farm Tools & Equipment", icon: "🔧", count: 650, bg: "bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800" },
  { name: "Irrigation Systems", icon: "💧", count: 340, bg: "bg-cyan-50 dark:bg-cyan-950/30 border-cyan-200 dark:border-cyan-800" },
  { name: "Animal Feed & Vets", icon: "🐄", count: 580, bg: "bg-pink-50 dark:bg-pink-950/30 border-pink-200 dark:border-pink-800" },
  { name: "Organic Inputs", icon: "🌿", count: 427, bg: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800" },
  { name: "Sell Your Produce", icon: "🌾", count: 0, bg: "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800" },
];

const featuredProducts = [
  { name: "DK8031 Yellow Maize Seed", price: "KES 2,850", unit: "2kg bag", supplier: "Wanjiku Agro Supplies", rating: 4.8, reviews: 234, verified: true, tag: "Best Seller" },
  { name: "CAN Fertilizer 50kg", price: "KES 3,600", unit: "50kg bag", supplier: "Mkulima Supplies Ltd", rating: 4.7, reviews: 189, verified: true, tag: "Price Drop" },
  { name: "Ridomil Gold MZ Fungicide", price: "KES 1,800", unit: "100g packet", supplier: "AgroChemix Kenya", rating: 4.9, reviews: 312, verified: true, tag: "Top Rated" },
  { name: "Drip Irrigation Kit ¼ Acre", price: "KES 12,500", unit: "complete kit", supplier: "IrriTech East Africa", rating: 4.6, reviews: 97, verified: true, tag: "New" },
  { name: "Anna F1 Tomato Seed", price: "KES 1,200", unit: "10g sachet", supplier: "East African Seeds", rating: 4.8, reviews: 508, verified: true, tag: "Best Seller" },
  { name: "Urea Fertilizer 50kg", price: "KES 3,200", unit: "50kg bag", supplier: "National Farmers Corp", rating: 4.5, reviews: 145, verified: true, tag: "" },
];

const suppliers = [
  { name: "Wanjiku Agro Supplies Ltd", products: 284, rating: 4.9, sales: "12,400+", badge: "Platinum", location: "Nairobi" },
  { name: "East African Seeds", products: 196, rating: 4.8, sales: "9,800+", badge: "Gold", location: "Nakuru" },
  { name: "Mkulima Supplies Ltd", products: 358, rating: 4.7, sales: "15,200+", badge: "Platinum", location: "Eldoret" },
  { name: "AgroChemix Kenya", products: 142, rating: 4.9, sales: "7,300+", badge: "Gold", location: "Mombasa" },
];

export default function MarketplacePage() {
  return (
    <>
      {/* Section 1: Hero */}
      <section className="gradient-hero py-20">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <Badge className="mb-6 bg-white/20 text-white border-white/30">Africa&apos;s AgriMarket</Badge>
          <h1 className="text-5xl lg:text-7xl font-black text-white mb-6 leading-tight">
            Buy Smart. <span className="text-gradient">Sell Fair.</span>
          </h1>
          <p className="text-xl text-green-100/80 max-w-2xl mx-auto mb-10">
            5,000+ certified products from 200+ verified suppliers. Anti-counterfeit QR verification, competitive bulk pricing, and financing integration.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="xl" asChild>
              <Link href="/register"><ShoppingBag className="w-5 h-5" />Shop Now</Link>
            </Button>
            <Button variant="hero-outline" size="xl" asChild>
              <Link href="/register#supplier">Sell on DIGI-FARMS</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Section 2: Search & Filter */}
      <section className="py-12 bg-white dark:bg-slate-900 sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Search products, suppliers, categories..." className="pl-10 h-12 text-base" />
            </div>
            <Button variant="outline" size="lg" className="gap-2 shrink-0">
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </Button>
            <Button size="lg" className="shrink-0">Search</Button>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {["All Products", "Seeds", "Fertilizers", "Pesticides", "Irrigation", "Tools", "Organic", "Bulk Orders"].map((tag) => (
              <button key={tag} className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${tag === "All Products" ? "bg-green-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-green-50 dark:hover:bg-green-950/30"}`}>
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Category Grid */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white">Browse by Category</h2>
              <p className="text-slate-500 text-sm mt-1">8 categories · 7,487 products</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map(({ name, icon, count, bg }) => (
              <Link href="/register" key={name} className={`${bg} border rounded-2xl p-5 text-center card-hover transition-all`}>
                <div className="text-3xl mb-2">{icon}</div>
                <div className="font-bold text-xs text-slate-800 dark:text-slate-200 mb-1 leading-tight">{name}</div>
                {count > 0 && <div className="text-xs text-slate-400">{count}+</div>}
                {count === 0 && <div className="text-xs text-purple-600 font-semibold">Sell Now</div>}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Featured Products */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white">Featured Products</h2>
              <p className="text-slate-500 text-sm mt-1">Handpicked by our agronomy team</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/register">View All <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map(({ name, price, unit, supplier, rating, reviews, verified, tag }) => (
              <Card key={name} className="overflow-hidden card-hover group">
                <div className="h-40 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/20 relative flex items-center justify-center">
                  <div className="text-6xl">🌿</div>
                  {tag && (
                    <div className="absolute top-3 left-3">
                      <Badge variant={tag === "Best Seller" ? "default" : tag === "Price Drop" ? "warning" : tag === "Top Rated" ? "earth" : "info"}>
                        {tag}
                      </Badge>
                    </div>
                  )}
                  {verified && (
                    <div className="absolute top-3 right-3">
                      <div className="flex items-center gap-1 bg-white dark:bg-slate-900 rounded-full px-2 py-0.5 shadow-sm">
                        <Shield className="w-3 h-3 text-green-600" />
                        <span className="text-[10px] font-bold text-green-600">Verified</span>
                      </div>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-1 leading-tight">{name}</h3>
                  <p className="text-xs text-slate-500 mb-2">{supplier}</p>
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{rating}</span>
                    <span className="text-xs text-slate-400">({reviews})</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="font-black text-green-600 text-lg">{price}</div>
                      <div className="text-xs text-slate-400">per {unit}</div>
                    </div>
                    <Button size="sm" asChild>
                      <Link href="/register">Add to Cart</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Verified Suppliers */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <Badge className="mb-4">Verified Suppliers</Badge>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3">Shop from Trusted Suppliers</h2>
            <p className="text-slate-500 text-sm">All suppliers are licensed, annually audited, and quality-certified</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {suppliers.map(({ name, products, rating, sales, badge, location }) => (
              <Card key={name} className="p-5 text-center card-hover">
                <CardContent className="p-0">
                  <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 flex items-center justify-center mb-3 text-2xl">🏪</div>
                  <div className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full mb-2 ${badge === "Platinum" ? "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200" : "bg-amber-100 text-amber-700"}`}>{badge}</div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{name}</h3>
                  <p className="text-xs text-slate-400 mb-3">{location}</p>
                  <div className="flex justify-around text-center">
                    <div><div className="font-bold text-slate-800 dark:text-slate-200 text-sm">{products}</div><div className="text-xs text-slate-400">Products</div></div>
                    <div><div className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-0.5"><Star className="w-3 h-3 fill-amber-400 text-amber-400" />{rating}</div><div className="text-xs text-slate-400">Rating</div></div>
                    <div><div className="font-bold text-slate-800 dark:text-slate-200 text-sm">{sales}</div><div className="text-xs text-slate-400">Sales</div></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6: Price Comparison */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="mb-4">Price Intelligence</Badge>
              <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-6">
                Compare Prices, <span className="text-gradient">Save More</span>
              </h2>
              <p className="text-slate-500 mb-6 leading-relaxed">
                Our price comparison engine aggregates real-time pricing from all marketplace suppliers. Never overpay for farm inputs again.
              </p>
              <div className="space-y-3">
                {["Real-time price tracking across all suppliers", "Historical price trends for seasonal planning", "Price alerts when your desired products drop", "Bulk purchase savings calculator"].map((f) => (
                  <div key={f} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <TrendingUp className="w-4 h-4 text-green-600 flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
              <div className="text-sm font-semibold text-slate-500 mb-4">Price comparison: CAN Fertilizer 50kg</div>
              <div className="space-y-3">
                {[
                  { name: "Mkulima Supplies", price: 3200, tag: "Lowest" },
                  { name: "Wanjiku Agro", price: 3400, tag: "" },
                  { name: "National Farmers", price: 3600, tag: "Avg Market" },
                  { name: "AgroChemix", price: 3750, tag: "" },
                ].map(({ name, price, tag }) => (
                  <div key={name} className="flex items-center gap-3">
                    <div className="flex-1 text-sm text-slate-700 dark:text-slate-300">{name}</div>
                    <div className="w-32 h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${(price / 4000) * 100}%` }} />
                    </div>
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200 w-20 text-right">KES {price.toLocaleString()}</div>
                    {tag && <Badge variant={tag === "Lowest" ? "default" : "secondary"} className="text-xs">{tag}</Badge>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: Bulk Purchase */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-y border-amber-200 dark:border-amber-900/30">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <Badge variant="earth" className="mb-4">Bulk Savings</Badge>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Group Buying Power</h2>
          <p className="text-slate-500 max-w-xl mx-auto mb-10">Join farmer groups to unlock bulk pricing. Form a cooperative purchase of 50+ bags and save up to 25% vs. single-unit pricing.</p>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[{ qty: "5-19 units", saving: "5% off", icon: "📦" }, { qty: "20-49 units", saving: "12% off", icon: "🚛" }, { qty: "50+ units", saving: "25% off", icon: "🏭" }].map(({ qty, saving, icon }) => (
              <div key={qty} className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-amber-200 dark:border-amber-800 text-center shadow-sm">
                <div className="text-4xl mb-2">{icon}</div>
                <div className="font-bold text-slate-900 dark:text-white">{qty}</div>
                <div className="text-2xl font-black text-amber-600 mt-1">{saving}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 8: Sell Produce */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-3xl p-8 text-white">
              <div className="text-6xl mb-4">🌾</div>
              <h3 className="text-3xl font-black mb-3">Sell Your Harvest</h3>
              <p className="text-green-200/80 mb-6">List your produce directly on the marketplace. Reach restaurants, wholesalers, and processors paying fair market prices.</p>
              <Button variant="hero" asChild>
                <Link href="/register">Start Selling <ArrowRight className="w-4 h-4" /></Link>
              </Button>
            </div>
            <div>
              <Badge className="mb-4">For Farmers</Badge>
              <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-6">Turn Harvest into Income</h2>
              <div className="space-y-4">
                {["List unlimited produce listings for free", "Connect with verified buyers paying fair prices", "Integrated M-Pesa & bank payments", "Real-time market price transparency", "Logistics partner network for delivery"].map((f) => (
                  <div key={f} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <Package className="w-4 h-4 text-green-600 flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 9: Secure Transactions */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <Badge className="mb-4">Security</Badge>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-12">Every Transaction Protected</h2>
          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[{ icon: Lock, title: "Escrow Payments", desc: "Funds held safely until delivery confirmed" }, { icon: Truck, title: "Order Tracking", desc: "Real-time delivery status updates" }, { icon: Shield, title: "Buyer Protection", desc: "Full refund if item not as described" }].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 text-center">
                <Icon className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">{title}</h3>
                <p className="text-xs text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 10: Anti-Counterfeit */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge variant="destructive" className="mb-4">Anti-Counterfeit</Badge>
              <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-6">Zero Tolerance for Fake Products</h2>
              <p className="text-slate-500 mb-6 leading-relaxed">Counterfeit seeds and agrochemicals cause KES 48B in losses annually. DIGI-FARMS uses QR codes and blockchain verification to ensure every product is genuine.</p>
              <div className="space-y-3">
                {["QR code on every verified product", "Scan with DIGI-FARMS app to authenticate", "Blockchain-recorded batch traceability", "Automatic supplier suspension for violations"].map((f) => (
                  <div key={f} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <QrCode className="w-4 h-4 text-green-600 flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-slate-900 dark:bg-slate-800 rounded-2xl p-8 text-white text-center">
              <QrCode className="w-24 h-24 mx-auto mb-4 text-green-400" />
              <div className="text-green-400 font-bold mb-2">✓ Product Verified</div>
              <div className="text-slate-300 text-sm mb-1">DK8031 Hybrid Maize Seed</div>
              <div className="text-slate-400 text-xs mb-4">Batch: 2025-03-14 · Source: Monsanto Kenya</div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {[["Supplier", "Verified ✓"], ["Batch Date", "Mar 2025"], ["Expiry", "Dec 2026"], ["QR Scans", "1,240"]].map(([k, v]) => (
                  <div key={k} className="bg-white/10 rounded-lg p-2">
                    <div className="text-slate-400">{k}</div>
                    <div className="font-bold text-white">{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 11: Financing Integration */}
      <section className="py-20 bg-gradient-to-br from-green-900 to-green-950 text-white">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <Badge className="mb-4 bg-white/20 text-white border-white/30">Purchase Financing</Badge>
          <h2 className="text-4xl font-black mb-6">Buy Now, Pay at Harvest</h2>
          <p className="text-green-200/80 max-w-2xl mx-auto mb-10">
            Purchase inputs on credit. Repayment is automatically deducted when you sell your harvest on the marketplace — zero cash needed at planting time.
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-10">
            {["Purchase inputs on credit (min. 3 months on DIGI-FARMS)", "Auto-repayment when harvest is sold on marketplace", "Interest rates from 8% p.a. — no hidden fees"].map((item) => (
              <div key={item} className="bg-white/10 rounded-xl p-5 text-sm text-green-200 border border-white/20">{item}</div>
            ))}
          </div>
          <Button variant="hero" size="xl" asChild>
            <Link href="/register">Get Input Financing <ArrowRight className="w-4 h-4" /></Link>
          </Button>
        </div>
      </section>

      {/* Section 12: CTA */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-6">
            Ready to Transform Your <span className="text-gradient">Supply Chain?</span>
          </h2>
          <p className="text-slate-500 mb-10">Join 5,000+ buyers and 200+ verified suppliers already trading on DIGI-FARMS marketplace.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="xl" asChild>
              <Link href="/register"><ShoppingBag className="w-5 h-5" />Start Buying</Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link href="/register#supplier">Become a Supplier</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
