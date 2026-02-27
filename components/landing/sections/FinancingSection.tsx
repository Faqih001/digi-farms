import { CreditCard, Shield, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function FinancingSection() {
  return (
    <section className="py-24 bg-[#F7FCF8] dark:bg-[#14271F]">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-green-600/10 text-green-800 border-green-200 dark:bg-white/20 dark:text-white dark:border-white/30">
            Finance &amp; Insurance
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4">
            Unlock Capital. <span className="text-gradient-gold">Protect Your Harvest.</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-green-200/80 max-w-2xl mx-auto">
            Your digital farm record is your credit score. Access micro-loans and crop insurance
            without traditional collateral requirements.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Financing card */}
          <div className="rounded-2xl p-8 bg-white dark:bg-[#1A3329] border border-[#c3dfc9] dark:border-[#2a4a38] shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center mb-6">
              <CreditCard className="w-6 h-6 text-amber-600 dark:text-amber-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">Agri Micro-Finance</h3>
            <p className="text-slate-600 dark:text-green-200/80 mb-6 text-sm leading-relaxed">
              AI-powered credit scoring uses your DIGI-FARMS data — yield history, diagnostics,
              market activity — to provide instant loan decisions without traditional bank collateral.
            </p>
            <ul className="space-y-3 text-sm text-slate-700 dark:text-green-200">
              {[
                "Loans from KES 5,000 – KES 500,000",
                "Interest from 8% per annum",
                "Approval within 24 hours",
                "Integrated with 12+ Kenyan lenders",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-amber-500 dark:text-amber-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Insurance card */}
          <div className="rounded-2xl p-8 bg-white dark:bg-[#1A3329] border border-[#c3dfc9] dark:border-[#2a4a38] shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center mb-6">
              <Shield className="w-6 h-6 text-blue-600 dark:text-blue-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">Crop Insurance</h3>
            <p className="text-slate-600 dark:text-green-200/80 mb-6 text-sm leading-relaxed">
              Index-based crop insurance powered by satellite imagery and weather data. Automatic
              payouts triggered by verified weather events — no paperwork required.
            </p>
            <ul className="space-y-3 text-sm text-slate-700 dark:text-green-200">
              {[
                "Coverage from KES 5,000/season",
                "Drought, flood, and pest coverage",
                "Satellite-triggered auto-payouts",
                "Partnered with UAP Old Mutual, Sanlam",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
