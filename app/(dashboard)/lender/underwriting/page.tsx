import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Shield, AlertTriangle, CheckCircle, TrendingUp, Clock, Search, Eye } from "lucide-react";

const decisions = [
  { id: "UW-2081", farmer: "John Kamau", amount: "KES 150,000", aiScore: 82, repaymentCapacity: 94, farmViability: 78, weatherRisk: 12, recommendation: "Approve", confidence: 91, factors: ["Strong repayment history", "Favorable soil conditions", "Adequate insurance"], collateral: "Farm equipment", date: "Feb 24, 2026" },
  { id: "UW-2080", farmer: "David Njoroge", amount: "KES 180,000", aiScore: 79, repaymentCapacity: 72, farmViability: 85, weatherRisk: 18, recommendation: "Approve", confidence: 84, factors: ["Good crop diversity", "Experienced farmer", "Moderate debt ratio"], collateral: "Land title", date: "Feb 23, 2026" },
  { id: "UW-2079", farmer: "Alice Chebet", amount: "KES 75,000", aiScore: 45, repaymentCapacity: 38, farmViability: 52, weatherRisk: 45, recommendation: "Reject", confidence: 88, factors: ["High default probability", "Drought-prone region", "No insurance cover"], collateral: "None", date: "Feb 22, 2026" },
  { id: "UW-2078", farmer: "Grace Akinyi", amount: "KES 45,000", aiScore: 58, repaymentCapacity: 65, farmViability: 48, weatherRisk: 30, recommendation: "Manual Review", confidence: 62, factors: ["Small farm size", "Limited credit history", "Growing market demand"], collateral: "Produce contract", date: "Feb 21, 2026" },
  { id: "UW-2077", farmer: "Peter Odhiambo", amount: "KES 250,000", aiScore: 91, repaymentCapacity: 96, farmViability: 88, weatherRisk: 8, recommendation: "Approve", confidence: 95, factors: ["Excellent credit score", "Large diversified farm", "Strong cash flow"], collateral: "Land title + Equipment", date: "Feb 20, 2026" },
];

const recConfig: Record<string, { variant: "success" | "warning" | "destructive"; icon: typeof CheckCircle }> = {
  Approve: { variant: "success", icon: CheckCircle },
  Reject: { variant: "destructive", icon: AlertTriangle },
  "Manual Review": { variant: "warning", icon: Clock },
};

function ScoreBar({ label, value, max = 100 }: { label: string; value: number; max?: number }) {
  const pct = (value / max) * 100;
  const color = pct >= 70 ? "bg-green-500" : pct >= 50 ? "bg-amber-500" : "bg-red-500";
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-500 dark:text-slate-400">{label}</span>
        <span className="font-medium text-slate-700 dark:text-slate-300">{value}%</span>
      </div>
      <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function UnderwritingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">AI Underwriting</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Automated risk assessment and loan decisions</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Brain, label: "AI Decisions (MTD)", value: "34", color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-950" },
          { icon: CheckCircle, label: "Auto-Approved", value: "22", color: "text-green-600", bg: "bg-green-50 dark:bg-green-950" },
          { icon: AlertTriangle, label: "Manual Review", value: "5", color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950" },
          { icon: Shield, label: "Avg. Confidence", value: "86%", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950" },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <Card key={label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <p className={`text-xl font-bold ${color}`}>{value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Search decisions..." />
            </div>
            <select className="h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm">
              <option>All Recommendations</option>
              <option>Approve</option>
              <option>Reject</option>
              <option>Manual Review</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {decisions.map((d: any) => {
          const rc = recConfig[d.recommendation];
          return (
            <Card key={d.id}>
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-purple-500" />
                      <span className="font-bold text-slate-900 dark:text-white">{d.farmer}</span>
                      <Badge variant={rc.variant}>{d.recommendation}</Badge>
                      <span className="text-xs text-slate-400">{d.id}</span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{d.amount} • Collateral: {d.collateral} • {d.date}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <ScoreBar label="Repayment Capacity" value={d.repaymentCapacity} />
                      <ScoreBar label="Farm Viability" value={d.farmViability} />
                      <ScoreBar label="Weather Risk" value={100 - d.weatherRisk} />
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {d.factors.map((f: any) => (
                        <span key={f} className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-400">{f}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-2 min-w-[100px]">
                    <div className="text-center">
                      <p className="text-3xl font-black text-slate-900 dark:text-white">{d.aiScore}</p>
                      <p className="text-xs text-slate-400">AI Score</p>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{d.confidence}% confidence</p>
                    <Button variant="outline" size="sm"><Eye className="w-3 h-3 mr-1" /> Details</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
