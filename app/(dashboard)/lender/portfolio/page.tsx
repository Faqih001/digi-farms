import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, AlertCircle, CheckCircle, Search, Eye, Calendar } from "lucide-react";

const loans = [
  { id: "LN-1021", farmer: "James Mwangi", county: "Meru", amount: "KES 500,000", disbursed: "Aug 1, 2025", maturity: "Aug 1, 2027", balance: "KES 342,000", paid: "KES 158,000", pct: 31.6, rate: "12%", status: "Current", nextPayment: "Mar 1, 2026", crop: "Tea" },
  { id: "LN-1018", farmer: "Peter Odhiambo", county: "Kisumu", amount: "KES 250,000", disbursed: "Jun 15, 2025", maturity: "Mar 15, 2026", balance: "KES 52,000", paid: "KES 198,000", pct: 79.2, rate: "10.5%", status: "Current", nextPayment: "Mar 15, 2026", crop: "Rice" },
  { id: "LN-1015", farmer: "Mary Wanjiku", county: "Kiambu", amount: "KES 85,000", disbursed: "Mar 10, 2025", maturity: "Mar 10, 2026", balance: "KES 78,000", paid: "KES 7,000", pct: 8.2, rate: "14%", status: "Overdue", nextPayment: "Feb 10, 2026", crop: "Coffee" },
  { id: "LN-1012", farmer: "David Njoroge", county: "Nyandarua", amount: "KES 180,000", disbursed: "Jan 20, 2025", maturity: "Jul 20, 2026", balance: "KES 110,000", paid: "KES 70,000", pct: 38.9, rate: "11%", status: "Current", nextPayment: "Mar 20, 2026", crop: "Tomatoes" },
  { id: "LN-1008", farmer: "John Kamau", county: "Nakuru", amount: "KES 200,000", disbursed: "Oct 5, 2024", maturity: "Apr 5, 2026", balance: "KES 0", paid: "KES 200,000", pct: 100, rate: "12.5%", status: "Closed", nextPayment: "N/A", crop: "Maize" },
];

const statusConfig: Record<string, "success" | "destructive" | "secondary"> = {
  Current: "success",
  Overdue: "destructive",
  Closed: "secondary",
};

export default function PortfolioPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Loan Portfolio</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Active and historical loan management</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: DollarSign, label: "Active Portfolio", value: "KES 48.2M", color: "text-green-600", bg: "bg-green-50 dark:bg-green-950" },
          { icon: CheckCircle, label: "Current Loans", value: "138", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950" },
          { icon: AlertCircle, label: "Overdue Loans", value: "4", color: "text-red-600", bg: "bg-red-50 dark:bg-red-950" },
          { icon: TrendingUp, label: "Avg. Recovery Rate", value: "96.8%", color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-950" },
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
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Search loans..." />
            </div>
            <select className="h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm">
              <option>All Status</option>
              <option>Current</option>
              <option>Overdue</option>
              <option>Closed</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  {["Loan ID / Farmer", "Amount", "Outstanding", "Progress", "Rate", "Next Payment", "Status", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loans.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-900 dark:text-white">{l.farmer}</p>
                      <p className="text-xs text-slate-400">{l.id} • {l.crop} • {l.county}</p>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">{l.amount}</td>
                    <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">{l.balance}</td>
                    <td className="px-4 py-3 min-w-[120px]">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${l.pct}%` }} />
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 w-12 text-right">{l.pct}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{l.rate}</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                        <Calendar className="w-3 h-3" /> {l.nextPayment}
                      </span>
                    </td>
                    <td className="px-4 py-3"><Badge variant={statusConfig[l.status]}>{l.status}</Badge></td>
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
