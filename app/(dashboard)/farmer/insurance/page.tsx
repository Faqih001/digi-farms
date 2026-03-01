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
import { Shield, FileText, AlertTriangle, CheckCircle, Plus, Loader2, X } from "lucide-react";
import { getUserPolicies, getUserClaims, fileClaim } from "@/lib/actions/insurance";

type Policy = Awaited<ReturnType<typeof getUserPolicies>>[number];
type Claim = Awaited<ReturnType<typeof getUserClaims>>[number];

const claimStatusVariant: Record<string, "success" | "warning" | "destructive" | "info" | "secondary"> = {
  FILED: "secondary",
  UNDER_REVIEW: "warning",
  APPROVED: "info",
  REJECTED: "destructive",
  SETTLED: "success",
};

const policyStatusVariant: Record<string, "success" | "warning" | "destructive" | "secondary"> = {
  ACTIVE: "success",
  EXPIRED: "secondary",
  CANCELLED: "destructive",
  CLAIMED: "warning",
};

const plans = [
  { name: "Basic Crop", coverage: "Up to KES 100K", premium: "From KES 5,000/season", features: ["Single crop coverage", "Drought protection", "Basic pest damage"] },
  { name: "Premium Crop", coverage: "Up to KES 500K", premium: "From KES 12,000/season", features: ["Multi-crop coverage", "All weather events", "Pest & disease", "Market price guarantee"] },
  { name: "Comprehensive", coverage: "Up to KES 1M", premium: "From KES 25,000/season", features: ["Crops + Livestock", "All natural disasters", "Equipment coverage", "Income protection", "Priority claims"] },
];

export default function InsurancePage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimOpen, setClaimOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState({ type: "", description: "", amount: "", insurer: "" });

  useEffect(() => {
    Promise.all([getUserPolicies(), getUserClaims()])
      .then(([p, c]) => { setPolicies(p); setClaims(c); })
      .catch(() => toast.error("Failed to load insurance data"))
      .finally(() => setLoading(false));
  }, []);

  const handleFileClaim = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        await fileClaim({
          type: form.type,
          description: form.description,
          amount: parseFloat(form.amount),
          insurer: form.insurer || undefined,
        });
        toast.success("Claim filed successfully!");
        setClaimOpen(false);
        setForm({ type: "", description: "", amount: "", insurer: "" });
        const [p, c] = await Promise.all([getUserPolicies(), getUserClaims()]);
        setPolicies(p);
        setClaims(c);
      } catch (err) { toast.error((err as Error).message); }
    });
  };

  const activePolicies = policies.filter((p) => p.status === "ACTIVE").length;
  const totalCoverage = policies.filter((p) => p.status === "ACTIVE").reduce((s, p) => s + p.coverageAmount, 0);
  const totalPayouts = claims.filter((c) => c.status === "SETTLED").reduce((s, c) => s + c.amount, 0);

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Insurance</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Protect your farm against risks with affordable agri-insurance</p>
        </div>
        <Dialog open={claimOpen} onOpenChange={setClaimOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4" /> File Claim</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>File Insurance Claim</DialogTitle></DialogHeader>
            <form onSubmit={handleFileClaim} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label>Claim Type *</Label>
                <Input placeholder="e.g., Drought Damage, Pest Infestation" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} required />
              </div>
              <div className="space-y-1.5">
                <Label>Description *</Label>
                <Textarea placeholder="Describe the damage and circumstances..." value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="min-h-[80px]" required />
              </div>
              <div className="space-y-1.5">
                <Label>Claim Amount (KES) *</Label>
                <Input type="number" placeholder="45000" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} required />
              </div>
              <div className="space-y-1.5">
                <Label>Insurer</Label>
                <Input placeholder="Insurance provider name" value={form.insurer} onChange={(e) => setForm((f) => ({ ...f, insurer: e.target.value }))} />
              </div>
              <div className="flex gap-3">
                <Button type="submit" disabled={pending} className="flex-1">
                  {pending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <FileText className="w-4 h-4 mr-2" />} Submit Claim
                </Button>
                <Button type="button" variant="outline" onClick={() => setClaimOpen(false)}>Cancel</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Policies", value: activePolicies, icon: Shield, color: "text-green-600 bg-green-100 dark:bg-green-900/30" },
          { label: "Total Coverage", value: `KES ${(totalCoverage / 1000).toFixed(0)}K`, icon: CheckCircle, color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30" },
          { label: "Claims Filed", value: claims.length, icon: FileText, color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30" },
          { label: "Total Payouts", value: `KES ${(totalPayouts / 1000).toFixed(0)}K`, icon: AlertTriangle, color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30" },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}><Icon className="w-5 h-5" /></div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Policies */}
      <Card>
        <CardHeader><CardTitle>My Policies</CardTitle></CardHeader>
        <CardContent>
          {policies.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Shield className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No insurance policies yet. Explore plans below.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {policies.map((p) => (
                <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 dark:text-white text-sm">{p.provider}</span>
                        <Badge variant={policyStatusVariant[p.status] ?? "secondary"} className="text-xs">{p.status}</Badge>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{p.cropCovered} · Coverage: KES {p.coverageAmount.toLocaleString()}</p>
                      <p className="text-xs text-slate-400">Premium: KES {p.premium.toLocaleString()} · {p.policyNumber}</p>
                      <p className="text-xs text-slate-400">
                        {new Date(p.startDate).toLocaleDateString()} – {new Date(p.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Claims History */}
      {claims.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Recent Claims</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {claims.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{c.type}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(c.createdAt).toLocaleDateString("en-KE", { year: "numeric", month: "short", day: "numeric" })}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">KES {c.amount.toLocaleString()}</p>
                    <Badge variant={claimStatusVariant[c.status] ?? "secondary"} className="text-xs">{c.status.replace("_", " ")}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Plans */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Available Insurance Plans</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {plans.map((plan, i) => (
            <Card key={plan.name} className={i === 1 ? "border-green-500 border-2" : ""}>
              <CardContent className="p-6">
                {i === 1 && <Badge className="mb-3">Most Popular</Badge>}
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                <p className="text-sm text-green-600 font-semibold mt-1">{plan.coverage}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{plan.premium}</p>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Button variant={i === 1 ? "default" : "outline"} className="w-full">Choose Plan</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
