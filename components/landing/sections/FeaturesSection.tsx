import {
  Microscope, BarChart3, ShoppingBag, MapPin, Shield, CloudRain,
  CreditCard, TrendingUp, Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  { icon: Microscope, title: "AI Crop Diagnostics", desc: "Vision AI analyzes crop images for 200+ diseases with 94% accuracy. Get treatment plans in seconds.", color: "green" },
  { icon: BarChart3, title: "Farm Analytics Dashboard", desc: "Real-time yield tracking, performance scoring, soil health monitoring, and predictive analytics.", color: "blue" },
  { icon: ShoppingBag, title: "Smart Marketplace", desc: "Verified inputs at fair prices. Sell produce directly to buyers. Anti-counterfeit QR verification.", color: "amber" },
  { icon: MapPin, title: "Agrovet Locator", desc: "GPS-powered map to find the nearest certified agrovet within your radius with real-time stock info.", color: "purple" },
  { icon: CloudRain, title: "Climate Intelligence", desc: "Hyperlocal 7-day forecasts, seasonal rainfall predictions, and drought risk alerts.", color: "cyan" },
  { icon: CreditCard, title: "Agri-Financing & Insurance", desc: "AI risk scoring based on farm data enables faster micro-loan approvals and crop insurance.", color: "pink" },
  { icon: Shield, title: "Anti-Counterfeit Verification", desc: "QR codes on all marketplace products verified against blockchain registry.", color: "indigo" },
  { icon: TrendingUp, title: "Yield Optimization AI", desc: "Personalized planting calendars, fertilizer recommendations, and harvest timing advisories.", color: "green" },
  { icon: Users, title: "Farmer Community Hub", desc: "Peer learning, expert Q&A, market groups, and cooperative formation tools.", color: "orange" },
];

const colorMap: Record<string, string> = {
  green: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  amber: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  purple: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  cyan: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400",
  pink: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400",
  indigo: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
  orange: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
};

export function FeaturesSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <Badge className="mb-4">Features</Badge>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4">
            Everything a Farmer Needs
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Nine integrated modules working together to maximize your farm&apos;s potential, profitability, and resilience.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc, color }) => (
            <Card key={title} className="p-6 hover:shadow-lg transition-shadow card-hover group">
              <CardContent className="p-0">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${colorMap[color]} group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
