import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Target, Eye, Lightbulb, Globe, Heart, Award, ArrowRight,
} from "lucide-react";

const values = [
  { icon: Heart, title: "Farmer First", desc: "Everything we build starts with the farmer. We listen, observe, and co-create solutions in the field." },
  { icon: Lightbulb, title: "Innovation", desc: "We bring world-class technology to the most underserved farmers. AI, satellites, and IoT — simplified." },
  { icon: Globe, title: "Inclusivity", desc: "Available in Swahili and English. Works on basic smartphones. Designed for every farmer, everywhere." },
  { icon: Award, title: "Trust & Transparency", desc: "Verified suppliers, transparent pricing, and honest data. We earn trust through radical openness." },
];

const milestones = [
  { year: "2024 Q1", title: "Platform Launch", desc: "Beta with 500 pilot farmers in Kenya", done: true },
  { year: "2024 Q3", title: "AI Diagnostics V2", desc: "200+ diseases, 94% accuracy achieved", done: true },
  { year: "2025 Q1", title: "Marketplace Live", desc: "500+ suppliers, KES 200M volume", done: true },
  { year: "2025 Q3", title: "East Africa Expansion", desc: "Uganda and Tanzania market entry", done: true },
  { year: "2026 Q1", title: "Finance Integration", desc: "12 lending partners, insurance live", done: false },
  { year: "2026 Q3", title: "IoT & Drone Services", desc: "Sensor-based precision agriculture", done: false },
  { year: "2027", title: "Pan-Africa", desc: "Nigeria, Ethiopia, Rwanda — 1M farmers", done: false },
];

const sdgs = [
  { num: 1, name: "No Poverty", color: "bg-red-600" },
  { num: 2, name: "Zero Hunger", color: "bg-amber-600" },
  { num: 8, name: "Decent Work", color: "bg-rose-700" },
  { num: 10, name: "Reduced Inequalities", color: "bg-pink-600" },
  { num: 13, name: "Climate Action", color: "bg-green-700" },
  { num: 17, name: "Partnerships", color: "bg-blue-700" },
];

const stats = [
  { value: "50K+", label: "Active Farmers" },
  { value: "500+", label: "Verified Suppliers" },
  { value: "47", label: "Counties Covered" },
  { value: "94%", label: "AI Accuracy" },
];

export function CompanyAboutHeroSection() {
  return (
    <section className="gradient-hero py-20 lg:py-28">
      <div className="container mx-auto px-4 max-w-7xl text-center">
        <Badge className="mb-6 bg-white/20 text-white border-white/30">About DIGI-FARMS</Badge>
        <h1 className="text-4xl lg:text-6xl font-black text-white mb-6 leading-tight">
          Feeding Africa Through <br className="hidden sm:block" />
          <span className="text-green-200">Innovation</span>
        </h1>
        <p className="text-lg text-green-100 max-w-2xl mx-auto mb-8">
          We&apos;re on a mission to empower 1 million smallholder farmers with AI-driven diagnostics, market access, and financing tools by 2027.
        </p>
      </div>
    </section>
  );
}

export function CompanyAboutStatsSection() {
  return (
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
  );
}

export function CompanyMissionVisionSection() {
  return (
    <section
      className="py-20 bg-image-overlay"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1583169506568-be87d8a77a04?w=1600&q=80&auto=format&fit=crop')" }}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="border-0 shadow-xl dark:bg-slate-900">
            <CardContent className="p-8">
              <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-5">
                <Target className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3">Our Mission</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                To democratize precision agriculture across East Africa by making AI-powered crop diagnostics, market access, and agricultural financing accessible to every smallholder farmer — regardless of farm size, literacy level, or location.
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-xl dark:bg-slate-900">
            <CardContent className="p-8">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-5">
                <Eye className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3">Our Vision</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                A food-secure Africa where every farmer has the tools to grow more, earn more, and waste less — powered by data, connected through technology, and supported by fair financial systems.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export function CompanyCoreValuesSection() {
  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-14">
          <Badge variant="secondary" className="mb-4">Our Values</Badge>
          <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">What Drives Us</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v) => (
            <Card key={v.title} className="text-center border-0 shadow-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-7 h-7 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{v.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{v.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CompanyRoadmapSection() {
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-14">
          <Badge variant="secondary" className="mb-4">Roadmap</Badge>
          <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">Our Journey</h2>
        </div>
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />
          <div className="space-y-8">
            {milestones.map((m) => (
              <div key={m.year} className="relative pl-14">
                <div className={`absolute left-3 w-5 h-5 rounded-full border-2 ${m.done ? "bg-green-500 border-green-500" : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600"}`} />
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                  <Badge variant={m.done ? "default" : "secondary"} className="w-fit text-xs">{m.year}</Badge>
                  <h3 className="font-bold text-slate-900 dark:text-white">{m.title}</h3>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function CompanySDGSection() {
  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 max-w-7xl text-center">
        <Badge variant="secondary" className="mb-4">Impact</Badge>
        <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mb-4">UN Sustainable Development Goals</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto mb-10">Our work directly contributes to 6 of the 17 SDGs.</p>
        <div className="flex flex-wrap justify-center gap-3">
          {sdgs.map((s) => (
            <div key={s.num} className={`${s.color} text-white rounded-xl px-5 py-3 text-sm font-bold`}>
              SDG {s.num}: {s.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CompanyAboutCTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-800 dark:to-green-950">
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mb-4">Join the Movement</h2>
        <p className="text-slate-600 dark:text-green-100 mb-8">Whether you&apos;re a farmer, supplier, lender, or partner — there&apos;s a place for you in the DIGI-FARMS ecosystem.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild className="bg-green-600 text-white hover:bg-green-700 dark:bg-white dark:text-green-700 dark:hover:bg-green-50">
            <Link href="/register">Get Started <ArrowRight className="ml-2 w-4 h-4" /></Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="border-green-600 text-green-700 hover:bg-green-50 dark:border-white/40 dark:text-white dark:hover:bg-white/10">
            <Link href="/company/partnerships">Partner With Us</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
