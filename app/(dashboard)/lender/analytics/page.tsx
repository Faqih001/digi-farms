import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart2, TrendingDown, AlertTriangle, Activity, MapPin, Cloud } from "lucide-react";

const riskMetrics = [
  { region: "Uasin Gishu", defaultRate: 1.2, avgScore: 78, activeLoan: 24, weatherRisk: "Low", trend: "stable" },
  { region: "Nakuru", defaultRate: 2.8, avgScore: 72, activeLoan: 19, weatherRisk: "Low", trend: "improving" },
  { region: "Kisumu", defaultRate: 5.6, avgScore: 61, activeLoan: 14, weatherRisk: "Medium", trend: "worsening" },
  { region: "Meru", defaultRate: 0.9, avgScore: 84, activeLoan: 16, weatherRisk: "Low", trend: "stable" },
  { region: "Nyandarua", defaultRate: 3.4, avgScore: 68, activeLoan: 11, weatherRisk: "Medium", trend: "stable" },
  { region: "Kiambu", defaultRate: 4.1, avgScore: 65, activeLoan: 9, weatherRisk: "Low", trend: "worsening" },
];

const cropRisk = [
  { crop: "Maize", borrowers: 48, defaultRate: 2.1, avgLoan: "KES 95K", risk: "Low" },
  { crop: "Tea", borrowers: 22, defaultRate: 0.8, avgLoan: "KES 380K", risk: "Low" },
  { crop: "Rice", borrowers: 18, defaultRate: 6.4, avgLoan: "KES 142K", risk: "High" },
  { crop: "Tomatoes", borrowers: 34, defaultRate: 3.9, avgLoan: "KES 88K", risk: "Medium" },
  { crop: "Coffee", borrowers: 12, defaultRate: 2.5, avgLoan: "KES 210K", risk: "Low" },
  { crop: "Wheat", borrowers: 8, defaultRate: 8.2, avgLoan: "KES 76K", risk: "High" },
];

export default function LenderAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Risk Analytics</h1>
        <p className="text-sm text-slate-500">Portfolio risk distribution and trend analysis</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Activity, label: "Portfolio Default Rate", value: "3.2%", color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950" },
          { icon: TrendingDown, label: "Non-Performing Loans", value: "4", color: "text-red-600", bg: "bg-red-50 dark:bg-red-950" },
          { icon: Cloud, label: "Weather Risk Exposure", value: "18%", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950" },
          { icon: BarChart2, label: "Avg. Credit Score", value: "73.4", color: "text-green-600", bg: "bg-green-50 dark:bg-green-950" },
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

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold flex items-center gap-2"><MapPin className="w-4 h-4" /> Risk by Region</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {riskMetrics.map((r) => (
                <div key={r.region} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{r.region}</p>
                    <p className="text-xs text-slate-400">{r.activeLoan} active loans • Weather: {r.weatherRisk}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className={`text-sm font-bold ${r.defaultRate > 4 ? "text-red-600" : r.defaultRate > 2 ? "text-amber-600" : "text-green-600"}`}>{r.defaultRate}%</p>
                      <p className="text-xs text-slate-400">default rate</p>
                    </div>
                    <Badge variant={r.trend === "improving" ? "success" : r.trend === "worsening" ? "destructive" : "secondary"} className="text-xs capitalize">{r.trend}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">Risk by Crop Type</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {cropRisk.map((c) => (
                <div key={c.crop} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{c.crop}</p>
                    <p className="text-xs text-slate-400">{c.borrowers} borrowers • Avg: {c.avgLoan}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className={`text-sm font-bold ${c.defaultRate > 5 ? "text-red-600" : c.defaultRate > 3 ? "text-amber-600" : "text-green-600"}`}>{c.defaultRate}%</p>
                    <Badge variant={c.risk === "Low" ? "success" : c.risk === "Medium" ? "warning" : "destructive"} className="text-xs">{c.risk}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold">Default Rate Trend (6 months)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 h-28">
            {[2.8, 3.5, 4.1, 3.8, 3.4, 3.2].map((rate, i) => {
              const labels = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb"];
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="flex-1 flex items-end w-full">
                    <div
                      className={`w-full rounded-t-md ${rate > 4 ? "bg-red-400" : rate > 3 ? "bg-amber-400" : "bg-green-400"}`}
                      style={{ height: `${(rate / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-400">{labels[i]}</span>
                  <span className="text-xs font-medium text-slate-600">{rate}%</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500" /> Risk Alerts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            { severity: "High", message: "Kisumu region default rate exceeded 5% threshold — review 3 borderline accounts", time: "2 hours ago" },
            { severity: "Medium", message: "El Niño forecast may affect 12 borrowers in Kisumu and Homabay counties", time: "1 day ago" },
            { severity: "Low", message: "Wheat borrowers in Uasin Gishu showing yield stress — consider loan restructuring", time: "3 days ago" },
          ].map(({ severity, message, time }) => (
            <div key={message} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <AlertTriangle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${severity === "High" ? "text-red-500" : severity === "Medium" ? "text-amber-500" : "text-blue-400"}`} />
              <div className="flex-1">
                <p className="text-sm text-slate-700 dark:text-slate-300">{message}</p>
                <p className="text-xs text-slate-400">{time}</p>
              </div>
              <Badge variant={severity === "High" ? "destructive" : severity === "Medium" ? "warning" : "info"} className="text-xs">{severity}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
