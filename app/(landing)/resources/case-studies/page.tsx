import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  TrendingUp, ArrowRight, MapPin, Quote, BarChart3,
  Leaf, Users, CheckCircle, Calendar,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Case Studies",
  description: "Real success stories from farmers, suppliers, and partners using DIGI-FARMS to transform agriculture across East Africa.",
};

const caseStudies = [
  {
    title: "How Mary Doubled Her Tomato Yield in Kiambu County",
    category: "Farmer Success",
    location: "Kiambu, Kenya",
    date: "March 2024",
    image: "🍅",
    excerpt: "Mary Wanjiku, a smallholder farmer, used DIGI-FARMS AI diagnostics to detect early blight and optimize her input application schedule, resulting in a 2.1x yield increase.",
    metrics: [
      { label: "Yield Increase", value: "110%" },
      { label: "Cost Reduction", value: "35%" },
      { label: "Revenue Growth", value: "KES 180K" },
    ],
    quote: "I never imagined technology could make such a difference. DIGI-FARMS helped me detect diseases before they destroyed my crop.",
    author: "Mary Wanjiku, Farmer",
  },
  {
    title: "AgroVet Plus: Scaling From 1 to 5 Outlets Using Marketplace",
    category: "Supplier Growth",
    location: "Nakuru, Kenya",
    date: "January 2024",
    image: "🏪",
    excerpt: "AgroVet Plus used the DIGI-FARMS marketplace to expand their customer base beyond walk-in traffic, growing from a single shop to five outlets across the Rift Valley.",
    metrics: [
      { label: "Revenue Growth", value: "340%" },
      { label: "Online Orders", value: "1,200/mo" },
      { label: "New Outlets", value: "4" },
    ],
    quote: "The marketplace opened doors we never knew existed. Farmers from neighboring counties now order from us regularly.",
    author: "John Ochieng, Owner",
  },
  {
    title: "Cooperative Society Secures KES 5M in Input Financing",
    category: "Financing Impact",
    location: "Trans-Nzoia, Kenya",
    date: "November 2023",
    image: "🌾",
    excerpt: "Moiben Farmers Cooperative used AI-generated credit scores and yield data to secure a bulk input financing deal, reducing per-farmer cost by 40%.",
    metrics: [
      { label: "Total Financing", value: "KES 5M" },
      { label: "Members Served", value: "320" },
      { label: "Cost Savings", value: "40%" },
    ],
    quote: "Our members could never access formal credit before. DIGI-FARMS data gave lenders the confidence to fund us.",
    author: "Peter Kiprop, Chairman",
  },
  {
    title: "County Government Deploys Smart Agriculture Monitoring",
    category: "Government Partnership",
    location: "Meru, Kenya",
    date: "August 2023",
    image: "🏛️",
    excerpt: "Meru County integrated DIGI-FARMS analytics into their agricultural extension program, enabling real-time monitoring of 8,000 registered farmers and data-driven policy decisions.",
    metrics: [
      { label: "Farmers Monitored", value: "8,000" },
      { label: "Extension Reach", value: "3x" },
      { label: "Response Time", value: "-60%" },
    ],
    quote: "For the first time, we have real-time visibility into what our farmers are growing and the challenges they face.",
    author: "Dr. Sarah Mwende, CEC Agriculture",
  },
];

const impactStats = [
  { value: "50K+", label: "Farmers Impacted" },
  { value: "KES 2B+", label: "Revenue Generated" },
  { value: "47", label: "Counties Reached" },
  { value: "110%", label: "Avg. Yield Increase" },
];

export default function CaseStudiesPage() {
  return (
    <>
      {/* Hero */}
      <section className="gradient-hero py-20 lg:py-28">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <Badge className="mb-6 bg-white/20 text-white border-white/30">Case Studies</Badge>
          <h1 className="text-4xl lg:text-6xl font-black text-white mb-6 leading-tight">
            Real Stories. <br className="hidden sm:block" />
            <span className="text-green-300">Real Impact.</span>
          </h1>
          <p className="text-lg text-green-100 max-w-2xl mx-auto mb-8">
            See how farmers, suppliers, and organizations across East Africa are transforming agriculture with DIGI-FARMS.
          </p>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-12 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {impactStats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl lg:text-4xl font-black text-green-600">{s.value}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="space-y-8">
            {caseStudies.map((cs, i) => (
              <Card key={i} className="dark:bg-slate-900 border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl transition-shadow">
                <CardContent className="p-0">
                  <div className="grid lg:grid-cols-3">
                    {/* Left: Info */}
                    <div className="lg:col-span-2 p-6 lg:p-8">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <Badge variant="secondary">{cs.category}</Badge>
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <MapPin className="w-3 h-3" /> {cs.location}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <Calendar className="w-3 h-3" /> {cs.date}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{cs.title}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">{cs.excerpt}</p>

                      {/* Metrics */}
                      <div className="flex flex-wrap gap-4 mb-4">
                        {cs.metrics.map((m) => (
                          <div key={m.label} className="text-center px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-xl">
                            <div className="text-lg font-black text-green-600">{m.value}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">{m.label}</div>
                          </div>
                        ))}
                      </div>

                      {/* Quote */}
                      <div className="border-l-4 border-green-500 pl-4">
                        <Quote className="w-4 h-4 text-green-400 mb-1" />
                        <p className="text-sm italic text-slate-600 dark:text-slate-400 dark:text-slate-300">&ldquo;{cs.quote}&rdquo;</p>
                        <p className="text-xs text-green-600 font-medium mt-1">— {cs.author}</p>
                      </div>
                    </div>

                    {/* Right: Visual */}
                    <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/10">
                      <span className="text-8xl">{cs.image}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-green-700 dark:bg-green-900">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <TrendingUp className="w-14 h-14 text-green-300 mx-auto mb-4" />
          <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">Write Your Success Story</h2>
          <p className="text-green-100 mb-8">Join thousands of farmers and suppliers already transforming their businesses with DIGI-FARMS.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-white text-green-700 hover:bg-green-50">
              <Link href="/auth/register">Get Started Free <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white/30 text-white hover:bg-white/10">
              <Link href="/company/partnerships">Partner With Us <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
