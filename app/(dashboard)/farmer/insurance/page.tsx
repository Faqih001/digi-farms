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
import { Shield, FileText, AlertTriangle, CheckCircle, Plus, Loader2, X, Trash2 } from "lucide-react";
import { getUserPolicies, getUserClaims, fileClaim, createPolicy, deletePolicy } from "@/lib/actions/insurance";

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
  { name: "Basic Crop", coverage: "Up to KES 100K", coverageAmount: 100000, premium: 5000, features: ["Single crop coverage", "Drought protection", "Basic pest damage"] },
  { name: "Premium Crop", coverage: "Up to KES 500K", coverageAmount: 500000, premium: 12000, features: ["Multi-crop coverage", "All weather events", "Pest & disease", "Market price guarantee"] },
  { name: "Comprehensive", coverage: "Up to KES 1M", coverageAmount: 1000000, premium: 25000, features: ["Crops + Livestock", "All natural disasters", "Equipment coverage", "Income protection", "Priority claims"] },
];

export default function InsurancePage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimOpen, setClaimOpen] = useState(false);
  const [policyOpen, setPolicyOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Policy | null>(null);
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState({ type: "", description: "", amount: "", insurer: "" });
  const [policyForm, setPolicyForm] = useState({
    provider: "", cropCovered: "", coverageAmount: "", premium: "", startDate: "", endDate: "",
  });

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

  const handleCreatePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        await createPolicy({
          provider: policyForm.provider,
          cropCovered: policyForm.cropCovered,
          coverageAmount: parseFloat(policyForm.coverageAmount),
          premium: parseFloat(policyForm.premium),
          startDate: policyForm.startDate,
          endDate: policyForm.endDate,
        });
        toast.success("Policy created successfully!");
        setPolicyOpen(false);
        setPolicyForm({ provider: "", cropCovered: "", coverageAmount: "", premium: "", startDate: "", endDate: "" });
        const [p, c] = await Promise.all([getUserPolicies(), getUserClaims()]);
        setPolicies(p);
        setClaims(c);
      } catch (err) { toast.error((err as Error).message); }
    });
  };

  const handleDeletePolicy = (policy: Policy) => {
    setDeleteTarget(policy);
  };

  const confirmDeletePolicy = () => {
    if (!deleteTarget) return;
    startTransition(async () => {
      try {
        await deletePolicy(deleteTarget.id);
        toast.success("Policy deleted");
        setDeleteTarget(null);
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
        <div className="flex gap-2 flex-wrap">
          <Dialog open={policyOpen} onOpenChange={setPolicyOpen}>
            <DialogTrigger asChild>
              <Button variant="outline"><Shield className="w-4 h-4" /> Add Policy</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader><DialogTitle>Subscribe to Insurance Plan</DialogTitle></DialogHeader>
              <form onSubmit={handleCreatePolicy} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label>Insurance Provider *</Label>
                  <Input placeholder="e.g., Jubilee Insurance, Britam" value={policyForm.provider} onChange={(e) => setPolicyForm(f => ({ ...f, provider: e.target.value }))} required />
                </div>
                <div className="space-y-1.5">
                  <Label>Crop / Livestock Covered *</Label>
                  <Input placeholder="e.g., Maize, Tomatoes, Dairy Cattle" value={policyForm.cropCovered} onChange={(e) => setPolicyForm(f => ({ ...f, cropCovered: e.target.value }))} required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Coverage Amount (KES) *</Label>
                    <Input type="number" placeholder="100000" value={policyForm.coverageAmount} onChange={(e) => setPolicyForm(f => ({ ...f, coverageAmount: e.target.value }))} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Premium (KES) *</Label>
                    <Input type="number" placeholder="5000" value={policyForm.premium} onChange={(e) => setPolicyForm(f => ({ ...f, premium: e.target.value }))} required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Start Date *</Label>
                    <Input type="date" value={policyForm.startDate} onChange={(e) => setPolicyForm(f => ({ ...f, startDate: e.target.value }))} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label>End Date *</Label>
                    <Input type="date" value={policyForm.endDate} onChange={(e) => setPolicyForm(f => ({ ...f, endDate: e.target.value }))} required />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button type="submit" disabled={pending} className="flex-1">
                    {pending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Shield className="w-4 h-4 mr-2" />} Activate Policy
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setPolicyOpen(false)}>Cancel</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

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
                  <button
                    onClick={() => handleDeletePolicy(p)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors self-start sm:self-auto"
                    title="Delete policy"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
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
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">From KES {plan.premium.toLocaleString()}/season</p>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={i === 1 ? "default" : "outline"}
                  className="w-full"
                  onClick={() => {
                    const today = new Date().toISOString().slice(0, 10);
                    const oneYear = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
                    setPolicyForm(f => ({ ...f, coverageAmount: String(plan.coverageAmount), premium: String(plan.premium), startDate: today, endDate: oneYear }));
                    setPolicyOpen(true);
                  }}
                >
                  Choose Plan
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">Delete Policy</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Are you sure you want to delete the <strong>{deleteTarget.cropCovered}</strong> policy with {deleteTarget.provider}? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button variant="destructive" disabled={pending} onClick={confirmDeletePolicy} className="flex-1">
                {pending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Delete
              </Button>
              <Button variant="outline" onClick={() => setDeleteTarget(null)} className="flex-1">Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
