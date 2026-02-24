import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin, ArrowRight, Heart, Zap, Globe, Coffee,
  GraduationCap, Briefcase, Code, Leaf, Users, TrendingUp,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join DIGI-FARMS and help build the future of African agriculture. We're hiring engineers, agronomists, and impact leaders.",
};

const perks = [
  { icon: Heart, title: "Health & Wellness", desc: "Comprehensive medical, dental, and vision coverage for you and your family." },
  { icon: Coffee, title: "Flexible Work", desc: "Remote-first culture with co-working spaces in Nairobi, Kampala, and Dar es Salaam." },
  { icon: GraduationCap, title: "Learning Budget", desc: "KES 200K annual learning stipend for courses, conferences, and certifications." },
  { icon: Globe, title: "Impact Travel", desc: "Regular field visits to farms and agrovets — connect with the people you're building for." },
  { icon: Zap, title: "Equity & ESOP", desc: "Early-stage equity options. Grow with us and share in the value we create together." },
  { icon: Leaf, title: "Sustainability Leave", desc: "5 paid days per year for volunteering on agricultural sustainability projects." },
];

const openRoles = [
  { title: "Senior Full-Stack Engineer", dept: "Engineering", location: "Nairobi / Remote", type: "Full-time" },
  { title: "ML Engineer — Plant Pathology", dept: "AI/ML", location: "Nairobi", type: "Full-time" },
  { title: "React Native Developer", dept: "Engineering", location: "Remote", type: "Full-time" },
  { title: "Field Agronomist — Western Kenya", dept: "Agronomy", location: "Kisumu", type: "Full-time" },
  { title: "Product Designer", dept: "Product & Design", location: "Nairobi / Remote", type: "Full-time" },
  { title: "Growth Marketing Manager", dept: "Marketing", location: "Nairobi", type: "Full-time" },
  { title: "DevOps / SRE Engineer", dept: "Engineering", location: "Remote", type: "Full-time" },
  { title: "Agricultural Economist", dept: "Research", location: "Nairobi", type: "Full-time" },
  { title: "Partner Success Manager", dept: "Partnerships", location: "Nairobi", type: "Full-time" },
];

const values = [
  { icon: Users, title: "Farmer-Obsessed", desc: "We build for farmers first. Every feature ships with field validation." },
  { icon: Code, title: "Ship & Iterate", desc: "We move fast, measure impact, and improve relentlessly." },
  { icon: TrendingUp, title: "Grow Together", desc: "We invest in each other. Mentorship, feedback, and collaboration are core to how we work." },
];

export default function CareersPage() {
  return (
    <>
      {/* Hero */}
      <section className="gradient-hero py-20 lg:py-28">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <Badge className="mb-6 bg-white/20 text-white border-white/30">Careers</Badge>
          <h1 className="text-4xl lg:text-6xl font-black text-white mb-6 leading-tight">
            Build the Future of <br className="hidden sm:block" />
            <span className="text-green-300">African Agriculture</span>
          </h1>
          <p className="text-lg text-green-100 max-w-2xl mx-auto mb-8">
            Join a mission-driven team using AI, satellite imagery, and mobile technology to empower millions of smallholder farmers across East Africa.
          </p>
          <Button size="lg" asChild className="bg-white text-green-700 hover:bg-green-50">
            <a href="#openings">View Open Roles <ArrowRight className="ml-2 w-4 h-4" /></a>
          </Button>
        </div>
      </section>

      {/* Culture Values */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4">Our Culture</Badge>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">How We Work</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {values.map((v) => (
              <Card key={v.title} className="text-center border-0 shadow-lg dark:bg-slate-800/50 hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                    <v.icon className="w-7 h-7 text-green-600" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{v.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{v.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Perks */}
      <section
        className="py-20 bg-image-overlay"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1600&q=80&auto=format&fit=crop')" }}
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4">Benefits & Perks</Badge>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">Why You&apos;ll Love It Here</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {perks.map((p) => (
              <div key={p.title} className="flex items-start gap-4 p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                  <p.icon className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-1">{p.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Roles */}
      <section id="openings" className="py-20 bg-white dark:bg-slate-900 scroll-mt-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4">Open Positions</Badge>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">{openRoles.length} Open Roles</h2>
          </div>
          <div className="space-y-3">
            {openRoles.map((role) => (
              <div key={role.title} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-green-400 transition-colors group">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-green-600 transition-colors">{role.title}</h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs"><Briefcase className="w-3 h-3 mr-1" />{role.dept}</Badge>
                    <Badge variant="secondary" className="text-xs"><MapPin className="w-3 h-3 mr-1" />{role.location}</Badge>
                    <span className="text-xs text-slate-400">{role.type}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-fit">
                  Apply <ArrowRight className="ml-1 w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-green-500 to-green-700 dark:from-green-800 dark:to-green-950">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">Don&apos;t See Your Role?</h2>
          <p className="text-green-100 mb-8">We&apos;re always looking for exceptional talent. Send us your CV and tell us how you want to change agriculture.</p>
          <Button size="lg" asChild className="bg-white text-green-700 hover:bg-green-50">
            <Link href="/contact">Send Your CV <ArrowRight className="ml-2 w-4 h-4" /></Link>
          </Button>
        </div>
      </section>
    </>
  );
}
