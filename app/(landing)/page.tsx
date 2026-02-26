import type { Metadata } from "next";
import { HeroSection } from "@/components/landing/sections/HeroSection";
import { ProblemSection } from "@/components/landing/sections/ProblemSection";
import { SolutionSection } from "@/components/landing/sections/SolutionSection";
import { HowItWorksSection } from "@/components/landing/sections/HowItWorksSection";
import { FeaturesSection } from "@/components/landing/sections/FeaturesSection";
import { MarketplacePreviewSection } from "@/components/landing/sections/MarketplacePreviewSection";
import { AgrovetSection } from "@/components/landing/sections/AgrovetSection";
import { FinancingSection } from "@/components/landing/sections/FinancingSection";
import { ImpactSection } from "@/components/landing/sections/ImpactSection";
import { TestimonialsSection } from "@/components/landing/sections/TestimonialsSection";
import { PartnersSection } from "@/components/landing/sections/PartnersSection";
import { CTASection } from "@/components/landing/sections/CTASection";

export const metadata: Metadata = {
  title: "DIGI-FARMS – Precision Agriculture Platform",
  description:
    "AI-powered precision agriculture platform connecting farmers to diagnostics, marketplace, financing, and agrovets across East Africa.",
};

// ── Section 1: Hero ─────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="gradient-hero min-h-[92vh] flex items-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-green-500/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-green-600/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-green-700/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 max-w-7xl py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div className="animate-fade-up">
            <Badge variant="earth" className="mb-6 text-xs font-bold tracking-wider px-4 py-1.5 uppercase">
              🌍 Hult Prize 2026 · Precision Agritech
            </Badge>
              <h1 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[1.05] mb-6">
              Farm Smarter.
              <br />
              <span className="text-gradient">Harvest More.</span>
              <br />
              <span className="text-green-900 dark:text-green-300">Thrive Now.</span>
            </h1>
            <p className="text-lg text-slate-800 dark:text-green-100/80 leading-relaxed mb-8 max-w-lg">
              Africa&apos;s first AI-powered precision agriculture ecosystem — connecting
              smallholder farmers with smart diagnostics, fair markets, certified agrovets,
              and climate-resilient financing tools.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Button variant="hero" size="xl" asChild>
                <Link href="/register">
                  <Sprout className="w-5 h-5" />
                  Start Farming Smarter
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link href="#how-it-works">
                  <Play className="w-4 h-4" />
                  Watch Demo
                </Link>
              </Button>
            </div>

            <div className="flex items-center gap-6 text-sm text-slate-700 dark:text-green-200/70">
                <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Free 14-day trial
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-green-600" />
                No credit card
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Swahili & English
              </div>
            </div>
          </div>

          {/* Right: Dashboard preview card (client) */}
          <DashboardPreview />
        </div>

        {/* Impact stats bar */}
        <div className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { value: "50K+", label: "Farmers Empowered", icon: "👨‍🌾" },
            { value: "+32%", label: "Average Yield Gain", icon: "📈" },
            { value: "5 Countries", label: "East Africa Coverage", icon: "🌍" },
            { value: "KES 2.4B", label: "Marketplace Volume", icon: "💸" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-transparent border border-transparent dark:border-slate-700 rounded-2xl p-6 text-center flex flex-col items-center justify-center min-h-[110px] sm:min-h-[90px] text-white"
            >
              <div className="text-2xl mb-2 text-white">{stat.icon}</div>
              <div className="text-3xl font-black text-white dark:text-white mb-1">{stat.value}</div>
              <div className="text-white dark:text-green-300/70 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section 2: Problem Statement ─────────────────────────────────────────────
function ProblemSection() {
  const problems = [
    { stat: "40%", desc: "of Sub-Saharan Africa's harvest is lost post-planting due to disease & pests", icon: "🌿", color: "red" },
    { stat: "$48B", desc: "in annual crop losses from preventable diseases across the continent", icon: "💸", color: "orange" },
    { stat: "80%", desc: "of smallholder farmers lack access to affordable crop insurance and financing", icon: "🏦", color: "amber" },
    { stat: "3.1B", desc: "people in food-insecure households depend on smallholder agriculture globally", icon: "🌍", color: "blue" },
  ];

  return (
    <section
      className="py-24 bg-image-overlay"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=1600&q=80&auto=format&fit=crop')" }}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <Badge variant="destructive" className="mb-4">The Crisis</Badge>
          <h2 style={{ color: 'var(--foreground)' }} className="text-4xl lg:text-5xl font-black mb-4">
            African Agriculture is <span className="text-red-600">Bleeding</span>
          </h2>
          <p style={{ color: 'var(--foreground-muted)' }} className="text-lg max-w-2xl mx-auto">
            Smallholder farmers — who produce 70% of Africa&apos;s food supply — are losing billions annually to preventable problems that technology can solve.
          </p>
        </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {problems.map(({ stat, desc, icon }) => (
              <div key={stat} className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 card-hover text-center">
                <div className="text-4xl mb-3">{icon}</div>
                <div className="text-4xl font-black text-red-600 dark:text-red-400 mb-3">{stat}</div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

        <div className="mt-12 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/60 dark:to-orange-950/60 rounded-2xl p-8 border border-red-200 dark:border-red-900/50 text-center backdrop-blur-sm">
          <p className="text-slate-700 dark:text-slate-300 text-lg max-w-3xl mx-auto">
            &quot;Without intervention, climate change will push <strong>100 million</strong> more African farmers
            into extreme poverty by 2030. DIGI-FARMS was built to reverse this.&quot;
          </p>
        </div>
      </div>
    </section>
  );
}

// ── Section 3: Solution Overview ─────────────────────────────────────────────
function SolutionSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-green-50 via-emerald-100 to-yellow-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
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
                <div key={title} className="flex items-start gap-4 p-4 rounded-xl hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors">
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

          {/* Solution visual */}
          <div className="bg-white/80 backdrop-blur-sm dark:bg-gradient-to-br dark:from-green-700 dark:to-green-900 rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-white/60 dark:bg-white/20 flex items-center justify-center mb-3 backdrop-blur-sm">
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
                <div key={label} className="bg-white/60 dark:bg-slate-900 rounded-xl p-3 flex items-center gap-3">
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

// ── Section 4: How It Works ───────────────────────────────────────────────────
function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      icon: "📲",
      title: "Sign Up & Profile Your Farm",
      desc: "Create your farmer profile in under 3 minutes. Add your farm location, crops, and land size to unlock personalized insights.",
    },
    {
      step: "02",
      icon: "🔬",
      title: "Scan Crops with AI Camera",
      desc: "Point your phone at any crop. Our Vision AI analyzes it instantly — diagnosing disease, nutrient deficiency, or pest damage with 94% accuracy.",
    },
    {
      step: "03",
      icon: "📊",
      title: "Get Smart Recommendations",
      desc: "Receive AI-powered treatment plans, market timing advice, weather alerts, and financing options — all personalized to your specific farm.",
    },
    {
      step: "04",
      icon: "🛒",
      title: "Buy, Sell & Access Finance",
      desc: "Order verified inputs from the marketplace. Sell your produce at fair prices. Apply for crop insurance and micro-loans based on your farm score.",
    },
    {
      step: "05",
      icon: "📈",
      title: "Track & Improve Every Season",
      desc: "Monitor yield trends, financial performance, and sustainability scores. Build your digital farm identity and qualify for better financing each season.",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <Badge variant="earth" className="mb-4">Process</Badge>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4">
            How DIGI-FARMS Works
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            From farm registration to harvest optimization — five simple steps to transform your agricultural outcomes.
          </p>
        </div>

        <div className="relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-green-200 via-green-400 to-green-200 dark:from-green-900 dark:via-green-600 dark:to-green-900" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {steps.map(({ step, icon, title, desc }, i) => (
              <div key={step} className={`flex flex-col items-center text-center animate-fade-up`} style={{ animationDelay: `${i * 100}ms` }}>
                <div className="relative z-10 w-20 h-20 rounded-2xl bg-white dark:bg-slate-900 border-2 border-green-500 shadow-lg flex items-center justify-center text-3xl mb-4">
                  {icon}
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-green-600 text-white text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-2">{title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Section 5: Key Features Grid ─────────────────────────────────────────────
function FeaturesSection() {
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

  return (
    <section className="py-24 bg-white dark:bg-slate-900">
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
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${colorMap[color]} group-hover:scale-110 transition-transform`}>
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

// ── Section 6: Marketplace ────────────────────────────────────────────────────
function MarketplacePreviewSection() {
  const categories = [
    { name: "Hybrid Seeds", icon: "🌱", products: "2,400+ products", color: "bg-green-50 dark:bg-green-950/30" },
    { name: "Fertilizers", icon: "🧪", products: "890+ products", color: "bg-blue-50 dark:bg-blue-950/30" },
    { name: "Pesticides", icon: "🛡️", products: "1,200+ products", color: "bg-amber-50 dark:bg-amber-950/30" },
    { name: "Farm Tools", icon: "🔧", products: "650+ products", color: "bg-orange-50 dark:bg-orange-950/30" },
    { name: "Irrigation", icon: "💧", products: "340+ products", color: "bg-cyan-50 dark:bg-cyan-950/30" },
    { name: "Produce Sale", icon: "🌾", products: "Sell direct", color: "bg-purple-50 dark:bg-purple-950/30" },
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <Badge variant="earth" className="mb-4">Marketplace</Badge>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4">
            Africa&apos;s Largest AgriMarket
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            5,000+ verified products from 200+ certified suppliers across East Africa — with anti-counterfeit guarantees and price comparison tools.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {categories.map(({ name, icon, products, color }) => (
            <Link href="/marketplace" key={name} className={`${color} rounded-2xl p-5 text-center border border-transparent hover:border-green-300 dark:hover:border-green-700 transition-all card-hover`}>
              <div className="text-3xl mb-2">{icon}</div>
              <div className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-1">{name}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{products}</div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" asChild>
            <Link href="/marketplace">
              <ShoppingBag className="w-5 h-5" />
              Explore All Products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

// ── Section 7: Agrovet Locator ────────────────────────────────────────────────
function AgrovetSection() {
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
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">500+ verified agrovets across East Africa</p>
              <div className="flex flex-col gap-2">
                {"🟢 Wanjiku Agrovet — 1.2km", "🟢 Green Earth Supplies — 2.4km", "🟡 Nakuru Agro Hub — 3.8km"].map((v) => (
                  <div key={v} className="bg-white dark:bg-slate-900 rounded-lg px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 shadow-sm text-left">
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
              500+ verified agrovet partners mapped across East Africa. Check product availability, compare prices, and navigate with Google Maps integration.
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

// ── Section 8: Financing & Insurance ─────────────────────────────────────────
function FinancingSection() {
  return (
    <section className="py-24 bg-green-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-green-600/10 text-green-800 border-green-200 dark:bg-white/20 dark:text-white dark:border-white/30">Finance & Insurance</Badge>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4">
            Unlock Capital. <span className="text-gradient-gold">Protect Your Harvest.</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-green-200/80 max-w-2xl mx-auto">
            Your digital farm record is your credit score. Access micro-loans and crop insurance without traditional collateral requirements.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Financing card */}
              <div className="rounded-2xl p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center mb-6">
              <CreditCard className="w-6 h-6 text-amber-600 dark:text-amber-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">Agri Micro-Finance</h3>
            <p className="text-slate-600 dark:text-green-200/80 mb-6 text-sm leading-relaxed">
              AI-powered credit scoring uses your DIGI-FARMS data — yield history, diagnostics, market activity — to provide instant loan decisions without traditional bank collateral.
            </p>
            <ul className="space-y-3 text-sm text-slate-700 dark:text-green-200">
              {[
                "Loans from KES 5,000 – KES 500,000",
                "Interest from 8% per annum",
                "Approval within 24 hours",
                "Integrated with 12+ Kenyan lenders",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Insurance card */}
              <div className="rounded-2xl p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center mb-6">
              <Shield className="w-6 h-6 text-blue-600 dark:text-blue-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">Crop Insurance</h3>
            <p className="text-slate-600 dark:text-green-200/80 mb-6 text-sm leading-relaxed">
              Index-based crop insurance powered by satellite imagery and weather data. Automatic payouts triggered by verified weather events — no paperwork required.
            </p>
            <ul className="space-y-3 text-sm text-slate-700 dark:text-green-200">
              {[
                "Coverage from KES 5,000/season",
                "Drought, flood, and pest coverage",
                "Satellite-triggered auto-payouts",
                "Partnered with UAP Old Mutual, Sanlam",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Section 9: Impact Metrics ─────────────────────────────────────────────────
function ImpactSection() {
  const metrics = [
    { value: "+32%", label: "Average yield improvement", sub: "after first full season on DIGI-FARMS", icon: "🌾" },
    { value: "94%", label: "AI diagnostic accuracy", sub: "across 200+ crop diseases", icon: "🔬" },
    { value: "3.2x", label: "ROI for Pro subscribers", sub: "compared to undigitised farms", icon: "📈" },
    { value: "65%", label: "Reduction in input waste", sub: "via precision recommendation engine", icon: "♻️" },
    { value: "8hrs", label: "Saved per week per farmer", sub: "through automation & smart alerts", icon: "⏱️" },
    { value: "KES 48K", label: "Average additional income/year", sub: "for farmers on the Pro plan", icon: "💰" },
  ];

  return (
    <section
      className="py-24 bg-image-overlay"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1600&q=80&auto=format&fit=crop')" }}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <Badge className="mb-4">Impact</Badge>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4">
            Numbers That Matter
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Real results from real farmers across our pilot programs in Kenya, Uganda, and Tanzania.
          </p>
        </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.map(({ value, label, sub, icon }) => (
            <div key={label} className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 text-center card-hover">
              <div className="text-4xl mb-3">{icon}</div>
              <div className="text-4xl font-black text-green-600 mb-2">{value}</div>
              <div className="font-bold text-slate-900 dark:text-white mb-1">{label}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section 10: Testimonials ──────────────────────────────────────────────────
function TestimonialsSection() {
  const testimonials = [
    {
      name: "Mary Wanjiku",
      role: "Maize & Vegetable Farmer",
      location: "Nakuru, Kenya",
      avatar: "MW",
      rating: 5,
      quote: "DIGI-FARMS changed how I farm. The AI diagnosed a rust disease on my maize before I could even see it with my eyes. I saved 70% of my crop that season.",
    },
    {
      name: "James Omondi",
      role: "Coffee Farmer",
      location: "Kisii, Kenya",
      avatar: "JO",
      rating: 5,
      quote: "I got a KES 80,000 loan through DIGI-FARMS in 2 days. No bank had approved me before. I used it to buy certified seedlings and my yield doubled.",
    },
    {
      name: "Grace Nyambura",
      role: "Horticulture Supplier",
      location: "Machakos, Kenya",
      avatar: "GN",
      rating: 5,
      quote: "As a supplier, the marketplace gave me access to thousands of farmers I could never reach before. My sales increased by 340% in 6 months.",
    },
  ];

  return (
    <section
      className="py-24 bg-image-overlay"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=1600&q=80&auto=format&fit=crop')" }}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <Badge variant="earth" className="mb-4">Testimonials</Badge>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4">
            Trusted by Farmers Across East Africa
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map(({ name, role, location, avatar, rating, quote }) => (
            <Card key={name} className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 italic">
                  &quot;{quote}&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white text-sm font-bold">
                    {avatar}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm">{name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{role} · {location}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section 11: Partners ──────────────────────────────────────────────────────
function PartnersSection() {
  const partners = [
    { name: "CGIAR", type: "Research Partner" },
    { name: "Equity Bank", type: "Finance Partner" },
    { name: "Safaricom", type: "Technology Partner" },
    { name: "UAP Old Mutual", type: "Insurance Partner" },
    { name: "AGRA", type: "Agriculture Partner" },
    { name: "Google.org", type: "Tech for Good" },
    { name: "Kenya NDMA", type: "Government Partner" },
    { name: "World Bank IFC", type: "Investment Partner" },
  ];

  return (
    <section
      className="py-20 bg-image-overlay border-y border-slate-200 dark:border-slate-800"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1600&q=80&auto=format&fit=crop')" }}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-2">Backed by world-class partners</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {partners.map(({ name, type }) => (
            <div key={name} className="bg-white dark:bg-slate-900 rounded-xl p-4 text-center shadow-sm border border-slate-200 dark:border-slate-800 hover:border-green-300 transition-colors">
              <div className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-1">{name}</div>
              <div className="text-xs text-slate-400">{type}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section 12: Final CTA + Newsletter ───────────────────────────────────────
function CTASection() {
  return (
    <section className="py-24 gradient-mesh">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <Badge className="mb-6 bg-green-600/10 text-green-800 border-green-200 text-sm px-4 py-1.5 dark:bg-white/20 dark:text-white dark:border-white/30">
          🚀 Join 50,000+ Farmers
        </Badge>
        <h2 className="text-4xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
          Ready to Transform <br />
          <span className="text-gradient">Your Farm?</span>
        </h2>
        <p className="text-xl text-slate-600 dark:text-green-200/80 mb-10 leading-relaxed">
          Start your free 14-day trial today. No credit card required. Cancel anytime.
          Join thousands of farmers already using DIGI-FARMS to feed the continent.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="hero" size="xl" asChild>
            <Link href="/register">
              <Sprout className="w-5 h-5" />
              Create Free Account
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button variant="hero-outline" size="xl" asChild>
            <Link href="/contact">
              <Zap className="w-5 h-5" />
              Book a Demo
            </Link>
          </Button>
        </div>

        <div className="mt-16 pt-10 border-t border-slate-200 dark:border-white/20">
          <p className="text-slate-500 dark:text-green-200/60 text-sm mb-4">📩 Subscribe to AgriIntelligence Weekly</p>
          <form className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 h-12 px-4 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-white/10 dark:border-white/20 dark:text-white dark:placeholder:text-green-200/50 dark:focus:ring-white/30 backdrop-blur-sm text-sm"
            />
            <Button variant="hero" size="lg" type="submit">Subscribe</Button>
          </form>
          <p className="text-slate-400 dark:text-green-200/40 text-xs mt-3">Join 28,000+ subscribers. No spam, ever.</p>
        </div>
      </div>
    </section>
  );
}

// ── Page Composition ──────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <HowItWorksSection />
      <FeaturesSection />
      <MarketplacePreviewSection />
      <AgrovetSection />
      <FinancingSection />
      <ImpactSection />
      <TestimonialsSection />
      <PartnersSection />
      <CTASection />
    </>
  );
}
