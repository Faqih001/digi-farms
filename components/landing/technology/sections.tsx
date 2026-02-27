import Link from "next/link";
import {
  Cpu, Satellite, BarChart3, Cloud, TrendingUp, Shield,
  MapPin, Smartphone, Lock, Zap, CheckCircle, ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// ── Section 1: Hero ──────────────────────────────────────────────────────────

export function TechHeroSection() {
  return (
    <section className="gradient-hero py-24">
      <div className="container mx-auto px-4 max-w-7xl text-center">
        <Badge className="mb-6 bg-white/20 text-white border-white/30">Our Technology</Badge>
        <h1 className="text-5xl lg:text-7xl font-black text-white mb-6 leading-tight">
          Precision Agriculture <br />
          <span className="text-green-200">Powered by AI</span>
        </h1>
        <p className="text-xl text-green-100/90 max-w-3xl mx-auto mb-10">
          Six integrated technology modules working in harmony — from satellite imagery and AI
          diagnostics to climate forecasting and financial risk modeling.
        </p>
        <Button variant="hero" size="xl" asChild>
          <Link href="/contact#demo">Book a Technology Demo <ArrowRight className="w-4 h-4" /></Link>
        </Button>
      </div>
    </section>
  );
}

// ── Section 2: Robotics as a Service ─────────────────────────────────────────

export function RoboticsSection() {
  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <Badge className="mb-4">RaaS</Badge>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-6">
              Robotics-as-a-Service
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Farmer cooperatives can rent precision agricultural drones and IoT sensor packages by
              the season. No capital expenditure — just pay per hectare monitored.
            </p>
            <div className="space-y-4">
              {[
                { title: "Autonomous crop scouting drones", desc: "Weekly field surveillance with multispectral cameras" },
                { title: "IoT soil moisture sensors", desc: "Real-time soil data every 15 minutes" },
                { title: "Weather micro-stations", desc: "Hyperlocal forecasting within 500m accuracy" },
                { title: "Cooperative device sharing", desc: "Single subscription for up to 20-farmer groups" },
              ].map(({ title, desc }) => (
                <div key={title} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white text-sm">{title}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-700 to-green-900 dark:from-slate-800 dark:to-green-950 rounded-3xl p-8 text-white shadow-xl">
            <div className="text-6xl mb-4 text-center">🚁</div>
            <h3 className="text-xl font-black text-center mb-6">Drone Scouting Dashboard</h3>
            <div className="space-y-3">
              {[
                { label: "Field Coverage", value: "5.2 ha scanned", status: "✅" },
                { label: "Stress Zones Detected", value: "2 areas flagged", status: "⚠️" },
                { label: "Soil Moisture Average", value: "68% — Optimal", status: "✅" },
                { label: "Next Flight", value: "Tomorrow 7am", status: "📅" },
              ].map(({ label, value, status }) => (
                <div key={label} className="bg-white/10 rounded-xl p-3 flex justify-between items-center">
                  <div className="text-sm">
                    <div className="text-green-300 text-xs">{label}</div>
                    <div className="font-bold text-white">{value}</div>
                  </div>
                  <div className="text-xl">{status}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Section 3: AI Diagnostics ─────────────────────────────────────────────────

export function AIDiagnosticsSection() {
  return (
    <section id="diagnostics" className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Live demo widget */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-white">AI Diagnostic Engine</div>
                <div className="text-xs text-green-600 dark:text-green-400">● Model v2.4 · Active</div>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 mb-4 text-center border-2 border-dashed border-slate-300 dark:border-slate-600">
              <div className="text-4xl mb-2">📸</div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Tap to upload a crop image</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">JPG, PNG · Max 10MB</p>
            </div>
            <div className="space-y-3">
              {[
                { disease: "Northern Corn Leaf Blight", confidence: 92, risk: "HIGH" },
                { disease: "Gray Leaf Spot", confidence: 74, risk: "MEDIUM" },
                { disease: "Common Rust", confidence: 61, risk: "LOW" },
              ].map(({ disease, confidence, risk }) => (
                <div key={disease} className="flex items-center gap-3 text-sm">
                  <div className="flex-1">
                    <div className="text-slate-700 dark:text-slate-300 font-medium mb-1">{disease}</div>
                    <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${confidence}%` }} />
                    </div>
                  </div>
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400">{confidence}%</div>
                  <Badge variant={risk === "HIGH" ? "destructive" : risk === "MEDIUM" ? "warning" : "secondary"} className="text-[10px]">{risk}</Badge>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Badge variant="earth" className="mb-4">AI Diagnostics</Badge>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-6">
              Diagnose Any Crop Disease <span className="text-gradient">in Seconds</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Our Vision AI was trained on 4 million+ African crop images across 200+ diseases.
              Farmers point, shoot, and get a diagnosis with treatment plan — faster than any
              agronomist visit.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "94%", label: "Diagnostic Accuracy", color: "text-green-600 dark:text-green-400" },
                { value: "200+", label: "Diseases in Database", color: "text-blue-600 dark:text-blue-400" },
                { value: "<5s", label: "Analysis Time", color: "text-amber-600 dark:text-amber-400" },
                { value: "4M+", label: "Training Images", color: "text-purple-600 dark:text-purple-400" },
              ].map(({ value, label, color }) => (
                <div key={label} className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700 text-center shadow-sm">
                  <div className={`text-2xl font-black ${color}`}>{value}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Section 4: Multispectral Imaging ─────────────────────────────────────────

export function MultispectralSection() {
  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <Badge className="mb-4">Imaging</Badge>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">
            See What the Human Eye Can&apos;t
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Multispectral imaging reveals crop stress, soil variability, and water distribution
            invisible to the naked eye — weeks before visible symptoms appear.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Satellite, title: "NDVI Mapping", desc: "Normalized Difference Vegetation Index maps reveal crop health and vigor across entire fields at once.", color: "bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400" },
            { icon: BarChart3, title: "Soil Variability Maps", desc: "Identify zones of soil compaction, nutrient deficiency, and waterlogging with precision GPS boundaries.", color: "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400" },
            { icon: Cloud, title: "Water Stress Detection", desc: "Thermal infrared imaging detects water stress 7–14 days before wilting occurs, enabling proactive irrigation.", color: "bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400" },
          ].map(({ icon: Icon, title, desc, color }) => (
            <Card key={title} className="p-6 text-center bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-4 ${color}`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-3">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section 5: Farm Analytics ─────────────────────────────────────────────────

export function FarmAnalyticsSection() {
  return (
    <section id="analytics" className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <Badge variant="earth" className="mb-4">Farm Analytics</Badge>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-6">
              Data-Driven Farming Decisions
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Your DIGI-FARMS dashboard aggregates all farm data into actionable intelligence —
              yield tracking, profitability scoring, input efficiency, and season-over-season
              benchmarking.
            </p>
            <div className="space-y-4">
              {[
                "Multi-season yield trend analysis",
                "Input ROI calculator per crop type",
                "Farm profitability score & benchmarking",
                "Market timing optimizer (best sell windows)",
                "Custom report export (PDF, CSV)",
              ].map((f) => (
                <div key={f} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <BarChart3 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:bg-slate-800 dark:from-slate-800 dark:to-slate-800 rounded-2xl p-6 shadow-lg border border-green-200 dark:border-slate-700">
            <div className="text-sm text-green-700 dark:text-slate-400 mb-4">Farm Performance — Season Overview</div>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: "Yield Score", value: "87/100", color: "text-green-600 dark:text-green-400" },
                { label: "Profitability", value: "KES 124K", color: "text-amber-600 dark:text-amber-400" },
                { label: "Season Rank", value: "Top 15%", color: "text-blue-600 dark:text-blue-400" },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-white/60 dark:bg-white/10 rounded-xl p-3 text-center">
                  <div className={`font-black text-lg ${color}`}>{value}</div>
                  <div className="text-xs text-slate-500 dark:text-white/60 mt-0.5">{label}</div>
                </div>
              ))}
            </div>
            <div className="space-y-2 text-xs">
              <div className="text-slate-500 dark:text-white/60 mb-2">Monthly Yield Progress (MT)</div>
              {[["Jan", 1.2, 40], ["Feb", 2.1, 62], ["Mar", 3.4, 85], ["Apr", 2.8, 72]].map(([m, val, pct]) => (
                <div key={m as string} className="flex items-center gap-3">
                  <span className="text-slate-500 dark:text-white/60 w-6">{m}</span>
                  <div className="flex-1 h-2 bg-green-200 dark:bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 dark:bg-green-400 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-slate-700 dark:text-white/80 w-8 text-right">{val}T</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Section 6: Climate Modeling ───────────────────────────────────────────────

export function ClimateModeling() {
  return (
    <section id="climate" className="py-24 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="bg-gradient-to-br from-blue-50 to-sky-100 dark:from-blue-900 dark:to-blue-950 rounded-3xl p-8 shadow-xl">
            <div className="text-5xl mb-4">🌦️</div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">7-Day Precision Forecast</h3>
            <div className="space-y-2">
              {[
                { day: "Today", temp: "26°C", rain: "12mm", icon: "🌤️" },
                { day: "Tomorrow", temp: "24°C", rain: "28mm", icon: "🌧️" },
                { day: "Day 3", temp: "22°C", rain: "45mm", icon: "⛈️" },
                { day: "Day 4", temp: "25°C", rain: "8mm", icon: "⛅" },
                { day: "Day 5", temp: "27°C", rain: "2mm", icon: "☀️" },
              ].map(({ day, temp, rain, icon }) => (
                <div key={day} className="flex items-center justify-between bg-white/60 dark:bg-white/10 rounded-xl px-4 py-2.5">
                  <span className="text-xs text-blue-600 dark:text-blue-200 w-16">{day}</span>
                  <span className="text-lg">{icon}</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{temp}</span>
                  <span className="text-xs text-blue-500 dark:text-blue-300">💧 {rain}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-yellow-100 dark:bg-yellow-500/20 rounded-xl p-3 border border-yellow-300 dark:border-yellow-400/30">
              <div className="text-yellow-700 dark:text-yellow-300 text-xs font-bold">⚠️ Heavy Rain Alert — Day 3</div>
              <div className="text-blue-700 dark:text-blue-200 text-xs mt-1">Delay fungicide application. Harvest tomatoes before Day 3 if possible.</div>
            </div>
          </div>

          <div>
            <Badge className="mb-4">Climate Intelligence</Badge>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-6">
              Climate AI for Every Farm
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Powered by satellite data, local weather stations, and historic climate patterns,
              DIGI-FARMS delivers hyperlocal forecasts down to 500m accuracy.
            </p>
            <div className="space-y-4">
              {[
                { title: "Seasonal rainfall forecasts", desc: "Plan planting dates based on long-range forecasts" },
                { title: "Pest outbreak risk alerts", desc: "Correlate weather with historical pest data" },
                { title: "Evapotranspiration maps", desc: "Optimize irrigation scheduling automatically" },
                { title: "Climate risk scoring", desc: "For lender and insurance underwriting models" },
              ].map(({ title, desc }) => (
                <div key={title} className="flex items-start gap-3">
                  <Cloud className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white text-sm">{title}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{desc}</div>
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

// ── Section 7: Farm Score ─────────────────────────────────────────────────────

export function FarmScoreSection() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 max-w-7xl text-center">
        <Badge className="mb-4">Farm Score</Badge>
        <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">
          Your Digital Farm Identity
        </h2>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-12">
          The DIGI-FARMS Farm Score aggregates 40+ data points into a single performance metric —
          your passport to better loans, insurance, and market access.
        </p>
        <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            { icon: "🌿", label: "Crop Health", weight: "25%", desc: "AI diagnostic history" },
            { icon: "🌾", label: "Yield Performance", weight: "30%", desc: "Season-over-season data" },
            { icon: "💧", label: "Resource Efficiency", weight: "20%", desc: "Water & input usage" },
            { icon: "💰", label: "Financial Behavior", weight: "25%", desc: "Market & loan history" },
          ].map(({ icon, label, weight, desc }) => (
            <div key={label} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 text-center card-hover shadow-sm">
              <div className="text-4xl mb-3">{icon}</div>
              <div className="font-bold text-slate-900 dark:text-white mb-1">{label}</div>
              <div className="text-2xl font-black text-green-600 dark:text-green-400 mb-1">{weight}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section 8: Risk Profiling ─────────────────────────────────────────────────

export function RiskProfilingSection() {
  return (
    <section id="finance" className="py-24 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <Badge variant="earth" className="mb-4">Risk Engine</Badge>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-6">
              AI Risk Profiling for Lenders
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Our risk engine gives lenders and insurers a data-driven creditworthiness score for
              each farmer — based on observed farm behavior, not just collateral. Reduce
              non-performing loans by 60%.
            </p>
            <div className="space-y-3">
              {[
                "40+ farm data points analyzed per loan application",
                "Weather-adjusted yield projections",
                "Historical repayment and marketplace behavior",
                "Climate risk overlay from our climate AI",
                "Real-time monitoring alerts for portfolio management",
              ].map((f) => (
                <div key={f} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4">Risk Assessment Report</div>
            <div className="text-center mb-6">
              <div className="w-24 h-24 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 border-4 border-green-500 flex items-center justify-center">
                <div>
                  <div className="text-2xl font-black text-green-600 dark:text-green-400">78</div>
                  <div className="text-xs text-green-600 dark:text-green-400 font-semibold">/100</div>
                </div>
              </div>
              <div className="font-bold text-slate-900 dark:text-white mt-2">Low-Medium Risk</div>
              <Badge className="mt-1">Loan Approved ✓</Badge>
            </div>
            <div className="space-y-2">
              {[["Crop Health History", 85], ["Yield Consistency", 72], ["Market Activity", 80], ["Climate Risk", 68]].map(([label, score]) => (
                <div key={label as string} className="flex items-center gap-3 text-xs">
                  <span className="text-slate-500 dark:text-slate-400 w-36">{label}</span>
                  <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${score}%` }} />
                  </div>
                  <span className="text-slate-700 dark:text-slate-300 w-6 text-right font-semibold">{score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Section 9: Maps ───────────────────────────────────────────────────────────

export function MapsSection() {
  return (
    <section id="locator" className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 max-w-7xl text-center">
        <Badge className="mb-4">Maps</Badge>
        <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">
          Google Maps Integration
        </h2>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-12">
          Seamless Google Maps SDK integration powers our agrovet locator, farm boundary mapping,
          and GPS-tagged diagnostic site management.
        </p>
        <div className="bg-gradient-to-br from-slate-100 to-green-50 dark:from-slate-800 dark:to-green-950/20 rounded-3xl h-64 flex items-center justify-center border border-slate-200 dark:border-slate-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
          <div className="text-center relative z-10">
            <MapPin className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-3" />
            <p className="font-bold text-slate-700 dark:text-slate-300">Interactive Map Preview</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Available in the Farmer Dashboard</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Section 10: Mobile App ────────────────────────────────────────────────────

export function MobileAppSection() {
  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <Badge variant="earth" className="mb-4">Mobile First</Badge>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-6">
              Farm From Your Pocket
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              The DIGI-FARMS mobile app is built for low-end Android devices with offline-first
              architecture. Works on 2G connectivity in remote farming areas.
            </p>
            <div className="space-y-4">
              {[
                { title: "Offline-first architecture", desc: "Works without internet, syncs when connected" },
                { title: "Supports low-end Android", desc: "Optimized for devices from KES 8,000+" },
                { title: "Voice input in Swahili", desc: "Describe symptoms via voice for AI analysis" },
                { title: "USSD fallback mode", desc: "Basic features accessible via *384#" },
              ].map(({ title, desc }) => (
                <div key={title} className="flex items-start gap-3">
                  <Smartphone className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white text-sm">{title}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-8">
              <Button size="lg" asChild><Link href="/register">Get the App</Link></Button>
              <Button variant="outline" size="lg">Download APK</Button>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-600 dark:to-green-800 rounded-3xl p-8 text-center shadow-2xl">
            <div className="text-8xl mb-4">📱</div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">DIGI-FARMS App</h3>
            <p className="text-green-700 dark:text-green-200/80 text-sm mb-4">Available on Android &amp; Web</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[["100K+", "Downloads"], ["4.7★", "Rating"], ["Swahili", "Language"], ["Offline", "Mode"]].map(([v, l]) => (
                <div key={l} className="bg-white/60 dark:bg-white/10 rounded-xl p-3">
                  <div className="font-black text-slate-900 dark:text-white">{v}</div>
                  <div className="text-xs text-green-600 dark:text-green-300">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Section 11: Data Privacy ──────────────────────────────────────────────────

export function DataPrivacySection() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 max-w-7xl text-center">
        <Badge className="mb-4">Privacy &amp; Security</Badge>
        <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Your Farm Data is Yours</h2>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-12">
          We built security-first infrastructure. Your data is never sold. You can export or delete it anytime.
        </p>
        <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {[
            { icon: Lock, title: "AES-256 Encryption", desc: "All farm data encrypted at rest and in transit", color: "bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400" },
            { icon: Shield, title: "GDPR & Kenya DPA Compliant", desc: "Full compliance with data protection regulations", color: "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400" },
            { icon: Zap, title: "Zero Data Selling Policy", desc: "We never monetize your data with third parties", color: "bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400" },
          ].map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 text-center shadow-sm">
              <div className={`w-12 h-12 mx-auto rounded-2xl flex items-center justify-center mb-3 ${color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section 12: Demo CTA ──────────────────────────────────────────────────────

export function TechCTASection() {
  return (
    <section className="py-24 gradient-mesh">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <h2 className="text-5xl font-black text-slate-900 dark:text-white mb-6">
          See It In <span className="text-gradient">Action</span>
        </h2>
        <p className="text-xl text-slate-600 dark:text-green-200/80 mb-10">
          Book a 30-minute live demo with our agritech team. We&apos;ll walk you through every module
          and answer your specific farming questions.
        </p>
        <Button variant="hero" size="xl" asChild>
          <Link href="/contact#demo">
            <Zap className="w-5 h-5" />
            Book Free Demo
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
