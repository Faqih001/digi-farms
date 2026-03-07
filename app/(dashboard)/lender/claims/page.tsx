"use client";

import { useEffect, useState, useCallback, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Shield, Search, Eye, CheckCircle, XCircle, Clock, DollarSign, AlertTriangle, Plus, Trash2, RefreshCw } from "lucide-react";
import { getLenderClaims, updateClaimStatus, createClaim, deleteClaim } from "@/lib/actions/lender";
import type { ClaimStatus } from "@prisma/client";

type ClaimsData = Awaited<ReturnType<typeof getLenderClaims>>;
type ClaimItem = ClaimsData["claims"][number];

const STATUS_CONFIG: Record<string, { variant: "success" | "warning" | "destructive" | "info" | "secondary"; icon: React.ElementType }> = {
  FILED: { variant: "secondary", icon: Clock },
  UNDER_REVIEW: { variant: "warning", icon: Clock },
  APPROVED: { variant: "success", icon: CheckCircle },
  SETTLED: { variant: "info", icon: DollarSign },
  REJECTED: { variant: "destructive", icon: XCircle },
};

function fmt(n: number) {
  if (n >= 1_000_000) return `KES ${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `KES ${(n / 1_000).toFixed(0)}K`;
  return `KES ${n.toFixed(0)}`;
}

export default function ClaimsPage() {
  const [data, setData] = useState<ClaimsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ClaimStatus | "">("");
  const [viewClaim, setViewClaim] = useState<ClaimItem | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState({
    farmerId: "", farmerName: "", type: "", description: "", amount: "", insurer: "", loanId: "",
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getLenderClaims({
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

  function handleStatusChange(id: string, status: ClaimStatus) {
    startTransition(async () => {
      await updateClaimStatus(id, status);
      await load();
    });
  }

  function handleCreate() {
    startTransition(async () => {
      await createClaim({
        farmerId: form.farmerId || "unknown",
        farmerName: form.farmerName,
        type: form.type,
        description: form.description,
        amount: parseFloat(form.amount) || 0,
        insurer: form.insurer || undefined,
        loanId: form.loanId || undefined,
      });
      setShowCreate(false);
      setForm({ farmerId: "", farmerName: "", type: "", description: "", amount: "", insurer: "", loanId: "" });
      await load();
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteClaim(id);
      setConfirmDelete(null);
      await load();
    });
  }

  const claims = data?.claims ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Insurance Claims</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage crop and loan insurance claims</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load} disabled={loading || isPending}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button size="sm" onClick={() => setShowCreate(true)}>
            <Plus className="w-4 h-4 mr-2" /> New Claim
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Claims", value: loading ? "..." : String(data?.stats.total ?? 0), color: "text-slate-700 dark:text-slate-300" },
          { label: "Under Review", value: loading ? "..." : String(data?.stats.underReview ?? 0), color: "text-amber-600" },
          { label: "Approved", value: loading ? "..." : String(data?.stats.approved ?? 0), color: "text-green-600" },
          { label: "Total Paid Out", value: loading ? "..." : fmt(data?.stats.totalPaidOut ?? 0), color: "text-blue-600" },
        ].map(({ label, value, color }) => (
          <Card key={label}>
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
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
              <Input className="pl-10" placeholder="Search by farmer, type, insurer…" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <select
              className="h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ClaimStatus | "")}
            >
              <option value="">All Status</option>
              <option value="FILED">Filed</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="APPROVED">Approved</option>
              <option value="SETTLED">Settled</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {loading ? (
          <Card><CardContent className="p-8 text-center text-slate-400">Loading claims…</CardContent></Card>
        ) : claims.length === 0 ? (
          <Card><CardContent className="p-8 text-center text-slate-400">No claims found.</CardContent></Card>
        ) : (
          claims.map((c) => {
            const sc = STATUS_CONFIG[c.status] ?? { variant: "secondary" as const, icon: Clock };
            const Icon = sc.icon;
            return (
              <Card key={c.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Shield className="w-4 h-4 text-blue-500" />
                        <span className="font-bold text-slate-900 dark:text-white">{c.farmerName ?? "Unknown Farmer"}</span>
                        <Badge variant={sc.variant} className="text-xs">{c.status.replace("_", " ")}</Badge>
                      </div>
                      <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        {c.type} — {c.id.slice(-6).toUpperCase()}{c.loanId ? ` / Loan: ${c.loanId.slice(-6).toUpperCase()}` : ""}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{c.description}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {c.insurer ?? "No insurer"} • {c.evidenceUrls.length} evidence files • Filed: {new Date(c.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <div className="text-center min-w-[100px]">
                        <p className="text-lg font-bold text-slate-900 dark:text-white">KES {c.amount.toLocaleString()}</p>
                        <p className="text-xs text-slate-400">Claim Amount</p>
                      </div>
                      <div className="flex gap-1.5 flex-wrap">
                        <Button variant="outline" size="sm" onClick={() => setViewClaim(c)}>
                          <Eye className="w-3 h-3 mr-1" /> View
                        </Button>
                        {c.status === "FILED" && (
                          <Button size="sm" variant="outline" onClick={() => handleStatusChange(c.id, "UNDER_REVIEW")} disabled={isPending}>
                            <Clock className="w-3 h-3 mr-1" /> Review
                          </Button>
                        )}
                        {c.status === "UNDER_REVIEW" && (
                          <>
                            <Button size="sm" onClick={() => handleStatusChange(c.id, "APPROVED")} disabled={isPending}>
                              <CheckCircle className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleStatusChange(c.id, "REJECTED")} disabled={isPending}>
                              <XCircle className="w-3 h-3" />
                            </Button>
                          </>
                        )}
                        {c.status === "APPROVED" && (
                          <Button size="sm" onClick={() => handleStatusChange(c.id, "SETTLED")} disabled={isPending}>
                            <DollarSign className="w-3 h-3 mr-1" /> Settle
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" className="text-red-500" onClick={() => setConfirmDelete(c.id)} disabled={isPending}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* View Claim Dialog */}
      <Dialog open={!!viewClaim} onOpenChange={() => setViewClaim(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Claim Details</DialogTitle>
          </DialogHeader>
          {viewClaim && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-slate-500">Farmer</span><p className="font-semibold">{viewClaim.farmerName}</p></div>
                <div><span className="text-slate-500">Status</span><p><Badge variant={STATUS_CONFIG[viewClaim.status]?.variant ?? "secondary"}>{viewClaim.status}</Badge></p></div>
                <div><span className="text-slate-500">Type</span><p className="font-semibold">{viewClaim.type}</p></div>
                <div><span className="text-slate-500">Amount</span><p className="font-semibold text-green-600">KES {viewClaim.amount.toLocaleString()}</p></div>
                <div><span className="text-slate-500">Insurer</span><p>{viewClaim.insurer ?? "—"}</p></div>
                <div><span className="text-slate-500">Filed</span><p>{new Date(viewClaim.createdAt).toLocaleDateString()}</p></div>
                {viewClaim.resolvedAt && <div className="col-span-2"><span className="text-slate-500">Resolved</span><p>{new Date(viewClaim.resolvedAt).toLocaleDateString()}</p></div>}
              </div>
              <div><span className="text-slate-500 block mb-1">Description</span><p className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 rounded-lg p-3">{viewClaim.description}</p></div>
              {viewClaim.loanApplication && (
                <div><span className="text-slate-500">Related Loan</span><p>Amount: KES {viewClaim.loanApplication.amount.toLocaleString()} · Status: {viewClaim.loanApplication.status}</p></div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewClaim(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Claim Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>New Insurance Claim</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Farmer Name</Label>
                <Input value={form.farmerName} onChange={(e) => setForm({ ...form, farmerName: e.target.value })} placeholder="Full name" />
              </div>
              <div>
                <Label>Farmer ID</Label>
                <Input value={form.farmerId} onChange={(e) => setForm({ ...form, farmerId: e.target.value })} placeholder="User ID (optional)" />
              </div>
              <div>
                <Label>Claim Type</Label>
                <Input value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} placeholder="e.g. Flood Damage" />
              </div>
              <div>
                <Label>Amount (KES)</Label>
                <Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0" />
              </div>
              <div>
                <Label>Insurer</Label>
                <Input value={form.insurer} onChange={(e) => setForm({ ...form, insurer: e.target.value })} placeholder="Insurance company" />
              </div>
              <div>
                <Label>Loan ID (optional)</Label>
                <Input value={form.loanId} onChange={(e) => setForm({ ...form, loanId: e.target.value })} placeholder="Link to a loan" />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the loss or damage…" rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={isPending || !form.farmerName || !form.type || !form.description || !form.amount}>
              {isPending ? "Saving…" : "Submit Claim"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Claim</DialogTitle></DialogHeader>
          <p className="text-sm text-slate-600 dark:text-slate-400">Are you sure you want to delete this claim? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => confirmDelete && handleDelete(confirmDelete)} disabled={isPending}>
              {isPending ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
