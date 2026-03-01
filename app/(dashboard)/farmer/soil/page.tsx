"use client";

import { useState, useEffect, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { AlertTriangle, CheckCircle, Info, Loader2, Plus, Trash2 } from "lucide-react";
import { getSoilReports, createSoilReport, deleteSoilReport } from "@/lib/actions/soil";

type Report = Awaited<ReturnType<typeof getSoilReports>>[number];

function getStatus(r: Report) {
  const vals = [r.nitrogen, r.phosphorus, r.potassium, r.moisture].filter((v): v is number => v != null);
  if (vals.length === 0) return "Unknown";
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
  if (avg >= 70 && r.ph != null && r.ph >= 6.0 && r.ph <= 7.0) return "Excellent";
  if (avg < 40 || (r.ph != null && (r.ph < 5.5 || r.ph > 7.5))) return "Needs Attention";
  return "Good";
}

function statusVariant(s: string) {
  return s === "Excellent" ? "success" : s === "Needs Attention" ? "warning" : "secondary" as const;
}

function statusBorder(s: string) {
  return s === "Excellent" ? "border-green-200 dark:border-green-800" : s === "Needs Attention" ? "border-amber-200 dark:border-amber-800" : "border-slate-200 dark:border-slate-700";
}

export default function SoilHealthPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [farms, setFarms] = useState<{ id: string; name: string }[]>([]);
  const [form, setForm] = useState({ farmId: "", ph: "", nitrogen: "", phosphorus: "", potassium: "", organicMatter: "", moisture: "" });

  const load = async () => {
    try {
      const data = await getSoilReports();
      setReports(data);
      const uniqueFarms = Array.from(new Map(data.map((r) => [r.farmId, { id: r.farmId, name: r.farmName }])).values());
      if (uniqueFarms.length > 0) setFarms(uniqueFarms);
    } catch { toast.error("Failed to load soil reports"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  // Also load farms directly for cases where there are no reports yet
  useEffect(() => {
    if (farms.length === 0) {
      import("@/lib/actions/farm").then((mod) =>
        mod.getUserFarms().then((f: any[]) => setFarms(f.map((x: any) => ({ id: x.id, name: x.name }))))
      ).catch(() => {});
    }
  }, [farms.length]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        await createSoilReport({
          farmId: form.farmId,
          ph: form.ph ? parseFloat(form.ph) : undefined,
          nitrogen: form.nitrogen ? parseFloat(form.nitrogen) : undefined,
          phosphorus: form.phosphorus ? parseFloat(form.phosphorus) : undefined,
          potassium: form.potassium ? parseFloat(form.potassium) : undefined,
          organicMatter: form.organicMatter ? parseFloat(form.organicMatter) : undefined,
          moisture: form.moisture ? parseFloat(form.moisture) : undefined,
        });
        toast.success("Soil report added!");
        setAddOpen(false);
        setForm({ farmId: "", ph: "", nitrogen: "", phosphorus: "", potassium: "", organicMatter: "", moisture: "" });
        await load();
      } catch (err) { toast.error((err as Error).message); }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      try { await deleteSoilReport(id); toast.success("Report deleted"); await load(); }
      catch (err) { toast.error((err as Error).message); }
    });
  };

  // Gather all recommendations
  const allRecs: { farmName: string; msg: string; type: "warning" | "info" | "success" }[] = [];
  reports.forEach((r) => {
    if (!r.recommendations) return;
    try {
      const recs: string[] = JSON.parse(r.recommendations);
      recs.forEach((msg) => {
        const type = msg.toLowerCase().includes("deficien") || msg.toLowerCase().includes("too ") || msg.toLowerCase().includes("low") || msg.toLowerCase().includes("very") ? "warning" : "info";
        allRecs.push({ farmName: r.farmName, msg, type });
      });
    } catch {}
    const status = getStatus(r);
    if (status === "Excellent") allRecs.push({ farmName: r.farmName, msg: "Soil nutrients are optimal. Continue current management.", type: "success" });
  });

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Soil Health</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Monitor soil nutrient levels and pH across your farm plots</p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4" /> Add Report</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>Add Soil Test Report</DialogTitle></DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label>Farm *</Label>
                <Select value={form.farmId} onValueChange={(v) => setForm((f) => ({ ...f, farmId: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select farm" /></SelectTrigger>
                  <SelectContent>
                    {farms.map((f) => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: "ph", label: "Soil pH", placeholder: "6.5" },
                  { key: "nitrogen", label: "Nitrogen (%)", placeholder: "70" },
                  { key: "phosphorus", label: "Phosphorus (%)", placeholder: "50" },
                  { key: "potassium", label: "Potassium (%)", placeholder: "80" },
                  { key: "organicMatter", label: "Organic Matter (%)", placeholder: "3.5" },
                  { key: "moisture", label: "Moisture (%)", placeholder: "60" },
                ].map(({ key, label, placeholder }) => (
                  <div key={key} className="space-y-1.5">
                    <Label className="text-xs">{label}</Label>
                    <Input type="number" step="0.1" placeholder={placeholder} value={(form as any)[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} />
                  </div>
                ))}
              </div>
              <Button type="submit" className="w-full" disabled={pending || !form.farmId}>
                {pending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Save Report
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {reports.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-slate-400">
            <Info className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No soil test reports yet. Add a report after your next soil test.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {reports.map((r) => {
            const status = getStatus(r);
            return (
              <Card key={r.id} className={`border-2 ${statusBorder(status)}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">{r.farmName}</CardTitle>
                      <p className="text-xs text-slate-400">{new Date(r.testedAt).toLocaleDateString("en-KE", { year: "numeric", month: "short", day: "numeric" })}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={statusVariant(status)}>{status}</Badge>
                      <button onClick={() => handleDelete(r.id)} className="text-red-400 hover:text-red-600" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {r.ph != null && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Soil pH</span>
                      <span className={`font-bold ${r.ph < 5.5 || r.ph > 7.5 ? "text-red-500" : r.ph < 6.0 ? "text-amber-500" : "text-green-600"}`}>{r.ph}</span>
                    </div>
                  )}
                  {[
                    { label: "Nitrogen (N)", value: r.nitrogen, color: "bg-blue-500" },
                    { label: "Phosphorus (P)", value: r.phosphorus, color: "bg-amber-500" },
                    { label: "Potassium (K)", value: r.potassium, color: "bg-green-500" },
                    { label: "Moisture", value: r.moisture, color: "bg-cyan-500" },
                  ]
                    .filter(({ value }) => value != null)
                    .map(({ label, value, color }) => (
                      <div key={label}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-500 dark:text-slate-400">{label}</span>
                          <span className="font-medium">{value}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(value!, 100)}%` }} />
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {allRecs.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Soil Recommendations</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {allRecs.map(({ farmName, msg, type }, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${type === "warning" ? "bg-amber-50 border-amber-100 dark:bg-amber-950/20 dark:border-amber-900" : type === "success" ? "bg-green-50 border-green-100 dark:bg-green-950/20 dark:border-green-900" : "bg-blue-50 border-blue-100 dark:bg-blue-950/20 dark:border-blue-900"}`}>
                {type === "warning" ? <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-500" /> : type === "success" ? <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-500" /> : <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-500" />}
                <div>
                  <span className="font-semibold text-sm">{farmName}: </span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">{msg}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
