import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Cpu, Activity, AlertTriangle, Leaf, TrendingUp, Eye, RefreshCw } from "lucide-react";

const aiModels = [
  { name: "Crop Disease Detection", version: "v4.2.1", accuracy: 97.3, requests: 142840, status: "Operational", lastUpdate: "Feb 10, 2026", type: "Vision AI" },
  { name: "Yield Forecast Engine", version: "v3.1.0", accuracy: 94.1, requests: 38420, status: "Operational", lastUpdate: "Jan 28, 2026", type: "Predictive ML" },
  { name: "AI Credit Scoring", version: "v2.5.3", accuracy: 91.8, requests: 12480, status: "Operational", lastUpdate: "Feb 5, 2026", type: "Risk ML" },
  { name: "Soil Analysis Classifier", version: "v2.0.4", accuracy: 96.5, requests: 58210, status: "Operational", lastUpdate: "Feb 18, 2026", type: "Analytical AI" },
  { name: "Smart Irrigation Advisor", version: "v1.8.0", accuracy: 88.4, requests: 24310, status: "Degraded", lastUpdate: "Jan 15, 2026", type: "Recommendation" },
  { name: "Pest Prediction Model", version: "v2.2.0", accuracy: 92.7, requests: 19080, status: "Operational", lastUpdate: "Feb 12, 2026", type: "Predictive ML" },
];

const recentAlerts = [
  { model: "Smart Irrigation Advisor", level: "Warning", message: "Model accuracy dropped to 88.4% — retraining scheduled for Mar 1, 2026", time: "2 days ago" },
  { model: "Crop Disease Detection", level: "Info", message: "New disease pattern detected: Anthracnose surge in Central Kenya — dataset updated", time: "5 days ago" },
  { model: "AI Credit Scoring", level: "Info", message: "Model v2.5.3 deployed — improved accuracy for smallholder farmer profiles", time: "Feb 5, 2026" },
];

export default function AdminAIPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">AI Systems</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Platform AI model health, usage, and management</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Brain, label: "Active Models", value: "6", color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-950" },
          { icon: Activity, label: "Total Requests (MTD)", value: "295K", color: "text-green-600", bg: "bg-green-50 dark:bg-green-950" },
          { icon: Cpu, label: "Avg. Accuracy", value: "93.5%", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950" },
          { icon: AlertTriangle, label: "Degraded Models", value: "1", color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950" },
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

      <div className="grid gap-4">
        {aiModels.map((m: any) => (
          <Card key={m.name}>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{m.name}</p>
                    <p className="text-xs text-slate-400">{m.type} • {m.version} • Updated: {m.lastUpdate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center hidden sm:block">
                    <p className="text-lg font-bold text-green-600">{m.accuracy}%</p>
                    <p className="text-xs text-slate-400">Accuracy</p>
                  </div>
                  <div className="text-center hidden sm:block">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{m.requests.toLocaleString()}</p>
                    <p className="text-xs text-slate-400">Requests</p>
                  </div>
                  <Badge variant={m.status === "Operational" ? "success" : "warning"} className="text-xs">{m.status}</Badge>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm"><Eye className="w-3 h-3" /></Button>
                    <Button variant="ghost" size="sm"><RefreshCw className="w-3 h-3" /></Button>
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Model Confidence</span>
                  <span className="text-slate-600 dark:text-slate-400">{m.accuracy}%</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${m.accuracy >= 95 ? "bg-green-500" : m.accuracy >= 90 ? "bg-blue-500" : "bg-amber-500"}`}
                    style={{ width: `${m.accuracy}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500" /> AI Alert Log</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {recentAlerts.map(({ model, level, message, time }) => (
            <div key={message} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <AlertTriangle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${level === "Warning" ? "text-amber-500" : "text-blue-400"}`} />
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-0.5">{model}</p>
                <p className="text-sm text-slate-700 dark:text-slate-300">{message}</p>
                <p className="text-xs text-slate-400">{time}</p>
              </div>
              <Badge variant={level === "Warning" ? "warning" : "info"} className="text-xs">{level}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
