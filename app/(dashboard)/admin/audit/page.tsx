"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Shield, Eye, User, Settings, LogIn, Trash2, AlertTriangle, Loader2, X, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { getActivityLogs } from "@/lib/actions/admin";
import AIInsightPanel from "@/components/dashboard/ai-insight-panel";

type Log = Awaited<ReturnType<typeof getActivityLogs>>[number];

function getSeverity(action: string): "high" | "medium" | "low" | "info" {
  const a = action.toUpperCase();
  if (a.includes("DELETE") || a.includes("SUSPEND") || a.includes("BLOCK") || a.includes("FLAGG") || a.includes("BAN")) return "high";
  if (a.includes("UPDATE") || a.includes("ROLE") || a.includes("DEPLOY") || a.includes("APPROVE") || a.includes("CREATE")) return "medium";
  if (a.includes("LOGIN") || a.includes("LOGOUT") || a.includes("EXPORT")) return "low";
  return "info";
}

const severityConfig: Record<string, { cls: string; label: string }> = {
  high: { cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", label: "High" },
  medium: { cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", label: "Medium" },
  low: { cls: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400", label: "Low" },
  info: { cls: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400", label: "Info" },
};

function getActionIcon(action: string) {
  const a = action.toUpperCase();
  if (a.includes("USER") || a.includes("SUSPEND") || a.includes("BAN")) return User;
  if (a.includes("LOGIN") || a.includes("LOGOUT") || a.includes("AUTH")) return LogIn;
  if (a.includes("DELETE") || a.includes("REMOVE")) return Trash2;
  if (a.includes("FLAG") || a.includes("ALERT") || a.includes("WARN")) return AlertTriangle;
  if (a.includes("CONFIG") || a.includes("SETTING") || a.includes("ROLE") || a.includes("DEPLOY")) return Settings;
  return Shield;
}

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);
  const [filterSeverity, setFilterSeverity] = useState("all");

  async function load() {
    setLoading(true);
    try { setLogs(await getActivityLogs({ limit: 200 })); }
    catch { toast.error("Failed to load audit logs"); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  const filtered = logs.filter(log => {
    const matchSearch = !search ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.entity.toLowerCase().includes(search.toLowerCase()) ||
      log.user.email.toLowerCase().includes(search.toLowerCase()) ||
      (log.user.name ?? "").toLowerCase().includes(search.toLowerCase());

    const sev = getSeverity(log.action);
    const matchSev = filterSeverity === "all" || sev === filterSeverity;

    return matchSearch && matchSev;
  });

  const highCount = logs.filter(l => getSeverity(l.action) === "high").length;
  const medCount = logs.filter(l => getSeverity(l.action) === "medium").length;

  const contextData = JSON.stringify({
    totalLogs: logs.length,
    highSeverity: highCount,
    mediumSeverity: medCount,
    recentActions: logs.slice(0, 10).map(l => ({ action: l.action, entity: l.entity, user: l.user.email })),
    uniqueUsers: [...new Set(logs.map(l => l.user.email))].length,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Audit Log</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Complete record of platform administrative actions</p>
        </div>
        <button onClick={load} disabled={loading} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-green-600 disabled:opacity-50">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Log Entries", value: loading ? "—" : logs.length.toLocaleString(), color: "text-slate-700 dark:text-slate-300" },
          { label: "High Severity", value: loading ? "—" : highCount, color: "text-red-600" },
          { label: "Medium Severity", value: loading ? "—" : medCount, color: "text-amber-600" },
          { label: "Unique Users", value: loading ? "—" : [...new Set(logs.map(l => l.user.email))].length, color: "text-blue-600" },
        ].map(({ label, value, color }) => (
          <Card key={label}>
            <CardContent className="p-4 text-center">
              {loading ? <div className="h-7 w-10 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mx-auto mb-1" /> : <p className={`text-2xl font-bold ${color}`}>{value}</p>}
              <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input className="pl-9 rounded-xl" placeholder="Search by action, entity, or user…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select
          value={filterSeverity}
          onChange={e => setFilterSeverity(e.target.value)}
          className="h-10 pl-3 pr-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none"
        >
          <option value="all">All Severity</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
          <option value="info">Info</option>
        </select>
        <Button
          variant="outline"
          size="sm"
          className="h-10 px-4"
          onClick={() => toast.success("Exporting audit log as CSV…")}
        >
          Export CSV
        </Button>
      </div>

      {/* Logs */}
      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Shield className="w-12 h-12 text-slate-300 mb-3" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            {logs.length === 0 ? "No audit logs recorded yet" : "No logs match your search"}
          </p>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((log) => {
                const Icon = getActionIcon(log.action);
                const sev = getSeverity(log.action);
                const { cls, label } = severityConfig[sev];
                return (
                  <div key={log.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">{log.action}</span>
                          <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${cls}`}>{label}</span>
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300 truncate">{log.entity}{log.entityId ? ` (${log.entityId.slice(0, 8)}…)` : ""}</p>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                          <span className="flex items-center gap-1"><User className="w-3 h-3" />{log.user.name ?? log.user.email}</span>
                          {log.ipAddress && <span>IP: {log.ipAddress}</span>}
                          <span>{new Date(log.createdAt).toLocaleString("en-KE")}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 flex-shrink-0"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Insights */}
      {!loading && (
        <AIInsightPanel
          module="admin_audit"
          contextData={contextData}
          title="AI Audit Analysis"
          description="Get AI insights on platform activity patterns, security events, and anomalies"
          defaultPrompt="Analyze the audit log data. Identify any suspicious activity patterns, high-risk actions, or unusual behaviour. Suggest security improvements and flag anything requiring immediate attention."
        />
      )}

      {/* Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedLog(null)} />
          <div className="relative z-10 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-900">
              <h2 className="text-base font-bold">Log Entry Details</h2>
              <button onClick={() => setSelectedLog(null)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-3">
              {[
                { label: "Action", value: selectedLog.action },
                { label: "Entity", value: `${selectedLog.entity}${selectedLog.entityId ? ` (${selectedLog.entityId})` : ""}` },
                { label: "User", value: `${selectedLog.user.name ?? ""} <${selectedLog.user.email}> [${selectedLog.user.role}]` },
                { label: "IP Address", value: selectedLog.ipAddress ?? "—" },
                { label: "Timestamp", value: new Date(selectedLog.createdAt).toLocaleString("en-KE") },
                { label: "Severity", value: severityConfig[getSeverity(selectedLog.action)].label },
              ].map(({ label, value }) => (
                <div key={label} className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{label}</p>
                  <p className={`text-sm font-medium break-all ${label === "Action" ? "font-mono" : ""}`}>{value}</p>
                </div>
              ))}
              {selectedLog.metadata && (
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Metadata</p>
                  <pre className="text-xs font-mono text-slate-700 dark:text-slate-300 whitespace-pre-wrap overflow-x-auto">
                    {JSON.stringify(selectedLog.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
