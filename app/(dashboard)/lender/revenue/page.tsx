"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, Percent, ArrowUpRight, RefreshCw } from "lucide-react";
import { getLenderRevenue } from "@/lib/actions/lender";

type Revenue = Awaited<ReturnType<typeof getLenderRevenue>>;

function fmt(n: number) {
  if (n >= 1_000_000) return `KES ${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `KES ${(n / 1_000).toFixed(0)}K`;
  return `KES ${n.toFixed(0)}`;
}

export default function LenderRevenuePage() {
  const [data, setData] = useState<Revenue | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getLenderRevenue();
      setData(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const months = data?.monthlyData ?? [];
  const maxRepaid = Math.max(...months.map((m) => m.totalRepaid), 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Revenue</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Loan repayments, interest income, and earnings</p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: DollarSign, label: "Total Repaid (6mo)", value: loading ? "..." : fmt(data?.totalRepaid ?? 0), color: "text-green-600", bg: "bg-green-50 dark:bg-green-950" },
          { icon: Percent, label: "Est. Interest Income", value: loading ? "..." : fmt((data?.totalRepaid ?? 0) * 0.05), color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950" },
          { icon: TrendingUp, label: "Total Disbursed", value: loading ? "..." : fmt(data?.totalDisbursed ?? 0), color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-950" },
          { icon: ArrowUpRight, label: "Avg. Interest Rate", value: loading ? "..." : `${(data?.avgInterestRate ?? 0).toFixed(1)}%`, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950" },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <Card key={label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <p className={`text-base font-bold ${color}`}>{value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold">Monthly Repayment Trend</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-32 flex items-center justify-center text-slate-400 text-sm">Loading…</div>
          ) : months.length === 0 ? (
            <div className="h-32 flex items-center justify-center text-slate-400 text-sm">No payment data yet.</div>
          ) : (
            <div className="flex items-end gap-2 h-32">
              {months.map((m) => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                  <div className="flex-1 flex items-end w-full">
                    <div
                      className="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-t-md"
                      style={{ height: `${(m.totalRepaid / maxRepaid) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-400 whitespace-nowrap">{m.month.slice(5)}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold">Monthly Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  {["Month", "Payments", "Total Repaid", "Est. Interest", "Loan Count"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading ? (
                  <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-400">Loading…</td></tr>
                ) : months.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-400">No repayment data yet.</td></tr>
                ) : (
                  <>
                    {[...months].reverse().map((m) => (
                      <tr key={m.month} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">
                          {new Date(m.month + "-01").toLocaleDateString("en-KE", { month: "short", year: "numeric" })}
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{m.paymentCount}</td>
                        <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">{fmt(m.totalRepaid)}</td>
                        <td className="px-4 py-3 text-green-600 font-medium">{fmt(m.interestEstimate)}</td>
                        <td className="px-4 py-3 text-slate-500">—</td>
                      </tr>
                    ))}
                    <tr className="bg-slate-50 dark:bg-slate-800 font-semibold">
                      <td className="px-4 py-3 text-slate-800 dark:text-slate-200">Total</td>
                      <td className="px-4 py-3">{months.reduce((s, m) => s + m.paymentCount, 0)}</td>
                      <td className="px-4 py-3">{fmt(data?.totalRepaid ?? 0)}</td>
                      <td className="px-4 py-3 text-green-600">{fmt((data?.totalRepaid ?? 0) * 0.05)}</td>
                      <td className="px-4 py-3">{data?.totalLoanCount ?? "—"} loans</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


