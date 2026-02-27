"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail, Phone, MapPin, Clock, MessageSquare, Users, TrendingUp,
  Briefcase, FileText, Send, ChevronDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

// ── Data ────────────────────────────────────────────────────────────────────

const contactChannels = [
  { icon: MessageSquare, title: "General Support", desc: "Farm app help, account issues, platform guidance", email: "support@digi-farms.com", hours: "24/7 via app chat", color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" },
  { icon: Users, title: "Partnerships", desc: "NGOs, cooperatives, agrovets, supplier onboarding", email: "partners@digi-farms.com", hours: "Mon–Fri 09:00–17:00", color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" },
  { icon: TrendingUp, title: "Investor Relations", desc: "Pitch decks, financial data, due diligence", email: "invest@digi-farms.com", hours: "By appointment", color: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" },
  { icon: FileText, title: "Media & Press", desc: "Press releases, interviews, brand assets", email: "media@digi-farms.com", hours: "Mon–Fri 08:00–18:00", color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" },
];

const officeDetails = [
  { icon: MapPin, label: "HQ Address", value: "The Promenade, Westlands, Nairobi, Kenya" },
  { icon: Phone, label: "Main Line", value: "+254 (0) 700 DIGI-FARM" },
  { icon: Mail, label: "General Email", value: "hello@digi-farms.com" },
  { icon: Clock, label: "Office Hours", value: "Mon–Fri 08:00–17:00 EAT" },
];

const faqs = [
  { q: "How accurate is the AI crop diagnostic?", a: "Our AI diagnostic achieves 94% accuracy across 200+ diseases and nutrient deficiencies. It's validated by certified agronomists and continuously improved with new field data." },
  { q: "What connectivity do I need to use DIGI-FARMS?", a: "The mobile app works offline for diagnostics and basic features. Market prices and weather require 2G or better. Full dashboard functionality needs 3G+." },
  { q: "How is my farm data protected?", a: "All data is encrypted with AES-256, stored in Neon cloud infrastructure, and never sold to third parties. You own your farm data and can export or delete it anytime." },
  { q: "Which payment methods are supported?", a: "We support M-Pesa, Airtel Money, Equity Bank, KCB, and major credit/debit cards. More payment options are added monthly." },
  { q: "Can I use DIGI-FARMS for a livestock farm?", a: "Currently, DIGI-FARMS focuses on crop farming. Veterinary modules for livestock are on our Q3 2026 roadmap." },
  { q: "Is there a free plan?", a: "Yes! The Free plan includes 5 AI diagnostics per month, basic weather, and marketplace access. The Pro plan (KES 999/month) includes unlimited diagnostics and full analytics." },
];

// ── Section 1: Hero ──────────────────────────────────────────────────────────

export function ContactHeroSection() {
  return (
    <section className="gradient-hero py-20">
      <div className="container mx-auto px-4 max-w-7xl text-center">
        <Badge className="mb-6 bg-white/20 text-white border-white/30">Get in Touch</Badge>
        <h1 className="text-5xl lg:text-7xl font-black text-white mb-6">
          Let&apos;s Build the <span className="text-green-200">Future of Farming</span>
        </h1>
        <p className="text-xl text-green-100/90 max-w-2xl mx-auto">
          Whether you&apos;re a farmer seeking support, an investor, a partner, or a journalist — we want
          to hear from you.
        </p>
      </div>
    </section>
  );
}

// ── Section 2: Contact Form + Channels ───────────────────────────────────────

export function ContactFormSection() {
  const [formData, setFormData] = useState({
    name: "", email: "", subject: "", message: "", inquiryType: "general",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setFormData({ name: "", email: "", subject: "", message: "", inquiryType: "general" });
  };

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setFormData((prev) => ({ ...prev, [k]: e.target.value }));

  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Form */}
          <div>
            <Badge className="mb-4">Send a Message</Badge>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6">
              We&apos;d Love to Hear From You
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input id="name" placeholder="John Kamau" value={formData.name} onChange={set("name")} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" type="email" placeholder="john@email.com" value={formData.email} onChange={set("email")} required />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="type">Inquiry Type</Label>
                <select
                  id="type"
                  className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={formData.inquiryType}
                  onChange={set("inquiryType")}
                >
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="partnership">Partnership Inquiry</option>
                  <option value="investor">Investor Relations</option>
                  <option value="media">Media / Press</option>
                  <option value="careers">Careers</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="subject">Subject *</Label>
                <Input id="subject" placeholder="How can we help?" value={formData.subject} onChange={set("subject")} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="message">Message *</Label>
                <Textarea id="message" rows={5} placeholder="Tell us more..." value={formData.message} onChange={set("message")} required className="min-h-32" />
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? "Sending..." : <><Send className="w-4 h-4 mr-2" />Send Message</>}
              </Button>
            </form>
          </div>

          {/* Contact channels */}
          <div>
            <Badge variant="earth" className="mb-4">Contact Channels</Badge>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6">
              Reach the Right Team
            </h2>
            <div className="space-y-4 mb-10">
              {contactChannels.map(({ icon: Icon, title, desc, email, hours, color }) => (
                <div key={title} className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-green-300 dark:hover:border-green-700 transition-colors">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm">{title}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">{desc}</div>
                    <a href={`mailto:${email}`} className="text-xs text-green-600 dark:text-green-400 hover:underline font-medium">{email}</a>
                    <span className="text-xs text-slate-400 dark:text-slate-500 ml-2">· {hours}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><MapPin className="w-4 h-4 text-green-600 dark:text-green-400" />Office Details</h3>
              <div className="space-y-3">
                {officeDetails.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <Icon className="w-4 h-4 text-slate-400 dark:text-slate-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
                      <div className="text-sm text-slate-700 dark:text-slate-300 font-medium">{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Section 3: FAQ ────────────────────────────────────────────────────────────

export function ContactFAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <Badge className="mb-4">FAQ</Badge>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Can&apos;t find your answer? <Link href="mailto:support@digi-farms.com" className="text-green-600 dark:text-green-400 hover:underline">Email our support team</Link>.
          </p>
        </div>
        <div className="space-y-3">
          {faqs.map(({ q, a }, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <button
                className="w-full text-left p-5 flex justify-between items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-semibold text-slate-900 dark:text-white text-sm">{q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-700 pt-4">
                  {a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section 4: Office Locations ───────────────────────────────────────────────

export function ContactOfficesSection() {
  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <Badge variant="earth" className="mb-4">Our Offices</Badge>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Find Us Across East Africa</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { city: "Nairobi", country: "Kenya 🇰🇪", status: "HQ", address: "Westlands, Nairobi", color: "border-green-500" },
            { city: "Kampala", country: "Uganda 🇺🇬", status: "Regional", address: "Kololo, Kampala", color: "border-blue-500" },
            { city: "Dar es Salaam", country: "Tanzania 🇹🇿", status: "Regional", address: "Msasani, Dar", color: "border-amber-500" },
            { city: "Kigali", country: "Rwanda 🇷🇼", status: "Upcoming", address: "Opening Q3 2026", color: "border-slate-300 dark:border-slate-600" },
          ].map(({ city, country, status, address, color }) => (
            <div key={city} className={`bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border-t-4 ${color} border-x border-b border-slate-200 dark:border-slate-700`}>
              <div className="font-black text-xl text-slate-900 dark:text-white mb-1">{city}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400 mb-3">{country}</div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${status === "HQ" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" : status === "Regional" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"}`}>
                {status}
              </span>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-3">{address}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
