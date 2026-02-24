import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  HelpCircle, ArrowRight, MessageSquare, Mail, Phone,
  ChevronRight, Search, ShoppingCart, CreditCard, Leaf,
  Shield, Smartphone, Users, BookOpen,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Help Center",
  description: "Get help with DIGI-FARMS. Browse FAQs, contact support, and find answers to common questions about the platform.",
};

const faqCategories = [
  { icon: Smartphone, title: "Getting Started", count: 12, desc: "Account setup, verification, and onboarding." },
  { icon: ShoppingCart, title: "Marketplace", count: 18, desc: "Buying, selling, orders, and delivery." },
  { icon: CreditCard, title: "Payments & Billing", count: 15, desc: "M-Pesa, wallet, subscriptions, and refunds." },
  { icon: Leaf, title: "Crop Diagnostics", count: 10, desc: "AI scanning, disease identification, and treatment." },
  { icon: Shield, title: "Account & Security", count: 8, desc: "Password, 2FA, privacy, and data protection." },
  { icon: Users, title: "Partnerships", count: 6, desc: "Partner programs, supplier onboarding, and API access." },
];

const popularQuestions = [
  { q: "How do I register as a farmer on DIGI-FARMS?", a: "Download the app or visit our website, click 'Register', select 'Farmer' as your role, and complete the KYC verification with your national ID." },
  { q: "What payment methods are supported?", a: "We support M-Pesa, Airtel Money, bank transfers, and DIGI-FARMS wallet. M-Pesa is the most popular method among our users." },
  { q: "How accurate is the AI crop diagnostic tool?", a: "Our AI model achieves 94% accuracy across 200+ crop diseases. Results are provided in under 3 seconds with treatment recommendations." },
  { q: "Can I get a refund on a marketplace order?", a: "Yes, you can request a refund within 48 hours of delivery if the products don't match the description. Visit Orders → Request Refund." },
  { q: "How do I apply for an input financing loan?", a: "Navigate to Financing in your dashboard, check your eligibility score, select a loan product, and submit your application. Decisions are made within 48 hours." },
  { q: "Is my data secure on DIGI-FARMS?", a: "Absolutely. We use AES-256 encryption, are GDPR compliant, and never sell your personal data to third parties." },
];

const contactOptions = [
  { icon: MessageSquare, title: "Live Chat", desc: "Chat with our support team in real-time.", detail: "Available Mon-Sat, 8AM-8PM EAT", color: "bg-blue-100 dark:bg-blue-900/30" },
  { icon: Mail, title: "Email Support", desc: "Get a response within 24 hours.", detail: "support@digi-farms.com", color: "bg-green-100 dark:bg-green-900/30" },
  { icon: Phone, title: "Phone Support", desc: "Speak directly with our team.", detail: "+254 700 000 000", color: "bg-purple-100 dark:bg-purple-900/30" },
];

export default function HelpCenterPage() {
  return (
    <>
      {/* Hero */}
      <section className="gradient-hero py-20 lg:py-28">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <Badge className="mb-6 bg-white/20 text-white border-white/30">Help Center</Badge>
          <h1 className="text-4xl lg:text-6xl font-black text-white mb-6 leading-tight">
            How Can We <br className="hidden sm:block" />
            <span className="text-green-300">Help You?</span>
          </h1>
          <p className="text-lg text-green-100 max-w-2xl mx-auto mb-8">
            Find answers to common questions, browse guides, or contact our support team.
          </p>
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search for help..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border-0 text-sm bg-white/95 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-green-400 outline-none"
              aria-label="Search help center"
            />
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4">Browse Topics</Badge>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">Help Categories</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {faqCategories.map((c) => (
              <Card key={c.title} className="group hover:shadow-xl transition-shadow dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-green-400 cursor-pointer">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <c.icon className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-slate-900 dark:text-white">{c.title}</h3>
                      <Badge variant="secondary" className="text-xs">{c.count}</Badge>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{c.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4">FAQs</Badge>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {popularQuestions.map((faq, i) => (
              <Card key={i} className="dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <CardContent className="p-6">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-start gap-2">
                    <HelpCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    {faq.q}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed ml-7">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4">Contact Us</Badge>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">Still Need Help?</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {contactOptions.map((c) => (
              <Card key={c.title} className="group hover:shadow-xl transition-shadow dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-green-400 text-center">
                <CardContent className="p-6">
                  <div className={`w-14 h-14 rounded-2xl ${c.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <c.icon className="w-7 h-7 text-green-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-1">{c.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{c.desc}</p>
                  <p className="text-xs text-green-600 font-medium">{c.detail}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-green-700 dark:bg-green-900">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <BookOpen className="w-14 h-14 text-green-300 mx-auto mb-4" />
          <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">Explore Our Documentation</h2>
          <p className="text-green-100 mb-8">In-depth guides and tutorials to help you master every feature of the platform.</p>
          <Button size="lg" asChild className="bg-white text-green-700 hover:bg-green-50">
            <Link href="/resources/docs">Browse Docs <ArrowRight className="ml-2 w-4 h-4" /></Link>
          </Button>
        </div>
      </section>
    </>
  );
}
