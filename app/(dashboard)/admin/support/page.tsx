import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, MessageSquare, Eye, Clock, CheckCircle, AlertTriangle, User } from "lucide-react";

const tickets = [
  { id: "T-1284", user: "Wanjiku Agro", role: "SUPPLIER", subject: "Payment processing issue — M-Pesa timeout", category: "Payments", priority: "High", status: "Open", created: "Feb 24, 2026", lastUpdate: "2 hrs ago" },
  { id: "T-1283", user: "John Kamau", role: "FARMER", subject: "AI scan giving incorrect disease diagnosis for my maize", category: "AI Diagnostics", priority: "Medium", status: "In Progress", created: "Feb 23, 2026", lastUpdate: "5 hrs ago" },
  { id: "T-1282", user: "KCB AgriFinance", role: "LENDER", subject: "Unable to access bulk loan application download", category: "Technical", priority: "Medium", status: "Resolved", created: "Feb 22, 2026", lastUpdate: "Feb 23, 2026" },
  { id: "T-1281", user: "Grace Akinyi", role: "FARMER", subject: "How do I upgrade from Free to Pro plan?", category: "Billing", priority: "Low", status: "Resolved", created: "Feb 21, 2026", lastUpdate: "Feb 22, 2026" },
  { id: "T-1280", user: "Peter Ochieng", role: "SUPPLIER", subject: "Product listing rejected — no reason given", category: "Marketplace", priority: "High", status: "Open", created: "Feb 20, 2026", lastUpdate: "Feb 21, 2026" },
  { id: "T-1279", user: "Alice Chebet", role: "FARMER", subject: "Soil report data doesn't match field observations", category: "AI Diagnostics", priority: "Low", status: "Closed", created: "Feb 18, 2026", lastUpdate: "Feb 20, 2026" },
];

const statusConfig: Record<string, "destructive" | "warning" | "success" | "secondary"> = {
  Open: "destructive",
  "In Progress": "warning",
  Resolved: "success",
  Closed: "secondary",
};

const priorityConfig: Record<string, "destructive" | "warning" | "secondary"> = {
  High: "destructive",
  Medium: "warning",
  Low: "secondary",
};

export default function AdminSupportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Support</h1>
        <p className="text-sm text-slate-500">User support tickets and helpdesk management</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Open Tickets", value: "23", color: "text-red-600" },
          { label: "In Progress", value: "8", color: "text-amber-600" },
          { label: "Resolved (MTD)", value: "142", color: "text-green-600" },
          { label: "Avg. Response Time", value: "3.2 hrs", color: "text-blue-600" },
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
              <input className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Search tickets..." />
            </div>
            <select className="h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm">
              <option>All Status</option>
              <option>Open</option>
              <option>In Progress</option>
              <option>Resolved</option>
              <option>Closed</option>
            </select>
            <select className="h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm">
              <option>All Priority</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {tickets.map((t) => (
              <div key={t.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <MessageSquare className="w-4 h-4 text-blue-400 flex-shrink-0" />
                      <span className="font-semibold text-sm text-slate-900 dark:text-white">{t.subject}</span>
                      <Badge variant={priorityConfig[t.priority]} className="text-xs">{t.priority}</Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><User className="w-3 h-3" />{t.user} ({t.role})</span>
                      <span>{t.category}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{t.lastUpdate}</span>
                      <span className="text-slate-300 dark:text-slate-600">{t.id}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={statusConfig[t.status]} className="text-xs">{t.status}</Badge>
                    <Button variant="outline" size="sm"><Eye className="w-3 h-3 mr-1" /> View</Button>
                    {(t.status === "Open" || t.status === "In Progress") && (
                      <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700 text-white"><CheckCircle className="w-3 h-3 mr-1" /> Resolve</Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
