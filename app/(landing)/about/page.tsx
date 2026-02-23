import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Target, Eye, Lightbulb, Cpu, Globe, Leaf, Users, Star,
  ArrowRight, CheckCircle, Heart, Award, Calendar
} from "lucide-react";

export const metadata: Metadata = {
  title: "About – DIGI-FARMS",
  description: "Learn about DIGI-FARMS' mission to transform smallholder agriculture across East Africa through AI and precision technology.",
};

const teamMembers = [
  { name: "Amara Osei", role: "CEO & Co-Founder", bio: "Former CGIAR researcher with 10 years in precision agriculture. MSc Agricultural Economics, Nairobi University.", avatar: "AO" },
  { name: "Dr. Neema Baraka", role: "CTO & Co-Founder", bio: "PhD Computer Vision, Carnegie Mellon. Led AI development at Safaricom's tech accelerator.", avatar: "NB" },
  { name: "Samuel Mwangi", role: "CPO", bio: "10 years building mobile-first products for African markets. Previously at M-Pesa and Jumia.", avatar: "SM" },
  { name: "Janet Chebet", role: "Head of Partnerships", bio: "Former AGRA program director. Built a network of 800+ agrovets across East Africa.", avatar: "JC" },
  { name: "Kwame Asante", role: "Head of AI/ML", bio: "ML Engineer specializing in plant disease detection. 50+ peer-reviewed publications.", avatar: "KA" },
  { name: "Fatima Hassan", role: "Head of Finance", bio: "Former Equity Bank agri-finance specialist. Structured over KES 2B in agricultural loans.", avatar: "FH" },
];

const advisors = [
  { name: "Prof. Akin Adesina", role: "African Development Bank President", focus: "Agricultural Finance" },
  { name: "Dr. Agnes Kalibata", role: "AGRA President", focus: "Policy & Scale" },
  { name: "Juliet Nabatanzi", role: "CGIAR Board Member", focus: "Research & Science" },
  { name: "Michael Otieno", role: "Former Safaricom CEO", focus: "Technology Strategy" },
];

const roadmilestones = [
  { period: "Q1 2024", title: "Platform Launch", desc: "Beta launch in Kenya with 500 pilot farmers", done: true },
  { period: "Q3 2024", title: "AI Diagnostic V2", desc: "200+ disease database, 94% accuracy milestone", done: true },
  { period: "Q1 2025", title: "Marketplace Live", desc: "500+ suppliers onboarded, KES 200M volume", done: true },
  { period: "Q3 2025", title: "East Africa Expansion", desc: "Uganda and Tanzania market entry", done: true },
  { period: "Q1 2026", title: "Finance Integration", desc: "12 lending partners, insurance products live", done: false },
  { period: "Q3 2026", title: "IoT & Drone Services", desc: "Sensor-based precision agriculture rollout", done: false },
  { period: "2027", title: "Pan-Africa Expansion", desc: "Nigeria, Ethiopia, Rwanda — 1M farmers goal", done: false },
];

const sdgs = [
  { number: 1, name: "No Poverty", color: "bg-red-600" },
  { number: 2, name: "Zero Hunger", color: "bg-amber-600" },
  { number: 8, name: "Decent Work", color: "bg-rose-700" },
  { number: 10, name: "Reduced Inequalities", color: "bg-pink-600" },
  { number: 13, name: "Climate Action", color: "bg-green-700" },
  { number: 17, name: "Partnerships", color: "bg-blue-700" },
];

