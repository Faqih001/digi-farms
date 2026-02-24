"use client";

import { useState, useTransition, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ShoppingCart, Search, Plus, Minus, Trash2, X, Star,
  PackageCheck, Loader2, ShieldCheck, AlertCircle, ChevronDown
} from "lucide-react";
import { toast } from "sonner";
import { getMarketplaceProducts } from "@/lib/actions/product";
import { createOrder } from "@/lib/actions/order";

type Product = Awaited<ReturnType<typeof getMarketplaceProducts>>[number];
type CartItem = { product: Product; quantity: number };

const CATEGORIES = ["all", "Seeds", "Fertilizers", "Pesticides", "Equipment", "Herbicides", "Irrigation", "Feed", "Tools", "Veterinary"];

export default function BuyPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [shippingAddress, setShippingAddress] = useState("");
  const [isPending, startTransition] = useTransition();

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMarketplaceProducts({ category, search });
      setProducts(data);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [category, search]);

  useEffect(() => {
    const t = setTimeout(loadProducts, 300);
    return () => clearTimeout(t);
  }, [loadProducts]);

  function addToCart(product: Product) {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) return prev.map((i) => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { product, quantity: 1 }];
    });
    toast.success(`${product.name} added to cart`);
  }

  function updateQuantity(productId: string, delta: number) {
    setCart((prev) =>
      prev
        .map((i) => i.product.id === productId ? { ...i, quantity: i.quantity + delta } : i)
        .filter((i) => i.quantity > 0)
    );
  }

  function removeFromCart(productId: string) {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  }

  const cartTotal = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  function handlePlaceOrder() {
    if (!shippingAddress.trim()) { toast.error("Please enter a shipping address"); return; }
    startTransition(async () => {
      try {
        await createOrder(
          cart.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
          shippingAddress
        );
        toast.success("Order placed successfully!");
        setCart([]);
        setCheckoutOpen(false);
        setCartOpen(false);
        setShippingAddress("");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to place order");
      }
    });
  }

  function stockLabel(stock: number) {
    if (stock === 0) return { label: "Out of Stock", cls: "bg-red-100 text-red-700" };
    if (stock < 10) return { label: "Low Stock", cls: "bg-amber-100 text-amber-700" };
    return { label: "In Stock", cls: "bg-green-100 text-green-700" };
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Marketplace</h1>
          <p className="text-sm text-slate-500">Buy seeds, fertilizers, equipment & more from verified suppliers</p>
        </div>
        <button
          onClick={() => setCartOpen(true)}
          className="relative flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium text-sm transition-all shadow-sm self-start sm:self-auto"
        >
          <ShoppingCart className="w-4 h-4" />
          Cart
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            className="pl-9 rounded-xl"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="relative">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="appearance-none h-10 pl-3 pr-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c === "all" ? "All Categories" : c}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              category === c
                ? "bg-green-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-green-50 dark:hover:bg-slate-700"
            }`}
          >
            {c === "all" ? "All" : c}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-green-600" />
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <PackageCheck className="w-12 h-12 text-slate-300 mb-3" />
          <p className="text-slate-500 font-medium">No products found</p>
          <p className="text-sm text-slate-400 mt-1">Try a different category or search term</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => {
            const inCart = cart.find((i) => i.product.id === product.id);
            const outOfStock = product.stock === 0;
            const { label: stockLbl, cls: stockCls } = stockLabel(product.stock);
            return (
              <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 h-40 flex items-center justify-center relative">
                  {product.isFeatured && (
                    <span className="absolute top-2 left-2 bg-amber-400 text-amber-900 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" /> Featured
                    </span>
                  )}
                  {product.isAntiCounterfeit && (
                    <span className="absolute top-2 right-2 bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </span>
                  )}
                  <span className="text-5xl">🌱</span>
                </div>
                <CardContent className="p-3 space-y-2">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white text-sm line-clamp-2">{product.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{product.supplier.companyName}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-green-700 dark:text-green-400 font-bold text-sm">
                      KES {product.price.toLocaleString()} / {product.unit}
                    </span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${stockCls}`}>{stockLbl}</span>
                  </div>
                  <p className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg">{product.category}</p>

                  {inCart ? (
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(product.id, -1)} className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-red-100 text-slate-600 transition-colors">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-bold text-slate-900 dark:text-white flex-1 text-center">{inCart.quantity}</span>
                      <button
                        onClick={() => updateQuantity(product.id, 1)}
                        disabled={inCart.quantity >= product.stock}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-green-100 text-slate-600 transition-colors disabled:opacity-40"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      disabled={outOfStock}
                      onClick={() => addToCart(product)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white text-xs"
                    >
                      {outOfStock ? "Out of Stock" : "Add to Cart"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={() => setCartOpen(false)} />
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 h-full flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-green-600" /> Your Cart ({cartCount})
              </h2>
              <button onClick={() => setCartOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                  <ShoppingCart className="w-10 h-10 text-slate-300 mb-3" />
                  <p className="text-slate-500 font-medium">Your cart is empty</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{item.product.name}</p>
                      <p className="text-xs text-slate-500">KES {item.product.price.toLocaleString()} × {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => updateQuantity(item.product.id, -1)} className="p-1 rounded-lg bg-white dark:bg-slate-700 border">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="p-1 rounded-lg bg-white dark:bg-slate-700 border disabled:opacity-40"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button onClick={() => removeFromCart(item.product.id)} className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between text-base font-bold text-slate-900 dark:text-white">
                  <span>Total</span>
                  <span className="text-green-700 dark:text-green-400">KES {cartTotal.toLocaleString()}</span>
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={() => { setCartOpen(false); setCheckoutOpen(true); }}>
                  Proceed to Checkout
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {checkoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => !isPending && setCheckoutOpen(false)} />
          <div className="relative z-10 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Checkout</h2>
              {!isPending && (
                <button onClick={() => setCheckoutOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 space-y-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Order Summary</p>
                {cart.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-300">{item.product.name} × {item.quantity}</span>
                    <span className="font-medium">KES {(item.product.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-green-700 dark:text-green-400">KES {cartTotal.toLocaleString()}</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Shipping Address *</label>
                <Input placeholder="e.g. Kiambu Road, Nairobi" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} className="rounded-xl" />
              </div>
              <div className="flex items-start gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs p-3 rounded-xl">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Payment collected upon delivery. Orders processed within 1-3 business days.</span>
              </div>
            </div>
            <div className="px-5 pb-5 flex gap-3">
              <Button variant="outline" className="flex-1 rounded-xl" disabled={isPending} onClick={() => setCheckoutOpen(false)}>Cancel</Button>
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl"
                disabled={isPending || !shippingAddress.trim()}
                onClick={handlePlaceOrder}
              >
                {isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Placing…</> : "Place Order"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
