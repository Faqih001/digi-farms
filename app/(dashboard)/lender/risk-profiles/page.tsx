"use client";

import { useEffect, useState, useCallback, useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { UserCheck, Eye, Search, TrendingUp, Shield, Sprout, BarChart3, RefreshCw, RotateCcw, Sparkles } from "lucide-react";
import { getRiskProfiles, recalculateCreditScore } from "@/lib/actions/lender";
import AIInsightPanel from "@/components/dashboard/ai-insight-panel";

type Profile = Awaited<ReturnType<typeof getRiskProfiles>>["profiles"][number];

function getScoreColor(score: number) {
  if (score >= 75) return "text-green-600";
  if (score >= 55) return "text-amber-600";
  return "text-red-600";
}

const RISK_BADGE: Record<string, "success" | "warning" | "destructive"> = {
  low: "success",
  medium: "warning",
  high: "destructive",
  very_high: "destructive",
};

export default function RiskProfilesPage() {
  const [data, setData] = useState<Awaited<ReturnType<typeof getRiskProfiles>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("ALL");
  const [isPending, startTransition] = useTransition();
  const [viewProfile, setViewProfile] = useState<Profile | null>(null);
  const [recalcUserId, setRecalcUserId] = useState<string | null>(null);
  const [aiProfile, setAiProfile] = useState<Profile | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const result = await getRiskProfiles({
      riskLevel: riskFilter !== "ALL" ? riskFilter : undefined,
      search: search || undefined,
    });
    setData(result);
    setLoading(false);
  }, [search, riskFilter]);

  useEffect(() => { load(); }, [load]);

  function handleRecalculate(userId: string) {
    setRecalcUserId(userId);
  }

  function confirmRecalculate() {
    if (!recalcUserId) return;
    startTransition(async () => {
      await recalculateCreditScore(recalcUserId);
      setRecalcUserId(null);
      await load();
    });
  }

  const stats = data?.stats;
  const profiles = data?.profiles ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Risk Profiles</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">AI-generated creditworthiness scores for farmers</p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Profiles", value: stats?.total ?? "—", icon: UserCheck, color: "text-purple-600" },
          { label: "Low Risk", value: stats?.low ?? "—", icon: Shield, color: "text-green-600" },
          { label: "Medium Risk", value: stats?.medium ?? "—", icon: TrendingUp, color: "text-amber-600" },
          { label: "High Risk", value: stats?.high ?? "—", icon: BarChart3, color: "text-red-600" },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="p-4 text-center">
              <Icon className={`w-6 h-6 ${color} mx-auto mb-2`} />
              <p className={`text-lg font-bold ${color}`}>{String(value)}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input className="pl-10" placeholder="Search by farmer name or farm..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Very_High">Very High</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-center py-16 text-slate-400">Loading risk profiles...</div>
      ) : profiles.length === 0 ? (
        <div className="text-center py-16 text-slate-400">No risk profiles found.</div>
      ) : (
        <div className="space-y-4">
          {profiles.map((p: Profile) => {
            const riskKey = (p.riskLevel ?? "").toLowerCase().replace(" ", "_");
            const loanCount = p.user?.loanApplications?.length ?? 0;
            const defaults = p.user?.loanApplications?.filter((l) => l.status === "DEFAULTED").length ?? 0;
            const crops = p.user?.farm?.crops?.map((c) => c.name).join(", ") || "—";
            return (
              <Card key={p.id} className="card-hover">
                <CardContent className="p-5">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="font-bold text-slate-900 dark:text-white">{p.user?.name ?? "Unknown"}</h3>
                        <Badge variant={RISK_BADGE[riskKey] ?? "secondary"} className="text-xs">
                          {p.riskLevel ?? "N/A"} Risk
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                        {p.user?.farm?.name ?? "No farm"} • {p.user?.farm?.location ?? "—"}
                        {p.user?.farm?.sizeHectares ? ` • ${p.user.farm.sizeHectares.toFixed(1)} ha` : ""}
                      </p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                        {crops !== "—" && <span className="flex items-center gap-1"><Sprout className="w-3.5 h-3.5 text-green-600" />{crops}</span>}
                        <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-blue-600" />{loanCount} loan{loanCount !== 1 ? "s" : ""}{defaults > 0 ? `, ${defaults} default${defaults !== 1 ? "s" : ""}` : ", 0 defaults"}</span>
                        {p.repaymentCapacity != null && <span className="flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5 text-purple-600" />Repayment: {Number(p.repaymentCapacity).toFixed(0)}%</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className={`text-3xl font-black ${getScoreColor(Number(p.score))}`}>{Number(p.score).toFixed(0)}</p>
                        <p className="text-xs text-slate-400">Credit Score</p>
                        <Progress value={Number(p.score)} className="h-1.5 w-20 mt-1" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Button variant="outline" size="sm" onClick={() => setViewProfile(p)}>
                          <Eye className="w-4 h-4 mr-1" /> Profile
                        </Button>
                        <Button variant="outline" size="sm" className="text-amber-600 border-amber-300 hover:bg-amber-50" onClick={() => handleRecalculate(p.user!.id)} disabled={isPending}>
                          <RotateCcw className="w-3 h-3 mr-1" /> Recalc
                        </Button>
                        <Button variant="outline" size="sm" className="text-purple-600 border-purple-200 hover:bg-purple-50 dark:hover:bg-purple-950" onClick={() => setAiProfile(p)}>
                          <Sparkles className="w-3 h-3 mr-1" /> AI
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

      {/* Full Profile Modal */}
      <Dialog open={!!viewProfile} onOpenChange={() => setViewProfile(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Full Risk Profile — {viewProfile?.user?.name}</DialogTitle>
          </DialogHeader>
          {viewProfile && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-slate-400 text-xs">Credit Score</p><p className={`text-2xl font-black ${getScoreColor(Number(viewProfile.score))}`}>{Number(viewProfile.score).toFixed(0)}</p></div>
                <div><p className="text-slate-400 text-xs">Risk Level</p><Badge variant={RISK_BADGE[(viewProfile.riskLevel ?? "").toLowerCase()] ?? "secondary"}>{viewProfile.riskLevel ?? "N/A"}</Badge></div>
                <div><p className="text-slate-400 text-xs">Repayment Capacity</p><p className="font-semibold">{viewProfile.repaymentCapacity != null ? `${Number(viewProfile.repaymentCapacity).toFixed(0)}%` : "—"}</p></div>
                <div><p className="text-slate-400 text-xs">Farm Viability</p><p className="font-semibold">{viewProfile.farmViability != null ? `${Number(viewProfile.farmViability).toFixed(0)}%` : "—"}</p></div>
                <div><p className="text-slate-400 text-xs">Calculated At</p><p className="font-semibold">{viewProfile.calculatedAt ? new Date(viewProfile.calculatedAt).toLocaleDateString() : "—"}</p></div>
                <div><p className="text-slate-400 text-xs">Email</p><p className="font-semibold truncate">{viewProfile.user?.email ?? "—"}</p></div>
              </div>
              {viewProfile.user?.farm && (
                <div className="border-t pt-3">
                  <p className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Farm Details</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div><p className="text-slate-400 text-xs">Name</p><p className="font-semibold">{viewProfile.user.farm.name}</p></div>
                    <div><p className="text-slate-400 text-xs">Location</p><p className="font-semibold">{viewProfile.user.farm.location ?? "—"}</p></div>
                    <div><p className="text-slate-400 text-xs">Size</p><p className="font-semibold">{viewProfile.user.farm.sizeHectares != null ? `${Number(viewProfile.user.farm.sizeHectares).toFixed(1)} ha` : "—"}</p></div>
                    <div><p className="text-slate-400 text-xs">Crops</p><p className="font-semibold">{viewProfile.user.farm.crops?.map((c) => c.name).join(", ") || "—"}</p></div>
                  </div>
                </div>
              )}
              {viewProfile.user?.loanApplications && viewProfile.user.loanApplications.length > 0 && (
                <div className="border-t pt-3">
                  <p className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Loan History ({viewProfile.user.loanApplications.length} loans)</p>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {viewProfile.user.loanApplications.map((loan) => (
                      <div key={loan.id} className="flex justify-between text-xs">
                        <span className="text-slate-500 truncate">{loan.id.slice(0, 10)}...</span>
                        <Badge variant={loan.status === "REPAID" ? "success" : loan.status === "DEFAULTED" ? "destructive" : "secondary"} className="text-xs">{loan.status}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {viewProfile.factors && typeof viewProfile.factors === "object" && !Array.isArray(viewProfile.factors) && (
                <div className="border-t pt-3">
                  <p className="font-semibold text-slate-700 dark:text-slate-300 mb-3">Score Factors</p>
                  <div className="space-y-2.5">
                    {Object.entries(viewProfile.factors as Record<string, number>)
                      .filter(([k]) => k !== "maxLoanEligible")
                      .map(([key, val]) => {
                        const pct = Math.min(Math.max(Number(val), 0), 100);
                        const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
                        const barColor = pct >= 70 ? "bg-green-500" : pct >= 45 ? "bg-amber-500" : "bg-red-500";
                        const textColor = pct >= 70 ? "text-green-600" : pct >= 45 ? "text-amber-600" : "text-red-600";
                        return (
                          <div key={key}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-slate-500 dark:text-slate-400">{label}</span>
                              <span className={`font-semibold ${textColor}`}>{pct}%</span>
                            </div>
                            <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div className={`h-full ${barColor} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    {(viewProfile.factors as any).maxLoanEligible != null && (
                      <div className="flex items-center justify-between pt-2 mt-1 border-t border-slate-100 dark:border-slate-700">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Max Loan Eligible</span>
                        <span className="text-sm font-bold text-green-600">
                          KES {Number((viewProfile.factors as any).maxLoanEligible).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewProfile(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI Risk Analysis Dialog */}
      <Dialog open={!!aiProfile} onOpenChange={() => setAiProfile(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" /> AI Risk Analysis
            </DialogTitle>
          </DialogHeader>
          {aiProfile && (
            <AIInsightPanel
              module="lender_risk_profiles"
              entityId={aiProfile.id}
              entityLabel={`${aiProfile.user?.name ?? "Farmer"} — Score ${Number(aiProfile.score).toFixed(0)}`}
              contextData={JSON.stringify({
                farmer: aiProfile.user?.name,
                creditScore: Number(aiProfile.score).toFixed(0),
                riskLevel: aiProfile.riskLevel,
                repaymentCapacity: Number(aiProfile.repaymentCapacity ?? 0).toFixed(0),
                farmViability: Number(aiProfile.farmViability ?? 0).toFixed(0),
                farm: aiProfile.user?.farm
                  ? { name: aiProfile.user.farm.name, location: aiProfile.user.farm.location, sizeHectares: aiProfile.user.farm.sizeHectares, crops: aiProfile.user.farm.crops?.map((c) => c.name) }
                  : null,
                loanHistory: {
                  total: aiProfile.user?.loanApplications?.length ?? 0,
                  defaults: aiProfile.user?.loanApplications?.filter((l) => l.status === "DEFAULTED").length ?? 0,
                },
                factors: aiProfile.factors,
              })}
              title="Credit Risk Analysis"
              description="AI assessment of this farmer's creditworthiness and risk factors"
              defaultPrompt="Analyze this farmer's credit risk profile. Evaluate key strengths and weaknesses, explain what's driving the score, and recommend specific actions to improve creditworthiness."
            />
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setAiProfile(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Recalculate Confirm */}
      <Dialog open={!!recalcUserId} onOpenChange={() => setRecalcUserId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Recalculate Credit Score</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-500">This will compute a new credit score based on the latest loan history and farm data for this farmer. Proceed?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRecalcUserId(null)}>Cancel</Button>
            <Button className="bg-amber-600 hover:bg-amber-700 text-white" onClick={confirmRecalculate} disabled={isPending}>
              {isPending ? "Recalculating..." : "Recalculate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

