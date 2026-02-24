import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, BarChart2, TrendingUp, Users, Leaf, Calendar } from "lucide-react";

const reports = [
  { name: "Monthly Platform Overview", description: "Comprehensive platform metrics including user growth, revenue, and engagement KPIs.", period: "February 2026", generated: "Mar 1, 2026", type: "Executive", size: "2.4 MB" },
  { name: "Farmer Activity Report", description: "Farmer usage patterns, crop diagnostics, marketplace transactions, and loan applications.", period: "Q1 2026", generated: "Feb 28, 2026", type: "Farmer", size: "5.1 MB" },
  { name: "Supplier Marketplace Analytics", description: "Product performance, order volumes, revenue by supplier, and inventory metrics.", period: "February 2026", generated: "Mar 1, 2026", type: "Supplier", size: "3.8 MB" },
  { name: "Loan Portfolio Report", description: "Disbursements, repayments, default rates, and credit score distributions by region.", period: "February 2026", generated: "Mar 1, 2026", type: "Lender", size: "4.2 MB" },
  { name: "AI Model Performance", description: "Accuracy metrics, prediction volumes, and model drift analysis across all AI systems.", period: "February 2026", generated: "Mar 1, 2026", type: "Technical", size: "1.8 MB" },
  { name: "Revenue & Financial Summary", description: "Platform revenue breakdown by source, subscription MRR, and payment analytics.", period: "Q1 2026", generated: "Feb 28, 2026", type: "Financial", size: "2.9 MB" },
];

const typeColors: Record<string, string> = {
  Executive: "text-purple-600 bg-purple-50 dark:bg-purple-950",
  Farmer: "text-green-600 bg-green-50 dark:bg-green-950",
  Supplier: "text-blue-600 bg-blue-50 dark:bg-blue-950",
  Lender: "text-amber-600 bg-amber-50 dark:bg-amber-950",
  Technical: "text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800",
  Financial: "text-red-600 bg-red-50 dark:bg-red-950",
};

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Reports</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Platform analytics reports and data exports</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700 text-white w-fit"><FileText className="w-4 h-4 mr-2" /> Generate Report</Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: BarChart2, label: "Reports Generated (MTD)", value: "48", color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-950" },
          { icon: Download, label: "Downloads (MTD)", value: "312", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950" },
          { icon: Calendar, label: "Scheduled Reports", value: "6", color: "text-green-600", bg: "bg-green-50 dark:bg-green-950" },
          { icon: TrendingUp, label: "Data Export Volume", value: "184 MB", color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950" },
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
        {reports.map((r: any) => (
          <Card key={r.name}>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${typeColors[r.type]}`}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{r.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">{r.description}</p>
                    <p className="text-xs text-slate-400 mt-1">Period: {r.period} • Generated: {r.generated} • {r.size}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm"><FileText className="w-3 h-3 mr-1" /> Preview</Button>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white"><Download className="w-3 h-3 mr-1" /> Download</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold">Scheduled Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { name: "Weekly Active Users", schedule: "Every Monday 08:00 EAT", recipients: "admin@digifarms.co.ke", next: "Mar 3, 2026" },
              { name: "Monthly Revenue Summary", schedule: "1st of each month", recipients: "cfo@digifarms.co.ke", next: "Mar 1, 2026" },
              { name: "Quarterly Farmer Outcomes", schedule: "End of each quarter", recipients: "board@digifarms.co.ke", next: "Mar 31, 2026" },
            ].map(({ name, schedule, recipients, next }) => (
              <div key={name} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{name}</p>
                  <p className="text-xs text-slate-400">{schedule} • To: {recipients}</p>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Next: {next}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
