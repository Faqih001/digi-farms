import Link from "next/link";
import {
  CreditCard, Shield, TrendingUp, ArrowRight, CheckCircle,
  Banknote, Percent, Clock, FileText, Users, Heart, Umbrella,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const loanProducts = [
  { name: "Input Financing", rate: "From 10%", tenure: "Up to 12 months", desc: "Buy seeds, fertilizers, and chemicals with deferred payment tied to harvest.", icon: Banknote },
  { name: "Equipment Loans", rate: "From 12%", tenure: "Up to 36 months", desc: "Finance irrigation systems, tractors, and farm machinery with flexible repayment.", icon: CreditCard },
  { name: "Working Capital", rate: "From 14%", tenure: "Up to 6 months", desc: "Short-term cash flow support for labor costs, transport, and operational expenses.", icon: TrendingUp },
];

const insuranceProducts = [
  { name: "Weather Index Insurance", desc: "Automatic payouts triggered by satellite-measured rainfall and temperature anomalies.", icon: Umbrella },
  { name: "Crop Yield Insurance", desc: "Coverage based on your DIGI-FARMS yield history. Fair premiums, fast claims.", icon: Heart },
  { name: "Input Loss Protection", desc: "Insurance for purchased inputs against flood, drought, pest outbreak, or theft.", icon: Shield },
];

const howItWorks = [
  { step: "1", title: "Apply In App", desc: "Fill a simple application in under 5 minutes using your DIGI-FARMS profile data" },
  { step: "2", title: "AI Credit Score", desc: "Our model analyzes 40+ farm data points to generate your risk profile" },
  { step: "3", title: "Instant Decision", desc: "Get approved or declined within minutes — no waiting, no branch visits" },
  { step: "4", title: "Funds Disbursed", desc: "Money sent directly to your M-Pesa or bank account same day" },
];

export function FinancingHeroSection() {
  return (
    <section className="gradient-hero py-20 lg:py-28">
      <div className="container mx-auto px-4 max-w-7xl text-center">
        <Badge className="mb-6 bg-white/20 text-white border-white/30">Financing &amp; Insurance</Badge>
        <h1 className="text-4xl lg:text-6xl font-black text-white mb-6 leading-tight">
          Grow Your Farm, <br className="hidden sm:block" />
          <span className="text-green-200">Not Your Debt</span>
        </h1>
        <p className="text-lg text-green-100/90 max-w-2xl mx-auto mb-8">
          Access agricultural loans and crop insurance designed for smallholder farmers.
          AI credit scoring, instant approvals, and affordable premiums.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="hero" size="lg" asChild>
            <Link href="/register">Apply for a Loan <ArrowRight className="ml-2 w-4 h-4" /></Link>
          </Button>
          <Button variant="hero-outline" size="lg" asChild>
            <Link href="/register">Get Insurance Quote</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function FinancingLoansSection() {
  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-14">
          <Badge className="mb-4">Agricultural Loans</Badge>
          <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">Loans Designed for Your Farming Cycle</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-3 max-w-xl mx-auto">Flexible products tied to planting and harvest seasons — not fixed monthly payments.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {loanProducts.map(({ name, rate, tenure, desc, icon: Icon }) => (
            <Card key={name} className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2">{name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">{desc}</p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-green-600 dark:text-green-400 font-semibold"><Percent className="w-3.5 h-3.5" />{rate}</div>
                  <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400"><Clock className="w-3.5 h-3.5" />{tenure}</div>
                </div>
                <Button className="w-full mt-4" variant="outline" asChild>
                  <Link href="/register">Apply Now</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinancingHowItWorksSection() {
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-14">
          <Badge className="mb-4">Application Process</Badge>
          <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">Approved in Minutes, Not Weeks</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {howItWorks.map(({ step, title, desc }) => (
            <div key={step} className="text-center">
              <div className="w-12 h-12 rounded-full bg-green-600 text-white font-black text-xl flex items-center justify-center mx-auto mb-4 shadow-lg">{step}</div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinancingInsuranceSection() {
  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-14">
          <Badge className="mb-4">Crop Insurance</Badge>
          <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">Protect Everything You Grow</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-3 max-w-xl mx-auto">Satellite-based index insurance means faster, fairer payouts — no loss adjustment visits needed.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {insuranceProducts.map(({ name, desc, icon: Icon }) => (
            <Card key={name} className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinancingEligibilitySection() {
  return (
    <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-slate-950 dark:to-green-950/30">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge className="mb-4">Eligibility</Badge>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mb-6">Who Can Apply?</h2>
            <div className="space-y-3">
              {["Active DIGI-FARMS account for at least 3 months", "At least one verified farm profile on the platform", "At least 5 AI crop diagnostic scans completed", "No outstanding defaulted loans on DIGI-FARMS", "Kenyan national or valid East African residency"].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />{item}
                </div>
              ))}
            </div>
            <Button size="lg" className="mt-8" asChild>
              <Link href="/register">Check My Eligibility <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-green-200 dark:border-slate-700 shadow-lg">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 border-4 border-green-500 flex items-center justify-center mx-auto mb-4">
                <div>
                  <div className="text-2xl font-black text-green-600 dark:text-green-400">78</div>
                  <div className="text-xs text-green-600 dark:text-green-400">/100</div>
                </div>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">Your Agri-Credit Score</h3>
              <Badge>Eligible for up to KES 150,000</Badge>
            </div>
            <div className="mt-6 space-y-2">
              {[["Loan Amount", "KES 80,000"], ["Interest Rate", "11% p.a."], ["Repayment", "At harvest"], ["Approval", "Same day"]].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">{k}</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{v}</span>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4" asChild>
              <Link href="/register"><FileText className="w-4 h-4 mr-2" />Apply Now</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FinancingCTASection() {
  return (
    <section className="py-20 gradient-mesh">
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <Badge className="mb-4">
          <Users className="w-3 h-3 mr-1" />Join 12,000+ Borrowers
        </Badge>
        <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mb-4">Finance Your Next Season Today</h2>
        <p className="text-slate-600 dark:text-green-200/80 mb-8">KES 2.1 billion disbursed. 94% on-time repayment rate. Apply in 5 minutes.</p>
        <Button size="lg" asChild>
          <Link href="/register">Start My Application <ArrowRight className="ml-2 w-4 h-4" /></Link>
        </Button>
      </div>
    </section>
  );
}
