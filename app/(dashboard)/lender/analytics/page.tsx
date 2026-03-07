"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart2, TrendingDown, AlertTriangle, Activity, Cloud, RefreshCw } from "lucide-react";
import { getLenderAnalytics } from "@/lib/actions/lender";
import AIInsightPanel from "@/components/dashboard/ai-insight-panel";

type Analytics = Awaited<ReturnType<typeof getLenderAnalytics>>;

function StatCard({ icon: Icon, label, value, color, bg }: { icon: React.ElementType; label: string; value: string; color: string; bg: string }) {
  return (
    <Card>
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
  );
}

export default function LenderAnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getLenderAnalytics();
      setData(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const statusLabels: Record<string, string> = {
    DRAFT: "Draft", SUBMITTED: "Submitted", UNDER_REVIEW: "Under Review",
    APPROVED: "Approved", REJECTED: "Rejected", DISBURSED: "Disbursed",
    REPAID: "Repaid", DEFAULTED: "Defaulted",
  };

  const riskEntries = data ? Object.entries(data.riskDistribution) : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Risk Analytics</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Portfolio risk distribution and trend analysis</p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Activity} label="Default Rate" value={loading ? "..." : `${data?.defaultRate ?? 0}%`} color="text-amber-600" bg="bg-amber-50 dark:bg-amber-950" />
        <StatCard icon={TrendingDown} label="Defaulted Loans" value={loading ? "..." : String(data?.defaultedLoans ?? 0)} color="text-red-600" bg="bg-red-50 dark:bg-red-950" />
        <StatCard icon={Cloud} label="Active Loans" value={loading ? "..." : String(data?.activeLoans ?? 0)} color="text-blue-600" bg="bg-blue-50 dark:bg-blue-950" />
        <StatCard icon={BarChart2} label="Avg. Credit Score" value={loading ? "..." : String(data?.avgCreditScore ?? 0)} color="text-green-600" bg="bg-green-50 dark:bg-green-950" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">Loans by Status</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6 text-center text-slate-400 text-sm">Loading…</div>
            ) : data?.loansByStatus.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-sm">No loan data yet.</div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {data?.loansByStatus.map((row) => (
                  <div key={row.status} className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{statusLabels[row.status] ?? row.status}</p>
                      <p className="text-xs text-slate-400">{row._count.status} loan(s)</p>
                    </div>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      KES {((row._sum.amount ?? 0) / 1000).toFixed(0)}K
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">Risk Level Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="p-6 text-center text-slate-400 text-sm">Loading…</div>
            ) : riskEntries.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-sm">No credit score data yet.</div>
            ) : (
              <div className="space-y-3">
                {riskEntries.map(([level, count]) => {
                  const total = riskEntries.reduce((s, [, c]) => s + c, 0);
                  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                  const color = level === "low" ? "bg-green-500" : level === "medium" ? "bg-amber-500" : "bg-red-500";
                  return (
                    <div key={level}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-600 dark:text-slate-400 capitalize">{level} Risk</span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">{count} ({pct}%)</span>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold">Recent Loan Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center text-slate-400 text-sm py-6">Loading…</div>
          ) : (data?.recentLoans ?? []).length === 0 ? (
            <div className="text-center text-slate-400 text-sm py-6">No loans recorded yet.</div>
          ) : (
            <div className="flex items-end gap-2 h-28">
              {(data?.recentLoans ?? []).map((l, i) => {
                const maxAmt = Math.max(...(data?.recentLoans ?? []).map((x) => x.amount), 1);
                const pct = (l.amount / maxAmt) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="flex-1 flex items-end w-full">
                      <div
                        className={`w-full rounded-t-md ${l.status === "DEFAULTED" ? "bg-red-400" : l.status === "REPAID" ? "bg-green-400" : "bg-blue-400"}`}
                        style={{ height: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-400">{new Date(l.createdAt).toLocaleDateString("en-KE", { month: "short" })}</span>
                    <span className="text-xs text-slate-500">{(l.amount / 1000).toFixed(0)}K</span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" /> Risk Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {loading ? (
            <div className="text-center text-slate-400 text-sm py-4">Loading…</div>
          ) : (
            <>
              {(data?.defaultedLoans ?? 0) > 0 && (
                <div className="flex items-start gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-950/30">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-500" />
                  <div className="flex-1">
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      {data?.defaultedLoans} defaulted loan(s) require immediate attention
                    </p>
                  </div>
                  <Badge variant="destructive" className="text-xs">High</Badge>
                </div>
              )}
              {(data?.defaultRate ?? 0) > 5 && (
                <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-500" />
                  <div className="flex-1">
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      Portfolio default rate at {data?.defaultRate}% — above 5% threshold
                    </p>
                  </div>
                  <Badge variant="warning" className="text-xs">Medium</Badge>
                </div>
              )}
              {(data?.defaultedLoans ?? 0) === 0 && (data?.activeLoans ?? 0) > 0 && (
                <div className="flex items-start gap-3 p-3 rounded-xl bg-green-50 dark:bg-green-950/30">
                  <Activity className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-500" />
                  <div className="flex-1">
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      Portfolio is healthy — {data?.activeLoans} active loans, 0 defaults
                    </p>
                  </div>
                  <Badge variant="success" className="text-xs">Good</Badge>
                </div>
              )}
              {(data?.totalLoans ?? 0) === 0 && (
                <div className="p-3 text-center text-slate-400 text-sm">No loan data available yet.</div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <AIInsightPanel
        module="lender_analytics"
        contextData={loading || !data ? "{}" : JSON.stringify({
          defaultRate: data.defaultRate,
          defaultedLoans: data.defaultedLoans,
          activeLoans: data.activeLoans,
          avgCreditScore: data.avgCreditScore,
          riskDistribution: data.riskDistribution,
          loansByStatus: data.loansByStatus.map((r) => ({ status: r.status, count: r._count.status, totalKES: r._sum.amount })),
          recentLoans: data.recentLoans.slice(0, 10).map((l) => ({ status: l.status, amount: l.amount })),
        })}
        title="Portfolio Risk Analysis"
        description="AI-powered insights on your lending portfolio health"
        defaultPrompt="Analyze this portfolio's risk profile. Identify concerning trends, highest-risk segments, and provide actionable recommendations to reduce default rates and improve portfolio health."
      />
    </div>
  );
}
