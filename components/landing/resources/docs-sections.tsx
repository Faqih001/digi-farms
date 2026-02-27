import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen, ArrowRight, Rocket, Code, ShoppingCart, BarChart3,
  Shield, Smartphone, Wallet, Leaf, Search, ChevronRight,
} from "lucide-react";

const gettingStarted = [
  { icon: Rocket, title: "Quick Start Guide", desc: "Set up your account, complete verification, and make your first transaction in under 10 minutes.", time: "10 min" },
  { icon: ShoppingCart, title: "Marketplace Guide", desc: "Learn how to browse products, compare suppliers, place orders, and track deliveries.", time: "15 min" },
  { icon: BarChart3, title: "Farm Analytics Setup", desc: "Connect your farm data, set up monitoring dashboards, and configure alerts.", time: "20 min" },
  { icon: Wallet, title: "Payments & Financing", desc: "Understand M-Pesa integration, apply for farm loans, and manage your wallet.", time: "12 min" },
];

const docCategories = [
  { icon: Smartphone, title: "Platform Guides", count: 24, desc: "Step-by-step guides for every platform feature.", color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" },
  { icon: Code, title: "API Documentation", count: 40, desc: "REST API endpoints, authentication, and examples.", color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" },
  { icon: Shield, title: "Security & Compliance", count: 8, desc: "Data protection, privacy settings, and account security.", color: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" },
  { icon: Leaf, title: "Best Practices", count: 16, desc: "Maximize yields and profitability with expert tips.", color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" },
  { icon: ShoppingCart, title: "Seller Guides", count: 12, desc: "For suppliers and agrovets listing on the marketplace.", color: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400" },
  { icon: BarChart3, title: "Reporting & Analytics", count: 10, desc: "Custom reports, data exports, and integrations.", color: "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400" },
];

const popularArticles = [
  "How to register and verify your farmer account",
  "Setting up two-factor authentication",
  "Understanding AI crop disease diagnostics",
  "How to apply for a farm input loan",
  "Connecting weather data to your dashboard",
  "Listing products as a supplier",
  "Using the agrovet locator map",
  "Exporting your farm analytics data",
];

export function DocsHeroSection() {
  return (
    <section className="gradient-hero py-20 lg:py-28">
      <div className="container mx-auto px-4 max-w-7xl text-center">
        <Badge className="mb-6 bg-white/20 text-white border-white/30">Documentation</Badge>
        <h1 className="text-4xl lg:text-6xl font-black text-white mb-6 leading-tight">
          Everything You Need <br className="hidden sm:block" />
          <span className="text-green-200">to Get Started</span>
        </h1>
        <p className="text-lg text-green-100 max-w-2xl mx-auto mb-8">
          Comprehensive guides, tutorials, and references to help you make the most of DIGI-FARMS.
        </p>
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search documentation..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border-0 text-sm bg-white/95 dark:bg-slate-800/90 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-green-400 outline-none"
            aria-label="Search documentation"
          />
        </div>
      </div>
    </section>
  );
}

export function DocsGettingStartedSection() {
  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-14">
          <Badge variant="secondary" className="mb-4">Getting Started</Badge>
          <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">Quick Start Guides</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {gettingStarted.map((g) => (
            <Card key={g.title} className="group hover:shadow-xl transition-shadow bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-green-400">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <g.icon className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{g.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">{g.desc}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">{g.time}</Badge>
                  <ArrowRight className="w-4 h-4 text-green-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DocsCategoriesSection() {
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-14">
          <Badge variant="secondary" className="mb-4">Browse Topics</Badge>
          <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">Documentation Categories</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {docCategories.map((c) => (
            <Card key={c.title} className="group hover:shadow-xl transition-shadow bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-green-400 cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${c.color}`}>
                    <c.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-slate-900 dark:text-white">{c.title}</h3>
                      <Badge variant="secondary" className="text-xs">{c.count} articles</Badge>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{c.desc}</p>
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

export function DocsPopularArticlesSection() {
  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-14">
          <Badge variant="secondary" className="mb-4">Popular</Badge>
          <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">Frequently Read Articles</h2>
        </div>
        <div className="max-w-2xl mx-auto space-y-3">
          {popularArticles.map((a, i) => (
            <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors cursor-pointer group">
              <BookOpen className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex-1">{a}</span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-green-500 transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DocsCTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-800 dark:to-green-950">
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <BookOpen className="w-14 h-14 text-green-600 dark:text-green-300 mx-auto mb-4" />
        <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mb-4">Can&apos;t Find What You Need?</h2>
        <p className="text-slate-600 dark:text-green-100 mb-8">Our support team is always ready to help. Reach out and we&apos;ll get you the answers.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild className="bg-green-600 text-white hover:bg-green-700 dark:bg-white dark:text-green-700 dark:hover:bg-green-50">
            <Link href="/resources/help">Visit Help Center <ArrowRight className="ml-2 w-4 h-4" /></Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="border-green-600 text-green-700 hover:bg-green-50 dark:border-white/30 dark:text-white dark:hover:bg-white/10">
            <Link href="/resources/api">API Reference <Code className="ml-2 w-4 h-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