export default function AboutPage() {
  return (
    <>
      {/* Section 1: Mission & Vision */}
      <section className="gradient-hero py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-white/20 text-white border-white/30">About DIGI-FARMS</Badge>
            <h1 className="text-5xl lg:text-7xl font-black text-white mb-6 leading-tight">
              Feeding Africa Through <span className="text-gradient">Innovation</span>
            </h1>
            <p className="text-xl text-green-100/80 leading-relaxed">
              We believe every African farmer deserves access to the same precision tools used by the world&apos;s most advanced farms. DIGI-FARMS is making that vision a reality.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-16">
            <div className="glass rounded-2xl p-8 bg-white/10 border border-white/20">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3">Our Mission</h3>
              <p className="text-green-200/80 leading-relaxed">
                To eliminate preventable crop loss and farm poverty by giving every smallholder farmer in Africa access to AI-powered diagnostics, fair markets, and climate-resilient financing — regardless of land size, education level, or location.
              </p>
            </div>
            <div className="glass rounded-2xl p-8 bg-white/10 border border-white/20">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3">Our Vision</h3>
              <p className="text-green-200/80 leading-relaxed">
                A world where African agriculture is the most productive, sustainable, and digitally-advanced in the world — where smallholder farmers earn fair income, food systems are resilient to climate change, and no family goes hungry due to preventable crop failure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Our Story */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge variant="earth" className="mb-4">Our Story</Badge>
              <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-6">
                Born in the Fields, <br />Built for the Future
              </h2>
              <div className="space-y-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                <p>
                  In 2023, our co-founder Amara Osei watched her uncle lose 60% of his maize crop to a fungal disease that could have been diagnosed and treated in time — if he had the right tools. He didn&apos;t. No farmer in his district did.
                </p>
                <p>
                  That single moment sparked DIGI-FARMS. Amara, alongside AI researcher Dr. Neema Baraka, set out to build the precision agriculture platform they wished existed for every African farmer.
                </p>
                <p>
                  What began as a simple crop scanning app in Nakuru, Kenya, has grown into a full-stack agritech ecosystem serving 50,000+ farmers across five East African countries — with plans to reach 1 million by 2027.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/20 rounded-3xl p-8 text-center border border-green-200 dark:border-green-800">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: "2023", label: "Founded" },
                  { value: "5", label: "Countries" },
                  { value: "50K+", label: "Farmers" },
                  { value: "28", label: "Team Members" },
                ].map(({ value, label }) => (
                  <div key={label} className="text-center">
                    <div className="text-4xl font-black text-green-600">{value}</div>
                    <div className="text-sm text-slate-500 mt-1">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: The Problem */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <Badge variant="destructive" className="mb-4">The Problem We&apos;re Solving</Badge>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">
              African Agriculture&apos;s Perfect Storm
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "🌿", title: "Preventable Crop Loss", desc: "40% of African smallholder harvests are lost to diseases that could be diagnosed and treated. Lack of diagnostic tools and expert access means farmers suffer losses that are entirely preventable." },
              { icon: "📊", title: "Information Gap", desc: "Farmers make critical decisions without reliable data on weather, soil, markets, or crop management. Over 75% rely on generational knowledge alone — with no access to precision insights." },
              { icon: "🏦", title: "Financial Exclusion", desc: "80% of smallholders are unbanked and can't access credit or insurance. With no digital farm history to score, lenders reject them. Without insurance, one bad season can destroy years of work." },
            ].map(({ icon, title, desc }) => (
              <Card key={title} className="p-6">
                <CardContent className="p-0">
                  <div className="text-4xl mb-4">{icon}</div>
                  <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-3">{title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Technology Infrastructure */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <Badge className="mb-4">Technology</Badge>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">
              World-Class Technology Infrastructure
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Cpu, title: "Proprietary Vision AI", desc: "Trained on 4M+ African crop images across 200+ diseases", color: "text-green-600" },
              { icon: Globe, title: "Cloud-Edge Architecture", desc: "Works offline in low-connectivity rural areas with sync", color: "text-blue-600" },
              { icon: Leaf, title: "IoT Integration Ready", desc: "Plug-in support for soil sensors, weather stations, drones", color: "text-emerald-600" },
              { icon: Lightbulb, title: "Explainable AI", desc: "All recommendations come with human-readable reasoning", color: "text-amber-600" },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="text-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 card-hover">
                <Icon className={`w-8 h-8 mx-auto mb-3 ${color}`} />
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: AI Engine */}
      <section className="py-24 bg-gradient-to-br from-green-900 to-green-950 text-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="mb-4 bg-white/20 text-white border-white/30">AI Engine</Badge>
              <h2 className="text-4xl font-black mb-6">
                The Brain Behind <span className="text-gradient">DIGI-FARMS</span>
              </h2>
              <p className="text-green-200/80 mb-8 leading-relaxed">
                Our proprietary Vision AI was trained specifically on African crop varieties and disease manifestations — not generic global datasets. This means unmatched accuracy for East African growing conditions.
              </p>
              <div className="space-y-4">
                {[
                  "4 million+ African crop images in training dataset",
                  "200+ crop diseases and nutrient deficiencies recognized",
                  "94% diagnostic accuracy, validated by agronomists",
                  "Continuous learning from new farm submissions",
                  "Multilingual: English, Swahili, Ekegusii, Dholuo",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-green-200">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm border border-white/20">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-green-400/20 flex items-center justify-center mb-3">
                  <Cpu className="w-8 h-8 text-green-300" />
                </div>
                <h3 className="font-bold text-xl">AI Diagnostic Console</h3>
              </div>
              <div className="space-y-3">
                {[
                  { crop: "Maize — Block 2A", result: "✅ Healthy", conf: "98%" },
                  { crop: "Tomatoes — Greenhouse", result: "⚠️ Early Blight", conf: "92%" },
                  { crop: "Kale — Row 3-8", result: "✅ Healthy", conf: "96%" },
                ].map(({ crop, result, conf }) => (
                  <div key={crop} className="bg-white/10 rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold">{crop}</div>
                      <div className="text-xs text-green-300">{result}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-green-400 font-bold">{conf}</div>
                      <div className="text-xs text-green-300/60">confidence</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Climate Resilience */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <Badge variant="earth" className="mb-4">Climate Resilience</Badge>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">
              Built for a Changing Climate
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Climate change is the single greatest threat to African food security. DIGI-FARMS embeds climate intelligence at every layer.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "🌧️", title: "Rainfall Prediction", desc: "Hyperlocal 7-day and seasonal rainfall forecasts to guide planting and harvesting decisions" },
              { icon: "🌡️", title: "Heat Stress Alerts", desc: "Real-time alerts when temperatures exceed crop-specific thresholds, with mitigation advice" },
              { icon: "🌍", title: "Carbon Sequestration", desc: "Track and measure carbon credits from sustainable farming practices for additional income streams" },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="text-center p-8 rounded-2xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30">
                <div className="text-5xl mb-4">{icon}</div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-3">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 7: Team */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <Badge className="mb-4">Our Team</Badge>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">
              World-Class Team, Local Expertise
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map(({ name, role, bio, avatar }) => (
              <Card key={name} className="p-6 card-hover">
                <CardContent className="p-0 text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white font-bold text-xl mb-4">
                    {avatar}
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-1">{name}</h3>
                  <div className="text-sm text-green-600 font-semibold mb-3">{role}</div>
                  <p className="text-xs text-slate-500 leading-relaxed">{bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section 8: Advisory Board */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <Badge variant="earth" className="mb-4">Advisory Board</Badge>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">
              Guided by Africa&apos;s Best
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {advisors.map(({ name, role, focus }) => (
              <div key={name} className="text-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-3">
                  <Star className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">{name}</h3>
                <div className="text-xs text-slate-500 mb-2">{role}</div>
                <Badge variant="earth" className="text-xs">{focus}</Badge>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 9: Roadmap */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <Badge className="mb-4">Roadmap</Badge>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Where We&apos;re Going</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {roadmilestones.map(({ period, title, desc, done }) => (
              <div key={period} className={`flex gap-6 items-start p-5 rounded-2xl border transition-all ${done ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"}`}>
                <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${done ? "bg-green-600" : "bg-slate-200 dark:bg-slate-700"}`}>
                  {done ? <CheckCircle className="w-5 h-5 text-white" /> : <Calendar className="w-5 h-5 text-slate-500" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{period}</span>
                    {done && <Badge className="text-[10px]">✓ Completed</Badge>}
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{title}</h3>
                  <p className="text-sm text-slate-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 10: SDG Alignment */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <Badge className="mb-4">Global Impact</Badge>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">
              Aligned with the UN SDGs
            </h2>
            <p className="text-slat-500 max-w-xl mx-auto text-sm">DIGI-FARMS directly contributes to 6 of the 17 United Nations Sustainable Development Goals.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {sdgs.map(({ number, name, color }) => (
              <div key={number} className={`${color} text-white rounded-xl p-4 text-center w-36`}>
                <div className="text-2xl font-black mb-1">{number}</div>
                <div className="text-xs font-semibold leading-tight">{name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 11: Transparency & Trust */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <Badge variant="earth" className="mb-4">Trust</Badge>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Transparency & Trust</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Heart, title: "Farmer-First Values", desc: "We never sell your data. Farmers own their farm data. We earn through subscriptions and marketplace commissions — not data monetization.", color: "text-red-600" },
              { icon: Award, title: "Third-Party Audited", desc: "Our AI models, data practices, and financial integrations are independently audited quarterly by KPMG East Africa.", color: "text-blue-600" },
              { icon: Users, title: "Farmer Advisory Council", desc: "200+ farmers sit on our product advisory council. Every major feature goes through farmer testing before launch.", color: "text-green-600" },
            ].map(({ icon: Icon, title, desc, color }) => (
              <Card key={title} className="p-6 text-center">
                <CardContent className="p-0">
                  <Icon className={`w-8 h-8 mx-auto mb-3 ${color}`} />
                  <h3 className="font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section 12: Join Us CTA */}
      <section className="py-24 gradient-mesh">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-5xl font-black text-white mb-6">
            Join the <span className="text-gradient">Movement</span>
          </h2>
          <p className="text-xl text-green-100/80 mb-10">
            Whether you&apos;re a farmer, investor, partner, or problem-solver — there&apos;s a role for you in transforming African agriculture.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="xl" asChild>
              <Link href="/register">
                <Sprout className="w-5 h-5" />
                Join as Farmer
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button variant="hero-outline" size="xl" asChild>
              <Link href="/contact#partnership">Partner with Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

// needed but import is already in scope via lucide-react
function Sprout(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M7 20h10" /><path d="M10 20c5.5-2.5.8-6.4 3-9" />
      <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" />
      <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" />
    </svg>
  );
}
