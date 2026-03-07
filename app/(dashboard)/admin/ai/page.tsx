"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Cpu, Activity, AlertTriangle, RefreshCw, Plus, Zap, BarChart3, Users } from "lucide-react";
import { getAIUsageStats, getAdminAIModels } from "@/lib/actions/ai";
import AIInsightPanel from "@/components/dashboard/ai-insight-panel";

type Stats = Awaited<ReturnType<typeof getAIUsageStats>>;
type AIModel = Awaited<ReturnType<typeof getAdminAIModels>>[number];

const MODULE_LABELS: Record<string, string> = {
  lender_underwriting: "Lender Underwriting",
  lender_risk_profiles: "Risk Profiles",
  lender_analytics: "Lender Analytics",
  lender_forecasts: "Yield Forecasts",
  lender_portfolio: "Loan Portfolio",
  farmer_soil: "Soil Analysis",
  farmer_analytics: "Farm Analytics",
  admin_ai_systems: "AI Systems",
  admin_reports: "Reports",
};

export default function AdminAIPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [models, setModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [s, m] = await Promise.all([getAIUsageStats(), getAdminAIModels()]);
      setStats(s);
      setModels(m);
    } catch {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const statCards = [
    { icon: Brain, label: "Total AI Analyses", value: loading ? "…" : String(stats?.total ?? 0), color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-950" },
    { icon: Activity, label: "Today's Analyses", value: loading ? "…" : String(stats?.todayCount ?? 0), color: "text-green-600", bg: "bg-green-50 dark:bg-green-950" },
    { icon: Zap, label: "Prompts Used (All)", value: loading ? "…" : String(stats?.totalPromptsUsed ?? 0), color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950" },
    { icon: Users, label: "Active Users", value: loading ? "…" : String(stats?.activeUsers ?? 0), color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">AI Systems</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Platform AI usage, model management, and system health</p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ icon: Icon, label, value, color, bg }) => (
          <Card key={label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <p className={`text-xl font-bold ${color}`}>{value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Usage by Module */}
      {!loading && stats && stats.byModule.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-500" /> Usage by Module
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.byModule.map(({ module, _count }) => {
              const total = stats.byModule.reduce((s, m) => s + m._count.id, 0);
              const pct = total > 0 ? Math.round((_count.id / total) * 100) : 0;
              return (
                <div key={module}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 dark:text-slate-400">{MODULE_LABELS[module] ?? module}</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{_count.id} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Registered AI Models */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-500" /> AI Models
            </CardTitle>
            <Badge variant="secondary" className="text-xs">{models.length} registered</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center text-slate-400 text-sm py-6">Loading…</div>
          ) : models.length === 0 ? (
            <div className="text-center py-8 space-y-2">
              <Brain className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm text-slate-400">No AI models registered yet.</p>
              <p className="text-xs text-slate-400">Models will appear here once configured in the database.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {models.map((m) => (
                <div key={m.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                      <Brain className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-slate-900 dark:text-white">{m.name}</p>
                      <p className="text-xs text-slate-400">{m.type} · v{m.version}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {m.accuracy != null && (
                      <div className="text-right hidden sm:block">
                        <p className={`text-sm font-bold ${m.accuracy >= 90 ? "text-green-600" : m.accuracy >= 75 ? "text-amber-600" : "text-red-600"}`}>
                          {m.accuracy.toFixed(1)}%
                        </p>
                        <p className="text-xs text-slate-400">Accuracy</p>
                      </div>
                    )}
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{m.totalRequests.toLocaleString()}</p>
                      <p className="text-xs text-slate-400">Requests</p>
                    </div>
                    <Badge variant={m.isActive ? "success" : "secondary"} className="text-xs">
                      {m.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI System Health Analysis */}
      <AIInsightPanel
        module="admin_ai_systems"
        contextData={JSON.stringify({
          totalAnalyses: stats?.total ?? 0,
          todayCount: stats?.todayCount ?? 0,
          activeUsers: stats?.activeUsers ?? 0,
          totalPromptsUsed: stats?.totalPromptsUsed ?? 0,
          usageByModule: stats?.byModule?.map((m) => ({ module: MODULE_LABELS[m.module] ?? m.module, count: m._count.id })) ?? [],
          registeredModels: models.length,
          activeModels: models.filter((m) => m.isActive).length,
        })}
        title="AI System Health Analysis"
        description="Get a comprehensive health check and recommendations for the platform's AI systems"
        defaultPrompt="Analyze the platform's AI systems usage and health. Identify usage patterns, potential bottlenecks, modules with low adoption, and provide recommendations to improve AI utilization and reliability across the platform."
      />
    </div>
  );
}

      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">AI Systems</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Platform AI model health, usage, and management</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Brain, label: "Active Models", value: "6", color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-950" },
          { icon: Activity, label: "Total Requests (MTD)", value: "295K", color: "text-green-600", bg: "bg-green-50 dark:bg-green-950" },
          { icon: Cpu, label: "Avg. Accuracy", value: "93.5%", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950" },
          { icon: AlertTriangle, label: "Degraded Models", value: "1", color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950" },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <Card key={label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <p className={`text-xl font-bold ${color}`}>{value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4">
        {aiModels.map((m: any) => (
          <Card key={m.name}>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{m.name}</p>
                    <p className="text-xs text-slate-400">{m.type} • {m.version} • Updated: {m.lastUpdate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center hidden sm:block">
                    <p className="text-lg font-bold text-green-600">{m.accuracy}%</p>
                    <p className="text-xs text-slate-400">Accuracy</p>
                  </div>
                  <div className="text-center hidden sm:block">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{m.requests.toLocaleString()}</p>
                    <p className="text-xs text-slate-400">Requests</p>
                  </div>
                  <Badge variant={m.status === "Operational" ? "success" : "warning"} className="text-xs">{m.status}</Badge>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm"><Eye className="w-3 h-3" /></Button>
                    <Button variant="ghost" size="sm"><RefreshCw className="w-3 h-3" /></Button>
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Model Confidence</span>
                  <span className="text-slate-600 dark:text-slate-400">{m.accuracy}%</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${m.accuracy >= 95 ? "bg-green-500" : m.accuracy >= 90 ? "bg-blue-500" : "bg-amber-500"}`}
                    style={{ width: `${m.accuracy}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500" /> AI Alert Log</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {recentAlerts.map(({ model, level, message, time }) => (
            <div key={message} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <AlertTriangle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${level === "Warning" ? "text-amber-500" : "text-blue-400"}`} />
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-0.5">{model}</p>
                <p className="text-sm text-slate-700 dark:text-slate-300">{message}</p>
                <p className="text-xs text-slate-400">{time}</p>
              </div>
              <Badge variant={level === "Warning" ? "warning" : "info"} className="text-xs">{level}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
