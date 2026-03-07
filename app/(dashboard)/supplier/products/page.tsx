"use client";

import { useState, useEffect, useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Package, Plus, Edit, Trash2, Search, Loader2, RotateCcw, Clock, ImageIcon, X } from "lucide-react";
import AppImage from "@/components/ui/app-image";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  getSupplierProducts, createProduct, updateProduct, deleteProduct,
} from "@/lib/actions/product";
import ImageUploadDialog from "@/components/ui/image-upload-dialog";

type Product = Awaited<ReturnType<typeof getSupplierProducts>>[number];

type ProductForm = {
  name: string; description: string; category: string; subcategory: string;
  price: string; unit: string; stock: string; imageUrls: string[];
};

const emptyForm: ProductForm = {
  name: "", description: "", category: "", subcategory: "",
  unit: "Bag", price: "", stock: "", imageUrls: [],
};

const CATEGORIES = [
  "Fertilizers", "Seeds", "Pest Control", "Equipment",
  "Irrigation", "Animal Feed", "Tools", "Herbicides", "Other",
];

const UNITS = ["Bag", "Kg", "Litre", "Piece", "Pack", "Roll", "Box", "Tin"];

function stockBadge(stock: number) {
  if (stock === 0) return { label: "Out of Stock", variant: "destructive" as const };
  if (stock < 10) return { label: "Low Stock", variant: "warning" as const };
  return { label: "In Stock", variant: "success" as const };
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [trashQueue, setTrashQueue] = useState<{ product: Product; deletedAt: number }[]>([]);
  const [pending, startTransition] = useTransition();

  const load = () =>
    getSupplierProducts()
      .then(setProducts)
      .catch(() => toast.error("Failed to load products"))
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  // Clean up trash queue – actually delete after 7 days (client-side cosmetic timer)
  // For now we show a visual undo within 30 seconds
  useEffect(() => {
    if (trashQueue.length === 0) return;
    const interval = setInterval(() => {
      const now = Date.now();
      const expired = trashQueue.filter((t) => now - t.deletedAt > 30000);
      if (expired.length > 0) {
        setTrashQueue((prev) => prev.filter((t) => now - t.deletedAt <= 30000));
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [trashQueue]);

  const filtered = products.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "All" || p.category === categoryFilter;
    const { label } = stockBadge(p.stock);
    const matchStatus = statusFilter === "All" || label === statusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name, description: p.description ?? "", category: p.category,
      subcategory: p.subcategory ?? "", price: String(p.price), unit: p.unit,
      stock: String(p.stock), imageUrls: p.imageUrls ?? [],
    });
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: form.name, description: form.description || undefined,
      category: form.category, subcategory: form.subcategory || undefined,
      price: parseFloat(form.price), unit: form.unit,
      stock: parseInt(form.stock), imageUrls: form.imageUrls, tags: [],
    };
    startTransition(async () => {
      try {
        if (editing) { await updateProduct(editing.id, data); toast.success("Product updated!"); }
        else { await createProduct(data); toast.success("Product created!"); }
        setModalOpen(false);
        await load();
      } catch (err) { toast.error((err as Error).message); }
    });
  };

  const moveToTrash = (p: Product) => {
    setTrashQueue((prev) => [...prev, { product: p, deletedAt: Date.now() }]);
    setProducts((prev) => prev.filter((x) => x.id !== p.id));
    toast(`"${p.name}" moved to trash`, {
      action: { label: "Undo", onClick: () => undoTrash(p.id) },
    });
    // Actually delete after 30s
    setTimeout(() => {
      startTransition(async () => {
        try { await deleteProduct(p.id); }
        catch { /* product may have been restored */ }
      });
    }, 30000);
  };

  const undoTrash = (id: string) => {
    const found = trashQueue.find((t) => t.product.id === id);
    if (found) {
      setProducts((prev) => [...prev, found.product].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      setTrashQueue((prev) => prev.filter((t) => t.product.id !== id));
    }
  };

  const addImage = (url: string) => setForm((f) => ({ ...f, imageUrls: [...f.imageUrls, url] }));
  const removeImage = (idx: number) => setForm((f) => ({ ...f, imageUrls: f.imageUrls.filter((_, i) => i !== idx) }));

  const usedCategories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Products</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{products.length} product{products.length !== 1 ? "s" : ""} listed</p>
        </div>
        <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" />Add Product</Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input className="pl-10" placeholder="Search products…" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-10 w-44 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {usedCategories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-10 w-44 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="In Stock">In Stock</SelectItem>
                <SelectItem value="Low Stock">Low Stock</SelectItem>
                <SelectItem value="Out of Stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Trash queue banner */}
      {trashQueue.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl">
          <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span className="text-sm text-amber-700 dark:text-amber-400 flex-1">
            {trashQueue.length} product{trashQueue.length > 1 ? "s" : ""} in trash — will be permanently deleted in 30s
          </span>
          {trashQueue.map((t) => (
            <Button key={t.product.id} variant="outline" size="sm" onClick={() => undoTrash(t.product.id)} className="border-amber-400 text-amber-700 hover:bg-amber-100">
              <RotateCcw className="w-3 h-3 mr-1" /> Restore "{t.product.name.slice(0, 15)}"
            </Button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <Card className="p-12 text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">{search || categoryFilter !== "All" || statusFilter !== "All" ? "No matching products" : "No products yet"}</h3>
          <p className="text-slate-400 mb-6">Add your first product to start selling on the marketplace</p>
          {!search && <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" />Add Product</Button>}
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((p) => {
            const { label, variant } = stockBadge(p.stock);
            const thumb = p.imageUrls?.[0];
            return (
              <Card key={p.id} className="card-hover overflow-hidden">
                <div className="h-40 bg-white dark:bg-slate-800 relative overflow-hidden flex items-center justify-center">
                  {thumb ? (
                    <AppImage src={thumb} alt={p.name} fill className="object-contain object-center" sizes="240px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-10 h-10 text-slate-300" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge variant={variant} className="text-xs shadow">{label}</Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-white mb-1 line-clamp-2">{p.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{p.category}{p.subcategory ? ` · ${p.subcategory}` : ""}</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-base font-bold text-green-600">KES {p.price.toLocaleString()}<span className="text-xs font-normal text-slate-400">/{p.unit}</span></span>
                    <span className="text-xs text-slate-400">{p.stock} in stock</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => openEdit(p)}><Edit className="w-3 h-3 mr-1" />Edit</Button>
                    <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600 border-red-200 hover:bg-red-50" onClick={() => moveToTrash(p)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Product" : "Add New Product"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 pt-2">
            {/* Product Name */}
            <div className="space-y-1.5">
              <Label>Product Name *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. NPK 17:17:17 Fertilizer (50kg)" required />
            </div>

            {/* Category + Subcategory */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Category *</Label>
                <Select required value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger className="h-10 rounded-xl">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Subcategory</Label>
                <Input value={form.subcategory} onChange={(e) => setForm({ ...form, subcategory: e.target.value })} placeholder="Optional" />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe your product…" />
            </div>

            {/* Price + Unit + Stock */}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label>Price (KES) *</Label>
                <Input type="number" min={0} step="0.01" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="2500" />
              </div>
              <div className="space-y-1.5">
                <Label>Unit *</Label>
                <Select value={form.unit} onValueChange={(v) => setForm({ ...form, unit: v })}>
                  <SelectTrigger className="h-10 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {UNITS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Stock *</Label>
                <Input type="number" min={0} required value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="100" />
              </div>
            </div>

            {/* Images */}
            <div className="space-y-2">
              <Label>Product Images</Label>
              <div className="flex flex-wrap gap-2">
                {form.imageUrls.length > 0 && (
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                    <AppImage src={form.imageUrls[0]} alt={`Image 1`} fill className="object-cover" sizes="80px" />
                    <button type="button" onClick={() => removeImage(0)} className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                {form.imageUrls.length < 1 && (
                  <ImageUploadDialog aspect={1} label="Add" onChange={(url) => { if (url) addImage(url); }} />
                )}
              </div>
              <p className="text-xs text-slate-400">Add 1 image. First image is the thumbnail.</p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="flex-1">Cancel</Button>
              <Button type="submit" disabled={pending} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                {pending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{editing ? "Saving…" : "Creating…"}</> : editing ? "Save Changes" : "Create Product"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
