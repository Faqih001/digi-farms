"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Loader2, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { getYieldAnalytics } from "@/lib/actions/analytics";

type Analytics = Awaited<ReturnType<typeof getYieldAnalytics>>;

const COLORS = ["#22c55e", "#f59e0b", "#3b82f6", "#ef4444", "#8b5cf6", "#06b6d4", "#f97316"];

export default function YieldAnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getYieldAnalytics()
      .then(setData)
      .catch(() => toast.error("Failed to load analytics"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>;

  const stats = data?.stats;
  const empty = !data || (data.yieldByMonth.length === 0 && data.revenueByMonth.length === 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Yield Analytics</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Track your farm production and revenue trends</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Yield", value: `${stats?.totalYield ?? 0}`, sub: "units" },
          { label: "Revenue (KES)", value: stats?.totalRevenue ? `${(stats.totalRevenue / 1000).toFixed(0)}K` : "0" },
          { label: "Best Crop", value: stats?.bestCrop ?? "–" },
          { label: "Avg Yield/Ha", value: `${stats?.avgYieldPerHa ?? 0}`, sub: "units" },
        ].map(({ label, value, sub }) => (
          <Card key={label} className="p-4">
            <CardContent className="p-0">
              <div className="text-xs text-slate-400 mb-1">{label}</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{value}</div>
              {sub && <span className="text-xs text-slate-400">{sub}</span>}
            </CardContent>
          </Card>
        ))}
      </div>

      {empty ? (
        <Card>
          <CardContent className="py-16 text-center text-slate-400">
            <BarChart3 className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No analytics data yet. Add crops with yield data to see charts.</p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="yield">
          <TabsList>
            <TabsTrigger value="yield">Yield by Crop</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
          </TabsList>
          <TabsContent value="yield" className="mt-4">
            <Card>
              <CardHeader><CardTitle className="text-base">Monthly Yield</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data!.yieldByMonth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    {data!.crops.map((crop, i) => (
                      <Bar key={crop} dataKey={crop} fill={COLORS[i % COLORS.length]} radius={4} name={crop} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="revenue" className="mt-4">
            <Card>
              <CardHeader><CardTitle className="text-base">Monthly Revenue (KES)</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={data!.revenueByMonth}>
                    <defs>
                      <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${v / 1000}K`} />
                    <Tooltip formatter={(v) => `KES ${Number(v).toLocaleString()}`} />
                    <Area type="monotone" dataKey="revenue" stroke="#22c55e" fill="url(#revenueGrad)" name="Revenue" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
