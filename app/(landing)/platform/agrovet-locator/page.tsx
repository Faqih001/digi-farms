import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin, Navigation, ShieldCheck, Star, ArrowRight, Clock,
  Phone, Store, Search, Filter, Truck, CheckCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Agrovet Locator",
  description: "Find certified agricultural input dealers near you. Verified agrovets, real-time stock, and doorstep delivery across East Africa.",
};

const features = [
  { icon: MapPin, title: "GPS-Powered Search", desc: "Find the nearest agrovets instantly with pinpoint accuracy using your device location." },
  { icon: ShieldCheck, title: "Verified Dealers", desc: "Every listed agrovet is certified and verified. Product authenticity guaranteed." },
  { icon: Search, title: "Product Availability", desc: "Check real-time stock levels before you travel. No more wasted trips." },
  { icon: Star, title: "Farmer Ratings", desc: "Community-driven ratings and reviews help you choose the best agrovets." },
  { icon: Truck, title: "Delivery Options", desc: "Order online and get inputs delivered to your farm from partnered agrovets." },
  { icon: Phone, title: "Direct Contact", desc: "Call or WhatsApp agrovets directly from the app to negotiate or ask questions." },
];

const stats = [
  { value: "800+", label: "Certified Agrovets" },
  { value: "47", label: "Counties Covered" },
  { value: "4.6/5", label: "Average Rating" },
  { value: "100K+", label: "Monthly Searches" },
];

const agrovetTypes = [
  { name: "Seeds & Seedlings Specialists", desc: "Certified seed dealers with hybrid and OPV varieties", count: "320+" },
  { name: "Agrochemical Dealers", desc: "Pesticides, herbicides, and fungicides from top brands", count: "450+" },
  { name: "Fertilizer Outlets", desc: "Basal, top-dress, and foliar fertilizers", count: "380+" },
  { name: "Farm Equipment & Tools", desc: "From hand tools to drip irrigation systems", count: "210+" },
  { name: "Veterinary Pharmacies", desc: "Animal health products and vaccination services", count: "290+" },
  { name: "Feed & Supplements", desc: "Animal feed, mineral licks, and supplements", count: "180+" },
];

export default function AgrovetLocatorPage() {
  return (
    <>
      {/* Hero */}
      <section className="gradient-hero py-20 lg:py-28">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <Badge className="mb-6 bg-white/20 text-white border-white/30">Agrovet Locator</Badge>
          <h1 className="text-4xl lg:text-6xl font-black text-white mb-6 leading-tight">
            Find Certified Agrovets <br className="hidden sm:block" />
            <span className="text-green-300">Near You</span>
          </h1>
          <p className="text-lg text-green-100 max-w-2xl mx-auto mb-8">
            Locate verified agricultural input dealers across 47 counties. Check stock, compare prices, and order for delivery — all from your phone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-white text-green-700 hover:bg-green-50">
              <Link href="/register">Find Nearest Agrovet <Navigation className="ml-2 w-4 h-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white/40 text-white hover:bg-white/10">
              <Link href="/register">Register Your Agrovet</Link>
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

      {/* How It Works */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4">How It Works</Badge>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">Three Steps to Find Inputs</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { icon: Search, title: "Search", desc: "Enter what you need or browse categories. Use your location to find nearby agrovets." },
              { icon: Filter, title: "Compare", desc: "Compare prices, ratings, and stock levels across multiple agrovets in your area." },
              { icon: Store, title: "Visit or Order", desc: "Get directions, call the agrovet, or order online for doorstep delivery." },
            ].map((step, i) => (
              <div key={step.title} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4 relative">
                  <step.icon className="w-8 h-8 text-green-600" />
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-green-600 text-white text-xs font-bold flex items-center justify-center">{i + 1}</div>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-lg">{step.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agrovet Types */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4">Categories</Badge>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">Every Input Source You Need</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {agrovetTypes.map((a) => (
              <Card key={a.name} className="group hover:shadow-xl transition-all dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-green-400">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-slate-900 dark:text-white">{a.name}</h3>
                    <Badge variant="secondary" className="text-xs">{a.count}</Badge>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{a.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4">Features</Badge>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">More Than Just a Map</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <Card key={f.title} className="group hover:shadow-xl transition-shadow dark:bg-slate-900 border-slate-200 dark:border-slate-800">
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

      {/* Trust */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-3xl p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-black text-white mb-4">Are You an Agrovet?</h2>
                <p className="text-green-100 mb-6">Join 800+ certified dealers on DIGI-FARMS. Get discovered by thousands of farmers, manage your inventory online, and grow your business.</p>
                <ul className="space-y-2 mb-6">
                  {["Free listing for verified agrovets", "Online inventory management", "Order & delivery management", "Customer reviews & analytics"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-white text-sm">
                      <CheckCircle className="w-4 h-4 text-green-200 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button size="lg" asChild className="bg-white text-green-700 hover:bg-green-50">
                  <Link href="/register">Register Your Agrovet <ArrowRight className="ml-2 w-4 h-4" /></Link>
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Clock, label: "Listed in 24hrs" },
                  { icon: Star, label: "Build reputation" },
                  { icon: Truck, label: "Delivery tools" },
                  { icon: Phone, label: "Direct inquiries" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="bg-white/10 rounded-2xl p-5 text-center">
                    <Icon className="w-7 h-7 text-white mx-auto mb-2" />
                    <p className="text-white text-sm font-semibold">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
