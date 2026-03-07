"use client";

import { useState, useTransition, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Handshake, Plus, Edit3, Trash2, Globe, CheckCircle, X, Loader2, Search, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import {
  getPartnerships,
  createPartnership,
  updatePartnership,
  deletePartnership,
} from "@/lib/actions/admin";
import AIInsightPanel from "@/components/dashboard/ai-insight-panel";

type Partnership = Awaited<ReturnType<typeof getPartnerships>>[number];

const TYPES = ["Lender", "Insurance", "Supplier", "Tech Partner", "NGO/Grant", "Distributor", "Other"];
const TIERS = ["standard", "silver", "gold", "platinum"];

const tierCls: Record<string, string> = {
  platinum: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  gold: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  silver: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  standard: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};

const emptyForm = {
  name: "", type: "Supplier", tier: "standard",
  contactName: "", contactEmail: "", country: "Kenya", notes: "",
};

export default function AdminPartnershipsPage() {
  const [partners, setPartners] = useState<Partnership[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<Partnership | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Partnership | null>(null);
  const [form, setForm] = useState(emptyForm);

  async function load() {
    setLoading(true);
    try { setPartners(await getPartnerships()); }
    catch { toast.error("Failed to load partnerships"); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  const filtered = partners.filter(p =>
    !search ||
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.type.toLowerCase().includes(search.toLowerCase()) ||
    (p.country ?? "").toLowerCase().includes(search.toLowerCase())
  );

  function openEdit(p: Partnership) {
    setEditTarget(p);
    setForm({
      name: p.name, type: p.type, tier: p.tier,
      contactName: p.contactName ?? "", contactEmail: p.contactEmail ?? "",
      country: p.country ?? "", notes: p.notes ?? "",
    });
  }

  function handleCreate() {
    if (!form.name.trim()) { toast.error("Partner name is required"); return; }
    startTransition(async () => {
      try {
        await createPartnership(form);
        toast.success("Partnership created");
        setShowCreate(false);
        setForm(emptyForm);
        await load();
      } catch (e) { toast.error(e instanceof Error ? e.message : "Failed to create partner"); }
    });
  }

  function handleEdit() {
    if (!editTarget || !form.name.trim()) { toast.error("Partner name is required"); return; }
    startTransition(async () => {
      try {
        await updatePartnership(editTarget.id, form);
        toast.success("Partnership updated");
        setEditTarget(null);
        await load();
      } catch (e) { toast.error(e instanceof Error ? e.message : "Failed to update partner"); }
    });
  }

  function handleDelete() {
    if (!deleteTarget) return;
    startTransition(async () => {
      try {
        await deletePartnership(deleteTarget.id);
        toast.success("Partnership removed");
        setDeleteTarget(null);
        await load();
      } catch (e) { toast.error(e instanceof Error ? e.message : "Failed to delete partner"); }
    });
  }

  function handleToggleActive(p: Partnership) {
    startTransition(async () => {
      try {
        await updatePartnership(p.id, { isActive: !p.isActive });
        toast.success(p.isActive ? "Partner deactivated" : "Partner activated");
        await load();
      } catch (e) { toast.error(e instanceof Error ? e.message : "Failed to update partner"); }
    });
  }

  const activeCount = partners.filter(p => p.isActive).length;
  const totalRevenue = partners.reduce((s, p) => s + (p.revenue ?? 0), 0);

  const FormFields = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 space-y-1.5">
          <Label>Partner Name *</Label>
          <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. KCB AgriFinance" className="rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Label>Type</Label>
          <div className="relative">
            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="w-full h-10 pl-3 pr-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none">
              {TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Tier</Label>
          <div className="relative">
            <select value={form.tier} onChange={e => setForm(f => ({ ...f, tier: e.target.value }))} className="w-full h-10 pl-3 pr-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none">
              {TIERS.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Contact Name</Label>
          <Input value={form.contactName} onChange={e => setForm(f => ({ ...f, contactName: e.target.value }))} placeholder="Full name" className="rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Label>Contact Email</Label>
          <Input type="email" value={form.contactEmail} onChange={e => setForm(f => ({ ...f, contactEmail: e.target.value }))} placeholder="email@company.com" className="rounded-xl" />
        </div>
        <div className="col-span-2 space-y-1.5">
          <Label>Country</Label>
          <Input value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} placeholder="Kenya" className="rounded-xl" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Notes</Label>
        <textarea
          value={form.notes}
          onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
          rows={3}
          placeholder="Partnership agreements, terms, special conditions..."
          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Partnerships</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Strategic partners, integrations, and revenue sharing</p>
        </div>
        <Button onClick={() => { setShowCreate(true); setForm(emptyForm); }} className="bg-green-600 hover:bg-green-700 text-white w-fit">
          <Plus className="w-4 h-4 mr-2" /> Add Partner
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Partners", value: partners.length, color: "text-slate-700 dark:text-slate-300" },
          { label: "Active", value: activeCount, color: "text-green-600" },
          { label: "Inactive", value: partners.length - activeCount, color: "text-amber-600" },
          { label: "Total Revenue", value: `KES ${(totalRevenue / 1000).toFixed(0)}K`, color: "text-blue-600" },
        ].map(({ label, value, color }) => (
          <Card key={label}>
            <CardContent className="p-4 text-center">
              {loading ? <div className="h-7 w-14 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mx-auto mb-1" /> : <p className={`text-2xl font-bold ${color}`}>{value}</p>}
              <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input className="pl-9 rounded-xl" placeholder="Search partners by name, type or country…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Partner List */}
      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Handshake className="w-12 h-12 text-slate-300 mb-3" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">No partnerships found</p>
          <Button onClick={() => setShowCreate(true)} className="mt-3 bg-green-600 hover:bg-green-700 text-white" size="sm">
            <Plus className="w-4 h-4 mr-1" /> Add First Partner
          </Button>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((p) => (
            <Card key={p.id} className={`transition-all ${!p.isActive ? "opacity-60" : ""}`}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center flex-shrink-0">
                      <Handshake className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-slate-900 dark:text-white">{p.name}</p>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${tierCls[p.tier] ?? tierCls.standard}`}>{p.tier}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">{p.type}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5 flex-wrap">
                        {p.country && <span className="flex items-center gap-0.5"><Globe className="w-3 h-3" />{p.country}</span>}
                        {p.contactEmail && <span>{p.contactEmail}</span>}
                        <span>Since {new Date(p.startDate).toLocaleDateString("en-KE", { month: "short", year: "numeric" })}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {p.revenue > 0 && (
                      <div className="text-right">
                        <p className="text-sm font-bold text-green-600">KES {p.revenue.toLocaleString()}</p>
                        <p className="text-xs text-slate-400">Revenue</p>
                      </div>
                    )}
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${p.isActive ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"}`}>
                      {p.isActive ? "Active" : "Inactive"}
                    </span>
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(p)} disabled={isPending} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 disabled:opacity-50" title="Edit">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleToggleActive(p)} disabled={isPending} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 disabled:opacity-50" title={p.isActive ? "Deactivate" : "Activate"}>
                        <CheckCircle className={`w-4 h-4 ${p.isActive ? "text-green-500" : "text-slate-300 dark:text-slate-600"}`} />
                      </button>
                      <button onClick={() => setDeleteTarget(p)} disabled={isPending} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-500 hover:text-red-600 disabled:opacity-50" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                {p.notes && <p className="mt-2 text-xs text-slate-400 italic border-t border-slate-100 dark:border-slate-800 pt-2 line-clamp-2">{p.notes}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* AI Insight */}
      {!loading && (
        <AIInsightPanel
          module="admin_partnerships"
          contextData={JSON.stringify({
            totalPartners: partners.length,
            activePartners: activeCount,
            totalRevenue,
            partnersByType: partners.reduce((acc, p) => ({ ...acc, [p.type]: (acc[p.type] ?? 0) + 1 }), {} as Record<string, number>),
            partnersByTier: partners.reduce((acc, p) => ({ ...acc, [p.tier]: (acc[p.tier] ?? 0) + 1 }), {} as Record<string, number>),
          })}
          title="AI Partnership Analysis"
          description="Get AI insights on partnership portfolio health and growth opportunities"
          defaultPrompt="Analyze the partnership portfolio. Which partner types and tiers generate the most value? Identify gaps and suggest partnership strategies to expand revenue."
        />
      )}

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => !isPending && setShowCreate(false)} />
          <div className="relative z-10 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-900">
              <h2 className="text-base font-bold">Add New Partner</h2>
              {!isPending && <button onClick={() => setShowCreate(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><X className="w-5 h-5" /></button>}
            </div>
            <div className="p-5">
              <FormFields />
              <div className="flex gap-2 justify-end mt-4">
                <Button variant="outline" onClick={() => setShowCreate(false)} disabled={isPending}>Cancel</Button>
                <Button onClick={handleCreate} disabled={isPending} className="bg-green-600 hover:bg-green-700 text-white">
                  {isPending ? <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Creating…</> : <><Plus className="w-4 h-4 mr-1" /> Create Partner</>}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => !isPending && setEditTarget(null)} />
          <div className="relative z-10 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-900">
              <h2 className="text-base font-bold">Edit Partner — {editTarget.name}</h2>
              {!isPending && <button onClick={() => setEditTarget(null)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><X className="w-5 h-5" /></button>}
            </div>
            <div className="p-5">
              <FormFields />
              <div className="flex gap-2 justify-end mt-4">
                <Button variant="outline" onClick={() => setEditTarget(null)} disabled={isPending}>Cancel</Button>
                <Button onClick={handleEdit} disabled={isPending} className="bg-green-600 hover:bg-green-700 text-white">
                  {isPending ? <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Saving…</> : <><CheckCircle className="w-4 h-4 mr-1" /> Save Changes</>}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => !isPending && setDeleteTarget(null)} />
          <div className="relative z-10 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="text-center mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-3">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-base font-bold">Remove Partnership?</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Permanently remove <span className="font-semibold text-slate-700 dark:text-slate-300">{deleteTarget.name}</span>?
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setDeleteTarget(null)} disabled={isPending}>Cancel</Button>
              <Button onClick={handleDelete} disabled={isPending} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Remove"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
