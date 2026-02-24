import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Leaf, ShoppingBag, DollarSign, TrendingUp, AlertCircle, BarChart2, Globe, Activity } from "lucide-react";

const stats = [
  { icon: Users, label: "Total Users", value: "12,482", change: "+8.4%", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950" },
  { icon: Leaf, label: "Active Farmers", value: "9,341", change: "+12.1%", color: "text-green-600", bg: "bg-green-50 dark:bg-green-950" },
  { icon: ShoppingBag, label: "Total Orders (MTD)", value: "4,287", change: "+5.7%", color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-950" },
  { icon: DollarSign, label: "Platform Revenue (MTD)", value: "KES 2.4M", change: "+18.3%", color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950" },
  { icon: Globe, label: "Active Suppliers", value: "284", change: "+3.2%", color: "text-teal-600", bg: "bg-teal-50 dark:bg-teal-950" },
  { icon: BarChart2, label: "Loans Disbursed (MTD)", value: "KES 18.6M", change: "+22.5%", color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-950" },
  { icon: Activity, label: "AI Scans Today", value: "1,842", change: "+34.8%", color: "text-pink-600", bg: "bg-pink-50 dark:bg-pink-950" },
  { icon: AlertCircle, label: "Open Support Tickets", value: "23", change: "-11.5%", color: "text-red-600", bg: "bg-red-50 dark:bg-red-950" },
];

const recentActivity = [
  { type: "user_signup", message: "New farmer registered: Alice Wambua (Machakos)", time: "2 min ago", badge: "success" },
  { type: "order", message: "Bulk order KES 145,000 placed by Wanjiku Agro Supplies", time: "8 min ago", badge: "info" },
  { type: "loan", message: "Loan application LA-3051 submitted — James Kariuki, KES 90,000", time: "15 min ago", badge: "warning" },
  { type: "ai_scan", message: "Disease alert in 4 farms: Late blight detected in Nyeri cluster", time: "22 min ago", badge: "destructive" },
  { type: "subscription", message: "Peter Ochieng upgraded to Pro plan (KES 2,999/month)", time: "41 min ago", badge: "success" },
  { type: "support", message: "Ticket #1284 escalated: Payment processing issue — Supplier", time: "1 hr ago", badge: "warning" },
];

const variantMap: Record<string, "success" | "info" | "warning" | "destructive"> = {
  success: "success",
  info: "info",
  warning: "warning",
  destructive: "destructive",
};

export default function AdminOverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Admin Overview</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Platform health and real-time metrics</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ icon: Icon, label, value, change, color, bg }) => (
          <Card key={label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <span className={`text-xs font-medium ${change.startsWith("+") ? "text-green-600" : "text-red-500"}`}>{change}</span>
              </div>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">Real-Time Activity Feed</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentActivity.map(({ message, time, badge }) => (
                <div key={message} className="flex items-start gap-3 px-4 py-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-slate-700 dark:text-slate-300">{message}</p>
                    <p className="text-xs text-slate-400">{time}</p>
                  </div>
                  <Badge variant={variantMap[badge]} className="text-xs flex-shrink-0">{badge}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold">User Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { role: "Farmers", count: 9341, pct: 75, color: "bg-green-500" },
                { role: "Suppliers", count: 284, pct: 2, color: "bg-purple-500" },
                { role: "Lenders", count: 42, pct: 1, color: "bg-blue-500" },
                { role: "Admins", count: 8, pct: 0.1, color: "bg-red-500" },
                { role: "Others", count: 2807, pct: 22.5, color: "bg-slate-400" },
              ].map(({ role, count, pct, color }) => (
                <div key={role}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 dark:text-slate-400">{role}</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{count.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full ${color} rounded-full`} style={{ width: `${Math.max(pct, 2)}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold">System Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: "API Uptime", value: "99.98%", status: "Healthy" },
                { label: "AI Services", value: "98.2%", status: "Healthy" },
                { label: "Database", value: "99.95%", status: "Healthy" },
                { label: "Payment Gateway", value: "99.7%", status: "Healthy" },
              ].map(({ label, value, status }) => (
                <div key={label} className="flex items-center justify-between py-1">
                  <span className="text-sm text-slate-600 dark:text-slate-400">{label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{value}</span>
                    <span className="w-2 h-2 rounded-full bg-green-400" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
