"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Save, ArrowLeft, ImageIcon, X, Package, Star } from "lucide-react";
import Link from "next/link";
import AppImage from "@/components/ui/app-image";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createProduct } from "@/lib/actions/product";
import ImageUploadDialog from "@/components/ui/image-upload-dialog";

const CATEGORIES = [
  "Fertilizers", "Seeds", "Pest Control", "Equipment",
  "Irrigation", "Animal Feed", "Tools", "Herbicides", "Other",
];

const SUBCATEGORIES: Record<string, string[]> = {
  Fertilizers: ["Nitrogen-based", "Phosphate-based", "Potassium-based", "Compound NPK", "Organic", "Foliar"],
  Seeds: ["Maize", "Wheat", "Rice", "Vegetables", "Fruits", "Legumes", "Other Cereals"],
  "Pest Control": ["Insecticides", "Fungicides", "Acaricides", "Nematicides", "Rodenticides"],
  Equipment: ["Sprayers", "Tractors", "Planters", "Harvesters", "Irrigation Equipment", "Hand Tools"],
  Irrigation: ["Drip systems", "Sprinklers", "Pipes & Fittings", "Pumps", "Tanks"],
  "Animal Feed": ["Poultry Feed", "Dairy Feed", "Pig Feed", "Sheep Feed", "Cattle Feed"],
  Tools: ["Hand Hoes", "Machetes", "Pruning Tools", "Planting Dibbers"],
  Herbicides: ["Pre-emergent", "Post-emergent", "Selective", "Non-selective"],
  Other: [],
};

const UNITS = ["Bag", "Kg", "Litre", "Piece", "Pack", "Roll", "Box", "Tin", "Bundle"];

