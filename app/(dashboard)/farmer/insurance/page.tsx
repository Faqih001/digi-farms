import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Shield, FileText, AlertTriangle, CheckCircle, Clock, ArrowRight, Leaf, CloudRain, Bug } from "lucide-react";

const policies = [
  { id: "INS-001", type: "Crop Insurance", crop: "Maize", coverage: "KES 250,000", premium: "KES 12,500/season", status: "Active", expires: "Aug 2026", payout: 0 },
  { id: "INS-002", type: "Weather Index", crop: "All Crops", coverage: "KES 150,000", premium: "KES 8,000/season", status: "Active", expires: "Dec 2026", payout: 0 },
  { id: "INS-003", type: "Livestock Insurance", crop: "Dairy Cattle (5)", coverage: "KES 500,000", premium: "KES 25,000/year", status: "Pending", expires: "—", payout: 0 },
];

const claims = [
  { id: "CLM-101", date: "Jan 15, 2026", type: "Drought Damage", amount: "KES 45,000", status: "Approved", icon: CloudRain },
  { id: "CLM-102", date: "Nov 8, 2025", type: "Pest Infestation", amount: "KES 18,000", status: "Paid", icon: Bug },
  { id: "CLM-103", date: "Feb 2, 2026", type: "Hailstorm Damage", amount: "KES 32,000", status: "Under Review", icon: AlertTriangle },
];

const plans = [
  { name: "Basic Crop", coverage: "Up to KES 100K", premium: "From KES 5,000/season", features: ["Single crop coverage", "Drought protection", "Basic pest damage"] },
  { name: "Premium Crop", coverage: "Up to KES 500K", premium: "From KES 12,000/season", features: ["Multi-crop coverage", "All weather events", "Pest & disease", "Market price guarantee"] },
  { name: "Comprehensive", coverage: "Up to KES 1M", premium: "From KES 25,000/season", features: ["Crops + Livestock", "All natural disasters", "Equipment coverage", "Income protection", "Priority claims"] },
];

export default function InsurancePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Insurance</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Protect your farm against risks with affordable agri-insurance</p>
        </div>
        <Button><Shield className="w-4 h-4" /> Get New Policy</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Policies", value: "2", icon: Shield, color: "text-green-600 bg-green-100 dark:bg-green-900/30" },
          { label: "Total Coverage", value: "KES 400K", icon: CheckCircle, color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30" },
          { label: "Claims This Year", value: "3", icon: FileText, color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30" },
          { label: "Total Payouts", value: "KES 63K", icon: AlertTriangle, color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30" },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}><Icon className="w-5 h-5" /></div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Policies */}
      <Card>
        <CardHeader><CardTitle>My Policies</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {policies.map((p) => (
              <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 dark:text-white text-sm">{p.type}</span>
                      <Badge variant={p.status === "Active" ? "success" : "warning"} className="text-xs">{p.status}</Badge>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{p.crop} • Coverage: {p.coverage}</p>
                    <p className="text-xs text-slate-400">Premium: {p.premium} • Expires: {p.expires}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">View Details</Button>
                  <Button variant="outline" size="sm">File Claim</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Claims History */}
      <Card>
        <CardHeader><CardTitle>Recent Claims</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {claims.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <div className="flex items-center gap-3">
                  <c.icon className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{c.type}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{c.id} • {c.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{c.amount}</p>
                  <Badge variant={c.status === "Paid" ? "success" : c.status === "Approved" ? "info" : "warning"} className="text-xs">{c.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Available Insurance Plans</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {plans.map((plan, i) => (
            <Card key={plan.name} className={i === 1 ? "border-green-500 border-2" : ""}>
              <CardContent className="p-6">
                {i === 1 && <Badge className="mb-3">Most Popular</Badge>}
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                <p className="text-sm text-green-600 font-semibold mt-1">{plan.coverage}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{plan.premium}</p>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Button variant={i === 1 ? "default" : "outline"} className="w-full">Choose Plan</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
