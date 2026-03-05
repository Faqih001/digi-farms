"use client";

import { useState, useEffect, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Wallet, Clock, CheckCircle, DollarSign, X, Loader2,
  RefreshCw, AlertCircle, CreditCard, ArrowDownToLine,
} from "lucide-react";
import { toast } from "sonner";
import { getSupplierPayouts, requestPayout, getSupplierRevenueStats } from "@/lib/actions/supplier";

type Payout = Awaited<ReturnType<typeof getSupplierPayouts>>[number];

const STATUS_CFG: Record<string, { label: string; cls: string; icon: typeof CheckCircle }> = {
  COMPLETED: { label: "Completed", cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", icon: CheckCircle },
  PENDING:   { label: "Pending",   cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", icon: Clock },
  FAILED:    { label: "Failed",    cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",         icon: AlertCircle },
  REFUNDED:  { label: "Refunded",  cls: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400", icon: ArrowDownToLine },
};

const METHODS = ["M-Pesa", "Bank Transfer", "Equity Bank", "KCB Bank", "Cooperative Bank"];

export default function PayoutsPage() {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [stats, setStats] = useState<{ totalRevenue: number; pendingRevenue: number; totalPaidOut: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("M-Pesa");
  const [isPending, startTransition] = useTransition();

  async function load() {
    setLoading(true);
    try {
      const [p, s] = await Promise.all([
        getSupplierPayouts(),
        getSupplierRevenueStats("all"),
      ]);
      setPayouts(p);
      setStats({ totalRevenue: s.totalRevenue, pendingRevenue: s.pendingRevenue, totalPaidOut: s.totalPaidOut });
    } catch {
      toast.error("Failed to load payouts");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function handleRequest() {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) { toast.error("Enter a valid amount"); return; }
    startTransition(async () => {
      try {
        await requestPayout({ amount: amt, method });
        toast.success("Payout request submitted");
        setShowDialog(false);
        setAmount("");
        await load();
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to request payout");
      }
    });
  }

  const availableBalance = stats ? stats.totalRevenue - stats.totalPaidOut : 0;
  const pendingPayouts = payouts.filter((p) => p.status === "PENDING");
  const completedTotal = payouts.filter((p) => p.status === "COMPLETED").reduce((s, p) => s + p.amount, 0);
  const thisMonthTotal = payouts
    .filter((p) => {
      const d = new Date(p.createdAt);
      const now = new Date();
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    })
    .reduce((s, p) => s + p.amount, 0);

  const statCards = [
    { label: "Available Balance", value: `KES ${availableBalance.toLocaleString()}`, icon: Wallet, color: "text-green-600 bg-green-100 dark:bg-green-900/30" },
    { label: "Pending Payouts", value: pendingPayouts.length > 0 ? `KES ${pendingPayouts.reduce((s, p) => s + p.amount, 0).toLocaleString()}` : "—", icon: Clock, color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30" },
    { label: "This Month", value: thisMonthTotal > 0 ? `KES ${thisMonthTotal.toLocaleString()}` : "—", icon: DollarSign, color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30" },
    { label: "Lifetime Payouts", value: completedTotal > 0 ? `KES ${completedTotal.toLocaleString()}` : "—", icon: CheckCircle, color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Payouts</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Track your withdrawal history and request payouts</p>
        </div>
        <div className="flex gap-2 self-start sm:self-auto">
          <Button variant="outline" onClick={load} disabled={loading} className="rounded-xl">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button onClick={() => setShowDialog(true)} className="bg-green-600 hover:bg-green-700 text-white rounded-xl">
            <Wallet className="w-4 h-4 mr-2" /> Request Payout
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}><Icon className="w-5 h-5" /></div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
                  {loading
                    ? <div className="h-5 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mt-1" />
                    : <p className="text-base font-bold text-slate-900 dark:text-white leading-tight">{value}</p>
                  }
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pending payouts alert */}
      {!loading && pendingPayouts.length > 0 && (
        <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/10">
          <CardContent className="p-4 flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-400">
                {pendingPayouts.length} Pending {pendingPayouts.length === 1 ? "payout" : "payouts"} — KES {pendingPayouts.reduce((s, p) => s + p.amount, 0).toLocaleString()} awaiting processing
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-500 mt-0.5">Payouts are typically processed within 1–3 business days.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payout history */}
      <Card>
        <CardHeader><CardTitle>Payout History</CardTitle></CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
          ) : payouts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <CreditCard className="w-12 h-12 text-slate-300 mb-3" />
              <p className="text-slate-500 dark:text-slate-400 font-medium">No payouts yet</p>
              <p className="text-sm text-slate-400 mt-1">Request your first payout once you have completed orders</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {payouts.map((p) => {
                const cfg = STATUS_CFG[p.status] ?? STATUS_CFG.PENDING;
                const StatusIcon = cfg.icon;
                return (
                  <div key={p.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.cls}`}>
                        <StatusIcon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm text-slate-900 dark:text-white truncate">{p.reference ?? `PAY-${p.id.slice(-6).toUpperCase()}`}</span>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${cfg.cls}`}>{cfg.label}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {new Date(p.createdAt).toLocaleDateString("en-KE", { year: "numeric", month: "short", day: "numeric" })}
                          {p.processedAt && ` · Processed ${new Date(p.processedAt).toLocaleDateString("en-KE", { month: "short", day: "numeric" })}`}
                        </p>
                      </div>
                    </div>
                    <p className="font-bold text-slate-900 dark:text-white text-sm flex-shrink-0">KES {p.amount.toLocaleString()}</p>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Request Payout Dialog */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => !isPending && setShowDialog(false)} />
          <div className="relative z-10 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Request Payout</h2>
              {!isPending && (
                <button onClick={() => setShowDialog(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <div className="p-5 space-y-4">
              {/* Balance info */}
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl p-3">
                <p className="text-xs text-slate-500 dark:text-slate-400">Available balance</p>
                <p className="text-xl font-black text-green-700 dark:text-green-400">KES {availableBalance.toLocaleString()}</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Amount (KES)</label>
                <Input
                  type="number"
                  min={1}
                  max={availableBalance}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="rounded-xl"
                  placeholder="Enter amount"
                  autoFocus
                />
                {parseFloat(amount) > availableBalance && (
                  <p className="text-xs text-red-500">Amount exceeds available balance</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Payment Method</label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {METHODS.map((m) => <option key={m}>{m}</option>)}
                </select>
              </div>

              <p className="text-xs text-slate-400">Payouts are processed within 1–3 business days. You will receive a confirmation once processed.</p>
            </div>
            <div className="px-5 pb-5 flex gap-3">
              <Button variant="outline" className="flex-1 rounded-xl" disabled={isPending} onClick={() => setShowDialog(false)}>Cancel</Button>
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl"
                disabled={isPending || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > availableBalance}
                onClick={handleRequest}
              >
                {isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting…</> : "Submit Request"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
