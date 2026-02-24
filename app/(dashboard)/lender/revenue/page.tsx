import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, Percent, ArrowUpRight } from "lucide-react";

const months = [
  { month: "Sep 2025", disbursed: 4200000, repaid: 1800000, interest: 210000, fees: 42000, net: 252000 },
  { month: "Oct 2025", disbursed: 5800000, repaid: 2400000, interest: 290000, fees: 58000, net: 348000 },
  { month: "Nov 2025", disbursed: 3900000, repaid: 3100000, interest: 195000, fees: 39000, net: 234000 },
  { month: "Dec 2025", disbursed: 7200000, repaid: 2900000, interest: 360000, fees: 72000, net: 432000 },
  { month: "Jan 2026", disbursed: 6100000, repaid: 4200000, interest: 305000, fees: 61000, net: 366000 },
  { month: "Feb 2026", disbursed: 8400000, repaid: 5600000, interest: 420000, fees: 84000, net: 504000 },
];

function fmt(n: number) {
  if (n >= 1_000_000) return `KES ${(n / 1_000_000).toFixed(1)}M`;
  return `KES ${(n / 1000).toFixed(0)}K`;
}

const maxNet = Math.max(...months.map((m) => m.net));

export default function LenderRevenuePage() {
  const totalInterest = months.reduce((s, m) => s + m.interest, 0);
  const totalFees = months.reduce((s, m) => s + m.fees, 0);
  const totalNet = months.reduce((s, m) => s + m.net, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Revenue</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Interest income, fees, and net earnings</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: DollarSign, label: "Total Net Revenue (6mo)", value: fmt(totalNet), color: "text-green-600", bg: "bg-green-50 dark:bg-green-950" },
          { icon: Percent, label: "Total Interest (6mo)", value: fmt(totalInterest), color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950" },
          { icon: TrendingUp, label: "Total Fees (6mo)", value: fmt(totalFees), color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-950" },
          { icon: ArrowUpRight, label: "Avg. Interest Rate", value: "11.8%", color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950" },
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
          <CardTitle className="text-base font-bold">Net Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 h-32">
            {months.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="flex-1 flex items-end w-full">
                  <div
                    className="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-t-md"
                    style={{ height: `${(m.net / maxNet) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-slate-400 whitespace-nowrap">{m.month.slice(0, 6)}</span>
              </div>
            ))}
          </div>
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
                  {["Month", "Disbursed", "Repaid", "Interest Income", "Fees", "Net Revenue"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {[...months].reverse().map((m) => (
                  <tr key={m.month} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">{m.month}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{fmt(m.disbursed)}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{fmt(m.repaid)}</td>
                    <td className="px-4 py-3 text-green-600 font-medium">{fmt(m.interest)}</td>
                    <td className="px-4 py-3 text-blue-600">{fmt(m.fees)}</td>
                    <td className="px-4 py-3 font-bold text-green-700">{fmt(m.net)}</td>
                  </tr>
                ))}
                <tr className="bg-slate-50 dark:bg-slate-800 font-semibold">
                  <td className="px-4 py-3 text-slate-800 dark:text-slate-200">Total</td>
                  <td className="px-4 py-3">{fmt(months.reduce((s, m) => s + m.disbursed, 0))}</td>
                  <td className="px-4 py-3">{fmt(months.reduce((s, m) => s + m.repaid, 0))}</td>
                  <td className="px-4 py-3 text-green-600">{fmt(totalInterest)}</td>
                  <td className="px-4 py-3 text-blue-600">{fmt(totalFees)}</td>
                  <td className="px-4 py-3 text-green-700">{fmt(totalNet)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">Revenue by Loan Type</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { type: "Input Financing", pct: 38, amount: "KES 768K" },
              { type: "Equipment Loans", pct: 25, amount: "KES 505K" },
              { type: "Working Capital", pct: 22, amount: "KES 445K" },
              { type: "Land Expansion", pct: 15, amount: "KES 303K" },
            ].map(({ type, pct, amount }) => (
              <div key={type}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 dark:text-slate-400">{type}</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{amount} ({pct}%)</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">Top Earning Counties</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { county: "Uasin Gishu", revenue: "KES 412K", loans: 18 },
              { county: "Nakuru", revenue: "KES 368K", loans: 15 },
              { county: "Meru", revenue: "KES 305K", loans: 12 },
              { county: "Kisumu", revenue: "KES 248K", loans: 10 },
              { county: "Kiambu", revenue: "KES 195K", loans: 8 },
            ].map(({ county, revenue, loans }) => (
              <div key={county} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{county}</span>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-600">{revenue}</p>
                  <p className="text-xs text-slate-400">{loans} loans</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
