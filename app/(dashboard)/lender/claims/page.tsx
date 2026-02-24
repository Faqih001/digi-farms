import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Search, Eye, CheckCircle, XCircle, Clock, DollarSign, AlertTriangle } from "lucide-react";

const claims = [
  { id: "CL-408", farmer: "Peter Odhiambo", county: "Kisumu", loanId: "LN-1018", type: "Flood Damage", description: "Flooding caused complete crop loss - 15 acres of rice destroyed", amount: "KES 94,500", date: "Feb 18, 2026", status: "Under Review", insurer: "APA Insurance", evidence: 4 },
  { id: "CL-407", farmer: "Alice Chebet", county: "Uasin Gishu", loanId: "LN-1025", type: "Drought", description: "Prolonged drought resulted in 60% crop failure - wheat crop", amount: "KES 38,400", date: "Feb 12, 2026", status: "Approved", insurer: "CIC Agriculture", evidence: 6 },
  { id: "CL-406", farmer: "John Kamau", county: "Nakuru", loanId: "LN-1021", type: "Pest Outbreak", description: "Fall armyworm infestation across 8 acres of maize", amount: "KES 62,000", date: "Feb 5, 2026", status: "Paid", insurer: "APA Insurance", evidence: 3 },
  { id: "CL-405", farmer: "Grace Akinyi", county: "Nairobi", loanId: "LN-1019", type: "Hailstorm", description: "Severe hailstorm destroyed greenhouse infrastructure and produce", amount: "KES 28,750", date: "Jan 28, 2026", status: "Rejected", insurer: "UAP Old Mutual", evidence: 2 },
  { id: "CL-404", farmer: "David Njoroge", county: "Nyandarua", loanId: "LN-1012", type: "Price Collapse", description: "Tomato market price dropped 70% causing revenue shortfall", amount: "KES 52,000", date: "Jan 20, 2026", status: "Paid", insurer: "CIC Agriculture", evidence: 5 },
];

const statusConfig: Record<string, { variant: "success" | "warning" | "destructive" | "info"; icon: typeof CheckCircle }> = {
  "Under Review": { variant: "warning", icon: Clock },
  Approved: { variant: "success", icon: CheckCircle },
  Paid: { variant: "info", icon: DollarSign },
  Rejected: { variant: "destructive", icon: XCircle },
};

export default function ClaimsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Insurance Claims</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Manage crop and loan insurance claims</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Claims", value: "28", color: "text-slate-700" },
          { label: "Under Review", value: "6", color: "text-amber-600" },
          { label: "Approved (MTD)", value: "5", color: "text-green-600" },
          { label: "Total Paid Out", value: "KES 1.2M", color: "text-blue-600" },
        ].map(({ label, value, color }) => (
          <Card key={label}>
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Search claims..." />
            </div>
            <select className="h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm">
              <option>All Status</option>
              <option>Under Review</option>
              <option>Approved</option>
              <option>Paid</option>
              <option>Rejected</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {claims.map((c: any) => {
          const sc = statusConfig[c.status];
          const Icon = sc.icon;
          return (
            <Card key={c.id}>
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Shield className="w-4 h-4 text-blue-500" />
                      <span className="font-bold text-slate-900 dark:text-white">{c.farmer}</span>
                      <Badge variant={sc.variant} className="text-xs">{c.status}</Badge>
                    </div>
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{c.type} — {c.id} / {c.loanId}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{c.description}</p>
                    <p className="text-xs text-slate-400 mt-1">{c.county} • {c.insurer} • {c.evidence} evidence files • Filed: {c.date}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div className="text-center min-w-[100px]">
                      <p className="text-lg font-bold text-slate-900 dark:text-white">{c.amount}</p>
                      <p className="text-xs text-slate-400">Claim Amount</p>
                    </div>
                    <div className="flex gap-1.5">
                      <Button variant="outline" size="sm"><Eye className="w-3 h-3 mr-1" /> View</Button>
                      {c.status === "Under Review" && (
                        <>
                          <Button size="sm" variant="default"><CheckCircle className="w-3 h-3" /></Button>
                          <Button size="sm" variant="destructive"><XCircle className="w-3 h-3" /></Button>
                        </>
                      )}
                    </div>
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
