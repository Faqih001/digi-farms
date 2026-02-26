import Link from "next/link";
import { Target, Eye, Cpu, Globe, Leaf, Lightbulb, Users, ArrowRight, CheckCircle, Award, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// ── Data ────────────────────────────────────────────────────────────────────

const teamMembers = [
  { name: "Amara Osei", role: "CEO & Co-Founder", bio: "Former CGIAR researcher with 10 years in precision agriculture. MSc Agricultural Economics, Nairobi University.", avatar: "AO", color: "from-green-500 to-green-700" },
  { name: "Dr. Neema Baraka", role: "CTO & Co-Founder", bio: "PhD Computer Vision, Carnegie Mellon. Led AI development at Safaricom's tech accelerator.", avatar: "NB", color: "from-blue-500 to-blue-700" },
  { name: "Samuel Mwangi", role: "CPO", bio: "10 years building mobile-first products for African markets. Previously at M-Pesa and Jumia.", avatar: "SM", color: "from-purple-500 to-purple-700" },
  { name: "Janet Chebet", role: "Head of Partnerships", bio: "Former AGRA program director. Built a network of 800+ agrovets across East Africa.", avatar: "JC", color: "from-amber-500 to-amber-700" },
  { name: "Kwame Asante", role: "Head of AI/ML", bio: "ML Engineer specializing in plant disease detection. 50+ peer-reviewed publications.", avatar: "KA", color: "from-cyan-500 to-cyan-700" },
  { name: "Fatima Hassan", role: "Head of Finance", bio: "Former Equity Bank agri-finance specialist. Structured over KES 2B in agricultural loans.", avatar: "FH", color: "from-rose-500 to-rose-700" },
];

const advisors = [
  { name: "Prof. Akin Adesina", role: "African Development Bank President", focus: "Agricultural Finance" },
  { name: "Dr. Agnes Kalibata", role: "AGRA President", focus: "Policy & Scale" },
  { name: "Juliet Nabatanzi", role: "CGIAR Board Member", focus: "Research & Science" },
  { name: "Michael Otieno", role: "Former Safaricom CEO", focus: "Technology Strategy" },
];

const milestones = [
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

const coreValues = [
  { icon: "🌱", title: "Farmer-First", desc: "Every decision starts with: Does this make a farmer's life better?" },
  { icon: "🔬", title: "Science-Led", desc: "We build on validated research, not assumptions." },
  { icon: "🌍", title: "Africa-Centered", desc: "Built for African soils, crops, languages, and ecosystems." },
  { icon: "🤝", title: "Inclusive by Design", desc: "Supports farmers with low literacy, connectivity, and capital." },
  { icon: "💡", title: "Transparent AI", desc: "Every recommendation is explainable in plain language." },
  { icon: "🌿", title: "Climate-Positive", desc: "We help farmers adapt to and mitigate climate change." },
];

// ── Section 1: Mission & Vision ──────────────────────────────────────────────

export function MissionVisionSection() {
  return (
    <section className="gradient-hero py-24">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <Badge className="mb-6 bg-white/20 text-white border-white/30">About DIGI-FARMS</Badge>
          <h1 className="text-5xl lg:text-7xl font-black text-white mb-6 leading-tight">
            Feeding Africa Through <span className="text-green-200">Innovation</span>
          </h1>
          <p className="text-xl text-green-100/90 leading-relaxed">
            We believe every African farmer deserves access to the same precision tools used by the
            world&apos;s most advanced farms. DIGI-FARMS is making that vision a reality.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              icon: Target,
              title: "Our Mission",
              body: "To eliminate preventable crop loss and farm poverty by giving every smallholder farmer in Africa access to AI-powered diagnostics, fair markets, and climate-resilient financing — regardless of land size, education level, or location.",
            },
            {
              icon: Eye,
              title: "Our Vision",
              body: "A world where African agriculture is the most productive, sustainable, and digitally-advanced in the world — where smallholder farmers earn fair income, food systems are resilient to climate change, and no family goes hungry due to preventable crop failure.",
            },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-white/15 backdrop-blur-sm rounded-2xl p-8 border border-white/25">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3">{title}</h3>
              <p className="text-green-100/85 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section 2: Our Story ─────────────────────────────────────────────────────

export function StorySection() {
  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <Badge variant="earth" className="mb-4">Our Story</Badge>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-6">
              Born in the Fields,<br />Built for the Future
            </h2>
            <div className="space-y-4 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              <p>
                In 2023, our co-founder Amara Osei watched her uncle lose 60% of his maize crop to a
                fungal disease that could have been diagnosed and treated in time — if he had the right
                tools. He didn&apos;t. No farmer in his district did.
              </p>
              <p>
                That single moment sparked DIGI-FARMS. Amara, alongside AI researcher Dr. Neema Baraka,
                set out to build the precision agriculture platform they wished existed for every African
                farmer.
              </p>
              <p>
                What began as a simple crop scanning app in Nakuru, Kenya, has grown into a full-stack
                agritech ecosystem serving 50,000+ farmers across five East African countries — with
                plans to reach 1 million by 2027.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/20 rounded-3xl p-10 border border-green-200 dark:border-green-800/50">
            <div className="grid grid-cols-2 gap-8 text-center">
              {[
                { value: "2023", label: "Founded" },
                { value: "5", label: "Countries" },
                { value: "50K+", label: "Farmers" },
                { value: "28", label: "Team Members" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <div className="text-4xl font-black text-green-600 dark:text-green-400">{value}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Section 3: The Problem ───────────────────────────────────────────────────

export function AboutProblemSection() {
  return (
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
            {
              icon: "🌿",
              title: "Preventable Crop Loss",
              desc: "40% of African smallholder harvests are lost to diseases that could be diagnosed and treated. Lack of diagnostic tools and expert access means farmers suffer losses that are entirely preventable.",
            },
            {
              icon: "📊",
              title: "Information Gap",
              desc: "Farmers make critical decisions without reliable data on weather, soil, markets, or crop management. Over 75% rely on generational knowledge alone — with no access to precision insights.",
            },
            {
              icon: "🏦",
              title: "Financial Exclusion",
              desc: "80% of smallholders are unbanked and can't access credit or insurance. With no digital farm history to score, lenders reject them. Without insurance, one bad season can destroy years of work.",
            },
          ].map(({ icon, title, desc }) => (
            <Card key={title} className="p-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-3">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section 4: Technology Infrastructure ─────────────────────────────────────

export function TechInfraSection() {
  return (
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
            { icon: Cpu, title: "Proprietary Vision AI", desc: "Trained on 4M+ African crop images across 200+ diseases", color: "bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400" },
            { icon: Globe, title: "Cloud-Edge Architecture", desc: "Works offline in low-connectivity rural areas with sync", color: "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400" },
            { icon: Leaf, title: "IoT Integration Ready", desc: "Plug-in support for soil sensors, weather stations, drones", color: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400" },
            { icon: Lightbulb, title: "Explainable AI", desc: "All recommendations come with human-readable reasoning", color: "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400" },
          ].map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="text-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 card-hover">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 ${color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section 5: AI Engine ──────────────────────────────────────────────────────

export function AIEngineSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 dark:bg-slate-950 dark:from-slate-950 dark:via-slate-950 dark:to-slate-950">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <Badge className="mb-4 bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700/50">AI Engine</Badge>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-6">
              The Brain Behind <span className="text-gradient">DIGI-FARMS</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Our proprietary Vision AI was trained specifically on African crop varieties and disease
              manifestations — not generic global datasets. This means unmatched accuracy for East
              African growing conditions.
            </p>
            <div className="space-y-3">
              {[
                "4 million+ African crop images in training dataset",
                "200+ crop diseases and nutrient deficiencies recognized",
                "94% diagnostic accuracy, validated by agronomists",
                "Continuous learning from new field data every 24 hours",
                "Works in Swahili, English, Luganda, and Amharic",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="text-center mb-6">
              <div className="text-6xl mb-3">🤖</div>
              <h3 className="font-black text-xl text-slate-900 dark:text-white">Vision AI Engine v2.4</h3>
              <p className="text-green-600 dark:text-green-400 text-sm">● Active · Processing 12,400 scans/day</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Accuracy", value: "94%", color: "text-green-600 dark:text-green-400" },
                { label: "Diseases", value: "200+", color: "text-blue-600 dark:text-blue-400" },
                { label: "Speed", value: "<5s", color: "text-amber-600 dark:text-amber-400" },
                { label: "Languages", value: "4", color: "text-purple-600 dark:text-purple-400" },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4 text-center border border-slate-200 dark:border-slate-600">
                  <div className={`text-2xl font-black ${color}`}>{value}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Section 6: Team ───────────────────────────────────────────────────────────

export function TeamSection() {
  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <Badge className="mb-4">Team</Badge>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">
            Meet the Team
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            A multidisciplinary team of agronomists, AI researchers, fintech builders, and impact entrepreneurs.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map(({ name, role, bio, avatar, color }) => (
            <div key={name} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 card-hover shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white text-lg font-black mb-4`}>
                {avatar}
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">{name}</h3>
              <p className="text-green-600 dark:text-green-400 text-sm font-semibold mb-3">{role}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section 7: Advisors ───────────────────────────────────────────────────────

export function AdvisorsSection() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <Badge variant="earth" className="mb-4">Advisors</Badge>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">
            Guided by World Leaders
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Our advisory board brings decades of African agriculture, finance, and technology expertise.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {advisors.map(({ name, role, focus }) => (
            <div key={name} className="bg-white dark:bg-slate-800 rounded-2xl p-6 text-center border border-slate-200 dark:border-slate-700 card-hover">
              <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center mb-4">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{role}</p>
              <span className="inline-block text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full border border-green-200 dark:border-green-700/50">
                {focus}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section 8: Core Values ────────────────────────────────────────────────────

export function CoreValuesSection() {
  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <Badge className="mb-4">Values</Badge>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">
            What We Stand For
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreValues.map(({ icon, title, desc }) => (
            <div key={title} className="flex gap-4 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 card-hover">
              <div className="text-3xl flex-shrink-0">{icon}</div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section 9: Milestones ─────────────────────────────────────────────────────

export function MilestonesSection() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <Badge variant="earth" className="mb-4">Roadmap</Badge>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">
            Our Journey &amp; What&apos;s Next
          </h2>
        </div>
        <div className="relative">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700 -translate-x-0.5" />
          <div className="space-y-8">
            {milestones.map(({ period, title, desc, done }, i) => (
              <div key={period} className={`flex gap-6 md:gap-0 items-start ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                <div className="hidden md:block w-1/2" />
                <div className="relative flex-shrink-0 z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${done ? "bg-green-600 border-green-600 text-white" : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-400"}`}>
                    {done ? <CheckCircle className="w-5 h-5" /> : <Calendar className="w-4 h-4" />}
                  </div>
                </div>
                <div className={`flex-1 pb-4 md:px-6 ${i % 2 === 0 ? "" : "md:text-right"}`}>
                  <div className={`inline-block bg-white dark:bg-slate-800 rounded-2xl p-5 border ${done ? "border-green-200 dark:border-green-800/50" : "border-slate-200 dark:border-slate-700"} shadow-sm`}>
                    <div className={`text-xs font-bold mb-1 ${done ? "text-green-600 dark:text-green-400" : "text-slate-400 dark:text-slate-500"}`}>{period}</div>
                    <div className="font-bold text-slate-900 dark:text-white">{title}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{desc}</div>
                    {done && <span className="inline-block mt-2 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full">✓ Completed</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Section 10: SDGs ──────────────────────────────────────────────────────────

export function SDGSection() {
  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <Badge className="mb-4">UN Sustainable Development Goals</Badge>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">
            Aligned with the Global Goals
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            DIGI-FARMS directly contributes to six of the 17 UN Sustainable Development Goals.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {sdgs.map(({ number, name, color }) => (
            <div key={number} className={`${color} rounded-xl px-6 py-4 text-white text-center min-w-24 shadow-sm`}>
              <div className="text-2xl font-black">{number}</div>
              <div className="text-xs font-semibold mt-1 text-white/90">{name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section 11: Awards & Join CTA ─────────────────────────────────────────────

export function AboutCTASection() {
  return (
    <section className="py-24 gradient-mesh">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          {["🏆 Hult Prize 2026 | Finalist", "🌍 AGRA Innovation Award 2025", "⭐ Forbes 30 Under 30 Africa 2025"].map((a) => (
            <div key={a} className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-xl px-4 py-2 shadow-sm border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200">
              <Award className="w-4 h-4 text-amber-500 flex-shrink-0" />
              {a}
            </div>
          ))}
        </div>
        <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-6">
          Join Our <span className="text-gradient">Mission</span>
        </h2>
        <p className="text-xl text-slate-600 dark:text-green-200/80 mb-10">
          Whether you&apos;re a farmer, investor, partner, or developer — there&apos;s a place for you in
          the DIGI-FARMS story.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="hero" size="xl" asChild>
            <Link href="/register">Start Farming Smarter <ArrowRight className="w-4 h-4" /></Link>
          </Button>
          <Button variant="hero-outline" size="xl" asChild>
            <Link href="/company/careers">Join Our Team</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
