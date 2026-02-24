"use client";

import { useState, useEffect, useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { FileText, Eye, CheckCircle, XCircle, Clock, Search, DollarSign, Loader2, AlertCircle } from "lucide-react";
import { getLenderApplications, updateLoanStatus } from "@/lib/actions/loan";

type Application = Awaited<ReturnType<typeof getLenderApplications>>[number];

const statusConfig: Record<string, { variant: "success" | "warning" | "destructive" | "info" | "secondary"; icon: typeof CheckCircle; label: string }> = {
  DRAFT:        { variant: "secondary",   icon: FileText,     label: "Draft" },
  SUBMITTED:    { variant: "warning",     icon: Clock,        label: "Submitted" },
  UNDER_REVIEW: { variant: "warning",     icon: Clock,        label: "Under Review" },
  APPROVED:     { variant: "success",     icon: CheckCircle,  label: "Approved" },
  REJECTED:     { variant: "destructive", icon: XCircle,      label: "Rejected" },
  DISBURSED:    { variant: "info",        icon: DollarSign,   label: "Disbursed" },
  REPAID:       { variant: "success",     icon: CheckCircle,  label: "Repaid" },
  DEFAULTED:    { variant: "destructive", icon: AlertCircle,  label: "Defaulted" },
};

export default function LoanApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [actionTarget, setActionTarget] = useState<{ app: Application; type: "approve" | "reject" } | null>(null);
  const [detailApp, setDetailApp] = useState<Application | null>(null);
  const [notes, setNotes] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [pending, startTransition] = useTransition();

  const load = () => getLenderApplications().then(setApplications).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const filtered = applications.filter((a: any) => {
    const name = (a.user as { name?: string | null })?.name ?? "";
    const matchSearch = !search || name.toLowerCase().includes(search.toLowerCase()) || a.purpose.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const openApprove = (app: Application) => { setActionTarget({ app, type: "approve" }); setNotes(""); setInterestRate(""); };
  const openReject = (app: Application) => { setActionTarget({ app, type: "reject" }); setNotes(""); };

  const handleAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionTarget) return;
    const { app, type } = actionTarget;
    startTransition(async () => {
      try {
        if (type === "approve") {
          await updateLoanStatus(app.id, "APPROVED", notes || undefined);
          toast.success("Application approved!");
        } else {
          if (!notes.trim()) { toast.error("Please provide a reason for rejection"); return; }
          await updateLoanStatus(app.id, "REJECTED", notes);
          toast.success("Application rejected");
        }
        setActionTarget(null);
        const data = await getLenderApplications(); setApplications(data);
      } catch (err) { toast.error((err as Error).message); }
    });
  };

  const stats = {
    total: applications.length,
    review: applications.filter((a: any) => ["SUBMITTED", "UNDER_REVIEW"].includes(a.status)).length,
    approved: applications.filter((a: any) => a.status === "APPROVED").length,
    rejected: applications.filter((a: any) => a.status === "REJECTED").length,
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Loan Applications</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Review and manage farmer loan requests</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Applications", value: stats.total, color: "text-green-600" },
          { label: "Under Review", value: stats.review, color: "text-amber-600" },
          { label: "Approved", value: stats.approved, color: "text-blue-600" },
          { label: "Rejected", value: stats.rejected, color: "text-red-600" },
        ].map(({ label, value, color }) => (
          <Card key={label}><CardContent className="p-4 text-center"><p className={`text-2xl font-bold ${color}`}>{value}</p><p className="text-xs text-slate-500 dark:text-slate-400">{label}</p></CardContent></Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Search by farmer or purpose..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="ALL">All Status</option>
              {Object.entries(statusConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">{search || statusFilter !== "ALL" ? "No matching applications" : "No applications yet"}</h3>
          <p className="text-slate-400">Loan applications from farmers will appear here</p>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {filtered.map((a: Application) => {
                const sc = statusConfig[a.status] ?? statusConfig.SUBMITTED;
                const farmerName = (a.user as { name?: string | null })?.name ?? "Unknown Farmer";
                const canAct = ["SUBMITTED", "UNDER_REVIEW"].includes(a.status);
                return (
                  <div key={a.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">{farmerName}</span>
                          <Badge variant={sc.variant} className="text-xs">{sc.label}</Badge>
                          <span className="text-xs text-slate-400">#{a.id.slice(-8).toUpperCase()}</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{a.purpose} • {a.tenure} months • Applied {new Date(a.createdAt).toLocaleDateString()}</p>
                        {a.notes && <p className="text-xs text-slate-400 mt-0.5 italic">{a.notes}</p>}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-lg font-bold text-slate-900 dark:text-white">KES {a.amount.toLocaleString()}</p>
                          {a.interestRate && <p className="text-xs text-slate-400">{a.interestRate}% p.a.</p>}
                        </div>
                        <div className="flex gap-1.5">
                          <Button variant="outline" size="sm" onClick={() => setDetailApp(a)}><Eye className="w-3 h-3 mr-1" />Review</Button>
                          {canAct && (
                            <>
                              <Button size="sm" onClick={() => openApprove(a)} disabled={pending}><CheckCircle className="w-3 h-3" /></Button>
                              <Button size="sm" variant="destructive" onClick={() => openReject(a)} disabled={pending}><XCircle className="w-3 h-3" /></Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Approve / Reject Modal */}
      <Dialog open={!!actionTarget} onOpenChange={open => { if (!open) setActionTarget(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className={actionTarget?.type === "approve" ? "text-green-600 flex items-center gap-2" : "text-red-600 flex items-center gap-2"}>
              {actionTarget?.type === "approve" ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
              {actionTarget?.type === "approve" ? "Approve Application" : "Reject Application"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAction} className="space-y-4 pt-2">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm">
              <p className="font-medium">{(actionTarget?.app.user as { name?: string | null })?.name ?? "Farmer"}</p>
              <p className="text-slate-500 dark:text-slate-400">KES {actionTarget?.app.amount.toLocaleString()} • {actionTarget?.app.tenure} months</p>
              <p className="text-slate-400 text-xs mt-1">{actionTarget?.app.purpose}</p>
            </div>
            {actionTarget?.type === "approve" && (
              <div className="space-y-1.5">
                <Label>Interest Rate (% p.a.)</Label>
                <Input type="number" min="0" max="100" step="0.1" placeholder="12.5" value={interestRate} onChange={e => setInterestRate(e.target.value)} />
              </div>
            )}
            <div className="space-y-1.5">
              <Label>{actionTarget?.type === "reject" ? "Reason for rejection *" : "Notes (optional)"}</Label>
              <Textarea className="min-h-[80px]" placeholder={actionTarget?.type === "reject" ? "Explain why the application was rejected..." : "Add any notes or conditions..."} value={notes} onChange={e => setNotes(e.target.value)} required={actionTarget?.type === "reject"} />
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={pending} variant={actionTarget?.type === "approve" ? "default" : "destructive"} className="flex-1">
                {pending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {actionTarget?.type === "approve" ? "Approve" : "Reject"} Application
              </Button>
              <Button type="button" variant="outline" onClick={() => setActionTarget(null)}>Cancel</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Detail Modal */}
      <Dialog open={!!detailApp} onOpenChange={open => { if (!open) setDetailApp(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Application Details</DialogTitle></DialogHeader>
          {detailApp && (
            <div className="space-y-3 pt-2 text-sm">
              {[
                { label: "Farmer", value: (detailApp.user as { name?: string | null })?.name ?? "Unknown" },
                { label: "Amount", value: `KES ${detailApp.amount.toLocaleString()}` },
                { label: "Purpose", value: detailApp.purpose },
                { label: "Tenure", value: `${detailApp.tenure} months` },
                { label: "Applied", value: new Date(detailApp.createdAt).toLocaleDateString() },
                ...(detailApp.interestRate ? [{ label: "Interest Rate", value: `${detailApp.interestRate}% p.a.` }] : []),
                ...(detailApp.approvedAmount ? [{ label: "Approved Amount", value: `KES ${detailApp.approvedAmount.toLocaleString()}` }] : []),
                ...(detailApp.dueDate ? [{ label: "Due Date", value: new Date(detailApp.dueDate).toLocaleDateString() }] : []),
                ...(detailApp.notes ? [{ label: "Notes", value: detailApp.notes }] : []),
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between gap-4">
                  <span className="text-slate-500 dark:text-slate-400 shrink-0">{label}</span>
                  <span className="font-medium text-right">{value}</span>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

