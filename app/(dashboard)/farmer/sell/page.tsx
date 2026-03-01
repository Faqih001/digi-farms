"use client";

import { useState, useEffect, useTransition, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Store, TrendingUp, Package, Plus, X, ShoppingCart, Loader2, Clock, Trash2, ImagePlus, AlertCircle } from "lucide-react";
import { getFarmerOrders } from "@/lib/actions/order";
import {
  getProduceListings,
  createProduceListing,
  updateProduceListing,
  deleteProduceListing,
  updateListingStatus,
} from "@/lib/actions/produce";
import Image from "next/image";

type FarmerOrder = Awaited<ReturnType<typeof getFarmerOrders>>[number];
type FarmerOrderItem = FarmerOrder["items"][number];
type Listing = Awaited<ReturnType<typeof getProduceListings>>[number];

const CATEGORIES = ["Grains", "Vegetables", "Fruits", "Legumes", "Roots & Tubers", "Dairy", "Poultry", "Livestock", "Other"];
const UNITS = ["kg", "bags", "crates", "bunches", "litres", "pieces", "tonnes"];

const STATUS_STYLES: Record<string, { label: string; variant: "secondary" | "success" | "destructive" | "info" }> = {
  PENDING:   { label: "Pending",   variant: "secondary"  },
  CONFIRMED: { label: "Confirmed", variant: "info"       },
  SHIPPED:   { label: "Shipped",   variant: "info"       },
  DELIVERED: { label: "Delivered", variant: "success"    },
  CANCELLED: { label: "Cancelled", variant: "destructive"},
};

const LISTING_STATUS: Record<string, "secondary" | "success" | "destructive" | "info"> = {
  ACTIVE:    "success",
  SOLD:      "info",
  EXPIRED:   "secondary",
  CANCELLED: "destructive",
};

function fmt(d: Date | string) {
  return new Date(d).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" });
}

const emptyForm = { name: "", category: "", quantity: "", unit: "", price: "", description: "", location: "", expiresAt: "" };

