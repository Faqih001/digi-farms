"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Mail, Phone, MapPin, Clock, MessageSquare, Users, TrendingUp,
  Briefcase, FileText, Star, ArrowRight, ChevronDown, Send
} from "lucide-react";

const faqs = [
  { q: "How accurate is the AI crop diagnostic?", a: "Our AI diagnostic achieves 94% accuracy across 200+ diseases and nutrient deficiencies. It&apos;s validated by certified agronomists and continuously improved with new field data." },
  { q: "What connectivity do I need to use DIGI-FARMS?", a: "The mobile app works offline for diagnostics and basic features. Market prices and weather require 2G or better. Full dashboard functionality needs 3G+." },
  { q: "How is my farm data protected?", a: "All data is encrypted with AES-256, stored in Neon cloud infrastructure, and never sold to third parties. You own your farm data and can export or delete it anytime." },
  { q: "Which payment methods are supported?", a: "We support M-Pesa, Airtel Money, Equity Bank, KCB, and major credit/debit cards. More payment options are added monthly." },
  { q: "Can I use DIGI-FARMS for a livestock farm?", a: "Currently, DIGI-FARMS focuses on crop farming. Veterinary modules for livestock are on our Q3 2026 roadmap." },
  { q: "Is there a free plan?", a: "Yes! The Free plan includes 5 AI diagnostics per month, basic weather, and marketplace access. The Pro plan (KES 999/month) includes unlimited diagnostics and full analytics." },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "", inquiryType: "general" });
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setFormData({ name: "", email: "", subject: "", message: "", inquiryType: "general" });
  };

  return (
    <>
      {/* Section 1: Hero */}
      <section className="gradient-hero py-20">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <Badge className="mb-6 bg-white/20 text-white border-white/30">Get in Touch</Badge>
          <h1 className="text-5xl lg:text-7xl font-black text-white mb-6">
            Let&apos;s Build the <span className="text-gradient">Future of Farming</span>
          </h1>
          <p className="text-xl text-green-100/80 max-w-2xl mx-auto">
            Whether you&apos;re a farmer seeking support, an investor, a partner, or a journalist — we want to hear from you.
          </p>
        </div>
      </section>

      {/* Section 2: Contact Form */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <Badge className="mb-4">Send a Message</Badge>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6">We&apos;d Love to Hear From You</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input id="name" placeholder="John Kamau" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" type="email" placeholder="john@email.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="type">Inquiry Type</Label>
                  <select
                    id="type"
                    className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.inquiryType}
                    onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
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
                  <Input id="subject" placeholder="How can we help?" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} required />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea id="message" rows={5} placeholder="Tell us more about your inquiry..." value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required className="min-h-32" />
                </div>

                <Button type="submit" size="lg" loading={loading} className="w-full">
                  <Send className="w-4 h-4" />
                  Send Message
                </Button>
              </form>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-4">Contact Information</h3>
                <div className="space-y-4">
                  {[
                    { icon: Mail, label: "Email", value: "hello@digi-farms.com", sub: "We respond within 24 hours" },
                    { icon: Phone, label: "Phone", value: "+254 (0) 700 DIGI-FARM", sub: "Mon–Fri 8AM–6PM EAT" },
                    { icon: MapPin, label: "Office", value: "The Yard, Ngong Road, Nairobi", sub: "Kenya, East Africa" },
                    { icon: Clock, label: "Support Hours", value: "24/7 AI chatbot", sub: "Human support: 7AM–8PM EAT" },
                  ].map(({ icon: Icon, label, value, sub }) => (
                    <div key={label} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                      <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 font-medium uppercase tracking-wide">{label}</div>
                        <div className="font-semibold text-slate-900 dark:text-white">{value}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-2xl p-6 text-white">
                <h4 className="font-black text-lg mb-3">Quick Response Channels</h4>
                <div className="space-y-2">
                  {["💬 Live Chat — Available in app", "📱 WhatsApp: +254 700 344 327", "🐦 Twitter/X: @DigiFarmsAfrica", "💼 LinkedIn: DIGI-FARMS Ltd"].map((c) => (
                    <div key={c} className="text-sm text-green-100">{c}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Office Location */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <Badge className="mb-4">Our Offices</Badge>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Find Us in East Africa</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { city: "Nairobi", address: "The Yard, Ngong Road, Karen", phone: "+254 20 000 0001", flag: "🇰🇪", badge: "HQ" },
              { city: "Kampala", address: "Business Park, Kololo Hill", phone: "+256 41 000 0001", flag: "🇺🇬", badge: "Regional" },
              { city: "Dar es Salaam", address: "Msasani Peninsula", phone: "+255 22 000 0001", flag: "🇹🇿", badge: "Regional" },
            ].map(({ city, address, phone, flag, badge }) => (
              <Card key={city} className="p-6 text-center">
                <CardContent className="p-0">
                  <div className="text-4xl mb-3">{flag}</div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <h3 className="font-bold text-slate-900 dark:text-white">{city}</h3>
                    <Badge variant={badge === "HQ" ? "default" : "secondary"} className="text-xs">{badge}</Badge>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{address}</p>
                  <p className="text-sm text-green-600 font-semibold">{phone}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Map Placeholder */}
      <section className="py-12 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="bg-gradient-to-br from-slate-100 to-green-50 dark:from-slate-800 dark:to-green-950/20 rounded-3xl h-72 flex items-center justify-center border border-slate-200 dark:border-slate-700 relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" />
            <div className="text-center relative z-10">
              <MapPin className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <p className="font-bold text-slate-700 dark:text-slate-300">Google Maps Integration</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">View live map in the DIGI-FARMS App</p>
              <Button className="mt-4" asChild><Link href="/register">Open App Map</Link></Button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Support Channels */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <Badge variant="earth" className="mb-4">Support</Badge>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Choose Your Support Channel</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: MessageSquare, title: "Live Chat", desc: "Chat with our support team in real-time during business hours", cta: "Start Chat", color: "text-green-600" },
              { icon: Phone, title: "Phone Support", desc: "Call us Mon–Fri 8AM–6PM EAT for urgent farm emergencies", cta: "Call Now", color: "text-blue-600" },
              { icon: Mail, title: "Email Support", desc: "Send detailed questions and get expert responses within 24hrs", cta: "Send Email", color: "text-purple-600" },
              { icon: Star, title: "Community Forum", desc: "Connect with 50,000+ farmers sharing advice and experiences", cta: "Join Forum", color: "text-amber-600" },
            ].map(({ icon: Icon, title, desc, cta, color }) => (
              <Card key={title} className="p-6 text-center card-hover">
                <CardContent className="p-0">
                  <Icon className={`w-8 h-8 mx-auto mb-3 ${color}`} />
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{desc}</p>
                  <Button variant="outline" size="sm" className="w-full">{cta}</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6: FAQ */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <Badge className="mb-4">FAQ</Badge>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map(({ q, a }, i) => (
              <div key={i} className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-semibold text-slate-900 dark:text-white text-sm">{q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-200 dark:border-slate-700 pt-4"
                    dangerouslySetInnerHTML={{ __html: a }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 7: Partnership Inquiry */}
      <section id="partnership" className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="mb-4">Partnerships</Badge>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6">Partner with DIGI-FARMS</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">We&apos;re actively seeking partnerships with agrovets, NGOs, financial institutions, seed companies, and technology providers who share our mission.</p>
              <div className="space-y-3">
                {[
                  { icon: Users, title: "NGO & Development Partners", desc: "Joint programs for farmer capacity building and digital inclusion" },
                  { icon: Briefcase, title: "Corporate Agribusiness", desc: "Offtake agreements, supply chain digitization, and CSR programs" },
                  { icon: TrendingUp, title: "Financial Institutions", desc: "Agri-lending partnerships with data-driven risk assessment" },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <Icon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-sm">{title}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-700 dark:from-green-700 dark:to-green-900 rounded-3xl p-8 text-white">
              <h3 className="text-2xl font-black mb-3">Partnership Inquiry</h3>
              <p className="text-green-200/80 text-sm mb-6">Tell us about your organization and how you&apos;d like to collaborate.</p>
              <div className="space-y-4">
                <Input placeholder="Organization name" className="bg-white/10 border-white/20 text-white placeholder:text-green-200/50 focus:ring-white/30" />
                <Input placeholder="Contact email" type="email" className="bg-white/10 border-white/20 text-white placeholder:text-green-200/50 focus:ring-white/30" />
                <Textarea placeholder="Describe your partnership idea..." className="bg-white/10 border-white/20 text-white placeholder:text-green-200/50 min-h-24" />
                <Button variant="hero" className="w-full" onClick={() => toast.success("Partnership inquiry submitted!")}>
                  Submit Inquiry <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 8: Investor Inquiry */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <Badge variant="earth" className="mb-4">Investors</Badge>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Invest in Africa&apos;s AgriTech Future</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto mb-10">We&apos;re raising our Series A to scale across East Africa. Interested in joining our cap table? Contact our investor relations team.</p>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-10">
            {[["$2.8M", "Pre-seed raised"], ["$18M", "Current valuation"], ["Series A", "Round open"]].map(([v, l]) => (
              <div key={l} className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                <div className="text-3xl font-black text-green-600">{v}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{l}</div>
              </div>
            ))}
          </div>
          <Button size="lg" asChild><Link href="mailto:investors@digi-farms.com">Contact Investor Relations <ArrowRight className="w-4 h-4" /></Link></Button>
        </div>
      </section>

      {/* Section 9: Careers */}
      <section id="careers" className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <Badge className="mb-4">Careers</Badge>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Join Our Team</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto mb-10">We&apos;re a team of 28 passionate agritech enthusiasts building the future of African farming.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-10">
            {[
              { role: "Senior ML Engineer", type: "Full-time", loc: "Nairobi / Remote" },
              { role: "Agronomist (AI Training)", type: "Full-time", loc: "Nairobi, Kenya" },
              { role: "Product Designer", type: "Full-time", loc: "Remote (Africa)" },
              { role: "Farmer Success Lead", type: "Contract", loc: "Nakuru, Kenya" },
            ].map(({ role, type, loc }) => (
              <Card key={role} className="p-4 text-left hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-2">{role}</h3>
                  <Badge variant="secondary" className="text-xs mb-1">{type}</Badge>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{loc}</div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Button asChild><Link href="mailto:careers@digi-farms.com">View Open Roles <ArrowRight className="w-4 h-4" /></Link></Button>
        </div>
      </section>

      {/* Section 10: Media Kit */}
      <section id="media" className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="max-w-2xl mx-auto text-center">
            <Badge className="mb-4">Press & Media</Badge>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Media Kit</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8">Download our official brand assets, executive headshots, and company fact sheet for press coverage.</p>
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              {[{ icon: FileText, label: "Press Kit (PDF)", size: "2.4 MB" }, { icon: Star, label: "Brand Assets (ZIP)", size: "18 MB" }, { icon: Users, label: "Executive Headshots", size: "12 MB" }].map(({ icon: Icon, label, size }) => (
                <button key={label} className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 hover:border-green-400 transition-colors group">
                  <Icon className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">{label}</div>
                  <div className="text-xs text-slate-400">{size}</div>
                </button>
              ))}
            </div>
            <Button asChild><Link href="mailto:press@digi-farms.com">Media Inquiries</Link></Button>
          </div>
        </div>
      </section>

      {/* Section 11: Social Links */}
      <section className="py-12 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <h3 className="font-bold text-slate-900 dark:text-white mb-6">Follow Our Journey</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {["🐦 Twitter / X", "💼 LinkedIn", "📘 Facebook", "📸 Instagram", "▶️ YouTube", "💬 WhatsApp"].map((s) => (
              <a key={s} href="#" className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-full text-sm font-medium hover:border-green-400 hover:text-green-600 transition-colors">
                {s}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Section 12: Final CTA */}
      <section className="py-24 gradient-mesh">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-5xl font-black text-white mb-6">
            Still Have Questions?
          </h2>
          <p className="text-xl text-green-200/80 mb-10">
            Our team is here to help. Reach out via any channel and we&apos;ll respond within 24 hours.
          </p>
          <Button variant="hero" size="xl" asChild>
            <Link href="mailto:hello@digi-farms.com">
              <Mail className="w-5 h-5" />
              Email Us Now
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
