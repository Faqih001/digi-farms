"use client";

import { useEffect, useState, useCallback, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DollarSign, TrendingUp, AlertCircle, CheckCircle, Search, Eye, Calendar, RefreshCw } from "lucide-react";
import { getLenderPortfolio, updateLoanStatus } from "@/lib/actions/lender";
import type { LoanStatus } from "@prisma/client";

type PortfolioData = Awaited<ReturnType<typeof getLenderPortfolio>>;
type LoanItem = PortfolioData["loans"][number];

const STATUS_VARIANT: Record<string, "success" | "destructive" | "secondary" | "warning"> = {
  DISBURSED: "success",
  APPROVED: "success",
  DEFAULTED: "destructive",
  REPAID: "secondary",
  UNDER_REVIEW: "warning",
  SUBMITTED: "warning",
  REJECTED: "destructive",
  DRAFT: "secondary",
};

function fmt(n: number) {
  if (n >= 1_000_000) return `KES ${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `KES ${(n / 1_000).toFixed(0)}K`;
  return `KES ${n.toFixed(0)}`;
}

export default function PortfolioPage() {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LoanStatus | "">("");
  const [viewLoan, setViewLoan] = useState<LoanItem | null>(null);
  const [updateModal, setUpdateModal] = useState<LoanItem | null>(null);
  const [updateStatus, setUpdateStatus] = useState<LoanStatus>("DISBURSED");
  const [updateNotes, setUpdateNotes] = useState("");
  const [isPending, startTransition] = useTransition();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getLenderPortfolio({
        status: statusFilter || undefined,
        search: search || undefined,
      });
      setData(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => { load(); }, [load]);

  function handleUpdate() {
    if (!updateModal) return;
    startTransition(async () => {
      await updateLoanStatus(updateModal.id, updateStatus, updateNotes || undefined);
      setUpdateModal(null);
      setUpdateNotes("");
      await load();
    });
  }

  const loans = data?.loans ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Loan Portfolio</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Active and historical loan management</p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading || isPending}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: DollarSign, label: "Total Disbursed", value: loading ? "..." : fmt(data?.stats.totalDisbursed ?? 0), color: "text-green-600", bg: "bg-green-50 dark:bg-green-950" },
          { icon: CheckCircle, label: "Active Loans", value: loading ? "..." : String(data?.stats.activeCount ?? 0), color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950" },
          { icon: AlertCircle, label: "Overdue", value: loading ? "..." : String(data?.stats.overdueCount ?? 0), color: "text-red-600", bg: "bg-red-50 dark:bg-red-950" },
          { icon: TrendingUp, label: "Total Loans", value: loading ? "..." : String(loans.length), color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-950" },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <Card key={label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <p className={`text-base font-bold ${color}`}>{value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input className="pl-10" placeholder="Search by farmer or purpose…" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <select
              className="h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as LoanStatus | "")}
            >
              <option value="">All Status</option>
              <option value="APPROVED">Approved</option>
              <option value="DISBURSED">Disbursed</option>
              <option value="REPAID">Repaid</option>
              <option value="DEFAULTED">Defaulted</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  {["Farmer / Farm", "Amount", "Paid", "Progress", "Purpose", "Status", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading ? (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400">Loading…</td></tr>
                ) : loans.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400">No loans found.</td></tr>
                ) : (
                  loans.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-900 dark:text-white">{l.user?.name ?? "—"}</p>
                        <p className="text-xs text-slate-400">{l.user?.farm?.name ?? "No farm"} · {l.user?.farm?.location ?? "—"}</p>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">{fmt(l.approvedAmount ?? l.amount)}</td>
                      <td className="px-4 py-3 text-green-600 font-medium">{fmt(l.totalPaid)}</td>
                      <td className="px-4 py-3 min-w-[120px]">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${l.repaymentPct}%` }} />
                          </div>
                          <span className="text-xs text-slate-500 w-10 text-right">{l.repaymentPct}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400 max-w-[120px] truncate">{l.purpose}</td>
                      <td className="px-4 py-3">
                        <Badge variant={STATUS_VARIANT[l.status] ?? "secondary"}>{l.status}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => setViewLoan(l)}><Eye className="w-3 h-3" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => { setUpdateModal(l); setUpdateStatus(l.status as LoanStatus); }}>Edit</Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* View Loan Dialog */}
      <Dialog open={!!viewLoan} onOpenChange={() => setViewLoan(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Loan Details</DialogTitle></DialogHeader>
          {viewLoan && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-slate-500">Farmer</span><p className="font-semibold">{viewLoan.user?.name ?? "—"}</p></div>
                <div><span className="text-slate-500">Status</span><p><Badge variant={STATUS_VARIANT[viewLoan.status] ?? "secondary"}>{viewLoan.status}</Badge></p></div>
                <div><span className="text-slate-500">Requested</span><p className="font-semibold">{fmt(viewLoan.amount)}</p></div>
                <div><span className="text-slate-500">Approved</span><p className="font-semibold text-green-600">{viewLoan.approvedAmount ? fmt(viewLoan.approvedAmount) : "—"}</p></div>
                <div><span className="text-slate-500">Interest Rate</span><p>{viewLoan.interestRate ? `${viewLoan.interestRate}%` : "—"}</p></div>
                <div><span className="text-slate-500">Tenure</span><p>{viewLoan.tenure} months</p></div>
                <div><span className="text-slate-500">Total Paid</span><p className="text-green-600 font-semibold">{fmt(viewLoan.totalPaid)}</p></div>
                <div><span className="text-slate-500">Due Date</span><p>{viewLoan.dueDate ? new Date(viewLoan.dueDate).toLocaleDateString() : "—"}</p></div>
              </div>
              <div><span className="text-slate-500 block mb-1">Purpose</span><p className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">{viewLoan.purpose}</p></div>
              {viewLoan.notes && <div><span className="text-slate-500 block mb-1">Notes</span><p className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">{viewLoan.notes}</p></div>}
              <div><span className="text-slate-500">Farm</span><p>{viewLoan.user?.farm?.name ?? "—"} · {viewLoan.user?.farm?.location ?? "—"}</p></div>
              <div><span className="text-slate-500">Created</span><p>{new Date(viewLoan.createdAt).toLocaleDateString()}</p></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setViewLoan(null)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={!!updateModal} onOpenChange={() => setUpdateModal(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Update Loan Status</DialogTitle></DialogHeader>
          {updateModal && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-500 mb-1">Farmer: <span className="font-semibold text-slate-800 dark:text-slate-200">{updateModal.user?.name ?? "—"}</span></p>
                <p className="text-sm text-slate-500">Amount: <span className="font-semibold">{fmt(updateModal.approvedAmount ?? updateModal.amount)}</span></p>
              </div>
              <div>
                <Label>New Status</Label>
                <select
                  className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm mt-1"
                  value={updateStatus}
                  onChange={(e) => setUpdateStatus(e.target.value as LoanStatus)}
                >
                  <option value="APPROVED">Approved</option>
                  <option value="DISBURSED">Disbursed</option>
                  <option value="REPAID">Repaid</option>
                  <option value="DEFAULTED">Defaulted</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
              <div>
                <Label>Notes (optional)</Label>
                <Textarea value={updateNotes} onChange={(e) => setUpdateNotes(e.target.value)} placeholder="Add notes about this status change…" rows={3} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpdateModal(null)}>Cancel</Button>
            <Button onClick={handleUpdate} disabled={isPending}>{isPending ? "Saving…" : "Update"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

