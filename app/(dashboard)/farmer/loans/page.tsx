"use client";

import { useState, useEffect, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { FileText, Clock, CheckCircle, XCircle, Plus, Loader2, Trash2, AlertCircle, DollarSign, Send } from "lucide-react";
import { getFarmerLoans, submitLoanApplication, cancelLoanApplication, submitDraftLoan } from "@/lib/actions/loan";

type Loan = Awaited<ReturnType<typeof getFarmerLoans>>[number];

const statusConfig: Record<string, { variant: "success" | "warning" | "destructive" | "info" | "secondary"; icon: typeof CheckCircle }> = {
  DRAFT: { variant: "secondary", icon: FileText },
  SUBMITTED: { variant: "warning", icon: Clock },
  UNDER_REVIEW: { variant: "warning", icon: Clock },
  APPROVED: { variant: "success", icon: CheckCircle },
  REJECTED: { variant: "destructive", icon: XCircle },
  DISBURSED: { variant: "info", icon: DollarSign },
  REPAID: { variant: "success", icon: CheckCircle },
  DEFAULTED: { variant: "destructive", icon: AlertCircle },
};

export default function LoanApplicationsPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyOpen, setApplyOpen] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<Loan | null>(null);
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState({ amount: "", purpose: "", tenure: "" });

  useEffect(() => {
    getFarmerLoans().then(setLoans).finally(() => setLoading(false));
  }, []);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        await submitLoanApplication({
          amount: parseFloat(form.amount),
          purpose: form.purpose,
          tenure: parseInt(form.tenure),
        });
        toast.success("Application submitted!");
        setApplyOpen(false);
        setForm({ amount: "", purpose: "", tenure: "" });
        const data = await getFarmerLoans();
        setLoans(data);
      } catch (err) { toast.error((err as Error).message); }
    });
  };

  const handleCancel = () => {
    if (!cancelTarget) return;
    startTransition(async () => {
      try {
        await cancelLoanApplication(cancelTarget.id);
        toast.success("Application cancelled");
        setCancelTarget(null);
        const data = await getFarmerLoans();
        setLoans(data);
      } catch (err) { toast.error((err as Error).message); }
    });
  };

  const handleSubmitDraft = (loan: Loan) => {
    startTransition(async () => {
      try {
        await submitDraftLoan(loan.id);
        toast.success("Application submitted for review!");
        const data = await getFarmerLoans();
        setLoans(data);
      } catch (err) { toast.error((err as Error).message); }
    });
  };

  const totalApproved = loans.filter((l: any) => ["APPROVED", "DISBURSED"].includes(l.status)).reduce((s: number, l: Loan) => s + l.amount, 0);
  const pending_ = loans.filter((l: any) => ["SUBMITTED", "UNDER_REVIEW"].includes(l.status)).length;

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Loan Applications</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Apply for agricultural financing and track your loans</p>
        </div>
        <Dialog open={applyOpen} onOpenChange={setApplyOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" /> New Application</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>New Loan Application</DialogTitle></DialogHeader>
            <form onSubmit={handleApply} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label>Loan Amount (KES) *</Label>
                <Input type="number" placeholder="50,000" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} required />
              </div>
              <div className="space-y-1.5">
                <Label>Purpose *</Label>
                <Textarea placeholder="Describe how you will use the loan (min 10 characters)..." value={form.purpose} onChange={e => setForm(f => ({ ...f, purpose: e.target.value }))} className="min-h-[80px]" required />
              </div>
              <div className="space-y-1.5">
                <Label>Repayment Period (months) *</Label>
                <Input type="number" min="1" max="60" placeholder="6" value={form.tenure} onChange={e => setForm(f => ({ ...f, tenure: e.target.value }))} required />
              </div>
              <div className="flex gap-3">
                <Button type="submit" disabled={pending} className="flex-1">
                  {pending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <FileText className="w-4 h-4 mr-2" />} Submit Application
                </Button>
                <Button type="button" variant="outline" onClick={() => setApplyOpen(false)}>Cancel</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Applications", value: loans.length, color: "text-blue-600" },
          { label: "Pending Review", value: pending_, color: "text-amber-600" },
          { label: "Approved/Active", value: loans.filter((l: any) => ["APPROVED", "DISBURSED"].includes(l.status)).length, color: "text-green-600" },
          { label: "Total Approved", value: `KES ${(totalApproved / 1000).toFixed(0)}K`, color: "text-purple-600" },
        ].map(({ label, value, color }) => (
          <Card key={label}><CardContent className="p-4 text-center"><p className={`text-2xl font-bold ${color}`}>{value}</p><p className="text-xs text-slate-500 dark:text-slate-400">{label}</p></CardContent></Card>
        ))}
      </div>

      {loans.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">No loan applications yet</h3>
          <p className="text-slate-400 mb-6">Apply for agricultural financing to grow your farm</p>
          <Button onClick={() => setApplyOpen(true)} className="mx-auto"><Plus className="w-4 h-4 mr-2" /> Apply Now</Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {loans.map((loan: Loan) => {
            const sc = statusConfig[loan.status] ?? statusConfig.SUBMITTED;
            const Icon = sc.icon;
            const canCancel = ["DRAFT", "SUBMITTED"].includes(loan.status);
            return (
              <Card key={loan.id} className="p-4">
                <CardContent className="p-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant={sc.variant} className="text-xs">{loan.status.replace("_", " ")}</Badge>
                          <span className="text-xs text-slate-400">Applied {new Date(loan.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">{loan.purpose}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-lg text-slate-900 dark:text-white">KES {loan.amount.toLocaleString()}</div>
                      <div className="text-xs text-slate-400">{loan.tenure} months</div>
                    </div>
                  </div>
                  {loan.status === "APPROVED" && loan.interestRate && (
                    <div className="grid grid-cols-3 gap-3 text-center bg-green-50 dark:bg-green-950/20 rounded-xl p-3 text-xs mb-3">
                      <div><div className="text-slate-400">Interest Rate</div><div className="font-semibold">{loan.interestRate}% p.a.</div></div>
                      {loan.dueDate && <div><div className="text-slate-400">Due Date</div><div className="font-semibold">{new Date(loan.dueDate).toLocaleDateString()}</div></div>}
                      {loan.approvedAmount && <div><div className="text-slate-400">Approved Amount</div><div className="font-semibold text-green-600">KES {loan.approvedAmount.toLocaleString()}</div></div>}
                    </div>
                  )}
                  {loan.notes && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs text-slate-600 dark:text-slate-400 mb-3">
                      <span className="font-semibold">Note: </span>{loan.notes}
                    </div>
                  )}
                  {canCancel && (
                    <div className="flex gap-2 justify-end">
                      {loan.status === "DRAFT" && (
                        <Button size="sm" disabled={pending} onClick={() => handleSubmitDraft(loan)}>
                          {pending ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : <Send className="w-3.5 h-3.5 mr-1" />} Submit
                        </Button>
                      )}
                      <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600 border-red-200" onClick={() => setCancelTarget(loan)}>
                        <Trash2 className="w-3.5 h-3.5 mr-1" /> Withdraw
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={!!cancelTarget} onOpenChange={open => { if (!open) setCancelTarget(null); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle className="flex items-center gap-2 text-red-600"><AlertCircle className="w-5 h-5" /> Withdraw Application</DialogTitle></DialogHeader>
          <p className="text-slate-600 dark:text-slate-400 text-sm">Are you sure you want to withdraw this loan application for KES {cancelTarget?.amount.toLocaleString()}? This action cannot be undone.</p>
          <div className="flex gap-3 pt-2">
            <Button variant="destructive" disabled={pending} onClick={handleCancel} className="flex-1">
              {pending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />} Withdraw
            </Button>
            <Button variant="outline" onClick={() => setCancelTarget(null)}>Keep It</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const loans = [
  { id: "LN001", lender: "Equity Agri Finance", amount: 150000, status: "APPROVED", applied: "Jun 15", approved: "Jun 22", due: "Dec 22", balance: 95000 },
  { id: "LN002", lender: "KCB Kilimo", amount: 50000, status: "PENDING", applied: "Jul 20", approved: null, due: null, balance: 50000 },
];
