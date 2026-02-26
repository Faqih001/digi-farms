import Link from "next/link";
import { MapPin, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const nearbyAgrovets = [
  "🟢 Wanjiku Agrovet — 1.2km",
  "🟢 Green Earth Supplies — 2.4km",
  "🟡 Nakuru Agro Hub — 3.8km",
];

export function AgrovetSection() {
  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Map placeholder */}
          <div className="bg-gradient-to-br from-slate-100 to-green-50 dark:from-slate-800 dark:to-green-950/20 rounded-3xl p-8 h-80 lg:h-96 flex items-center justify-center border border-slate-200 dark:border-slate-700 relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.05)_1px,transparent_1px)] bg-[size:30px_30px]" />
            <div className="text-center relative z-10">
              <div className="w-20 h-20 mx-auto rounded-full bg-green-600 flex items-center justify-center mb-4 shadow-xl">
                <MapPin className="w-10 h-10 text-white" />
              </div>
              <p className="text-slate-600 dark:text-slate-400 font-semibold mb-2">Interactive Agrovet Map</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                500+ verified agrovets across East Africa
              </p>
              <div className="flex flex-col gap-2">
                {nearbyAgrovets.map((v) => (
                  <div
                    key={v}
                    className="bg-white dark:bg-slate-900 rounded-lg px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 shadow-sm text-left"
                  >
                    {v}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <Badge variant="earth" className="mb-4">Agrovet Locator</Badge>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white leading-tight mb-6">
              Find Certified Agrovets <span className="text-gradient">Near You</span>
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
              500+ verified agrovet partners mapped across East Africa. Check product availability,
              compare prices, and navigate with Google Maps integration.
            </p>

            <div className="space-y-4 mb-8">
              {[
                { title: "Real-time stock availability", desc: "See what each agrovet has in stock before you travel" },
                { title: "Price comparison", desc: "Compare prices across multiple agrovets in your area" },
                { title: "Verified sellers only", desc: "All listed agrovets are licensed and annually audited" },
                { title: "Mobile navigation", desc: "One-tap GPS direction via Google Maps integration" },
              ].map(({ title, desc }) => (
                <div key={title} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white text-sm">{title}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <Button size="lg" asChild>
              <Link href="/register">
                <MapPin className="w-5 h-5" />
                Find Agrovets Near Me
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
