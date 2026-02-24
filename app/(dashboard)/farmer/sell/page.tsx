"use client";

import { useState, useEffect, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Store, TrendingUp, Package, Plus, X, ShoppingCart, Loader2, Clock } from "lucide-react";
import { getFarmerOrders } from "@/lib/actions/order";

type FarmerOrder = Awaited<ReturnType<typeof getFarmerOrders>>[number];

const STATUS_STYLES: Record<string, { label: string; variant: "secondary" | "success" | "destructive" | "info" }> = {
  PENDING:   { label: "Pending",   variant: "secondary"   },
  CONFIRMED: { label: "Confirmed", variant: "info"        },
  SHIPPED:   { label: "Shipped",   variant: "info"        },
  DELIVERED: { label: "Delivered", variant: "success"     },
  CANCELLED: { label: "Cancelled", variant: "destructive" },
};

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

  const activeListings = listings.filter((l) => l.status === "Active").length;
  const totalViews     = listings.reduce((a, l) => a + l.views, 0);
  const totalInquiries = listings.reduce((a, l) => a + l.inquiries, 0);

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
        {(["listings", "orders"] as const).map((tab) => (
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
                {orders.map((order) => {
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
                        {order.items.map((item) => (
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
