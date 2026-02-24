import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Eye, CheckCircle, XCircle, Clock, Search, DollarSign } from "lucide-react";

const applications = [
  { id: "LA-3045", farmer: "John Kamau", county: "Nakuru", amount: "KES 150,000", purpose: "Input Financing", duration: "6 months", score: 82, status: "Under Review", date: "Feb 24, 2026", farm: "12 acres" },
  { id: "LA-3044", farmer: "Mary Wanjiku", county: "Kiambu", amount: "KES 85,000", purpose: "Equipment Lease", duration: "12 months", score: 76, status: "Approved", date: "Feb 23, 2026", farm: "8 acres" },
  { id: "LA-3043", farmer: "Peter Odhiambo", county: "Kisumu", amount: "KES 250,000", purpose: "Working Capital", duration: "9 months", score: 91, status: "Disbursed", date: "Feb 22, 2026", farm: "25 acres" },
  { id: "LA-3042", farmer: "Grace Akinyi", county: "Nairobi", amount: "KES 45,000", purpose: "Seed Purchase", duration: "4 months", score: 58, status: "Rejected", date: "Feb 21, 2026", farm: "2 acres" },
  { id: "LA-3041", farmer: "James Mwangi", county: "Meru", amount: "KES 500,000", purpose: "Land Expansion", duration: "24 months", score: 88, status: "Disbursed", date: "Feb 20, 2026", farm: "18 acres" },
  { id: "LA-3040", farmer: "Alice Chebet", county: "Uasin Gishu", amount: "KES 75,000", purpose: "Input Financing", duration: "6 months", score: 45, status: "Rejected", date: "Feb 19, 2026", farm: "5 acres" },
  { id: "LA-3039", farmer: "David Njoroge", county: "Nyandarua", amount: "KES 180,000", purpose: "Greenhouse", duration: "18 months", score: 79, status: "Under Review", date: "Feb 18, 2026", farm: "10 acres" },
];

const statusConfig: Record<string, { variant: "success" | "warning" | "destructive" | "info"; icon: typeof CheckCircle }> = {
  Approved: { variant: "success", icon: CheckCircle },
  Disbursed: { variant: "info", icon: DollarSign },
  "Under Review": { variant: "warning", icon: Clock },
  Rejected: { variant: "destructive", icon: XCircle },
};

export default function LoanApplicationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Loan Applications</h1>
          <p className="text-sm text-slate-500">Review and manage farmer loan requests</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Applications", value: "247", color: "text-green-600" },
          { label: "Under Review", value: "18", color: "text-amber-600" },
          { label: "Approved (MTD)", value: "12", color: "text-blue-600" },
          { label: "Rejected (MTD)", value: "5", color: "text-red-600" },
        ].map(({ label, value, color }) => (
          <Card key={label}>
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
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
              <input className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Search applications..." />
            </div>
            <select className="h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm">
              <option>All Status</option>
              <option>Under Review</option>
              <option>Approved</option>
              <option>Disbursed</option>
              <option>Rejected</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {applications.map((a) => {
              const sc = statusConfig[a.status];
              return (
                <div key={a.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">{a.farmer}</span>
                        <Badge variant={sc.variant} className="text-xs">{a.status}</Badge>
                        <span className="text-xs text-slate-400">{a.id}</span>
                      </div>
                      <p className="text-xs text-slate-500">{a.purpose} • {a.duration} • {a.county} • {a.farm}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-lg font-bold text-slate-900 dark:text-white">{a.amount}</p>
                        <p className="text-xs text-slate-400">Score: {a.score}/100</p>
                      </div>
                      <div className="flex gap-1.5">
                        <Button variant="outline" size="sm"><Eye className="w-3 h-3" /> Review</Button>
                        {a.status === "Under Review" && (
                          <>
                            <Button size="sm" variant="default"><CheckCircle className="w-3 h-3" /></Button>
                            <Button size="sm" variant="destructive"><XCircle className="w-3 h-3" /></Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
