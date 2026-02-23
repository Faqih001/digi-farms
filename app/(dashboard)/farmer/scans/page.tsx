import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScanLine, CheckCircle, AlertTriangle, AlertOctagon } from "lucide-react";

const scans = [
  { id: "SCN001", crop: "Maize", disease: "Fall Armyworm", severity: "HIGH", confidence: 95, date: "2025-07-28", status: "Treated" },
  { id: "SCN002", crop: "Tomato", disease: "Early Blight", severity: "MEDIUM", confidence: 89, date: "2025-07-20", status: "In Progress" },
  { id: "SCN003", crop: "Beans", disease: "Bean Fly", severity: "LOW", confidence: 76, date: "2025-07-15", status: "Treated" },
  { id: "SCN004", crop: "Maize", disease: "Nitrogen Deficiency", severity: "LOW", confidence: 84, date: "2025-07-10", status: "Treated" },
  { id: "SCN005", crop: "Tomato", disease: "Healthy Plant", severity: "NONE", confidence: 98, date: "2025-07-01", status: "OK" },
];

export default function ScanHistoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Scan History</h2>
          <p className="text-slate-500 text-sm">All your AI diagnostic scan results</p>
        </div>
        <div className="flex gap-2">
          {[["", "All"], ["HIGH", "High"], ["MEDIUM", "Medium"], ["LOW", "Low"]].map(([v, l]) => (
            <Badge key={l} variant={v === "HIGH" ? "destructive" : v === "MEDIUM" ? "warning" : v === "LOW" ? "success" : "secondary"} className="cursor-pointer px-3 py-1">{l}</Badge>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {scans.map((scan) => (
              <div key={scan.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  scan.severity === "HIGH" ? "bg-red-100 dark:bg-red-900/20" :
                  scan.severity === "MEDIUM" ? "bg-amber-100 dark:bg-amber-900/20" :
                  scan.severity === "NONE" ? "bg-green-100 dark:bg-green-900/20" : "bg-slate-100 dark:bg-slate-800"
                }`}>
                  {scan.severity === "HIGH" ? <AlertOctagon className="w-5 h-5 text-red-500" /> :
                   scan.severity === "MEDIUM" ? <AlertTriangle className="w-5 h-5 text-amber-500" /> :
                   scan.severity === "NONE" ? <CheckCircle className="w-5 h-5 text-green-500" /> :
                   <ScanLine className="w-5 h-5 text-slate-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-sm text-slate-900 dark:text-white">{scan.disease}</span>
                    <span className="text-xs text-slate-400">· {scan.crop}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>{scan.id}</span>
                    <span>·</span>
                    <span>{new Date(scan.date).toLocaleDateString("en-KE", { year: "numeric", month: "short", day: "numeric" })}</span>
                    <span>·</span>
                    <span>{scan.confidence}% confidence</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={
                    scan.severity === "HIGH" ? "destructive" : scan.severity === "MEDIUM" ? "warning" :
                    scan.severity === "NONE" ? "success" : "secondary"
                  } className="text-xs">{scan.severity === "NONE" ? "Healthy" : scan.severity}</Badge>
                  <Badge variant="outline" className="text-xs">{scan.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