export default function NewProductPage() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [comparePrice, setComparePrice] = useState("");
  const [unit, setUnit] = useState("Bag");
  const [stock, setStock] = useState("");
  const [minOrder, setMinOrder] = useState("1");
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const subs = SUBCATEGORIES[category] ?? [];

  const priceNum = parseFloat(price) || 0;
  const comparePriceNum = parseFloat(comparePrice) || 0;
  const stockNum = parseInt(stock) || 0;
  const discount = comparePriceNum > priceNum ? Math.round(((comparePriceNum - priceNum) / comparePriceNum) * 100) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !category || !price || !stock) { toast.error("Fill in all required fields"); return; }
    startTransition(async () => {
      try {
        await createProduct({
          name, description: description || undefined, category, subcategory: subcategory || undefined,
          price: priceNum, unit, stock: stockNum, imageUrls, tags: [],
        });
        toast.success("Product created successfully!");
        router.push("/supplier/products");
      } catch (err) {
        toast.error((err as Error).message);
      }
    });
  };

  const addImage = (url: string) => setImageUrls((prev) => [...prev, url]);
  const removeImage = (i: number) => setImageUrls((prev) => prev.filter((_, idx) => idx !== i));

  const stockLabel = stockNum === 0 ? "Out of Stock" : stockNum < 10 ? "Low Stock" : "In Stock";
  const stockVariant: "destructive" | "warning" | "success" = stockNum === 0 ? "destructive" : stockNum < 10 ? "warning" : "success";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/supplier/products"><ArrowLeft className="w-4 h-4 mr-1" />Back</Link>
        </Button>
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Add New Product</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">List a new product on the marketplace</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Product Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Product Name *</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. NPK 17:17:17 Fertilizer (50kg)" required />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="category">Category *</Label>
                  <Select required value={category} onValueChange={(v) => { setCategory(v); setSubcategory(""); }}>
                    <SelectTrigger id="category" className="h-10 rounded-xl">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                {subs.length > 0 && (
                  <div className="space-y-1.5">
                    <Label htmlFor="subcategory">Subcategory</Label>
                    <Select value={subcategory} onValueChange={setSubcategory}>
                      <SelectTrigger id="subcategory" className="h-10 rounded-xl">
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        {subs.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your product, specifications, usage instructions…" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Pricing & Inventory</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="price">Price (KES) *</Label>
                  <Input id="price" type="number" min={0} step="0.01" required value={price} onChange={(e) => setPrice(e.target.value)} placeholder="2500" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="comparePrice">Compare Price (KES)</Label>
                  <Input id="comparePrice" type="number" min={0} step="0.01" value={comparePrice} onChange={(e) => setComparePrice(e.target.value)} placeholder="3000" />
                  {discount > 0 && <p className="text-xs text-green-600 font-medium">{discount}% discount shown to customers</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="stock">Stock Quantity *</Label>
                  <Input id="stock" type="number" min={0} required value={stock} onChange={(e) => setStock(e.target.value)} placeholder="100" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="unit">Unit *</Label>
                  <Select value={unit} onValueChange={setUnit}>
                    <SelectTrigger id="unit" className="h-10 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {UNITS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="minOrder">Minimum Order Quantity</Label>
                  <Input id="minOrder" type="number" min={1} value={minOrder} onChange={(e) => setMinOrder(e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Product Images</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-3">
                {imageUrls.map((url, i) => (
                  <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                    <AppImage src={url} alt={`Image ${i + 1}`} fill className="object-cover" sizes="96px" />
                    {i === 0 && <div className="absolute bottom-0 left-0 right-0 text-center bg-green-600/80 text-white text-xs py-0.5">Main</div>}
                    <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {imageUrls.length < 5 && (
                  <div className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center">
                    <ImageUploadDialog aspect={1} label="Add" onChange={(url) => { if (url) addImage(url); }} />
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-400">Add up to 5 images. The first image becomes the main product thumbnail.</p>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button type="button" variant="outline" asChild className="flex-1"><Link href="/supplier/products">Cancel</Link></Button>
            <Button type="submit" disabled={pending || !name || !category || !price || !stock} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
              {pending ? "Creating…" : <><Save className="w-4 h-4 mr-2" />Create Product</>}
            </Button>
          </div>
        </form>

        {/* Preview */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Preview</h2>
          <Card className="overflow-hidden">
            <div className="aspect-square bg-slate-100 dark:bg-slate-800 relative">
              {imageUrls[0] ? (
                <AppImage src={imageUrls[0]} alt={name || "Product"} fill className="object-cover" sizes="300px" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                  <ImageIcon className="w-12 h-12 text-slate-300" />
                  <span className="text-xs text-slate-400">No image yet</span>
                </div>
              )}
              {stockNum >= 0 && (
                <div className="absolute top-2 right-2">
                  <Badge variant={stockVariant} className="text-xs shadow">{stockLabel}</Badge>
                </div>
              )}
              {discount > 0 && (
                <div className="absolute top-2 left-2">
                  <Badge className="text-xs bg-red-500 shadow">-{discount}%</Badge>
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-sm text-slate-900 dark:text-white mb-1 line-clamp-2">{name || "Product Name"}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                {category || "Category"}{subcategory ? ` · ${subcategory}` : ""}
              </p>
              {description && (
                <p className="text-xs text-slate-400 mb-3 line-clamp-3">{description}</p>
              )}
              <div className="flex items-baseline gap-2 mb-3">
                {priceNum > 0 ? (
                  <>
                    <span className="text-lg font-bold text-green-600">KES {priceNum.toLocaleString()}</span>
                    <span className="text-xs text-slate-400">/{unit}</span>
                    {comparePriceNum > priceNum && (
                      <span className="text-xs text-slate-400 line-through">KES {comparePriceNum.toLocaleString()}</span>
                    )}
                  </>
                ) : (
                  <span className="text-sm text-slate-400">Enter price</span>
                )}
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{stockNum > 0 ? `${stockNum} in stock` : "Out of stock"}</span>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map((s) => <Star key={s} className="w-3 h-3 text-slate-300" />)}
                  <span className="ml-1 text-xs text-slate-400">New</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-xs text-slate-500 space-y-2">
              <p className="font-semibold text-slate-700 dark:text-slate-300">Listing checklist</p>
              {[
                { done: !!name, label: "Product name added" },
                { done: !!category, label: "Category selected" },
                { done: !!description, label: "Description written" },
                { done: priceNum > 0, label: "Price set" },
                { done: stockNum > 0, label: "Stock quantity set" },
                { done: imageUrls.length > 0, label: "At least 1 image uploaded" },
              ].map(({ done, label }) => (
                <div key={label} className={`flex items-center gap-2 ${done ? "text-green-600" : "text-slate-400"}`}>
                  <div className={`w-2 h-2 rounded-full ${done ? "bg-green-500" : "bg-slate-300"}`} />
                  {label}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