export default function SellProducePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [orders, setOrders] = useState<FarmerOrder[]>([]);
  const [activeTab, setActiveTab] = useState<"listings" | "orders">("listings");
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Listing | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState(emptyForm);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    Promise.all([getProduceListings(), getFarmerOrders()])
      .then(([l, o]) => { setListings(l); setOrders(o); })
      .catch(() => toast.error("Failed to load data"))
      .finally(() => setLoading(false));
  }, []);

  function openCreate() {
    setEditTarget(null);
    setForm(emptyForm);
    setImageFiles([]);
    setImagePreviews([]);
    setShowForm(true);
  }

  function openEdit(l: Listing) {
    setEditTarget(l);
    setForm({
      name: l.name,
      category: l.category,
      quantity: String(l.quantity),
      unit: l.unit,
      price: String(l.price),
      description: l.description ?? "",
      location: l.location ?? "",
      expiresAt: l.expiresAt ? new Date(l.expiresAt).toISOString().split("T")[0] : "",
    });
    setImageFiles([]);
    setImagePreviews(l.imageUrls);
    setShowForm(true);
  }

  function handleImagePick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setImageFiles((prev) => [...prev, ...files]);
    const urls = files.map((f) => URL.createObjectURL(f));
    setImagePreviews((prev) => [...prev, ...urls]);
  }

  function removeImage(idx: number) {
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
    setImageFiles((prev) => {
      // Only newly added files track with imageFiles array
      // Offset by existing DB images count when editing
      const dbCount = editTarget ? editTarget.imageUrls.length : 0;
      const fileIdx = idx - dbCount;
      if (fileIdx < 0) return prev; // removing a DB image — just update previews
      return prev.filter((_, i) => i !== fileIdx);
    });
  }

  async function uploadImages(): Promise<string[]> {
    if (imageFiles.length === 0) return [];
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of imageFiles) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload/produce", { method: "POST", body: fd });
        if (!res.ok) throw new Error("Image upload failed");
        const { imageUrl } = await res.json();
        uploaded.push(imageUrl);
      }
      return uploaded;
    } finally {
      setUploading(false);
    }
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const newUrls = await uploadImages();
        // Retained DB images = previews that were already URLs (not blob:)
        const retained = imagePreviews.filter((p) => !p.startsWith("blob:"));
        const allUrls = [...retained, ...newUrls];

        const payload = {
          name: form.name,
          category: form.category,
          quantity: parseFloat(form.quantity),
          unit: form.unit,
          price: parseFloat(form.price),
          description: form.description || undefined,
          location: form.location || undefined,
          imageUrls: allUrls,
          expiresAt: form.expiresAt || undefined,
        };

        if (editTarget) {
          const updated = await updateProduceListing(editTarget.id, payload);
          setListings((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
          toast.success("Listing updated!");
        } else {
          const created = await createProduceListing(payload);
          setListings((prev) => [created, ...prev]);
          toast.success("Listing published!");
        }
        setShowForm(false);
      } catch (err) {
        toast.error((err as Error).message);
      }
    });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    startTransition(async () => {
      try {
        await deleteProduceListing(deleteTarget.id);
        setListings((prev) => prev.filter((l) => l.id !== deleteTarget.id));
        toast.success("Listing deleted");
        setDeleteTarget(null);
      } catch (err) { toast.error((err as Error).message); }
    });
  };

  const handleMarkSold = (l: Listing) => {
    startTransition(async () => {
      try {
        const updated = await updateListingStatus(l.id, "SOLD");
        setListings((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
        toast.success("Marked as sold");
      } catch (err) { toast.error((err as Error).message); }
    });
  };

  const activeListings = listings.filter((l) => l.status === "ACTIVE").length;
  const totalViews = 0; // future analytics
  const totalInquiries = 0; // future analytics

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Sell Produce</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">List your harvest and connect with buyers directly</p>
        </div>
        <Button onClick={openCreate} className="w-fit">
          <Plus className="w-4 h-4 mr-1.5" /> New Listing
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Package,      label: "Active Listings",  value: activeListings,    color: "text-green-600"  },
          { icon: TrendingUp,   label: "Total Listings",   value: listings.length,   color: "text-blue-600"   },
          { icon: Store,        label: "Sold Listings",    value: listings.filter(l => l.status === "SOLD").length, color: "text-purple-600" },
          { icon: ShoppingCart, label: "Purchases Made",   value: orders.length,     color: "text-amber-600"  },
        ].map(({ icon: Icon, label, value, color }) => (
          <Card key={label}><CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800"><Icon className={`w-5 h-5 ${color}`} /></div>
            <div><p className={`text-xl font-bold ${color}`}>{value}</p><p className="text-xs text-slate-500 dark:text-slate-400">{label}</p></div>
          </CardContent></Card>
        ))}
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
        {(["listings", "orders"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700"}`}>
            {tab === "listings" ? "My Listings" : "Purchase History"}
          </button>
        ))}
      </div>

      {/* Listings Tab */}
      {activeTab === "listings" && (
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base font-bold">My Produce Listings</CardTitle></CardHeader>
          <CardContent className="divide-y divide-slate-100 dark:divide-slate-800 p-0">
            {listings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 text-slate-400">
                <Store className="w-10 h-10 mb-3" />
                <p className="font-semibold">No listings yet</p>
                <p className="text-sm">Click &quot;New Listing&quot; to get started</p>
              </div>
            ) : listings.map((l) => (
              <div key={l.id} className="px-4 py-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex-wrap sm:flex-nowrap">
                {l.imageUrls[0] ? (
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                    <Image src={l.imageUrls[0]} alt={l.name} width={48} height={48} className="object-cover w-full h-full" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                    <Store className="w-5 h-5 text-green-600" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">{l.name}</p>
                  <p className="text-xs text-slate-400">{l.quantity} {l.unit} · KES {Number(l.price).toLocaleString()}/{l.unit}</p>
                  {l.location && <p className="text-xs text-slate-400 mt-0.5">{l.location}</p>}
                </div>
                <Badge variant={LISTING_STATUS[l.status] ?? "secondary"} className="flex-shrink-0">{l.status}</Badge>
                <div className="flex gap-2 flex-shrink-0">
                  {l.status === "ACTIVE" && (
                    <Button variant="outline" size="sm" onClick={() => handleMarkSold(l)} disabled={pending}>Sold</Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => openEdit(l)}>Edit</Button>
                  <Button variant="outline" size="sm" className="text-red-500 border-red-200" onClick={() => setDeleteTarget(l)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Orders / Purchase History Tab */}
      {activeTab === "orders" && (
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base font-bold">Purchase History</CardTitle></CardHeader>
          <CardContent className="p-0">
            {orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 text-slate-400">
                <ShoppingCart className="w-10 h-10 mb-3" />
                <p className="font-semibold">No purchases yet</p>
                <p className="text-sm">Visit the marketplace to buy supplies</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {orders.map((order) => {
                  const cfg = STATUS_STYLES[order.status] ?? STATUS_STYLES.PENDING;
                  return (
                    <div key={order.id} className="px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <p className="font-semibold text-sm text-slate-900 dark:text-white">Order #{order.id.slice(-8).toUpperCase()}</p>
                          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><Clock className="w-3 h-3" /> {fmt(order.createdAt)}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge variant={cfg.variant} className="text-xs">{cfg.label}</Badge>
                          <p className="text-sm font-bold">KES {order.totalAmount.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        {order.items.map((item: FarmerOrderItem) => (
                          <div key={item.id} className="flex items-center justify-between text-xs text-slate-500">
                            <span>{item.product.name} × {item.quantity}</span>
                            <span>KES {(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Create / Edit Modal */}
      <Dialog open={showForm} onOpenChange={(open) => { if (!open) setShowForm(false); }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editTarget ? "Edit Listing" : "Create New Listing"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 pt-1">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Produce Name <span className="text-red-500">*</span></Label>
                <Input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g., Fresh Maize" required />
              </div>
              <div className="space-y-1.5">
                <Label>Category <span className="text-red-500">*</span></Label>
                <Select value={form.category} onValueChange={(v) => setForm(f => ({ ...f, category: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Unit <span className="text-red-500">*</span></Label>
                <Select value={form.unit} onValueChange={(v) => setForm(f => ({ ...f, unit: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select unit" /></SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {UNITS.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Quantity <span className="text-red-500">*</span></Label>
                <Input type="number" step="0.1" min="0" value={form.quantity} onChange={(e) => setForm(f => ({ ...f, quantity: e.target.value }))} placeholder="50" required />
              </div>
              <div className="space-y-1.5">
                <Label>Price per Unit (KES) <span className="text-red-500">*</span></Label>
                <Input type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm(f => ({ ...f, price: e.target.value }))} placeholder="2800" required />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Location</Label>
                <Input value={form.location} onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))} placeholder="e.g., Nakuru, Kenya" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Listing Expiry Date</Label>
                <Input type="date" value={form.expiresAt} onChange={(e) => setForm(f => ({ ...f, expiresAt: e.target.value }))} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Description</Label>
                <Textarea value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Quality, growing method, available from..." className="min-h-20" />
              </div>
              {/* Image upload */}
              <div className="space-y-2 sm:col-span-2">
                <Label>Photos</Label>
                <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={handleImagePick} />
                <div className="flex flex-wrap gap-2">
                  {imagePreviews.map((src, idx) => (
                    <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200">
                      <Image src={src} alt="preview" fill className="object-cover" unoptimized={src.startsWith("blob:")} />
                      <button type="button" onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={() => fileRef.current?.click()}
                    className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center text-slate-400 hover:border-green-500 hover:text-green-500 transition-colors">
                    <ImagePlus className="w-6 h-6" />
                    <span className="text-xs mt-1">Add</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <Button type="submit" disabled={pending || uploading} className="flex-1">
                {(pending || uploading) ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {editTarget ? "Update Listing" : "Publish Listing"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle className="flex items-center gap-2 text-red-600"><AlertCircle className="w-5 h-5" /> Delete Listing</DialogTitle></DialogHeader>
          <p className="text-slate-600 dark:text-slate-400 text-sm">Delete &quot;{deleteTarget?.name}&quot;? This cannot be undone.</p>
          <div className="flex gap-3 pt-2">
            <Button variant="destructive" disabled={pending} onClick={handleDelete} className="flex-1">
              {pending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />} Delete
            </Button>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Keep It</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function fmt(d: Date | string) {
  return new Date(d).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" });
}

export default function SellProducePage() {
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"listings" | "orders">("listings");
  const [orders, setOrders] = useState<FarmerOrder[]>([]);
  const [loadingOrders, startLoad] = useTransition();

  // Form state for new listing (local — pending marketplace supplier integration)
  const [produceName, setProduceName]   = useState("");
  const [quantity,    setQuantity]      = useState("");
  const [price,       setPrice]         = useState("");
  const [unit,        setUnit]          = useState("");
  const [description, setDescription]   = useState("");

  // Listings stored locally (no dedicated DB model yet)
  const [listings, setListings] = useState([
    { id: 1, name: "Fresh Maize",    qty: "20 bags (90kg)",       price: 2800, status: "Active", views: 45,  inquiries: 8  },
    { id: 2, name: "Tomatoes",       qty: "50 crates",            price: 1200, status: "Active", views: 120, inquiries: 22 },
    { id: 3, name: "French Beans",   qty: "500 kg export grade",  price: 80,   status: "Sold",   views: 89,  inquiries: 15 },
  ]);

  useEffect(() => {
    startLoad(async () => {
      try {
        const data = await getFarmerOrders();
        setOrders(data);
      } catch {
        toast.error("Failed to load orders");
      }
    });
  }, []);

  function handlePublish() {
    if (!produceName || !quantity || !price) { toast.error("Please fill in all required fields"); return; }
    const newListing = {
      id: Date.now(),
      name: produceName,
      qty: `${quantity} ${unit}`.trim(),
      price: parseFloat(price) || 0,
      status: "Active",
      views: 0,
      inquiries: 0,
    };
    setListings((prev) => [newListing, ...prev]);
    toast.success("Listing published to marketplace!");
    setShowForm(false);
    setProduceName(""); setQuantity(""); setPrice(""); setUnit(""); setDescription("");
  }

  const activeListings = listings.filter((l: any) => l.status === "Active").length;
  const totalViews     = listings.reduce((a: any, l: any) => a + l.views, 0);
  const totalInquiries = listings.reduce((a: any, l: any) => a + l.inquiries, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Sell Produce</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">List your harvest and connect with buyers directly</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-green-600 hover:bg-green-700 text-white w-fit">
          <Plus className="w-4 h-4 mr-1.5" /> New Listing
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Package,      label: "Active Listings",  value: activeListings,    color: "text-green-600"  },
          { icon: TrendingUp,   label: "Total Views",      value: totalViews,        color: "text-blue-600"   },
          { icon: Store,        label: "Inquiries",        value: totalInquiries,    color: "text-purple-600" },
          { icon: ShoppingCart, label: "Purchases Made",   value: orders.length,     color: "text-amber-600"  },
        ].map(({ icon: Icon, label, value, color }) => (
          <Card key={label} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <p className={`text-xl font-bold ${color}`}>{value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
        {(["listings", "orders"] as const).map((tab: any) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${activeTab === tab ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"}`}
          >
            {tab === "listings" ? "My Listings" : "Purchase History"}
          </button>
        ))}
      </div>

      {/* New Listing Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Create New Listing</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}><X className="w-4 h-4" /></Button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Produce Name <span className="text-red-500">*</span></Label>
                <Input value={produceName} onChange={(e) => setProduceName(e.target.value)} placeholder="e.g., Fresh Maize, Tomatoes" />
              </div>
              <div className="space-y-1.5">
                <Label>Quantity Available <span className="text-red-500">*</span></Label>
                <Input value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="e.g., 50, 200" />
              </div>
              <div className="space-y-1.5">
                <Label>Unit</Label>
                <Input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="bags / kg / crates" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Price per Unit (KES) <span className="text-red-500">*</span></Label>
                <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="2800" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Description</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe quality, growing method, available from..."
                  className="min-h-20"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={handlePublish} className="flex-1 bg-green-600 hover:bg-green-700 text-white">Publish Listing</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* Listings Tab */}
      {activeTab === "listings" && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">My Produce Listings</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-slate-100 dark:divide-slate-800 p-0">
            {listings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 text-slate-400">
                <Store className="w-10 h-10 mb-3" />
                <p className="font-semibold">No listings yet</p>
                <p className="text-sm">Click "New Listing" to get started</p>
              </div>
            ) : (
              listings.map(({ id, name, qty, price, status, views, inquiries }) => (
                <div key={id} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                    <Store className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">{name}</p>
                    <p className="text-xs text-slate-400">{qty} · KES {price.toLocaleString()}/unit</p>
                    <p className="text-xs text-slate-400 mt-0.5">{views} views · {inquiries} inquiries</p>
                  </div>
                  <Badge variant={status === "Active" ? "success" : "secondary"}>{status}</Badge>
                  <Button variant="outline" size="sm" onClick={() => toast.info("Edit coming soon")}>Edit</Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}

      {/* Orders / Purchase History Tab */}
      {activeTab === "orders" && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">Purchase History</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loadingOrders ? (
              <div className="flex items-center justify-center py-14">
                <Loader2 className="w-6 h-6 animate-spin text-green-600" />
              </div>
            ) : orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 text-slate-400">
                <ShoppingCart className="w-10 h-10 mb-3" />
                <p className="font-semibold">No purchases yet</p>
                <p className="text-sm">Visit the marketplace to buy supplies</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {orders.map((order: any) => {
                  const cfg = STATUS_STYLES[order.status] ?? STATUS_STYLES.PENDING;
                  return (
                    <div key={order.id} className="px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <p className="font-semibold text-sm text-slate-900 dark:text-white">
                            Order #{order.id.slice(-8).toUpperCase()}
                          </p>
                          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" /> {fmt(order.createdAt)}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge variant={cfg.variant} className="text-xs">{cfg.label}</Badge>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">
                            KES {order.totalAmount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        {order.items.map((item: FarmerOrderItem) => (
                          <div key={item.id} className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                            <span>{item.product.name} × {item.quantity}</span>
                            <span>KES {(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
