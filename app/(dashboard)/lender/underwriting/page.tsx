"use client";

import { useEffect, useState, useCallback, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Brain, Shield, AlertTriangle, CheckCircle, Clock, Search, Eye, RefreshCw, XCircle, Sparkles } from "lucide-react";
import { getUnderwritingQueue, approveApplication, rejectApplication, setUnderReview } from "@/lib/actions/lender";
import AIInsightPanel from "@/components/dashboard/ai-insight-panel";

type UnderwritingApp = Awaited<ReturnType<typeof getUnderwritingQueue>>["applications"][number];

function ScoreBar({ label, value }: { label: string; value: number }) {
  const pct = Math.min(Math.max(value, 0), 100);
  const color = pct >= 70 ? "bg-green-500" : pct >= 50 ? "bg-amber-500" : "bg-red-500";
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-500 dark:text-slate-400">{label}</span>
        <span className="font-medium text-slate-700 dark:text-slate-300">{pct}%</span>
      </div>
      <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

const RISK_COLOR: Record<string, string> = {
  LOW: "text-green-600",
  MEDIUM: "text-amber-600",
  HIGH: "text-red-600",
  VERY_HIGH: "text-red-700",
};

const fmt = new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 });

export default function UnderwritingPage() {
  const [data, setData] = useState<Awaited<ReturnType<typeof getUnderwritingQueue>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isPending, startTransition] = useTransition();

  // Approve modal
  const [approveApp, setApproveApp] = useState<UnderwritingApp | null>(null);
  const [approvedAmount, setApprovedAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [approveNotes, setApproveNotes] = useState("");

  // Reject modal
  const [rejectApp, setRejectApp] = useState<UnderwritingApp | null>(null);
  const [rejectNotes, setRejectNotes] = useState("");

  // View modal
  const [viewApp, setViewApp] = useState<UnderwritingApp | null>(null);

  // AI modal
  const [aiApp, setAiApp] = useState<UnderwritingApp | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const result = await getUnderwritingQueue();
    setData(result);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = (data?.applications ?? []).filter((a) => {
    const matchSearch =
      !search ||
      a.user.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.purpose?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  function openApprove(a: UnderwritingApp) {
    setApproveApp(a);
    setApprovedAmount(a.amount?.toString() ?? "");
    setInterestRate("12");
    setApproveNotes("");
  }

  function openReject(a: UnderwritingApp) {
    setRejectApp(a);
    setRejectNotes("");
  }

  function handleApprove() {
    if (!approveApp) return;
    startTransition(async () => {
      await approveApplication(approveApp.id, parseFloat(approvedAmount), parseFloat(interestRate), approveNotes || undefined);
      setApproveApp(null);
      await load();
    });
  }

  function handleReject() {
    if (!rejectApp) return;
    startTransition(async () => {
      await rejectApplication(rejectApp.id, rejectNotes);
      setRejectApp(null);
      await load();
    });
  }

  function handleSetUnderReview(id: string) {
    startTransition(async () => {
      await setUnderReview(id);
      await load();
    });
  }

  const stats = data?.stats;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">AI Underwriting</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Automated risk assessment and loan decisions</p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Brain, label: "Total in Queue", value: stats?.total ?? "—", color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-950" },
          { icon: Clock, label: "Submitted", value: stats?.submitted ?? "—", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950" },
          { icon: AlertTriangle, label: "Under Review", value: stats?.underReview ?? "—", color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950" },
          { icon: Shield, label: "Avg Credit Score", value: stats?.avgCreditScore != null ? stats.avgCreditScore.toFixed(0) : "—", color: "text-green-600", bg: "bg-green-50 dark:bg-green-950" },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <Card key={label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <p className={`text-xl font-bold ${color}`}>{String(value)}</p>
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
              <Input className="pl-10" placeholder="Search by farmer or purpose..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm"
            >
              <option value="ALL">All Statuses</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="UNDER_REVIEW">Under Review</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-center py-16 text-slate-400">Loading underwriting queue...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">No applications in queue.</div>
      ) : (
        <div className="space-y-4">
          {filtered.map((a) => {
            const creditScore = a.creditScores?.[0];
            const repaymentCapacity = creditScore?.repaymentCapacity ?? 0;
            const farmViability = creditScore?.farmViability ?? 0;
            const score = creditScore?.score ?? 0;
            const riskLevel = creditScore?.riskLevel ?? "N/A";
            return (
              <Card key={a.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Brain className="w-5 h-5 text-purple-500" />
                        <span className="font-bold text-slate-900 dark:text-white">{a.user.name}</span>
                        <Badge variant={a.status === "SUBMITTED" ? "secondary" : "warning"}>
                          {a.status === "UNDER_REVIEW" ? "Under Review" : "Submitted"}
                        </Badge>
                        <span className="text-xs text-slate-400">{a.id.slice(0, 8).toUpperCase()}</span>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {a.amount != null ? fmt.format(Number(a.amount)) : "—"}
                        {a.purpose ? ` • ${a.purpose}` : ""}
                        {a.farm?.name ? ` • ${a.farm.name}` : ""}
                        {a.farm?.location ? `, ${a.farm.location}` : ""}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <ScoreBar label="Repayment Capacity" value={repaymentCapacity} />
                        <ScoreBar label="Farm Viability" value={farmViability} />
                      </div>
                      {a.notes && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 italic">Notes: {a.notes}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-center justify-center gap-3 min-w-[120px]">
                      <div className="text-center">
                        <p className="text-3xl font-black text-slate-900 dark:text-white">{score > 0 ? score.toFixed(0) : "—"}</p>
                        <p className="text-xs text-slate-400">Credit Score</p>
                        {riskLevel !== "N/A" && (
                          <p className={`text-xs font-semibold mt-0.5 ${RISK_COLOR[riskLevel] ?? "text-slate-500"}`}>{riskLevel} RISK</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-1.5 w-full">
                        <Button size="sm" variant="outline" className="w-full" onClick={() => setViewApp(a)}>
                          <Eye className="w-3 h-3 mr-1" /> View
                        </Button>
                        {a.status === "SUBMITTED" && (
                          <Button size="sm" variant="outline" className="w-full text-amber-600 border-amber-300" onClick={() => handleSetUnderReview(a.id)} disabled={isPending}>
                            <Clock className="w-3 h-3 mr-1" /> Review
                          </Button>
                        )}
                        <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700 text-white" onClick={() => setAiApp(a)}>
                          <Sparkles className="w-3 h-3 mr-1" /> AI Analyze
                        </Button>
                        <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={() => openApprove(a)} disabled={isPending}>
                          <CheckCircle className="w-3 h-3 mr-1" /> Approve
                        </Button>
                        <Button size="sm" variant="destructive" className="w-full" onClick={() => openReject(a)} disabled={isPending}>
                          <XCircle className="w-3 h-3 mr-1" /> Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* View Details Modal */}
      <Dialog open={!!viewApp} onOpenChange={() => setViewApp(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
          </DialogHeader>
          {viewApp && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div><p className="text-slate-400 text-xs">Farmer</p><p className="font-semibold">{viewApp.user.name}</p></div>
                <div><p className="text-slate-400 text-xs">Email</p><p className="font-semibold">{viewApp.user.email}</p></div>
                <div><p className="text-slate-400 text-xs">Requested Amount</p><p className="font-semibold">{viewApp.amount != null ? fmt.format(Number(viewApp.amount)) : "—"}</p></div>
                <div><p className="text-slate-400 text-xs">Status</p><p className="font-semibold">{viewApp.status}</p></div>
                <div><p className="text-slate-400 text-xs">Purpose</p><p className="font-semibold">{viewApp.purpose ?? "—"}</p></div>
                <div><p className="text-slate-400 text-xs">Tenure (months)</p><p className="font-semibold">{viewApp.tenure ?? "—"}</p></div>
                <div><p className="text-slate-400 text-xs">Farm</p><p className="font-semibold">{viewApp.farm?.name ?? "—"}</p></div>
                <div><p className="text-slate-400 text-xs">Farm Location</p><p className="font-semibold">{viewApp.farm?.location ?? "—"}</p></div>
              </div>
              {viewApp.creditScores?.[0] && (
                <div className="border-t pt-3 space-y-2">
                  <p className="font-semibold text-slate-700 dark:text-slate-300">Credit Score Details</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div><p className="text-slate-400 text-xs">Score</p><p className="font-semibold">{viewApp.creditScores[0].score.toFixed(1)}</p></div>
                    <div><p className="text-slate-400 text-xs">Risk Level</p><p className={`font-semibold ${RISK_COLOR[viewApp.creditScores[0].riskLevel] ?? ""}`}>{viewApp.creditScores[0].riskLevel}</p></div>
                    <div><p className="text-slate-400 text-xs">Repayment Capacity</p><p className="font-semibold">{viewApp.creditScores[0].repaymentCapacity}%</p></div>
                    <div><p className="text-slate-400 text-xs">Farm Viability</p><p className="font-semibold">{viewApp.creditScores[0].farmViability}%</p></div>
                  </div>
                </div>
              )}
              {viewApp.notes && <div className="border-t pt-3"><p className="text-slate-400 text-xs">Notes</p><p>{viewApp.notes}</p></div>}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewApp(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Modal */}
      <Dialog open={!!approveApp} onOpenChange={() => setApproveApp(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Application</DialogTitle>
          </DialogHeader>
          {approveApp && (
            <div className="space-y-4">
              <p className="text-sm text-slate-500">
                Approving loan for <strong>{approveApp.user.name}</strong> — requested {approveApp.amount != null ? fmt.format(Number(approveApp.amount)) : "—"}
              </p>
              <div className="space-y-2">
                <Label>Approved Amount (KES)</Label>
                <Input type="number" value={approvedAmount} onChange={(e) => setApprovedAmount(e.target.value)} placeholder="e.g. 150000" />
              </div>
              <div className="space-y-2">
                <Label>Interest Rate (%)</Label>
                <Input type="number" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} placeholder="e.g. 12" />
              </div>
              <div className="space-y-2">
                <Label>Notes (optional)</Label>
                <Textarea value={approveNotes} onChange={(e) => setApproveNotes(e.target.value)} placeholder="Any conditions or remarks..." rows={3} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveApp(null)}>Cancel</Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleApprove} disabled={isPending || !approvedAmount || !interestRate}>
              {isPending ? "Approving..." : "Approve Loan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI Analysis Dialog */}
      <Dialog open={!!aiApp} onOpenChange={() => setAiApp(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" /> AI Underwriting Analysis
            </DialogTitle>
          </DialogHeader>
          {aiApp && (
            <AIInsightPanel
              module="lender_underwriting"
              entityId={aiApp.id}
              entityLabel={`${aiApp.user.name} — ${aiApp.amount != null ? fmt.format(Number(aiApp.amount)) : ""}`}
              contextData={JSON.stringify({
                applicationId: aiApp.id,
                farmer: aiApp.user.name,
                email: aiApp.user.email,
                requestedAmount: aiApp.amount,
                purpose: aiApp.purpose,
                tenure: aiApp.tenure,
                status: aiApp.status,
                farm: aiApp.farm ? { name: aiApp.farm.name, location: aiApp.farm.location, sizeHectares: aiApp.farm.sizeHectares } : null,
                creditScore: aiApp.creditScores?.[0] ? {
                  score: aiApp.creditScores[0].score,
                  riskLevel: aiApp.creditScores[0].riskLevel,
                  repaymentCapacity: aiApp.creditScores[0].repaymentCapacity,
                  farmViability: aiApp.creditScores[0].farmViability,
                } : null,
              })}
              title="Loan Risk Analysis"
              description="AI-powered underwriting assessment for this loan application"
              defaultPrompt="Perform a comprehensive risk assessment of this loan application. Evaluate creditworthiness, recommend approval or rejection with reasoning, and suggest optimal loan terms."
            />
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setAiApp(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Modal */}
      <Dialog open={!!rejectApp} onOpenChange={() => setRejectApp(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
          </DialogHeader>
          {rejectApp && (
            <div className="space-y-4">
              <p className="text-sm text-slate-500">
                Rejecting loan for <strong>{rejectApp.user.name}</strong>
              </p>
              <div className="space-y-2">
                <Label>Reason for Rejection <span className="text-red-500">*</span></Label>
                <Textarea value={rejectNotes} onChange={(e) => setRejectNotes(e.target.value)} placeholder="Explain the reason for rejection..." rows={4} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectApp(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject} disabled={isPending || !rejectNotes.trim()}>
              {isPending ? "Rejecting..." : "Reject Application"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
