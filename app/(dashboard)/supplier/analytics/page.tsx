import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, ShoppingCart, Users, DollarSign, Package, ArrowUpRight } from "lucide-react";

const metrics = [
  { label: "Total Sales", value: "339", change: "+24%", period: "vs last month" },
  { label: "Avg Order Value", value: "KES 5,200", change: "+12%", period: "vs last month" },
  { label: "Repeat Customers", value: "67%", change: "+8%", period: "vs last month" },
  { label: "Conversion Rate", value: "3.8%", change: "+0.5%", period: "vs last month" },
];

const topCategories = [
  { name: "Fertilizers", revenue: "KES 580,000", share: 47, orders: 142 },
  { name: "Seeds", revenue: "KES 290,000", share: 23, orders: 98 },
  { name: "Equipment", revenue: "KES 210,000", share: 17, orders: 23 },
  { name: "Pest Control", revenue: "KES 160,000", share: 13, orders: 76 },
];

const monthlyData = [
  { month: "Sep", value: 82 }, { month: "Oct", value: 95 }, { month: "Nov", value: 110 },
  { month: "Dec", value: 88 }, { month: "Jan", value: 124 }, { month: "Feb", value: 142 },
];

export default function SupplierAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Analytics</h1>
        <p className="text-sm text-slate-500">Insights into your store performance</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map(({ label, value, change, period }) => (
          <Card key={label}>
            <CardContent className="p-4">
              <p className="text-xs text-slate-500 mb-1">{label}</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
              <div className="flex items-center gap-1 mt-1">
                <Badge variant="success" className="text-xs"><ArrowUpRight className="w-3 h-3" /> {change}</Badge>
                <span className="text-xs text-slate-400">{period}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Sales Chart */}
        <Card>
          <CardHeader><CardTitle>Monthly Sales Trend</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-48">
              {monthlyData.map(({ month, value }) => (
                <div key={month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">{value}</span>
                  <div className="w-full bg-green-500 rounded-t-lg transition-all" style={{ height: `${(value / 150) * 100}%` }} />
                  <span className="text-xs text-slate-400">{month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Categories */}
        <Card>
          <CardHeader><CardTitle>Revenue by Category</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCategories.map(({ name, revenue, share, orders }) => (
                <div key={name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{name}</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{revenue}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${share}%` }} />
                    </div>
                    <span className="text-xs text-slate-400 w-16 text-right">{orders} orders</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Geographic Performance */}
      <Card>
        <CardHeader><CardTitle>Top Performing Counties</CardTitle></CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { county: "Nakuru", orders: 68, revenue: "KES 340K" },
              { county: "Kiambu", orders: 52, revenue: "KES 260K" },
              { county: "Meru", orders: 41, revenue: "KES 205K" },
              { county: "Nyandarua", orders: 38, revenue: "KES 190K" },
              { county: "Trans Nzoia", orders: 33, revenue: "KES 165K" },
            ].map(({ county, orders, revenue }, i) => (
              <div key={county} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-center">
                <span className="text-xs font-bold text-green-600">#{i + 1}</span>
                <p className="font-semibold text-slate-900 dark:text-white text-sm mt-1">{county}</p>
                <p className="text-xs text-slate-500">{orders} orders</p>
                <p className="text-xs font-bold text-green-600">{revenue}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
