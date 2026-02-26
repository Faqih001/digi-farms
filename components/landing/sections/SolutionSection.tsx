import { Microscope, ShoppingBag, MapPin, CreditCard, Leaf } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function SolutionSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-green-50 via-emerald-100 to-yellow-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text side */}
          <div>
            <Badge className="mb-4">The Solution</Badge>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white leading-tight mb-6">
              One Platform.
              <br />
              <span className="text-gradient">Infinite Possibilities.</span>
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
              DIGI-FARMS integrates AI diagnostics, smart marketplace, agrovet network, and
              climate-resilient financing into a single, mobile-first platform — built for the
              African smallholder farmer.
            </p>

            <div className="space-y-4">
              {[
                { icon: Microscope, title: "AI Crop Diagnostics", desc: "Instant disease detection with 94% accuracy using smartphone camera" },
                { icon: ShoppingBag, title: "Smart Marketplace", desc: "Buy certified inputs & sell produce at fair, transparent prices" },
                { icon: MapPin, title: "Agrovet Network", desc: "Locate verified agrovets within your 5km radius" },
                { icon: CreditCard, title: "Agri-Financing", desc: "Instant credit scoring based on farm data for micro-loans" },
              ].map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-green-100 dark:hover:bg-green-950/30 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-0.5">{title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual card */}
          <div className="bg-white/80 backdrop-blur-sm dark:bg-green-900 rounded-3xl p-8 shadow-2xl border border-green-100 dark:border-green-800">
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-green-100 dark:bg-white/20 flex items-center justify-center mb-3">
                <Leaf className="w-10 h-10 text-green-700 dark:text-white" />
              </div>
              <p className="font-bold text-xl text-slate-900 dark:text-white">DIGI-FARMS Ecosystem</p>
              <p className="text-green-700 dark:text-green-300 text-sm">Precision Agriculture Platform</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "AI Engine", emoji: "🤖", desc: "Vision + NLP" },
                { label: "Marketplace", emoji: "🏪", desc: "B2B + B2C" },
                { label: "Agrovets", emoji: "🗺️", desc: "500+ locations" },
                { label: "Climate AI", emoji: "🌦️", desc: "7-day forecasts" },
                { label: "E-Finance", emoji: "💳", desc: "Micro-credit" },
                { label: "IoT Ready", emoji: "📡", desc: "Soil sensors" },
              ].map(({ label, emoji, desc }) => (
                <div
                  key={label}
                  className="bg-green-50 dark:bg-slate-900 rounded-xl p-3 flex items-center gap-3"
                >
                  <span className="text-2xl">{emoji}</span>
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">{label}</div>
                    <div className="text-xs text-green-700 dark:text-green-300">{desc}</div>
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
