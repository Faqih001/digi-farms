import Link from "next/link";
import {
  BarChart3, LineChart, TrendingUp, ArrowRight, Droplets,
  Thermometer, Sun, Leaf, Map, Brain, Zap, Calendar, Target,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  { icon: LineChart, title: "Yield Tracking", desc: "Monitor crop yields season by season. Compare performance across plots, crops, and practices." },
  { icon: Droplets, title: "Soil Health Analysis", desc: "Track pH, NPK levels, organic matter, and soil moisture with IoT sensor integration." },
  { icon: Thermometer, title: "Climate Insights", desc: "Hyperlocal weather data and climate forecasting tailored to your exact farm coordinates." },
  { icon: Brain, title: "AI Recommendations", desc: "Machine learning models suggest optimal planting dates, input quantities, and crop rotations." },
  { icon: Map, title: "Field Mapping", desc: "Satellite imagery overlays show NDVI, crop health, and irrigation coverage per plot." },
  { icon: Target, title: "ROI Calculator", desc: "Track input costs vs. revenue per acre. Know exactly which crops and practices drive profit." },
];

const dashboardMetrics = [
  { icon: TrendingUp, label: "Yield per Acre", value: "+23%", desc: "vs. regional average", color: "text-green-600 dark:text-green-400" },
  { icon: Droplets, label: "Water Efficiency", value: "340L", desc: "per kg of maize", color: "text-blue-600 dark:text-blue-400" },
  { icon: Sun, label: "Growing Days", value: "142", desc: "current season", color: "text-amber-600 dark:text-amber-400" },
  { icon: Leaf, label: "Crop Health", value: "94%", desc: "healthy canopy", color: "text-green-600 dark:text-green-400" },
  { icon: BarChart3, label: "Input ROI", value: "3.2x", desc: "return on investment", color: "text-purple-600 dark:text-purple-400" },
  { icon: Calendar, label: "Next Action", value: "3 days", desc: "top-dress fertilizer", color: "text-red-600 dark:text-red-400" },
];

const reports = [
  { title: "Seasonal Yield Report", desc: "Complete season analysis with yield maps, input tracking, and cost breakdowns." },
  { title: "Soil Health Trends", desc: "Multi-year soil health trajectory with nutrient depletion alerts and amendment recommendations." },
  { title: "Weather Impact Analysis", desc: "Correlate rainfall, temperature, and humidity patterns with actual crop performance." },
  { title: "Financial Performance", desc: "Per-crop P&L statements, input cost analysis, and revenue forecasting." },
];

export function AnalyticsHeroSection() {
  return (
    <section className="gradient-hero py-20 lg:py-28">
      <div className="container mx-auto px-4 max-w-7xl text-center">
        <Badge className="mb-6 bg-white/20 text-white border-white/30">Farm Analytics</Badge>
        <h1 className="text-4xl lg:text-6xl font-black text-white mb-6 leading-tight">
          Data-Driven <span className="text-green-200">Farming</span>
        </h1>
        <p className="text-lg text-green-100/90 max-w-2xl mx-auto mb-8">
          Transform raw farm data into actionable insights. Track yields, monitor soil health, and
          make every acre more productive with AI-powered analytics.
        </p>
        <Button variant="hero" size="lg" asChild>
          <Link href="/register">Get Your Dashboard <ArrowRight className="ml-2 w-4 h-4" /></Link>
        </Button>
      </div>
    </section>
  );
}

export function AnalyticsDashboardSection() {
  return (
    <section className="py-16 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <Badge className="mb-4">Dashboard Preview</Badge>
          <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">Your Farm at a Glance</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {dashboardMetrics.map((m) => (
            <Card key={m.label} className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                    <m.icon className={`w-5 h-5 ${m.color}`} />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{m.label}</p>
                </div>
                <p className={`text-2xl font-black ${m.color}`}>{m.value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{m.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AnalyticsFeaturesSection() {
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-14">
          <Badge className="mb-4">Capabilities</Badge>
          <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">Precision Tools for Every Farmer</h2>
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

export function AnalyticsReportsSection() {
  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge className="mb-4">Automated Reports</Badge>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mb-6">Reports That Write Themselves</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              AI-generated reports delivered weekly, monthly, or seasonally — in Swahili or English.
              Share with lenders, insurers, or cooperative managers.
            </p>
            <div className="space-y-3">
              {reports.map((r) => (
                <div key={r.title} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="font-semibold text-slate-900 dark:text-white text-sm mb-0.5">{r.title}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{r.desc}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-green-800 dark:bg-slate-800 rounded-3xl p-8 text-white shadow-xl border border-green-900 dark:border-slate-700">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-black mb-2">Q1 Farm Report</h3>
            <p className="text-green-200/80 dark:text-slate-300 text-sm mb-6">Generated automatically · March 2025</p>
            <div className="space-y-3">
              {[["Maize Yield", "3.4T/ha", "+18%"], ["Input Cost", "KES 45,200", "-5%"], ["Gross Revenue", "KES 312,000", "+22%"], ["Profit Margin", "31%", "+8pts"]].map(([k, v, ch]) => (
                <div key={k} className="flex items-center justify-between text-sm bg-white/10 rounded-lg px-3 py-2">
                  <span className="text-green-200 dark:text-slate-400">{k}</span>
                  <span className="font-bold text-white">{v}</span>
                  <span className={ch.startsWith("+") ? "text-green-400 text-xs" : "text-red-400 text-xs"}>{ch}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function AnalyticsCTASection() {
  return (
    <section className="py-20 gradient-mesh">
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <Badge className="mb-4">
          <Zap className="w-3 h-3 mr-1" />Start Today
        </Badge>
        <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mb-4">Turn Your Farm Data into Profits</h2>
        <p className="text-slate-600 dark:text-green-200/80 mb-8">Connect your farm in minutes. Our onboarding team will guide you through setup.</p>
        <Button size="lg" asChild>
          <Link href="/register">Get Analytics Access <ArrowRight className="ml-2 w-4 h-4" /></Link>
        </Button>
      </div>
    </section>
  );
}
