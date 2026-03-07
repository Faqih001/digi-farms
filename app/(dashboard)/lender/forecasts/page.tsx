"use client";

import { useEffect, useState, useCallback, useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { TrendingUp, TrendingDown, Leaf, Droplets, Sun, CloudRain, Search, Plus, Trash2, RefreshCw, Sparkles } from "lucide-react";
import { getLenderForecasts, createForecast, deleteForecast, getFarmsForSelect } from "@/lib/actions/lender";
import AIInsightPanel from "@/components/dashboard/ai-insight-panel";

type Forecast = Awaited<ReturnType<typeof getLenderForecasts>>["forecasts"][number];
type FarmOption = Awaited<ReturnType<typeof getFarmsForSelect>>[number];

const RISK_BADGE: Record<string, "success" | "warning" | "destructive"> = {
  low: "success",
  medium: "warning",
  high: "destructive",
};

export default function ForecastsPage() {
  const [data, setData] = useState<Awaited<ReturnType<typeof getLenderForecasts>> | null>(null);
  const [farms, setFarms] = useState<FarmOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  // New forecast modal
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    farmId: "",
    cropName: "",
    season: "",
    predictedYield: "",
    confidence: "80",
    moisture: "50",
    healthScore: "70",
    forecastDate: new Date().toISOString().split("T")[0],
  });

  // Delete confirm
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [aiForecast, setAiForecast] = useState<Forecast | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [result, farmList] = await Promise.all([getLenderForecasts(search || undefined), getFarmsForSelect()]);
    setData(result);
    setFarms(farmList);
    setLoading(false);
  }, [search]);

  useEffect(() => { load(); }, [load]);

  function handleSearch(val: string) {
    setSearch(val);
  }

  function handleCreate() {
    startTransition(async () => {
      await createForecast({
        farmId: form.farmId,
        cropName: form.cropName,
        season: form.season,
        predictedYield: parseFloat(form.predictedYield),
        confidence: parseFloat(form.confidence),
        moisture: parseFloat(form.moisture),
        healthScore: parseFloat(form.healthScore),
        forecastDate: new Date(form.forecastDate),
      });
      setShowCreate(false);
      setForm({ farmId: "", cropName: "", season: "", predictedYield: "", confidence: "80", moisture: "50", healthScore: "70", forecastDate: new Date().toISOString().split("T")[0] });
      await load();
    });
  }

  function handleDelete() {
    if (!deleteId) return;
    startTransition(async () => {
      await deleteForecast(deleteId);
      setDeleteId(null);
      await load();
    });
  }

  const stats = data?.stats;
  const forecasts = data?.forecasts ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Yield Forecasts</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">AI-powered crop yield predictions for borrower farms</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => setShowCreate(true)}>
            <Plus className="w-4 h-4 mr-2" /> New Forecast
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Leaf, label: "Total Forecasts", value: stats?.total ?? "—", color: "text-green-600", bg: "bg-green-50 dark:bg-green-950" },
          { icon: Sun, label: "Avg. Confidence", value: stats?.avgConfidence != null ? `${stats.avgConfidence.toFixed(0)}%` : "—", color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950" },
          { icon: CloudRain, label: "High Risk (health <50)", value: stats?.highRisk ?? "—", color: "text-red-600", bg: "bg-red-50 dark:bg-red-950" },
          { icon: Droplets, label: "Good Moisture (≥50)", value: stats?.goodMoisture ?? "—", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950" },
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
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input className="pl-10" placeholder="Search by crop, season, or location..." value={search} onChange={(e) => handleSearch(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-center py-16 text-slate-400">Loading forecasts...</div>
      ) : forecasts.length === 0 ? (
        <div className="text-center py-16 text-slate-400">No forecasts found.</div>
      ) : (
        <div className="grid gap-4">
          {forecasts.map((f: Forecast) => {
            const healthScore = f.healthScore ?? 0;
            const confidence = f.confidence ?? 0;
            const moisture = f.moisture ?? 0;
            const riskKey = healthScore >= 70 ? "low" : healthScore >= 50 ? "medium" : "high";
            return (
              <Card key={f.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-bold text-slate-900 dark:text-white">{f.farm?.user?.name ?? "Unknown Farmer"}</span>
                        <Badge variant={RISK_BADGE[riskKey]} className="text-xs">{riskKey.charAt(0).toUpperCase() + riskKey.slice(1)} Risk</Badge>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {f.cropName} • {f.farm?.location ?? "—"} • {f.farm?.name ?? "—"} • {f.season}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1"><Droplets className="w-3 h-3" /> Moisture: {moisture.toFixed(0)}%</span>
                        <span className="flex items-center gap-1"><Leaf className="w-3 h-3" /> Health: {healthScore.toFixed(0)}%</span>
                        {f.farm?.sizeHectares && (
                          <span>{f.farm.sizeHectares.toFixed(1)} ha</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-xs text-slate-400">Predicted Yield</p>
                        <p className="font-bold text-sm text-slate-900 dark:text-white">{f.predictedYield?.toFixed(1) ?? "—"} t/ha</p>
                      </div>
                      <div className="text-center">
                        <div className={`flex items-center gap-1 ${confidence >= 70 ? "text-green-600" : "text-amber-600"}`}>
                          {confidence >= 70 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          <span className="font-bold">{confidence.toFixed(0)}%</span>
                        </div>
                        <p className="text-xs text-slate-400">confidence</p>
                      </div>
                      <Button size="sm" variant="outline" className="text-purple-600 border-purple-200 hover:bg-purple-50" onClick={() => setAiForecast(f)}>
                        <Sparkles className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50" onClick={() => setDeleteId(f.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* AI Forecast Analysis Dialog */}
      <Dialog open={!!aiForecast} onOpenChange={() => setAiForecast(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" /> AI Yield Analysis
            </DialogTitle>
          </DialogHeader>
          {aiForecast && (
            <AIInsightPanel
              module="lender_forecasts"
              entityId={aiForecast.id}
              entityLabel={`${aiForecast.farm?.user?.name ?? ""} — ${aiForecast.cropName}`}
              contextData={JSON.stringify({
                farmer: aiForecast.farm?.user?.name,
                farm: aiForecast.farm?.name,
                location: aiForecast.farm?.location,
                sizeHectares: aiForecast.farm?.sizeHectares,
                cropName: aiForecast.cropName,
                season: aiForecast.season,
                predictedYield: aiForecast.predictedYield,
                confidence: aiForecast.confidence,
                healthScore: aiForecast.healthScore,
                moisture: aiForecast.moisture,
                forecastDate: aiForecast.forecastDate,
              })}
              title="Crop Yield Analysis"
              description="AI interpretation of this yield forecast and lending risk"
              defaultPrompt="Analyze this crop yield forecast. Assess the reliability of the prediction, identify weather or agronomic risks, and advise whether this farm's output is sufficient to support loan repayment."
            />
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setAiForecast(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Forecast Modal */}}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Yield Forecast</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Farm <span className="text-red-500">*</span></Label>
              <select
                value={form.farmId}
                onChange={(e) => setForm({ ...form, farmId: e.target.value })}
                className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm"
              >
                <option value="">Select a farm...</option>
                {farms.map((fm) => (
                  <option key={fm.id} value={fm.id}>
                    {fm.name} — {fm.user?.name} ({fm.location})
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Crop Name <span className="text-red-500">*</span></Label>
                <Input value={form.cropName} onChange={(e) => setForm({ ...form, cropName: e.target.value })} placeholder="e.g. Maize" />
              </div>
              <div className="space-y-1.5">
                <Label>Season <span className="text-red-500">*</span></Label>
                <Input value={form.season} onChange={(e) => setForm({ ...form, season: e.target.value })} placeholder="e.g. Long Rains 2026" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Predicted Yield (t/ha) <span className="text-red-500">*</span></Label>
                <Input type="number" value={form.predictedYield} onChange={(e) => setForm({ ...form, predictedYield: e.target.value })} placeholder="e.g. 3.8" />
              </div>
              <div className="space-y-1.5">
                <Label>Confidence (%)</Label>
                <Input type="number" min="0" max="100" value={form.confidence} onChange={(e) => setForm({ ...form, confidence: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Moisture (%)</Label>
                <Input type="number" min="0" max="100" value={form.moisture} onChange={(e) => setForm({ ...form, moisture: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Health Score (%)</Label>
                <Input type="number" min="0" max="100" value={form.healthScore} onChange={(e) => setForm({ ...form, healthScore: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Forecast Date</Label>
              <Input type="date" value={form.forecastDate} onChange={(e) => setForm({ ...form, forecastDate: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleCreate}
              disabled={isPending || !form.farmId || !form.cropName || !form.season || !form.predictedYield}
            >
              {isPending ? "Creating..." : "Create Forecast"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Forecast</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-500">Are you sure you want to delete this forecast? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

