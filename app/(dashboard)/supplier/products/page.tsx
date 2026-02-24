"use client";

import { useState, useEffect, useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Package, Plus, Edit, Trash2, Search, Star, Loader2, AlertCircle } from "lucide-react";
import { getSupplierProducts, createProduct, updateProduct, deleteProduct } from "@/lib/actions/product";

type Product = Awaited<ReturnType<typeof getSupplierProducts>>[number];
type ProductForm = { name: string; description: string; category: string; subcategory: string; price: string; unit: string; stock: string };

const emptyForm: ProductForm = { name: "", description: "", category: "", subcategory: "", unit: "bag", price: "", stock: "" };

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [pending, startTransition] = useTransition();

  const load = () => getSupplierProducts().then(setProducts).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const filtered = products.filter((p: any) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ name: p.name, description: p.description ?? "", category: p.category, subcategory: p.subcategory ?? "", price: String(p.price), unit: p.unit, stock: String(p.stock) });
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { name: form.name, description: form.description || undefined, category: form.category, subcategory: form.subcategory || undefined, price: parseFloat(form.price), unit: form.unit, stock: parseInt(form.stock) };
    startTransition(async () => {
      try {
        if (editing) { await updateProduct(editing.id, data); toast.success("Product updated!"); }
        else { await createProduct(data); toast.success("Product created!"); }
        setModalOpen(false);
        const data2 = await getSupplierProducts(); setProducts(data2);
      } catch (err) { toast.error((err as Error).message); }
    });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    startTransition(async () => {
      try {
        await deleteProduct(deleteTarget.id);
        toast.success("Product deleted");
        setDeleteTarget(null);
        const data = await getSupplierProducts(); setProducts(data);
      } catch (err) { toast.error((err as Error).message); }
    });
  };

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

      <Card>
        <CardContent className="p-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input className="pl-10" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <Card className="p-12 text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">{search ? "No matching products" : "No products yet"}</h3>
          <p className="text-slate-400 mb-6">Add your first product to start selling on the marketplace</p>
          {!search && <Button onClick={openCreate} className="mx-auto"><Plus className="w-4 h-4 mr-2" />Add Product</Button>}
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((p: Product) => {
            const stockStatus = p.stock === 0 ? "Out of Stock" : p.stock < 10 ? "Low Stock" : "Active";
            return (
              <Card key={p.id} className="card-hover">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center"><Package className="w-6 h-6 text-slate-400" /></div>
                    <Badge variant={stockStatus === "Active" ? "success" : stockStatus === "Low Stock" ? "warning" : "destructive"} className="text-xs">{stockStatus}</Badge>
                  </div>
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-white mb-1 line-clamp-2">{p.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{p.category}</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-green-600">KES {p.price.toLocaleString()}/{p.unit}</span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-3">{p.stock} in stock</div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => openEdit(p)}><Edit className="w-3 h-3 mr-1" />Edit</Button>
                    <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600 border-red-200" onClick={() => setDeleteTarget(p)}><Trash2 className="w-3 h-3" /></Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={open => { if (!open) { setModalOpen(false); setEditing(null); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editing ? "Edit Product" : "Add New Product"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div className="space-y-1.5"><Label>Product Name *</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="NPK Fertilizer 50kg" required /></div>
            <div className="space-y-1.5"><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="min-h-[60px]" placeholder="Describe the product..." /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Category *</Label><Input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="Fertilizers" required /></div>
              <div className="space-y-1.5"><Label>Subcategory</Label><Input value={form.subcategory} onChange={e => setForm(f => ({ ...f, subcategory: e.target.value }))} placeholder="NPK" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Price (KES) *</Label><Input type="number" min="0" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="2500" required /></div>
              <div className="space-y-1.5"><Label>Unit *</Label><Input value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} placeholder="bag" required /></div>
            </div>
            <div className="space-y-1.5"><Label>Stock Quantity *</Label><Input type="number" min="0" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} placeholder="100" required /></div>
            <div className="flex gap-3">
              <Button type="submit" disabled={pending} className="flex-1">{pending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}{editing ? "Save Changes" : "Add Product"}</Button>
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteTarget} onOpenChange={open => { if (!open) setDeleteTarget(null); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle className="flex items-center gap-2 text-red-600"><AlertCircle className="w-5 h-5" />Delete Product</DialogTitle></DialogHeader>
          <p className="text-slate-600 dark:text-slate-400 text-sm">Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This cannot be undone.</p>
          <div className="flex gap-3 pt-2">
            <Button variant="destructive" disabled={pending} onClick={handleDelete} className="flex-1">{pending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}Delete</Button>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
