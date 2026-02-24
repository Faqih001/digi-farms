import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, ArrowUpRight, CreditCard, Calendar } from "lucide-react";

const monthlyRevenue = [
  { month: "Sep 2025", revenue: "KES 148,000", orders: 62, growth: "+8%" },
  { month: "Oct 2025", revenue: "KES 172,000", orders: 78, growth: "+16%" },
  { month: "Nov 2025", revenue: "KES 195,000", orders: 89, growth: "+13%" },
  { month: "Dec 2025", revenue: "KES 164,000", orders: 71, growth: "-16%" },
  { month: "Jan 2026", revenue: "KES 218,000", orders: 95, growth: "+33%" },
  { month: "Feb 2026", revenue: "KES 245,000", orders: 108, growth: "+12%" },
];

export default function RevenuePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Revenue</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Track your earnings and financial performance</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "This Month", value: "KES 245K", change: "+12%", icon: DollarSign, color: "text-green-600 bg-green-100 dark:bg-green-900/30" },
          { label: "Last 6 Months", value: "KES 1.14M", change: "+24%", icon: TrendingUp, color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30" },
          { label: "Lifetime", value: "KES 3.2M", change: "", icon: CreditCard, color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30" },
          { label: "Pending Payouts", value: "KES 82K", change: "", icon: Calendar, color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30" },
        ].map(({ label, value, change, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}><Icon className="w-5 h-5" /></div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{value}</p>
                  {change && <Badge variant="success" className="text-xs mt-0.5"><ArrowUpRight className="w-3 h-3" /> {change}</Badge>}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Monthly Revenue Breakdown</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left p-3 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase">Month</th>
                  <th className="text-left p-3 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase">Revenue</th>
                  <th className="text-left p-3 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase">Orders</th>
                  <th className="text-left p-3 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase">Growth</th>
                </tr>
              </thead>
              <tbody>
                {monthlyRevenue.map((m) => (
                  <tr key={m.month} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="p-3 font-medium text-slate-900 dark:text-white">{m.month}</td>
                    <td className="p-3 font-bold text-green-600">{m.revenue}</td>
                    <td className="p-3 text-slate-500 dark:text-slate-400">{m.orders}</td>
                    <td className="p-3">
                      <Badge variant={m.growth.startsWith("+") ? "success" : "destructive"} className="text-xs">{m.growth}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Revenue by Payment Method</CardTitle></CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { method: "M-Pesa", share: 68, amount: "KES 166K" },
              { method: "Bank Transfer", share: 24, amount: "KES 59K" },
              { method: "Card", share: 8, amount: "KES 20K" },
            ].map(({ method, share, amount }) => (
              <div key={method} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-center">
                <p className="font-semibold text-slate-900 dark:text-white">{method}</p>
                <p className="text-2xl font-bold text-green-600 my-1">{share}%</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{amount} this month</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
