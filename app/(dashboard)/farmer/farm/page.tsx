"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Sprout, MapPin, Droplets, Thermometer, Plus, Edit2, Save } from "lucide-react";

export default function FarmProfilePage() {
  const [editing, setEditing] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Farm Profile</h2>
          <p className="text-slate-500 text-sm">Manage your farm details and plots</p>
        </div>
        <Button onClick={() => { setEditing(!editing); if (editing) toast.success("Farm profile saved!"); }}>
          {editing ? <><Save className="w-4 h-4" /> Save Changes</> : <><Edit2 className="w-4 h-4" /> Edit Profile</>}
        </Button>
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Farm Details</TabsTrigger>
          <TabsTrigger value="plots">Plots & Fields</TabsTrigger>
          <TabsTrigger value="crops">Crop Records</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-4">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="text-base">Basic Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Farm Name", placeholder: "Sunrise Farm", id: "name" },
                  { label: "County", placeholder: "Nakuru", id: "county" },
                  { label: "Sub-county", placeholder: "Rongai", id: "subcounty" },
                  { label: "GPS Coordinates", placeholder: "-0.1234, 36.5678", id: "gps" },
                  { label: "Total Size (acres)", placeholder: "5.0", id: "size", type: "number" },
                ].map(({ label, placeholder, id, type }) => (
                  <div key={id} className="space-y-1.5">
                    <Label htmlFor={id}>{label}</Label>
                    <Input id={id} placeholder={placeholder} disabled={!editing} type={type || "text"} />
                  </div>
                ))}
                <div className="space-y-1.5">
                  <Label htmlFor="notes">Farm Notes</Label>
                  <Textarea id="notes" placeholder="Additional information about your farm..." disabled={!editing} className="min-h-20" />
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader><CardTitle className="text-base">Farm Health Overview</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: "Soil Health", value: 78, color: "bg-green-500" },
                    { label: "Water Adequacy", value: 62, color: "bg-blue-500" },
                    { label: "Crop Coverage", value: 91, color: "bg-amber-500" },
                    { label: "Pest Risk", value: 35, color: "bg-red-500" },
                  ].map(({ label, value, color }) => (
                    <div key={label}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-slate-600 dark:text-slate-400">{label}</span>
                        <span className="font-semibold">{value}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-base">Weather Summary</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: Thermometer, label: "Temperature", value: "24°C" },
                      { icon: Droplets, label: "Humidity", value: "68%" },
                      { icon: Droplets, label: "Rainfall", value: "12mm" },
                      { icon: MapPin, label: "Elevation", value: "1,850m" },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-center">
                        <Icon className="w-4 h-4 mx-auto mb-1 text-green-600" />
                        <div className="text-xs text-slate-400">{label}</div>
                        <div className="font-bold text-sm text-slate-900 dark:text-white">{value}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="plots" className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-900 dark:text-white">Farm Plots</h3>
            <Button size="sm"><Plus className="w-4 h-4" /> Add Plot</Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {["Plot A — Maize", "Plot B — Tomatoes", "Plot C — Beans"].map((plot, i) => (
              <Card key={plot} className="p-4">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{plot}</span>
                    <Badge variant="success" className="text-xs">Active</Badge>
                  </div>
                  <div className="text-xs text-slate-500 space-y-1">
                    <div>Size: {(i + 1) * 1.5} acres</div>
                    <div>Soil: Clay loam</div>
                    <div>pH: {(6.2 + i * 0.3).toFixed(1)}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
            <button className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:border-green-400 transition-colors">
              <Plus className="w-6 h-6 text-slate-400" />
              <span className="text-sm text-slate-400">Add Plot</span>
            </button>
          </div>
        </TabsContent>

        <TabsContent value="crops" className="mt-4">
          <div className="space-y-3">
            {[
              { name: "Maize (H614D)", status: "GROWING", planted: "Jan 15", harvest: "May 20", progress: 65 },
              { name: "Tomatoes (Anna F1)", status: "GROWING", planted: "Feb 1", harvest: "Apr 30", progress: 82 },
              { name: "Beans (Rose Coco)", status: "HARVESTED", planted: "Dec 10", harvest: "Feb 28", progress: 100 },
            ].map(({ name, status, planted, harvest, progress }) => (
              <div key={name} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Sprout className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-sm text-slate-900 dark:text-white">{name}</span>
                  </div>
                  <Badge variant={status === "GROWING" ? "success" : "secondary"} className="text-xs">{status}</Badge>
                </div>
                <div className="text-xs text-slate-500 mb-2">Planted {planted} · Expected harvest {harvest}</div>
                <Progress value={progress} className="h-2" />
                <div className="text-xs text-slate-400 mt-1">{progress}% season progress</div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
