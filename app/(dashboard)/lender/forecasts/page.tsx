import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Leaf, Droplets, Sun, CloudRain, Search } from "lucide-react";

const forecasts = [
  { farmer: "John Kamau", crop: "Maize", county: "Nakuru", acres: 12, currentYield: "3.2 tons/acre", predicted: "3.8 tons/acre", change: +18.7, confidence: 92, risk: "Low", season: "Long Rains 2026", moisture: "Adequate", health: "Excellent" },
  { farmer: "James Mwangi", crop: "Tea", county: "Meru", acres: 18, currentYield: "2.1 tons/acre", predicted: "2.4 tons/acre", change: +14.3, confidence: 88, risk: "Low", season: "Long Rains 2026", moisture: "Good", health: "Good" },
  { farmer: "Peter Odhiambo", crop: "Rice", county: "Kisumu", acres: 25, currentYield: "4.5 tons/acre", predicted: "4.1 tons/acre", change: -8.9, confidence: 75, risk: "Medium", season: "Long Rains 2026", moisture: "Excess", health: "Fair" },
  { farmer: "David Njoroge", crop: "Tomatoes", county: "Nyandarua", acres: 10, currentYield: "18 tons/acre", predicted: "22 tons/acre", change: +22.2, confidence: 85, risk: "Low", season: "Long Rains 2026", moisture: "Adequate", health: "Good" },
  { farmer: "Alice Chebet", crop: "Wheat", county: "Uasin Gishu", acres: 5, currentYield: "2.8 tons/acre", predicted: "2.0 tons/acre", change: -28.6, confidence: 68, risk: "High", season: "Long Rains 2026", moisture: "Deficit", health: "Poor" },
  { farmer: "Grace Akinyi", crop: "Beans", county: "Nairobi", acres: 2, currentYield: "1.2 tons/acre", predicted: "1.4 tons/acre", change: +16.7, confidence: 78, risk: "Medium", season: "Long Rains 2026", moisture: "Adequate", health: "Good" },
];

export default function ForecastsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Yield Forecasts</h1>
        <p className="text-sm text-slate-500">AI-powered crop yield predictions for borrower farms</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Leaf, label: "Avg. Yield Change", value: "+5.7%", color: "text-green-600", bg: "bg-green-50 dark:bg-green-950" },
          { icon: Sun, label: "Favorable Forecasts", value: "68%", color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950" },
          { icon: CloudRain, label: "Weather Risk Alerts", value: "4", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950" },
          { icon: Droplets, label: "Moisture Deficit Areas", value: "12", color: "text-red-600", bg: "bg-red-50 dark:bg-red-950" },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <Card key={label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <p className={`text-xl font-bold ${color}`}>{value}</p>
                <p className="text-xs text-slate-500">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Search by farmer, crop, or county..." />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {forecasts.map((f) => (
          <Card key={f.farmer}>
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-900 dark:text-white">{f.farmer}</span>
                    <Badge variant={f.risk === "Low" ? "success" : f.risk === "Medium" ? "warning" : "destructive"} className="text-xs">{f.risk} Risk</Badge>
                  </div>
                  <p className="text-sm text-slate-500">{f.crop} • {f.county} • {f.acres} acres • {f.season}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Droplets className="w-3 h-3" /> Moisture: {f.moisture}</span>
                    <span className="flex items-center gap-1"><Leaf className="w-3 h-3" /> Health: {f.health}</span>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-xs text-slate-400">Current</p>
                    <p className="font-semibold text-sm text-slate-700 dark:text-slate-300">{f.currentYield}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-400">Predicted</p>
                    <p className="font-bold text-sm text-slate-900 dark:text-white">{f.predicted}</p>
                  </div>
                  <div className="text-center">
                    <div className={`flex items-center gap-1 ${f.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {f.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      <span className="font-bold">{f.change >= 0 ? "+" : ""}{f.change}%</span>
                    </div>
                    <p className="text-xs text-slate-400">{f.confidence}% conf.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
