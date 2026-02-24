import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Shield, Eye, User, Settings, LogIn, Trash2, AlertTriangle } from "lucide-react";

const auditLogs = [
  { id: "AL-50281", user: "admin@digifarms.co.ke", action: "USER_SUSPENDED", resource: "User: Peter Ochieng (U-005)", ip: "41.89.12.42", time: "Feb 24, 2026 14:32", severity: "High" },
  { id: "AL-50280", user: "admin@digifarms.co.ke", action: "PRODUCT_FLAGGED", resource: "Product: Unknown Pesticide Blend (P-1184)", ip: "41.89.12.42", time: "Feb 24, 2026 14:28", severity: "High" },
  { id: "AL-50279", user: "system@digifarms.co.ke", action: "AI_MODEL_DEPLOYED", resource: "Model: AI Credit Scoring v2.5.3", ip: "10.0.0.1", time: "Feb 5, 2026 09:00", severity: "Medium" },
  { id: "AL-50278", user: "admin@digifarms.co.ke", action: "ROLE_UPDATED", resource: "User: Grace Akinyi — role permissions modified", ip: "41.89.12.42", time: "Feb 3, 2026 11:15", severity: "Medium" },
  { id: "AL-50277", user: "john.kamau@gmail.com", action: "LOGIN_FAILED", resource: "Auth: 3 consecutive failed attempts", ip: "102.209.44.8", time: "Feb 2, 2026 08:44", severity: "Low" },
  { id: "AL-50276", user: "system@digifarms.co.ke", action: "DATABASE_BACKUP", resource: "Full database backup completed — 2.8GB", ip: "10.0.0.1", time: "Feb 1, 2026 02:00", severity: "Info" },
  { id: "AL-50275", user: "admin@digifarms.co.ke", action: "SUBSCRIPTION_MODIFIED", resource: "Wanjiku Agro — Plan upgraded Enterprise", ip: "41.89.12.42", time: "Jan 28, 2026 16:22", severity: "Low" },
  { id: "AL-50274", user: "admin@digifarms.co.ke", action: "PARTNER_APPROVED", resource: "Partnership: KCB AgriFinance added", ip: "41.89.12.42", time: "Feb 15, 2025 10:05", severity: "Medium" },
];

const actionIcons: Record<string, typeof Eye> = {
  USER_SUSPENDED: User,
  PRODUCT_FLAGGED: AlertTriangle,
  AI_MODEL_DEPLOYED: Settings,
  ROLE_UPDATED: Shield,
  LOGIN_FAILED: LogIn,
  DATABASE_BACKUP: Shield,
  SUBSCRIPTION_MODIFIED: Settings,
  PARTNER_APPROVED: Shield,
};

const severityConfig: Record<string, "destructive" | "warning" | "secondary" | "info"> = {
  High: "destructive",
  Medium: "warning",
  Low: "secondary",
  Info: "info",
};

export default function AdminAuditPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Audit Log</h1>
        <p className="text-sm text-slate-500">Complete record of platform administrative actions</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Log Entries", value: "50,281", color: "text-slate-700" },
          { label: "High Severity (MTD)", value: "12", color: "text-red-600" },
          { label: "System Events (MTD)", value: "842", color: "text-blue-600" },
          { label: "Admin Actions (MTD)", value: "186", color: "text-purple-600" },
        ].map(({ label, value, color }) => (
          <Card key={label}>
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-slate-500">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Search logs by action, user, or resource..." />
            </div>
            <select className="h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm">
              <option>All Severity</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
              <option>Info</option>
            </select>
            <Button variant="outline" size="sm" className="h-10 px-4">Export CSV</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {auditLogs.map((log) => {
              const Icon = actionIcons[log.action] || Eye;
              return (
                <div key={log.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-slate-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-mono text-xs font-semibold text-slate-600 dark:text-slate-400">{log.action}</span>
                        <Badge variant={severityConfig[log.severity]} className="text-xs">{log.severity}</Badge>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300">{log.resource}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span>{log.user}</span>
                        <span>IP: {log.ip}</span>
                        <span>{log.time}</span>
                        <span className="text-slate-300 dark:text-slate-600">{log.id}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm"><Eye className="w-3 h-3" /></Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
