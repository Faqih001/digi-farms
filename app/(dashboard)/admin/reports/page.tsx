"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FileText, Download, BarChart2, TrendingUp, Calendar, X, Loader2, CheckCircle, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import AIInsightPanel from "@/components/dashboard/ai-insight-panel";

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

const REPORT_TYPES = ["Executive", "Farmer", "Supplier", "Lender", "Technical", "Financial"];
const PERIODS = ["Current Month", "Last Month", "Last Quarter", "Q1 2026", "Q2 2026", "YTD 2026", "Custom Range"];

export default function AdminReportsPage() {
  const [showGenerate, setShowGenerate] = useState(false);
  const [generateForm, setGenerateForm] = useState({ type: "Executive", period: "Current Month", recipients: "" });
  const [isPending, startTransition] = useTransition();
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);

  function handleGenerate() {
    startTransition(async () => {
      // Simulate report generation
      await new Promise(r => setTimeout(r, 1500));
      const name = `${generateForm.type} Report — ${generateForm.period}`;
      setGeneratedReport(name);
      setShowGenerate(false);
      toast.success(`"${name}" generated successfully`);
    });
  }

  function handleDownload(reportName: string) {
    toast.success(`Downloading "${reportName}"…`);
  }

  function handlePreview(reportName: string) {
    toast.info(`Opening preview for "${reportName}"…`);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Reports</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Platform analytics reports and data exports</p>
        </div>
        <Button onClick={() => setShowGenerate(true)} className="bg-green-600 hover:bg-green-700 text-white w-fit">
          <FileText className="w-4 h-4 mr-2" /> Generate Report
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: BarChart2, label: "Reports (MTD)", value: reports.length + (generatedReport ? 1 : 0), color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-950" },
          { icon: Download, label: "Downloads (MTD)", value: "312", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950" },
          { icon: Calendar, label: "Scheduled", value: "6", color: "text-green-600", bg: "bg-green-50 dark:bg-green-950" },
          { icon: TrendingUp, label: "Export Volume", value: "184 MB", color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950" },
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

      {/* Newly generated report banner */}
      {generatedReport && (
        <div className="flex items-center gap-3 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 rounded-xl p-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-green-800 dark:text-green-300">New report ready</p>
            <p className="text-xs text-green-600 dark:text-green-400">{generatedReport}</p>
          </div>
          <Button size="sm" onClick={() => handleDownload(generatedReport)} className="bg-green-600 hover:bg-green-700 text-white">
            <Download className="w-3 h-3 mr-1" /> Download
          </Button>
          <button onClick={() => setGeneratedReport(null)} className="p-1 rounded hover:bg-green-100 dark:hover:bg-green-900">
            <X className="w-4 h-4 text-green-600" />
          </button>
        </div>
      )}

      <div className="grid gap-4">
        {reports.map((r) => (
          <Card key={r.name}>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${typeColors[r.type]}`}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{r.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">{r.description}</p>
                    <p className="text-xs text-slate-400 mt-1">Period: {r.period} • Generated: {r.generated} • {r.size}</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button variant="outline" size="sm" onClick={() => handlePreview(r.name)}>
                    <FileText className="w-3 h-3 mr-1" /> Preview
                  </Button>
                  <Button size="sm" onClick={() => handleDownload(r.name)} className="bg-green-600 hover:bg-green-700 text-white">
                    <Download className="w-3 h-3 mr-1" /> Download
                  </Button>
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
                <p className="text-xs text-slate-500 dark:text-slate-400 flex-shrink-0">Next: {next}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <AIInsightPanel
        module="admin_reports"
        contextData={JSON.stringify({
          totalReports: reports.length,
          reportTypes: reports.map(r => r.type),
          scheduledReports: 3,
          mostRecentReport: reports[0]?.name,
        })}
        title="AI Report Generator Assistant"
        description="Let AI draft report narratives, identify key KPIs to track, or suggest new report types"
        defaultPrompt="Based on the available platform reports, what are the most critical KPIs to monitor? Which report types would be most valuable to add? Provide a concise executive summary of what these reports should highlight."
      />

      {/* Generate Report Modal */}
      {showGenerate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => !isPending && setShowGenerate(false)} />
          <div className="relative z-10 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-base font-bold">Generate Report</h2>
              {!isPending && <button onClick={() => setShowGenerate(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><X className="w-5 h-5" /></button>}
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <Label>Report Type</Label>
                <div className="relative">
                  <select
                    value={generateForm.type}
                    onChange={e => setGenerateForm(f => ({ ...f, type: e.target.value }))}
                    disabled={isPending}
                    className="w-full h-10 pl-3 pr-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none"
                  >
                    {REPORT_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Period</Label>
                <div className="relative">
                  <select
                    value={generateForm.period}
                    onChange={e => setGenerateForm(f => ({ ...f, period: e.target.value }))}
                    disabled={isPending}
                    className="w-full h-10 pl-3 pr-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none"
                  >
                    {PERIODS.map(p => <option key={p}>{p}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Send to (email, optional)</Label>
                <input
                  type="email"
                  value={generateForm.recipients}
                  onChange={e => setGenerateForm(f => ({ ...f, recipients: e.target.value }))}
                  disabled={isPending}
                  placeholder="admin@digifarms.co.ke"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <Button variant="outline" onClick={() => setShowGenerate(false)} disabled={isPending}>Cancel</Button>
                <Button onClick={handleGenerate} disabled={isPending} className="bg-green-600 hover:bg-green-700 text-white">
                  {isPending ? <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Generating…</> : <><FileText className="w-4 h-4 mr-1" /> Generate</>}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
