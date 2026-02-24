import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Handshake, ArrowRight, CheckCircle, Building2, Landmark,
  Tractor, Globe, Leaf, Award, Users, ShieldCheck, Cpu,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Partnerships",
  description: "Partner with DIGI-FARMS to reach 50,000+ farmers across East Africa. Programs for agrovets, lenders, NGOs, and technology providers.",
};

const partnerTypes = [
  { icon: Building2, title: "Agrovet & Supplier Partners", desc: "List your products on our marketplace, reach 50K+ farmers, and manage orders digitally. Free onboarding and marketing support.", benefits: ["Free digital storefront", "Order management tools", "Farmer analytics dashboard", "Marketing co-promotion"] },
  { icon: Landmark, title: "Financial Institutions", desc: "Access AI-scored farmers with verified performance data. Reduce defaults with data-driven lending and automated disbursement.", benefits: ["Pre-scored farmer profiles", "Portfolio monitoring", "M-Pesa disbursement", "Risk analytics API"] },
  { icon: Tractor, title: "Equipment & Input Manufacturers", desc: "Reach smallholder farmers directly through our marketplace. Run targeted campaigns and sponsorships.", benefits: ["Direct farmer access", "Product sampling programs", "Brand sponsorships", "Market intelligence data"] },
  { icon: Globe, title: "NGOs & Development Agencies", desc: "Deploy DIGI-FARMS tools in your agricultural programs. White-label options and impact measurement dashboards available.", benefits: ["White-label platform", "Beneficiary tracking", "Impact measurement", "Program analytics"] },
];

const currentPartners = [
  { name: "Kenya Agricultural & Livestock Research Organization", type: "Research" },
  { name: "Equity Bank Agriculture Division", type: "Finance" },
  { name: "KCB AgriFinance", type: "Finance" },
  { name: "Syngenta East Africa", type: "Inputs" },
  { name: "AGRA (Alliance for a Green Revolution in Africa)", type: "Development" },
  { name: "USAID Feed the Future", type: "Development" },
  { name: "Safaricom M-Pesa", type: "Technology" },
  { name: "Kenya Meteorological Department", type: "Data" },
];

const stats = [
  { value: "30+", label: "Active Partners" },
  { value: "KES 2B+", label: "Partner Revenue" },
  { value: "3", label: "Countries" },
  { value: "500+", label: "Supplier Network" },
];

export default function PartnershipsPage() {
  return (
    <>
      {/* Hero */}
      <section className="gradient-hero py-20 lg:py-28">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <Badge className="mb-6 bg-white/20 text-white border-white/30">Partnerships</Badge>
          <h1 className="text-4xl lg:text-6xl font-black text-white mb-6 leading-tight">
            Grow Together. <br className="hidden sm:block" />
            <span className="text-green-300">Impact Together.</span>
          </h1>
          <p className="text-lg text-green-100 max-w-2xl mx-auto mb-8">
            Join 30+ organizations partnering with DIGI-FARMS to reach millions of smallholder farmers across East Africa. Together, we can transform agriculture.
          </p>
          <Button size="lg" asChild className="bg-white text-green-700 hover:bg-green-50">
            <a href="#partner-form">Become a Partner <ArrowRight className="ml-2 w-4 h-4" /></a>
          </Button>
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

      {/* Partner Types */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4">Partnership Programs</Badge>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">How We Partner</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {partnerTypes.map((p) => (
              <Card key={p.title} className="group hover:shadow-xl transition-shadow dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-green-400">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <p.icon className="w-7 h-7 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{p.title}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">{p.desc}</p>
                      <ul className="grid grid-cols-2 gap-2">
                        {p.benefits.map((b) => (
                          <li key={b} className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                            <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Current Partners */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4">Our Network</Badge>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">Trusted Partners</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {currentPartners.map((p) => (
              <div key={p.name} className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <ShieldCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white leading-snug">{p.name}</p>
                  <Badge variant="secondary" className="text-xs mt-1">{p.type}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Partner */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-3xl p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-black text-white mb-4">Why Partner With DIGI-FARMS?</h2>
                <p className="text-green-100 mb-6">Access the largest network of digitally-connected smallholder farmers in East Africa.</p>
                <ul className="space-y-3 mb-6">
                  {[
                    "50,000+ active farmers on the platform",
                    "Presence in Kenya, Uganda, and Tanzania",
                    "AI-verified data on farmer performance",
                    "Integrated payments via M-Pesa",
                    "Dedicated partner success team",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-white text-sm">
                      <CheckCircle className="w-4 h-4 text-green-200 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Users, val: "50K+", label: "Farmers" },
                  { icon: Cpu, val: "AI", label: "Powered" },
                  { icon: Award, val: "30+", label: "Partners" },
                  { icon: Leaf, val: "6", label: "SDGs" },
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

      {/* CTA */}
      <section id="partner-form" className="py-20 bg-gradient-to-br from-green-500 to-green-700 dark:from-green-800 dark:to-green-950 scroll-mt-20">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <Handshake className="w-14 h-14 text-green-300 mx-auto mb-4" />
          <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">Ready to Partner?</h2>
          <p className="text-green-100 mb-8">Get in touch with our partnerships team. We&apos;ll schedule a call within 48 hours.</p>
          <Button size="lg" asChild className="bg-white text-green-700 hover:bg-green-50">
            <Link href="/contact">Contact Partnerships Team <ArrowRight className="ml-2 w-4 h-4" /></Link>
          </Button>
        </div>
      </section>
    </>
  );
}
