"use client";

import { useState, useEffect, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Sprout, MapPin, Plus, Edit2, Trash2, Save, Loader2, Wheat, CalendarDays, Ruler, AlertCircle } from "lucide-react";
import { getUserFarms, createFarm, updateFarm, deleteFarm, createCrop, updateCrop, deleteCrop } from "@/lib/actions/farm";

type Farm = Awaited<ReturnType<typeof getUserFarms>>[number];
type Crop = Farm["crops"][number];

const statusColor: Record<string, "success" | "destructive" | "warning" | "secondary"> = {
  HEALTHY: "success", DISEASED: "destructive", AT_RISK: "warning", UNKNOWN: "secondary",
};

function FarmModal({ farm, onClose }: { farm?: Farm | null; onClose: () => void }) {
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState({
    name: farm?.name ?? "", location: farm?.location ?? "",
    sizeHectares: farm?.sizeHectares?.toString() ?? "",
    soilType: farm?.soilType ?? "", waterSource: farm?.waterSource ?? "",
    description: farm?.description ?? "",
  });
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const data = { ...form, sizeHectares: parseFloat(form.sizeHectares) };
        farm ? await updateFarm(farm.id, data) : await createFarm(data);
        toast.success(farm ? "Farm updated" : "Farm created!");
        onClose();
      } catch (err) { toast.error((err as Error).message); }
    });
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      <div className="grid sm:grid-cols-2 gap-4">
        {[["Farm Name", "name", "Sunrise Farm"], ["Location", "location", "Nakuru, Kenya"], ["Soil Type", "soilType", "Clay loam"], ["Water Source", "waterSource", "Borehole, River..."]].map(([label, key, ph]) => (
          <div key={key} className="space-y-1.5">
            <Label>{label}{key === "name" || key === "location" ? " *" : ""}</Label>
            <Input value={(form as Record<string, string>)[key]} onChange={set(key)} placeholder={ph} required={key === "name" || key === "location"} />
          </div>
        ))}
        <div className="space-y-1.5">
          <Label>Size (Hectares) *</Label>
          <Input type="number" step="0.1" value={form.sizeHectares} onChange={set("sizeHectares")} placeholder="2.5" required />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label>Description</Label>
          <Textarea value={form.description} onChange={set("description")} placeholder="Additional details..." className="min-h-[70px]" />
        </div>
      </div>
      <div className="flex gap-3">
        <Button type="submit" disabled={pending} className="flex-1">
          {pending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          {farm ? "Update Farm" : "Create Farm"}
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
      </div>
    </form>
  );
}

function CropModal({ farmId, crop, onClose }: { farmId: string; crop?: Crop | null; onClose: () => void }) {
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState({
    name: crop?.name ?? "", variety: crop?.variety ?? "",
    areaHectares: crop?.areaHectares?.toString() ?? "",
    plantedAt: crop?.plantedAt ? new Date(crop.plantedAt).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
    expectedYield: crop?.expectedYield?.toString() ?? "",
    season: crop?.season ?? "", notes: crop?.notes ?? "",
  });
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const data = { ...form, areaHectares: parseFloat(form.areaHectares), expectedYield: form.expectedYield ? parseFloat(form.expectedYield) : undefined };
        crop ? await updateCrop(crop.id, data) : await createCrop(farmId, data);
        toast.success(crop ? "Crop updated" : "Crop added!");
        onClose();
      } catch (err) { toast.error((err as Error).message); }
    });
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5"><Label>Crop Name *</Label><Input value={form.name} onChange={set("name")} placeholder="Maize, Tomatoes..." required /></div>
        <div className="space-y-1.5"><Label>Variety</Label><Input value={form.variety} onChange={set("variety")} placeholder="H614D, Anna F1..." /></div>
        <div className="space-y-1.5"><Label>Area (Hectares) *</Label><Input type="number" step="0.1" value={form.areaHectares} onChange={set("areaHectares")} placeholder="1.0" required /></div>
        <div className="space-y-1.5"><Label>Planted Date *</Label><Input type="date" value={form.plantedAt} onChange={set("plantedAt")} required /></div>
        <div className="space-y-1.5"><Label>Expected Yield (kg)</Label><Input type="number" value={form.expectedYield} onChange={set("expectedYield")} placeholder="500" /></div>
        <div className="space-y-1.5"><Label>Season</Label><Input value={form.season} onChange={set("season")} placeholder="Long rains 2026" /></div>
        <div className="space-y-1.5 sm:col-span-2"><Label>Notes</Label><Textarea value={form.notes} onChange={set("notes")} placeholder="Cropping notes..." className="min-h-[60px]" /></div>
      </div>
      <div className="flex gap-3">
        <Button type="submit" disabled={pending} className="flex-1">
          {pending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          {crop ? "Update Crop" : "Add Crop"}
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
      </div>
    </form>
  );
}

