import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Droplets, AlertTriangle, CheckCircle, Info } from "lucide-react";

const plotData = [
  { plot: "Plot A", ph: 6.2, nitrogen: 72, phosphorus: 45, potassium: 88, moisture: 64, status: "Good" },
  { plot: "Plot B", ph: 5.1, nitrogen: 35, phosphorus: 22, potassium: 60, moisture: 48, status: "Needs Attention" },
  { plot: "Plot C", ph: 6.8, nitrogen: 85, phosphorus: 70, potassium: 92, moisture: 71, status: "Excellent" },
];

export default function SoilHealthPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Soil Health</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Monitor soil nutrient levels and pH across your farm plots</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {plotData.map(({ plot, ph, nitrogen, phosphorus, potassium, moisture, status }) => (
          <Card key={plot} className={`border-2 ${status === "Excellent" ? "border-green-200 dark:border-green-800" : status === "Needs Attention" ? "border-amber-200 dark:border-amber-800" : "border-slate-200 dark:border-slate-700"}`}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{plot}</CardTitle>
                <Badge variant={status === "Excellent" ? "success" : status === "Needs Attention" ? "warning" : "secondary"}>{status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Soil pH</span>
                <span className={`font-bold ${ph < 5.5 || ph > 7.5 ? "text-red-500" : ph < 6.0 ? "text-amber-500" : "text-green-600"}`}>{ph}</span>
              </div>
              {[
                { label: "Nitrogen (N)", value: nitrogen, color: "bg-blue-500" },
                { label: "Phosphorus (P)", value: phosphorus, color: "bg-amber-500" },
                { label: "Potassium (K)", value: potassium, color: "bg-green-500" },
                { label: "Moisture", value: moisture, color: "bg-cyan-500" },
              ].map(({ label, value, color }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500 dark:text-slate-400">{label}</span>
                    <span className="font-medium">{value}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Soil Recommendations</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {[
            { icon: AlertTriangle, plot: "Plot B", msg: "Apply lime at 2 tons/acre to raise pH from 5.1 to optimal 6.0–7.0", type: "warning" },
            { icon: Info, plot: "Plot B", msg: "Nitrogen deficiency detected. Apply CAN fertilizer at 50kg/acre", type: "info" },
            { icon: CheckCircle, plot: "Plot C", msg: "Soil nutrients are optimal. Continue current management practices", type: "success" },
          ].map(({ icon: Icon, plot, msg, type }) => (
            <div key={msg} className={`flex items-start gap-3 p-3 rounded-xl border ${type === "warning" ? "bg-amber-50 border-amber-100 dark:bg-amber-950/20 dark:border-amber-900" : type === "success" ? "bg-green-50 border-green-100 dark:bg-green-950/20 dark:border-green-900" : "bg-blue-50 border-blue-100 dark:bg-blue-950/20 dark:border-blue-900"}`}>
              <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${type === "warning" ? "text-amber-500" : type === "success" ? "text-green-500" : "text-blue-500"}`} />
              <div>
                <span className="font-semibold text-sm">{plot}: </span>
                <span className="text-sm text-slate-600 dark:text-slate-400">{msg}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button>Order Soil Test Kit</Button>
        <Button variant="outline">Download Report</Button>
      </div>
    </div>
  );
}
