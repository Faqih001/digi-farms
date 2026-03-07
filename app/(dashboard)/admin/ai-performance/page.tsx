"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Brain, Activity, Zap, Users, Clock, Eye, BarChart3, RefreshCw, Trash2 } from "lucide-react";
import { getAIUsageStats, getAdminAIConversations } from "@/lib/actions/ai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Stats = Awaited<ReturnType<typeof getAIUsageStats>>;
type Conversation = Awaited<ReturnType<typeof getAdminAIConversations>>[number];

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

const MODULE_COLORS: Record<string, string> = {
  lender_underwriting: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  lender_risk_profiles: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  lender_analytics: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  lender_forecasts: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  lender_portfolio: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  farmer_soil: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  farmer_analytics: "bg-lime-100 text-lime-700 dark:bg-lime-900 dark:text-lime-300",
  admin_ai_systems: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  admin_reports: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300",
};

const ROLE_COLORS: Record<string, string> = {
  FARMER: "bg-green-100 text-green-700",
  LENDER: "bg-blue-100 text-blue-700",
  ADMIN: "bg-purple-100 text-purple-700",
  SUPPLIER: "bg-amber-100 text-amber-700",
};

export default function AIPerformancePage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [moduleFilter, setModuleFilter] = useState("");
  const [viewConv, setViewConv] = useState<Conversation | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [s, c] = await Promise.all([
        getAIUsageStats(),
        getAdminAIConversations({ module: moduleFilter || undefined, limit: 50 }),
      ]);
      setStats(s);
      setConversations(c);
    } catch {}
    finally { setLoading(false); }
  }, [moduleFilter]);

  useEffect(() => { load(); }, [load]);

  type ByModuleItem = { module: string; _count: { id: number } };
  const byModule: ByModuleItem[] = (stats?.byModule ?? []) as ByModuleItem[];
  const totalModuleCount = byModule.reduce((s, m) => s + m._count.id, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">AI Performance</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Platform-wide AI analysis activity and conversation logs</p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Brain, label: "Total Analyses", value: loading ? "…" : String(stats?.total ?? 0), color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-950" },
          { icon: Activity, label: "Today", value: loading ? "…" : String(stats?.todayCount ?? 0), color: "text-green-600", bg: "bg-green-50 dark:bg-green-950" },
          { icon: Zap, label: "Prompts Used", value: loading ? "…" : String(stats?.totalPromptsUsed ?? 0), color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950" },
          { icon: Users, label: "Active Users", value: loading ? "…" : String(stats?.activeUsers ?? 0), color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950" },
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

      {/* Module breakdown */}
      {!loading && stats && byModule.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-500" /> Analyses by Module
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {byModule.map(({ module, _count }: { module: string; _count: { id: number } }) => {
                const pct = totalModuleCount > 0 ? Math.round((_count.id / totalModuleCount) * 100) : 0;
                const colorClass = MODULE_COLORS[module] ?? "bg-slate-100 text-slate-700";
                return (
                  <div key={module} className={`rounded-xl p-3 ${colorClass} bg-opacity-40`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold">{MODULE_LABELS[module] ?? module}</span>
                      <span className="text-xs font-bold">{_count.id}</span>
                    </div>
                    <div className="h-1.5 bg-white/40 dark:bg-black/20 rounded-full overflow-hidden">
                      <div className="h-full bg-current opacity-60 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="text-xs opacity-70 mt-1">{pct}% of all analyses</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Conversation log */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-500" /> Recent AI Conversations
            </CardTitle>
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm"
            >
              <option value="">All Modules</option>
              {Object.entries(MODULE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center text-slate-400 text-sm py-8">Loading…</div>
          ) : conversations.length === 0 ? (
            <div className="text-center text-slate-400 text-sm py-8">
              <Brain className="w-8 h-8 mx-auto mb-2 opacity-30" />
              No AI conversations recorded yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {conversations.map((c) => (
                <div key={c.id} className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Brain className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{c.user.name}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-md font-medium ${ROLE_COLORS[c.user.role] ?? "bg-slate-100 text-slate-600"}`}>{c.user.role}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-md font-medium ${MODULE_COLORS[c.module] ?? "bg-slate-100 text-slate-600"}`}>
                        {MODULE_LABELS[c.module] ?? c.module}
                      </span>
                      {c.entityLabel && <span className="text-xs text-slate-400">{c.entityLabel}</span>}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {c.response.slice(0, 120)}…
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(c.createdAt).toLocaleDateString()} {new Date(c.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      {c.model && <span className="text-xs text-slate-400">{c.model}</span>}
                      {c.outputTokens && <span className="text-xs text-slate-400">{c.outputTokens.toLocaleString()} tokens</span>}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                    onClick={() => setViewConv(c)}
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* View conversation dialog */}
      <Dialog open={!!viewConv} onOpenChange={() => setViewConv(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 flex-wrap">
              <Brain className="w-4 h-4 text-purple-600" />
              {viewConv?.user.name}
              {viewConv && (
                <span className={`text-xs px-1.5 py-0.5 rounded-md font-medium ${MODULE_COLORS[viewConv.module] ?? ""}`}>
                  {MODULE_LABELS[viewConv.module] ?? viewConv.module}
                </span>
              )}
            </DialogTitle>
          </DialogHeader>
          {viewConv && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs">
                <div><span className="text-slate-400">User:</span> <span className="font-medium">{viewConv.user.email}</span></div>
                <div><span className="text-slate-400">Role:</span> <span className="font-medium">{viewConv.user.role}</span></div>
                <div><span className="text-slate-400">Date:</span> <span className="font-medium">{new Date(viewConv.createdAt).toLocaleString()}</span></div>
                <div><span className="text-slate-400">Model:</span> <span className="font-medium">{viewConv.model}</span></div>
                {viewConv.inputTokens && <div><span className="text-slate-400">Input tokens:</span> <span className="font-medium">{viewConv.inputTokens.toLocaleString()}</span></div>}
                {viewConv.outputTokens && <div><span className="text-slate-400">Output tokens:</span> <span className="font-medium">{viewConv.outputTokens.toLocaleString()}</span></div>}
              </div>
              {viewConv.entityLabel && (
                <div>
                  <p className="text-xs text-slate-400 mb-1">Entity</p>
                  <Badge variant="secondary">{viewConv.entityLabel}</Badge>
                </div>
              )}
              <div className="prose prose-sm dark:prose-invert max-w-none border-t pt-3">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{viewConv.response}</ReactMarkdown>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewConv(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
