import Link from "next/link";
import { Sprout, ArrowRight, CheckCircle, Play } from "lucide-react";
import DashboardPreview from "@/components/landing/DashboardPreview";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function HeroSection() {
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
            <h1 className="text-5xl lg:text-7xl font-black text-white leading-[1.05] mb-6">
              Farm Smarter.
              <br />
              <span className="text-green-200">Harvest More.</span>
              <br />
              <span className="text-green-100">Thrive Now.</span>
            </h1>
            <p className="text-lg text-green-50/90 leading-relaxed mb-8 max-w-lg">
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

            <div className="flex items-center gap-6 text-sm text-green-100/80">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-green-300" />
                Free 14-day trial
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-green-300" />
                No credit card
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-green-300" />
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
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center flex flex-col items-center justify-center min-h-[110px] sm:min-h-[90px]"
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
              <div className="text-green-100/80 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
