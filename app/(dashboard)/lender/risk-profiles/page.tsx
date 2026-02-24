import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { UserCheck, Eye, Search, TrendingUp, Shield, Sprout, CloudSun, BarChart3 } from "lucide-react";

const farmers = [
  { name: "John Kamau", farm: "Kamau Coffee Estate", county: "Nakuru", score: 82, risk: "Low", crops: "Coffee, Maize", acres: 12, history: "3 loans, 0 defaults", income: "KES 420K/year" },
  { name: "Mary Wanjiku", farm: "Wanjiku Dairy Farm", county: "Kiambu", score: 76, risk: "Low", crops: "Napier, Maize", acres: 8, history: "2 loans, 0 defaults", income: "KES 280K/year" },
  { name: "Peter Odhiambo", farm: "Lake Farm", county: "Kisumu", score: 91, risk: "Very Low", crops: "Rice, Beans", acres: 25, history: "5 loans, 0 defaults", income: "KES 680K/year" },
  { name: "Grace Akinyi", farm: "Akinyi Gardens", county: "Nairobi", score: 58, risk: "Medium", crops: "Vegetables", acres: 2, history: "1 loan, 1 late payment", income: "KES 120K/year" },
  { name: "James Mwangi", farm: "Mwangi Holdings", county: "Meru", score: 88, risk: "Low", crops: "Tea, Avocado", acres: 18, history: "4 loans, 0 defaults", income: "KES 560K/year" },
  { name: "Alice Chebet", farm: "Highland Wheat", county: "Uasin Gishu", score: 45, risk: "High", crops: "Wheat", acres: 5, history: "1 loan, 1 default", income: "KES 85K/year" },
];

function getScoreColor(score: number) {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-amber-600";
  return "text-red-600";
}

export default function RiskProfilesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Risk Profiles</h1>
          <p className="text-sm text-slate-500">AI-generated creditworthiness scores for farmers</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Profiles", value: "1,284", icon: UserCheck },
          { label: "Low Risk", value: "892", icon: Shield },
          { label: "Medium Risk", value: "312", icon: TrendingUp },
          { label: "High Risk", value: "80", icon: BarChart3 },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="p-4 text-center">
              <Icon className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-lg font-bold text-slate-900 dark:text-white">{value}</p>
              <p className="text-xs text-slate-500">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Search farmers..." />
            </div>
            <select className="h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm">
              <option>All Risk Levels</option>
              <option>Very Low</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {farmers.map((f) => (
          <Card key={f.name} className="card-hover">
            <CardContent className="p-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-slate-900 dark:text-white">{f.name}</h3>
                    <Badge variant={f.risk === "Very Low" || f.risk === "Low" ? "success" : f.risk === "Medium" ? "warning" : "destructive"} className="text-xs">{f.risk} Risk</Badge>
                  </div>
                  <p className="text-sm text-slate-500 mb-3">{f.farm} • {f.county} • {f.acres} acres</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="flex items-center gap-1.5"><Sprout className="w-3.5 h-3.5 text-green-600" /><span className="text-slate-500">{f.crops}</span></div>
                    <div className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-blue-600" /><span className="text-slate-500">{f.history}</span></div>
                    <div className="flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-purple-600" /><span className="text-slate-500">{f.income}</span></div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className={`text-3xl font-black ${getScoreColor(f.score)}`}>{f.score}</p>
                    <p className="text-xs text-slate-400">Credit Score</p>
                    <Progress value={f.score} className="h-1.5 w-20 mt-1" />
                  </div>
                  <Button variant="outline" size="sm"><Eye className="w-4 h-4" /> Full Profile</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
