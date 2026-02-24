import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Linkedin, Twitter, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Team",
  description: "Meet the people behind DIGI-FARMS — agronomists, engineers, and impact leaders building the future of African agriculture.",
};

const leadership = [
  { name: "Amara Osei", role: "CEO & Co-Founder", bio: "Former CGIAR researcher with 10 years in precision agriculture. MSc Agricultural Economics, Nairobi University.", initials: "AO" },
  { name: "Dr. Neema Baraka", role: "CTO & Co-Founder", bio: "PhD Computer Vision, Carnegie Mellon. Led AI development at Safaricom's tech accelerator.", initials: "NB" },
  { name: "Samuel Mwangi", role: "Chief Product Officer", bio: "10 years building mobile-first products for African markets. Previously at M-Pesa and Jumia.", initials: "SM" },
  { name: "Janet Chebet", role: "Head of Partnerships", bio: "Former AGRA program director. Network of 800+ agrovets across East Africa.", initials: "JC" },
  { name: "Kwame Asante", role: "Head of AI/ML", bio: "ML Engineer specializing in plant disease detection. 50+ peer-reviewed publications.", initials: "KA" },
  { name: "Fatima Hassan", role: "Head of Finance", bio: "Former Equity Bank agri-finance specialist. Structured over KES 2B in agricultural loans.", initials: "FH" },
];

const advisors = [
  { name: "Prof. Akin Adesina", role: "African Development Bank", focus: "Agricultural Finance", initials: "AA" },
  { name: "Dr. Agnes Kalibata", role: "AGRA President", focus: "Policy & Scale", initials: "AK" },
  { name: "Juliet Nabatanzi", role: "CGIAR Board Member", focus: "Research & Science", initials: "JN" },
  { name: "Michael Otieno", role: "Former Safaricom CEO", focus: "Technology Strategy", initials: "MO" },
];

const departments = [
  { name: "Engineering", count: 24, desc: "Full-stack, ML, mobile, and infrastructure engineers" },
  { name: "Agronomy", count: 12, desc: "Field agronomists across Kenya, Uganda, and Tanzania" },
  { name: "Product & Design", count: 8, desc: "UX researchers, designers, and product managers" },
  { name: "Operations", count: 15, desc: "Logistics, supply chain, and partner management" },
  { name: "Finance & Legal", count: 6, desc: "Financial operations, compliance, and legal counsel" },
  { name: "Sales & Marketing", count: 10, desc: "Growth, community, and farmer acquisition teams" },
];

export default function TeamPage() {
  return (
    <>
      {/* Hero */}
      <section className="gradient-hero py-20 lg:py-28">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <Badge className="mb-6 bg-white/20 text-white border-white/30">Our Team</Badge>
          <h1 className="text-4xl lg:text-6xl font-black text-white mb-6 leading-tight">
            The People Behind <br className="hidden sm:block" />
            <span className="text-green-300">DIGI-FARMS</span>
          </h1>
          <p className="text-lg text-green-100 max-w-2xl mx-auto">
            Agronomists, engineers, and impact leaders united by one goal — empowering every smallholder farmer in Africa with world-class technology.
          </p>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4">Leadership</Badge>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">Executive Team</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {leadership.map((m) => (
              <Card key={m.name} className="group hover:shadow-xl transition-shadow dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold group-hover:scale-105 transition-transform shadow-lg">
                    {m.initials}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{m.name}</h3>
                  <p className="text-sm font-medium text-green-600 mb-3">{m.role}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{m.bio}</p>
                  <div className="flex justify-center gap-2 mt-4">
                    <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-400 hover:text-blue-600">
                      <Linkedin className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-400 hover:text-blue-400">
                      <Twitter className="w-4 h-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Advisors */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4">Advisory Board</Badge>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">Our Advisors</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {advisors.map((a) => (
              <Card key={a.name} className="text-center dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center mx-auto mb-3 text-slate-600 dark:text-slate-400 dark:text-slate-300 font-bold">
                    {a.initials}
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{a.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{a.role}</p>
                  <Badge variant="secondary" className="mt-2 text-xs">{a.focus}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4">Our Teams</Badge>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">75+ People, One Mission</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {departments.map((d) => (
              <div key={d.name} className="flex items-center gap-4 p-5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-white">{d.name}</h3>
                    <Badge variant="secondary" className="text-xs">{d.count}</Badge>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-green-700 dark:bg-green-900">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">Want to Join Us?</h2>
          <p className="text-green-100 mb-8">We&apos;re always looking for passionate people who want to make a difference in African agriculture.</p>
          <Button size="lg" asChild className="bg-white text-green-700 hover:bg-green-50">
            <Link href="/company/careers">View Open Positions <ArrowRight className="ml-2 w-4 h-4" /></Link>
          </Button>
        </div>
      </section>
    </>
  );
}
