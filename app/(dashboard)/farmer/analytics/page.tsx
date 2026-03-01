"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Loader2, BarChart3, Download, Calendar, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { getYieldAnalytics } from "@/lib/actions/analytics";

type Analytics = Awaited<ReturnType<typeof getYieldAnalytics>>;

const COLORS = ["#22c55e", "#f59e0b", "#3b82f6", "#ef4444", "#8b5cf6", "#06b6d4", "#f97316"];

function exportCSV(data: Analytics) {
  if (!data) return;
  const rows: string[] = ["Month," + (data.crops.length > 0 ? data.crops.join(",") : "Yield") + ",Revenue(KES)"];
  const revenueMap = new Map(data.revenueByMonth.map((r) => [r.month, r.revenue]));
  const allMonths = new Set([...data.yieldByMonth.map((y) => y.month as string), ...data.revenueByMonth.map((r) => r.month)]);
  for (const month of allMonths) {
    const yRow = data.yieldByMonth.find((y) => y.month === month);
    const yieldValues = data.crops.map((c) => String(yRow?.[c] ?? 0)).join(",");
    const rev = revenueMap.get(month) ?? 0;
    rows.push(`${month},${yieldValues || "0"},${rev}`);
  }
  const blob = new Blob([rows.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `farm-analytics-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success("CSV exported");
}

export default function YieldAnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const load = async (sd?: string, ed?: string) => {
    setLoading(true);
    try {
      const result = await getYieldAnalytics(sd || undefined, ed || undefined);
      setData(result);
    } catch { toast.error("Failed to load analytics"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleFilter = () => {
    if ((startDate && !endDate) || (!startDate && endDate)) {
      toast.error("Please set both start and end date"); return;
    }
    load(startDate, endDate);
  };

  const handleReset = () => {
    setStartDate(""); setEndDate(""); load();
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>;

  const stats = data?.stats;
  const empty = !data || (data.yieldByMonth.length === 0 && data.revenueByMonth.length === 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Yield Analytics</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Track your farm production and revenue trends</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => data && exportCSV(data)} disabled={!data}>
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Date range filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500"><Calendar className="w-3 h-3 inline mr-1" />Start Date</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-9 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">End Date</Label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="h-9 text-sm" />
            </div>
            <Button size="sm" onClick={handleFilter} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply Filter"}
            </Button>
            {(startDate || endDate) && (
              <Button size="sm" variant="outline" onClick={handleReset}>
                <RefreshCw className="w-3 h-3 mr-1" /> Reset
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

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
