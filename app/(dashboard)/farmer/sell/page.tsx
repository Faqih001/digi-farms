"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Store, TrendingUp, Package, Plus } from "lucide-react";

const listings = [
  { id: 1, name: "Fresh Maize", qty: "20 bags (90kg)", price: 2800, status: "Active", views: 45, inquiries: 8 },
  { id: 2, name: "Tomatoes", qty: "50 crates", price: 1200, status: "Active", views: 120, inquiries: 22 },
  { id: 3, name: "French Beans", qty: "500 kg export grade", price: 80, status: "Sold", views: 89, inquiries: 15 },
];

export default function SellProducePage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Sell Produce</h2>
          <p className="text-slate-500 text-sm">List your harvest and connect with buyers directly</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}><Plus className="w-4 h-4" /> New Listing</Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader><CardTitle className="text-base">Create New Listing</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Produce Name</Label>
                <Input placeholder="e.g., Fresh Maize, Tomatoes" />
              </div>
              <div className="space-y-1.5">
                <Label>Quantity Available</Label>
                <Input placeholder="e.g., 50 bags, 200 kg" />
              </div>
              <div className="space-y-1.5">
                <Label>Price per Unit (KES)</Label>
                <Input type="number" placeholder="2800" />
              </div>
              <div className="space-y-1.5">
                <Label>Unit</Label>
                <Input placeholder="per bag / per kg / per crate" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea placeholder="Describe quality, growing method, available from..." className="min-h-20" />
            </div>
            <div className="flex gap-3">
              <Button onClick={() => { toast.success("Listing published!"); setShowForm(false); }}>Publish Listing</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        {[{ icon: Package, label: "Active Listings", val: 2 }, { icon: TrendingUp, label: "Total Views", val: 254 }, { icon: Store, label: "Inquiries", val: 45 }].map(({ icon: Icon, label, val }) => (
          <Card key={label} className="p-4">
            <CardContent className="p-0 flex items-center gap-3">
              <Icon className="w-8 h-8 text-green-600" />
              <div><div className="text-2xl font-black text-slate-900 dark:text-white">{val}</div><div className="text-xs text-slate-400">{label}</div></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">My Listings</CardTitle></CardHeader>
        <CardContent className="divide-y divide-slate-100 dark:divide-slate-800">
          {listings.map(({ id, name, qty, price, status, views, inquiries }) => (
            <div key={id} className="py-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                <Store className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm text-slate-900 dark:text-white">{name}</div>
                <div className="text-xs text-slate-400">{qty} · KES {price.toLocaleString()}/unit</div>
                <div className="text-xs text-slate-400 mt-0.5">{views} views · {inquiries} inquiries</div>
              </div>
              <Badge variant={status === "Active" ? "success" : "secondary"}>{status}</Badge>
              <Button variant="outline" size="sm">Edit</Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
