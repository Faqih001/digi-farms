"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Save, ArrowLeft, Upload } from "lucide-react";
import Link from "next/link";

const categories = ["Fertilizers", "Seeds", "Pest Control", "Equipment", "Irrigation", "Animal Feed", "Tools", "Other"];

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    toast.success("Product created successfully!");
    router.push("/supplier/products");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild><Link href="/supplier/products"><ArrowLeft className="w-4 h-4" /> Back</Link></Button>
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Add New Product</h1>
          <p className="text-sm text-slate-500">List a new product on the marketplace</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Product Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Product Name *</Label>
                <Input id="name" placeholder="e.g. NPK 17:17:17 Fertilizer (50kg)" required />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="category">Category *</Label>
                  <select id="category" required className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option value="">Select category</option>
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="brand">Brand</Label>
                  <Input id="brand" placeholder="e.g. Yara, KYNOCH" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="description">Description *</Label>
                <Textarea id="description" rows={4} placeholder="Describe your product, usage instructions, etc." required />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Pricing & Inventory</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="price">Price (KES) *</Label>
                  <Input id="price" type="number" min={0} placeholder="2500" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="comparePrice">Compare Price (KES)</Label>
                  <Input id="comparePrice" type="number" min={0} placeholder="3000" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="stock">Stock Quantity *</Label>
                  <Input id="stock" type="number" min={0} placeholder="100" required />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="unit">Unit</Label>
                  <select id="unit" className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option>Piece</option><option>Kg</option><option>Litre</option><option>Bag</option><option>Pack</option><option>Roll</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="minOrder">Minimum Order</Label>
                  <Input id="minOrder" type="number" min={1} placeholder="1" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Images</CardTitle></CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 text-center">
                <Upload className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-500 mb-2">Click or drag images here</p>
                <p className="text-xs text-slate-400">PNG, JPG up to 5MB each. Max 5 images.</p>
                <Button variant="outline" className="mt-3" size="sm">Select Files</Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button type="submit" loading={loading} size="lg"><Save className="w-4 h-4" /> Publish Product</Button>
            <Button type="button" variant="outline" size="lg" onClick={() => router.back()}>Cancel</Button>
          </div>
        </div>
      </form>
    </div>
  );
}
