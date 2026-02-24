import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, CreditCard, TrendingUp, Users, Eye } from "lucide-react";

const subscribers = [
  { user: "John Kamau", role: "FARMER", plan: "Pro", price: "KES 2,999/mo", since: "Jan 1, 2025", renews: "Mar 1, 2026", status: "Active", usage: 78 },
  { user: "Wanjiku Agro", role: "SUPPLIER", plan: "Enterprise", price: "KES 12,999/mo", since: "Feb 15, 2024", renews: "Mar 15, 2026", status: "Active", usage: 92 },
  { user: "Equity Agri Finance", role: "LENDER", plan: "Enterprise", price: "KES 24,999/mo", since: "Jan 8, 2024", renews: "Mar 8, 2026", status: "Active", usage: 65 },
  { user: "Grace Akinyi", role: "FARMER", plan: "Free", price: "KES 0/mo", since: "Mar 5, 2025", renews: "N/A", status: "Active", usage: 34 },
  { user: "KCB AgriFinance", role: "LENDER", plan: "Enterprise", price: "KES 24,999/mo", since: "Feb 15, 2025", renews: "Mar 15, 2026", status: "Active", usage: 81 },
  { user: "Peter Ochieng", role: "SUPPLIER", plan: "Pro", price: "KES 5,999/mo", since: "Apr 10, 2025", renews: "Mar 10, 2026", status: "Past Due", usage: 48 },
  { user: "Mary Njeri", role: "FARMER", plan: "Free", price: "KES 0/mo", since: "May 22, 2025", renews: "N/A", status: "Active", usage: 15 },
];

const planConfig: Record<string, "secondary" | "info" | "success"> = {
  Free: "secondary",
  Pro: "info",
  Enterprise: "success",
};

export default function AdminSubscriptionsPage() {
  const mrr = 842000 + 12999 + 24999 * 2 + 5999;
  function fmt(n: number) {
    return `KES ${(n / 1000).toFixed(0)}K`;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Subscriptions</h1>
        <p className="text-sm text-slate-500">Platform subscription plans and billing management</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "MRR", value: "KES 1.24M", color: "text-green-600" },
          { label: "Enterprise", value: "38", color: "text-purple-600" },
          { label: "Pro", value: "1,284", color: "text-blue-600" },
          { label: "Free Tier", value: "11,160", color: "text-slate-500" },
        ].map(({ label, value, color }) => (
          <Card key={label}>
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-slate-500">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {[
          { plan: "Free", price: "KES 0", features: ["Basic crop tracking", "5 AI scans/month", "Marketplace access", "Community support"], color: "border-slate-200", badge: "secondary" as const },
          { plan: "Pro", price: "KES 2,999/mo", features: ["Unlimited AI scans", "Soil & climate reports", "Priority support", "Financing access", "Advanced analytics"], color: "border-green-400", badge: "info" as const },
          { plan: "Enterprise", price: "Custom", features: ["All Pro features", "Dedicated account manager", "API access", "Custom integrations", "SLA guarantee", "Multi-farm management"], color: "border-purple-400", badge: "success" as const },
        ].map(({ plan, price, features, color, badge }) => (
          <Card key={plan} className={`border-2 ${color}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="font-bold text-slate-900 dark:text-white">{plan}</p>
                <Badge variant={badge}>{plan}</Badge>
              </div>
              <p className="text-xl font-black text-slate-800 dark:text-slate-200 mb-3">{price}</p>
              <ul className="space-y-1">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button variant="outline" size="sm" className="w-full mt-3">Edit Plan</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Search subscribers..." />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  {["User", "Role", "Plan", "Price", "Since", "Renews", "Usage", "Status", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {subscribers.map((s) => (
                  <tr key={s.user} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{s.user}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{s.role}</td>
                    <td className="px-4 py-3"><Badge variant={planConfig[s.plan]} className="text-xs">{s.plan}</Badge></td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 text-xs">{s.price}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{s.since}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{s.renews}</td>
                    <td className="px-4 py-3 min-w-[80px]">
                      <div className="flex items-center gap-1.5 text-xs">
                        <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: `${s.usage}%` }} />
                        </div>
                        <span className="text-slate-500 w-8">{s.usage}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><Badge variant={s.status === "Active" ? "success" : "destructive"} className="text-xs">{s.status}</Badge></td>
                    <td className="px-4 py-3"><Button variant="ghost" size="sm"><Eye className="w-3 h-3" /></Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
