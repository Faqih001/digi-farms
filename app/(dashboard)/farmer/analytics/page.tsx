"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

const yieldData = [
  { month: "Jan", maize: 12, tomato: 8, beans: 5 },
  { month: "Feb", maize: 15, tomato: 12, beans: 7 },
  { month: "Mar", maize: 18, tomato: 15, beans: 9 },
  { month: "Apr", maize: 14, tomato: 20, beans: 6 },
  { month: "May", maize: 22, tomato: 18, beans: 11 },
  { month: "Jun", maize: 28, tomato: 14, beans: 8 },
  { month: "Jul", maize: 25, tomato: 16, beans: 13 },
];

const revenueData = [
  { month: "Jan", revenue: 45000 }, { month: "Feb", revenue: 62000 }, { month: "Mar", revenue: 58000 },
  { month: "Apr", revenue: 71000 }, { month: "May", revenue: 65000 }, { month: "Jun", revenue: 89000 }, { month: "Jul", revenue: 76000 },
];

export default function YieldAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Yield Analytics</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Track your farm production and revenue trends</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Yield (bags)", value: "284", change: "+12%", up: true },
          { label: "Revenue (KES)", value: "466K", change: "+8%", up: true },
          { label: "Best Crop", value: "Maize", change: "134 bags", up: true },
          { label: "Avg Yield/Acre", value: "28 bags", change: "-2%", up: false },
        ].map(({ label, value, change, up }) => (
          <Card key={label} className="p-4">
            <CardContent className="p-0">
              <div className="text-xs text-slate-400 mb-1">{label}</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{value}</div>
              <Badge variant={up ? "success" : "destructive"} className="text-xs mt-1">{change} vs last season</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="yield">
        <TabsList>
          <TabsTrigger value="yield">Yield by Crop</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>
        <TabsContent value="yield" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Monthly Yield (bags/acre)</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={yieldData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="maize" fill="#22c55e" radius={4} name="Maize" />
                  <Bar dataKey="tomato" fill="#f59e0b" radius={4} name="Tomato" />
                  <Bar dataKey="beans" fill="#3b82f6" radius={4} name="Beans" />
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
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${v/1000}K`} />
                  <Tooltip formatter={(v) => `KES ${Number(v).toLocaleString()}`} />
                  <Area type="monotone" dataKey="revenue" stroke="#22c55e" fill="url(#revenueGrad)" name="Revenue" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
