import Link from "next/link";
import {
  MapPin, Navigation, ShieldCheck, Star, ArrowRight, Clock,
  Phone, Store, Search, Filter, Truck, CheckCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  { icon: MapPin, title: "GPS-Powered Search", desc: "Find the nearest agrovets instantly with pinpoint accuracy using your device location." },
  { icon: ShieldCheck, title: "Verified Dealers", desc: "Every listed agrovet is certified and verified. Product authenticity guaranteed." },
  { icon: Search, title: "Product Availability", desc: "Check real-time stock levels before you travel. No more wasted trips." },
  { icon: Star, title: "Farmer Ratings", desc: "Community-driven ratings and reviews help you choose the best agrovets." },
  { icon: Truck, title: "Doorstep Delivery", desc: "Order from verified agrovets and get inputs delivered to your farm gate." },
  { icon: Filter, title: "Smart Filtering", desc: "Filter by product type, brand, price range, and distance to find exactly what you need." },
];

const sampleAgrovets = [
  { name: "Wanjiku Agro Supplies", dist: "1.2 km", rating: 4.9, products: 284, status: "Open", phone: "+254 712 345 678" },
  { name: "Mkulima Farmer Shop", dist: "2.4 km", rating: 4.7, products: 196, status: "Open", phone: "+254 723 456 789" },
  { name: "Green Thumb Agrovets", dist: "3.1 km", rating: 4.8, products: 158, status: "Open", phone: "+254 734 567 890" },
  { name: "Farmwise Supplies Ltd", dist: "4.5 km", rating: 4.6, products: 312, status: "Closed", phone: "+254 745 678 901" },
];

export function AgrovetHeroSection() {
  return (
    <section className="gradient-hero py-20 lg:py-28">
      <div className="container mx-auto px-4 max-w-7xl text-center">
        <Badge className="mb-6 bg-white/20 text-white border-white/30">Agrovet Locator</Badge>
        <h1 className="text-4xl lg:text-6xl font-black text-white mb-6 leading-tight">
          Find Your Nearest <br className="hidden sm:block" />
          <span className="text-green-200">Certified Agrovet</span>
        </h1>
        <p className="text-lg text-green-100/90 max-w-2xl mx-auto mb-8">
          Locate verified agricultural input dealers near you. Check real-time stock, compare
          prices, and order for doorstep delivery — all in one app.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="hero" size="lg" asChild>
            <Link href="/register"><Navigation className="w-4 h-4" />Find Agrovets Near Me</Link>
          </Button>
          <Button variant="hero-outline" size="lg" asChild>
            <Link href="/register#agrovet">Register Your Shop</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function AgrovetMapSection() {
  return (
    <section className="py-16 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Map placeholder */}
          <div className="bg-gradient-to-br from-green-50 to-slate-100 dark:from-slate-800 dark:to-green-950/20 rounded-2xl h-80 flex items-center justify-center border border-slate-200 dark:border-slate-700 relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.04)_1px,transparent_1px)] bg-[size:30px_30px]" />
            <div className="text-center relative z-10">
              <MapPin className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-3" />
              <p className="font-bold text-slate-700 dark:text-slate-300">Interactive Map</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Agrovets shown on live map in the app</p>
            </div>
          </div>

          {/* Results list */}
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Nearby Agrovets</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">4 verified agrovets within 5km</p>
            <div className="space-y-3">
              {sampleAgrovets.map(({ name, dist, rating, products, status, phone }) => (
                <div key={name} className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center text-xl flex-shrink-0 shadow-sm">🏪</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-900 dark:text-white text-sm truncate">{name}</div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" />{dist}</span>
                      <span className="flex items-center gap-0.5"><Star className="w-3 h-3 fill-amber-400 text-amber-400" />{rating}</span>
                      <span>{products} products</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={`text-xs font-bold px-2 py-0.5 rounded-full ${status === "Open" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "bg-slate-200 dark:bg-slate-700 text-slate-500"}`}>{status}</div>
                    <div className="flex items-center gap-1 text-xs text-slate-400 mt-1"><Phone className="w-3 h-3" />{phone.slice(-9)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function AgrovetFeaturesSection() {
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-14">
          <Badge className="mb-4">Features</Badge>
          <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">Everything You Need to Find Inputs</h2>
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

export function AgrovetStatsSection() {
  return (
    <section className="py-16 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[{ value: "2,400+", label: "Certified Agrovets", icon: Store }, { value: "47", label: "Counties Covered", icon: MapPin }, { value: "15 min", label: "Avg. Response Time", icon: Clock }, { value: "99.2%", label: "Stock Accuracy", icon: CheckCircle }].map(({ value, label, icon: Icon }) => (
            <div key={label} className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
              <Icon className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-black text-slate-900 dark:text-white">{value}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AgrovetCTASection() {
  return (
    <section className="py-20 gradient-mesh">
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mb-4">Find Inputs Near You Now</h2>
        <p className="text-slate-600 dark:text-green-200/80 mb-8">2,400+ verified agrovets across East Africa. Real-time stock. Doorstep delivery.</p>
        <Button size="lg" asChild>
          <Link href="/register"><Navigation className="w-4 h-4 mr-2" />Open Agrovet Locator</Link>
        </Button>
      </div>
    </section>
  );
}
