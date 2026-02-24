import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CreditCard, Shield, TrendingUp, ArrowRight, CheckCircle,
  Banknote, Percent, Clock, FileText, Users, Heart, Umbrella,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Financing & Insurance",
  description: "Access agricultural loans and crop insurance designed for smallholder farmers. AI credit scoring, instant approvals, and affordable premiums.",
};

const loanProducts = [
  { name: "Input Financing", rate: "From 10%", tenure: "Up to 12 months", desc: "Buy seeds, fertilizers, and chemicals with deferred payment tied to harvest.", icon: Banknote },
  { name: "Equipment Loans", rate: "From 12%", tenure: "Up to 36 months", desc: "Finance irrigation systems, tractors, and farm machinery with flexible repayment.", icon: CreditCard },
  { name: "Working Capital", rate: "From 14%", tenure: "Up to 6 months", desc: "Short-term cash flow support for labor costs, transport, and operational expenses.", icon: TrendingUp },
];

const insuranceProducts = [
  { name: "Crop Insurance", premium: "From KES 500/acre", desc: "Weather-indexed coverage for drought, floods, and pest damage. Automatic payouts.", icon: Umbrella },
  { name: "Livestock Insurance", premium: "From KES 1,200/head", desc: "Coverage against disease, theft, and natural disasters for cattle, goats, and poultry.", icon: Heart },
  { name: "Equipment Insurance", premium: "From 2% of value", desc: "Protect your farm machinery and irrigation systems against damage and theft.", icon: Shield },
];

const stats = [
  { value: "12", label: "Lending Partners" },
  { value: "KES 2B+", label: "Disbursed" },
  { value: "48hrs", label: "Avg. Approval" },
  { value: "92%", label: "Approval Rate" },
];

const howItWorks = [
  { step: "1", title: "Apply Online", desc: "Fill a simple 5-minute form. No physical documents required — we use digital verification." },
  { step: "2", title: "AI Credit Scoring", desc: "Our AI analyzes farm performance, weather data, and market prices to assess creditworthiness." },
  { step: "3", title: "Instant Decision", desc: "Get approval within 48 hours. Funds disbursed directly to your M-Pesa or bank account." },
  { step: "4", title: "Smart Repayment", desc: "Flexible repayment tied to harvest cycles. Pay when you sell, not when the bank says." },
];

export default function FinancingPage() {
  return (
    <>
      {/* Hero */}
      <section className="gradient-hero py-20 lg:py-28">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <Badge className="mb-6 bg-green-600/10 text-green-800 border-green-200 dark:bg-white/20 dark:text-white dark:border-white/30">Financing & Insurance</Badge>
          <h1 className="text-4xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
            Finance Your Farm. <br className="hidden sm:block" />
            <span className="text-green-600 dark:text-green-300">Protect Your Harvest.</span>
          </h1>
          <p className="text-lg text-green-800 dark:text-green-100 max-w-2xl mx-auto mb-8">
            Access affordable agricultural loans with AI-powered credit scoring and crop insurance designed for smallholder farmers. No collateral, no paperwork headaches.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-white text-green-700 hover:bg-green-50">
              <Link href="/register">Apply for a Loan <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-green-600 text-green-700 hover:bg-green-50 dark:border-white/40 dark:text-white dark:hover:bg-white/10">
              <Link href="/register">Get Insured</Link>
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
      <section
        className="py-20 bg-image-overlay"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1600&q=80&auto=format&fit=crop')" }}
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4">How It Works</Badge>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">From Application to Disbursement</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((h) => (
              <div key={h.step} className="text-center relative">
                <div className="w-14 h-14 rounded-2xl bg-green-600 text-white text-xl font-black flex items-center justify-center mx-auto mb-4">{h.step}</div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{h.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Loan Products */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4">Loan Products</Badge>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">Financing for Every Need</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {loanProducts.map((p) => (
              <Card key={p.name} className="group hover:shadow-xl transition-shadow dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-green-400">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <p.icon className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{p.name}</h3>
                  <div className="flex gap-3 mb-3">
                    <Badge variant="secondary" className="text-xs"><Percent className="w-3 h-3 mr-1" />{p.rate}</Badge>
                    <Badge variant="secondary" className="text-xs"><Clock className="w-3 h-3 mr-1" />{p.tenure}</Badge>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{p.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Insurance Products */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4">Insurance Products</Badge>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">Protect What You&apos;ve Grown</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {insuranceProducts.map((p) => (
              <Card key={p.name} className="group hover:shadow-xl transition-shadow dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-green-400">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <p.icon className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{p.name}</h3>
                  <Badge variant="secondary" className="text-xs mb-3">{p.premium}</Badge>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{p.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partners & CTA */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-3xl p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-black text-white mb-4">Lending Partners Welcome</h2>
                <p className="text-slate-600 dark:text-green-100 mb-6">Are you a bank, MFI, or SACCO? Join our lending network and access AI-scored farmers with verified performance data.</p>
                <ul className="space-y-2 mb-6">
                  {["Pre-scored farmers with verified data", "Reduced default risk with AI analytics", "Automated disbursement via M-Pesa", "Portfolio monitoring dashboard"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-white text-sm">
                      <CheckCircle className="w-4 h-4 text-green-200 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button size="lg" asChild className="bg-white text-green-700 hover:bg-green-50">
                  <Link href="/company/partnerships">Partner With Us <ArrowRight className="ml-2 w-4 h-4" /></Link>
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Users, val: "12", label: "Lending Partners" },
                  { icon: FileText, val: "50K+", label: "Applications Processed" },
                  { icon: Shield, val: "<3%", label: "Default Rate" },
                  { icon: Clock, val: "48hrs", label: "Avg. Disbursement" },
                ].map(({ icon: Icon, val, label }) => (
                  <div key={label} className="bg-white/10 rounded-2xl p-5 text-center">
                    <Icon className="w-7 h-7 text-white mx-auto mb-2" />
                    <p className="text-xl font-black text-white">{val}</p>
                    <p className="text-green-100 text-xs mt-1">{label}</p>
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