export default function FarmProfilePage() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [farmModalOpen, setFarmModalOpen] = useState(false);
  const [editingFarm, setEditingFarm] = useState<Farm | null>(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: "farm" | "crop"; id: string; name: string } | null>(null);
  const [deletePending, startDeleteTransition] = useTransition();

  const refresh = async () => {
    try {
      const data = await getUserFarms();
      setFarms(data);
      if (selectedFarm) setSelectedFarm(data.find((f: Farm) => f.id === selectedFarm.id) ?? data[0] ?? null);
      else if (data.length > 0) setSelectedFarm(data[0]);
    } catch { toast.error("Failed to load farms"); }
  };

  useEffect(() => { getUserFarms().then(data => { setFarms(data); if (data.length > 0) setSelectedFarm(data[0]); }).finally(() => setLoading(false)); }, []);

  const handleDelete = () => {
    if (!deleteTarget) return;
    startDeleteTransition(async () => {
      try {
        if (deleteTarget.type === "farm") {
          await deleteFarm(deleteTarget.id);
          if (selectedFarm?.id === deleteTarget.id) setSelectedFarm(null);
          toast.success("Farm deleted");
        } else {
          await deleteCrop(deleteTarget.id);
          toast.success("Crop removed");
        }
        await refresh();
      } catch (err) { toast.error((err as Error).message); }
      finally { setDeleteTarget(null); }
    });
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Farm Profile</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{farms.length} farm{farms.length !== 1 ? "s" : ""} registered</p>
        </div>
        <Dialog open={farmModalOpen} onOpenChange={open => { setFarmModalOpen(open); if (!open) { setEditingFarm(null); refresh(); } }}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingFarm(null); setFarmModalOpen(true); }}><Plus className="w-4 h-4 mr-2" /> Add Farm</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editingFarm ? "Edit Farm" : "Create New Farm"}</DialogTitle></DialogHeader>
            <FarmModal farm={editingFarm} onClose={() => { setFarmModalOpen(false); setEditingFarm(null); refresh(); }} />
          </DialogContent>
        </Dialog>
      </div>

      {farms.length === 0 && (
        <Card className="p-12 text-center">
          <Sprout className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">No farms yet</h3>
          <p className="text-slate-400 mb-6">Register your first farm to start tracking crops and diagnostics</p>
          <Button onClick={() => setFarmModalOpen(true)} className="mx-auto"><Plus className="w-4 h-4 mr-2" /> Create Your First Farm</Button>
        </Card>
      )}

      {farms.length > 0 && (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {farms.map(farm => (
              <Card key={farm.id} className={`cursor-pointer transition-all ${selectedFarm?.id === farm.id ? "ring-2 ring-green-500" : "hover:shadow-md"}`} onClick={() => setSelectedFarm(farm)}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <Sprout className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={e => { e.stopPropagation(); setEditingFarm(farm); setFarmModalOpen(true); }}><Edit2 className="w-3.5 h-3.5" /></Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-500 hover:text-red-600" onClick={e => { e.stopPropagation(); setDeleteTarget({ type: "farm", id: farm.id, name: farm.name }); }}><Trash2 className="w-3.5 h-3.5" /></Button>
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{farm.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" />{farm.location}</p>
                  <div className="flex gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400">
                    <span><Ruler className="w-3 h-3 inline mr-0.5" />{farm.sizeHectares} ha</span>
                    <span><Wheat className="w-3 h-3 inline mr-0.5" />{farm.crops.length} crops</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedFarm && (
            <Tabs defaultValue="crops">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="crops">Crops ({selectedFarm.crops.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="mt-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base">{selectedFarm.name}</CardTitle>
                    <Button size="sm" variant="outline" onClick={() => { setEditingFarm(selectedFarm); setFarmModalOpen(true); }}><Edit2 className="w-3.5 h-3.5 mr-1" /> Edit</Button>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                      {[["Location", selectedFarm.location], ["Size", `${selectedFarm.sizeHectares} hectares`], ["Soil Type", selectedFarm.soilType || "Not specified"], ["Water Source", selectedFarm.waterSource || "Not specified"], ["Total Crops", `${selectedFarm.crops.length} crop${selectedFarm.crops.length !== 1 ? "s" : ""}`]].map(([label, value]) => (
                        <div key={label}><p className="text-xs text-slate-400 mb-1">{label}</p><p className="font-semibold text-slate-900 dark:text-white">{value}</p></div>
                      ))}
                      {selectedFarm.description && (
                        <div className="sm:col-span-2 lg:col-span-3"><p className="text-xs text-slate-400 mb-1">Description</p><p className="text-slate-700 dark:text-slate-300">{selectedFarm.description}</p></div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="crops" className="mt-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-900 dark:text-white">Crop Records</h3>
                  <Dialog open={cropModalOpen} onOpenChange={open => { setCropModalOpen(open); if (!open) { setEditingCrop(null); refresh(); } }}>
                    <DialogTrigger asChild>
                      <Button size="sm" onClick={() => { setEditingCrop(null); setCropModalOpen(true); }}><Plus className="w-4 h-4 mr-1" /> Add Crop</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader><DialogTitle>{editingCrop ? "Edit Crop" : "Add Crop"}</DialogTitle></DialogHeader>
                      <CropModal farmId={selectedFarm.id} crop={editingCrop} onClose={() => { setCropModalOpen(false); setEditingCrop(null); refresh(); }} />
                    </DialogContent>
                  </Dialog>
                </div>
                {selectedFarm.crops.length === 0 ? (
                  <Card className="p-10 text-center"><Sprout className="w-12 h-12 mx-auto mb-3 text-slate-300" /><p className="text-slate-500 dark:text-slate-400">No crops recorded yet.</p><Button size="sm" className="mt-4" onClick={() => setCropModalOpen(true)}><Plus className="w-4 h-4 mr-1" /> Add First Crop</Button></Card>
                ) : (
                  <div className="space-y-3">
                    {selectedFarm.crops.map((crop: Crop) => (
                      <Card key={crop.id} className="p-4">
                        <CardContent className="p-0">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center"><Sprout className="w-5 h-5 text-green-600" /></div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{crop.name}</h4>
                                  {crop.variety && <span className="text-xs text-slate-400">({crop.variety})</span>}
                                  <Badge variant={statusColor[crop.status] ?? "secondary"} className="text-xs">{crop.status}</Badge>
                                </div>
                                <div className="flex gap-4 text-xs text-slate-500 dark:text-slate-400 mt-1">
                                  <span><CalendarDays className="w-3 h-3 inline mr-0.5" />Planted {new Date(crop.plantedAt).toLocaleDateString()}</span>
                                  <span><Ruler className="w-3 h-3 inline mr-0.5" />{crop.areaHectares} ha</span>
                                  {crop.season && <span>{crop.season}</span>}
                                </div>
                                {crop.expectedYield && <p className="text-xs text-slate-400 mt-0.5">Expected: {crop.expectedYield} kg</p>}
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => { setEditingCrop(crop); setCropModalOpen(true); }}><Edit2 className="w-3.5 h-3.5" /></Button>
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-500 hover:text-red-600" onClick={() => setDeleteTarget({ type: "crop", id: crop.id, name: crop.name })}><Trash2 className="w-3.5 h-3.5" /></Button>
                            </div>
                          </div>
                          {crop.notes && <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">{crop.notes}</p>}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </>
      )}

      <Dialog open={!!deleteTarget} onOpenChange={open => { if (!open) setDeleteTarget(null); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle className="flex items-center gap-2 text-red-600"><AlertCircle className="w-5 h-5" /> Confirm Delete</DialogTitle></DialogHeader>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Are you sure you want to delete <strong>{deleteTarget?.name}</strong>?
            {deleteTarget?.type === "farm" && " All crops and data will be permanently removed."}
            {" This cannot be undone."}
          </p>
          <div className="flex gap-3 pt-2">
            <Button variant="destructive" disabled={deletePending} onClick={handleDelete} className="flex-1">
              {deletePending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />} Delete
            </Button>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
