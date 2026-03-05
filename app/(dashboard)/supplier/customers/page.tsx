"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Users, Search, ShoppingCart, Star, DollarSign, Loader2, X, RefreshCw,
  MapPin, Phone, Mail, ChevronDown, ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import { getSupplierCustomers } from "@/lib/actions/supplier";

type Customer = Awaited<ReturnType<typeof getSupplierCustomers>>[number];

function isVIP(c: Customer) {
  return c.orderCount >= 5 || c.totalSpent >= 100000;
}

function isActive(c: Customer) {
  const d = new Date(c.lastOrderAt);
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  return d >= thirtyDaysAgo;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "vip" | "active" | "inactive">("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const data = await getSupplierCustomers();
      setCustomers(data);
    } catch {
      toast.error("Failed to load customers");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch = !search
      || (c.user.name ?? "").toLowerCase().includes(q)
      || c.user.email.toLowerCase().includes(q)
      || (c.user.country ?? "").toLowerCase().includes(q);
    const vip = isVIP(c);
    const active = isActive(c);
    const matchFilter =
      filter === "all" || (filter === "vip" && vip) || (filter === "active" && active && !vip) || (filter === "inactive" && !active);
    return matchSearch && matchFilter;
  });

  const vipCount = customers.filter(isVIP).length;
  const activeCount = customers.filter((c) => isActive(c)).length;
  const totalSpent = customers.reduce((s, c) => s + c.totalSpent, 0);
  const avgLTV = customers.length ? Math.round(totalSpent / customers.length) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Customers</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Farmers and buyers who have ordered from you</p>
        </div>
        <Button variant="outline" onClick={load} disabled={loading} className="rounded-xl self-start sm:self-auto">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Customers", value: loading ? "—" : customers.length, icon: Users, color: "text-green-600 bg-green-100 dark:bg-green-900/30", f: "all" as const },
          { label: "Active (30 days)", value: loading ? "—" : activeCount, icon: ShoppingCart, color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30", f: "active" as const },
          { label: "VIP Customers", value: loading ? "—" : vipCount, icon: Star, color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30", f: "vip" as const },
          { label: "Avg Lifetime Value", value: loading ? "—" : `KES ${avgLTV.toLocaleString()}`, icon: DollarSign, color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30", f: "all" as const },
        ].map(({ label, value, icon: Icon, color, f }) => (
          <Card
            key={label}
            onClick={() => setFilter(filter === f && f !== "all" ? "all" : f)}
            className={`cursor-pointer transition-all hover:shadow-md ${filter === f && f !== "all" ? "ring-2 ring-green-500" : ""}`}
          >
            <CardContent className="p-4 text-center">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 ${color}`}><Icon className="w-5 h-5" /></div>
              {loading
                ? <div className="h-5 w-12 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mx-auto" />
                : <p className="text-lg font-bold text-slate-900 dark:text-white">{value}</p>
              }
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input className="pl-9 rounded-xl" placeholder="Search by name, email, or county…" value={search} onChange={(e) => setSearch(e.target.value)} />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["all", "vip", "active", "inactive"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-colors ${filter === f ? "bg-green-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"}`}
            >
              {f === "all" ? "All" : f === "vip" ? "⭐ VIP" : f === "active" ? "Active" : "Inactive"}
            </button>
          ))}
        </div>
      </div>

      {/* Customer table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <Users className="w-12 h-12 text-slate-300 mb-3" />
              <p className="text-slate-500 dark:text-slate-400 font-medium">No customers found</p>
              <p className="text-sm text-slate-400 mt-1">
                {search || filter !== "all" ? "Try adjusting your search or filter" : "Customers will appear here once they place orders"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((c) => {
                const vip = isVIP(c);
                const active = isActive(c);
                const isOpen = expanded === c.user.id;
                return (
                  <div key={c.user.id}>
                    <button
                      className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-left transition-colors"
                      onClick={() => setExpanded(isOpen ? null : c.user.id)}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Avatar */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm ${vip ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"}`}>
                          {(c.user.name ?? c.user.email)[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-sm text-slate-900 dark:text-white truncate">{c.user.name ?? "Unknown"}</span>
                            {vip && <span className="text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 font-bold px-1.5 py-0.5 rounded-full flex-shrink-0">VIP</span>}
                            {!active && <span className="text-xs bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 font-medium px-1.5 py-0.5 rounded-full flex-shrink-0">Inactive</span>}
                          </div>
                          <p className="text-xs text-slate-400 truncate">{c.user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 flex-shrink-0 ml-2">
                        <div className="text-right hidden sm:block">
                          <p className="text-sm font-bold text-slate-900 dark:text-white">KES {c.totalSpent.toLocaleString()}</p>
                          <p className="text-xs text-slate-400">{c.orderCount} order{c.orderCount !== 1 ? "s" : ""}</p>
                        </div>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </div>
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-0 bg-slate-50 dark:bg-slate-800/30">
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3">
                          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            <span className="truncate">{c.user.email}</span>
                          </div>
                          {c.user.phone && (
                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                              <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                              <span>{c.user.phone}</span>
                            </div>
                          )}
                          {c.user.country && (
                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                              <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                              <span>{c.user.country}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <ShoppingCart className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            <span>Last order: {new Date(c.lastOrderAt).toLocaleDateString("en-KE", { month: "short", day: "numeric", year: "numeric" })}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 sm:hidden">
                          <div>
                            <p className="text-xs text-slate-400">Total Spent</p>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">KES {c.totalSpent.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400">Orders</p>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">{c.orderCount}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
