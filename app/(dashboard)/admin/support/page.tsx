"use client";

import { useState, useTransition, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MessageSquare, Eye, Clock, CheckCircle, User, X, Loader2, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { getSupportTickets, updateSupportTicketStatus } from "@/lib/actions/admin";

type Ticket = Awaited<ReturnType<typeof getSupportTickets>>[number];

const STATUS_OPTIONS = ["all", "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];
const PRIORITY_OPTIONS = ["all", "low", "medium", "high", "critical"];

const statusCls: Record<string, string> = {
  OPEN: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  IN_PROGRESS: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  RESOLVED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  CLOSED: "bg-slate-100 text-slate-500 dark:text-slate-400 dark:bg-slate-800 dark:text-slate-400",
};

const priorityCls: Record<string, string> = {
  critical: "bg-red-100 text-red-700",
  high: "bg-orange-100 text-orange-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-slate-100 text-slate-600",
};

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isPending, startTransition] = useTransition();

  async function load() {
    setLoading(true);
    try {
      const data = await getSupportTickets({
        status: filterStatus !== "all" ? filterStatus : undefined,
        priority: filterPriority !== "all" ? filterPriority : undefined,
      });
      setTickets(data);
    } catch {
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [filterStatus, filterPriority]);

  const filtered = tickets.filter((t) =>
    !search ||
    t.subject.toLowerCase().includes(search.toLowerCase()) ||
    (t.user.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
    t.user.email.toLowerCase().includes(search.toLowerCase())
  );

  function updateStatus(ticketId: string, status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED") {
    startTransition(async () => {
      try {
        await updateSupportTicketStatus(ticketId, status);
        toast.success(`Ticket marked as ${status.replace("_", " ").toLowerCase()}`);
        await load();
        if (selectedTicket?.id === ticketId) {
          setSelectedTicket((prev) => prev ? { ...prev, status } : null);
        }
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to update ticket");
      }
    });
  }

  const openCount = tickets.filter((t) => t.status === "OPEN").length;
  const inProgressCount = tickets.filter((t) => t.status === "IN_PROGRESS").length;
  const resolvedCount = tickets.filter((t) => t.status === "RESOLVED").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Support</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">User support tickets and helpdesk management</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Open Tickets", value: openCount, color: "text-red-600", filter: "OPEN" },
          { label: "In Progress", value: inProgressCount, color: "text-amber-600", filter: "IN_PROGRESS" },
          { label: "Resolved", value: resolvedCount, color: "text-green-600", filter: "RESOLVED" },
          { label: "Total", value: tickets.length, color: "text-slate-700 dark:text-slate-200", filter: "all" },
        ].map(({ label, value, color, filter }) => (
          <Card
            key={label}
            onClick={() => setFilterStatus(filterStatus === filter ? "all" : filter)}
            className={`cursor-pointer transition-all hover:shadow-md ${filterStatus === filter ? "ring-2 ring-green-500" : ""}`}
          >
            <CardContent className="p-4 text-center">
              {loading ? <div className="h-7 w-10 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mx-auto mb-1" /> : <p className={`text-2xl font-bold ${color}`}>{value}</p>}
              <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input className="pl-9 rounded-xl" placeholder="Search tickets by subject or user…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="relative">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="appearance-none h-10 pl-3 pr-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s === "all" ? "All Status" : s.replace("_", " ")}</option>)}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
        <div className="relative">
          <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="appearance-none h-10 pl-3 pr-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
            {PRIORITY_OPTIONS.map((p) => <option key={p} value={p}>{p === "all" ? "All Priority" : p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Ticket List */}
      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <MessageSquare className="w-12 h-12 text-slate-300 mb-3" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">No tickets found</p>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((ticket) => (
                <div key={ticket.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <MessageSquare className="w-4 h-4 text-blue-400 flex-shrink-0" />
                        <span className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-1">{ticket.subject}</span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${priorityCls[ticket.priority] ?? priorityCls.medium}`}>
                          {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1"><User className="w-3 h-3" />{ticket.user.name ?? ticket.user.email}</span>
                        {ticket.category && <span>{ticket.category}</span>}
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(ticket.createdAt).toLocaleDateString("en-KE")}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusCls[ticket.status] ?? ""}`}>{ticket.status.replace("_", " ")}</span>
                      <button onClick={() => setSelectedTicket(ticket)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400">
                        <Eye className="w-4 h-4" />
                      </button>
                      {(ticket.status === "OPEN" || ticket.status === "IN_PROGRESS") && (
                        <button
                          disabled={isPending}
                          onClick={() => updateStatus(ticket.id, "RESOLVED")}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-medium transition-colors disabled:opacity-50"
                        >
                          <CheckCircle className="w-3 h-3" /> Resolve
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => !isPending && setSelectedTicket(null)} />
          <div className="relative z-10 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-900">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Ticket Details</h2>
              {!isPending && (
                <button onClick={() => setSelectedTicket(null)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <div className="p-5 space-y-4">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">{selectedTicket.subject}</p>
                <p className="text-xs text-slate-400 mt-0.5">#{selectedTicket.id.slice(0, 12)}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">User</p>
                  <p className="font-semibold">{selectedTicket.user.name ?? selectedTicket.user.email}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Priority</p>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${priorityCls[selectedTicket.priority] ?? ""}`}>
                    {selectedTicket.priority.charAt(0).toUpperCase() + selectedTicket.priority.slice(1)}
                  </span>
                </div>
                {selectedTicket.category && (
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Category</p>
                    <p className="font-medium">{selectedTicket.category}</p>
                  </div>
                )}
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Created</p>
                  <p className="font-medium">{new Date(selectedTicket.createdAt).toLocaleDateString("en-KE")}</p>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Description</p>
                <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{selectedTicket.description}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"] as const).map((s) => (
                    <button
                      key={s}
                      disabled={isPending || selectedTicket.status === s}
                      onClick={() => updateStatus(selectedTicket.id, s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-40 ${
                        selectedTicket.status === s
                          ? `${statusCls[s]} ring-2 ring-current ring-offset-1`
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      {s.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const tickets = [
  { id: "T-1284", user: "Wanjiku Agro", role: "SUPPLIER", subject: "Payment processing issue — M-Pesa timeout", category: "Payments", priority: "High", status: "Open", created: "Feb 24, 2026", lastUpdate: "2 hrs ago" },
  { id: "T-1283", user: "John Kamau", role: "FARMER", subject: "AI scan giving incorrect disease diagnosis for my maize", category: "AI Diagnostics", priority: "Medium", status: "In Progress", created: "Feb 23, 2026", lastUpdate: "5 hrs ago" },
  { id: "T-1282", user: "KCB AgriFinance", role: "LENDER", subject: "Unable to access bulk loan application download", category: "Technical", priority: "Medium", status: "Resolved", created: "Feb 22, 2026", lastUpdate: "Feb 23, 2026" },
  { id: "T-1281", user: "Grace Akinyi", role: "FARMER", subject: "How do I upgrade from Free to Pro plan?", category: "Billing", priority: "Low", status: "Resolved", created: "Feb 21, 2026", lastUpdate: "Feb 22, 2026" },
  { id: "T-1280", user: "Peter Ochieng", role: "SUPPLIER", subject: "Product listing rejected — no reason given", category: "Marketplace", priority: "High", status: "Open", created: "Feb 20, 2026", lastUpdate: "Feb 21, 2026" },
  { id: "T-1279", user: "Alice Chebet", role: "FARMER", subject: "Soil report data doesn't match field observations", category: "AI Diagnostics", priority: "Low", status: "Closed", created: "Feb 18, 2026", lastUpdate: "Feb 20, 2026" },
];

