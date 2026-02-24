"use client";

import { useEffect, useState, useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Eye, X, Users, CreditCard, TrendingUp, Ban } from "lucide-react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getAdminSubscriptions } from "@/lib/actions/admin";

type Subscription = Awaited<ReturnType<typeof getAdminSubscriptions>>[number];

const TIER_STYLES: Record<string, { label: string; badgeVariant: "secondary" | "info" | "success"; border: string; color: string }> = {
  FREE:       { label: "Free",       badgeVariant: "secondary", border: "border-slate-200",  color: "text-slate-500 dark:text-slate-400"  },
  PRO:        { label: "Pro",        badgeVariant: "info",      border: "border-blue-400",   color: "text-blue-600"   },
  ENTERPRISE: { label: "Enterprise", badgeVariant: "success",   border: "border-purple-400", color: "text-purple-600" },
};

const STATUS_STYLES: Record<string, { label: string; variant: "success" | "destructive" | "secondary" }> = {
  ACTIVE:    { label: "Active",    variant: "success"     },
  EXPIRED:   { label: "Expired",   variant: "destructive" },
  CANCELLED: { label: "Cancelled", variant: "destructive" },
  PAUSED:    { label: "Paused",    variant: "secondary"   },
};

function fmt(d: Date | string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" });
}

function fmtPrice(price: number) {
  if (price === 0) return "Free";
  return `KES ${price.toLocaleString()}/mo`;
}

export default function AdminSubscriptionsPage() {
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, startLoad] = useTransition();
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selected, setSelected] = useState<Subscription | null>(null);

  function load() {
    startLoad(async () => {
      try {
        const data = await getAdminSubscriptions();
        setSubs(data);
      } catch {
        toast.error("Failed to load subscriptions");
      }
    });
  }

  useEffect(() => { load(); }, []);

  const filtered = subs.filter((s: any) => {
    const matchTier   = tierFilter   === "ALL" || s.tier   === tierFilter;
    const matchStatus = statusFilter === "ALL" || s.status === statusFilter;
    const matchSearch = !search || s.user.name?.toLowerCase().includes(search.toLowerCase()) || s.user.email?.toLowerCase().includes(search.toLowerCase());
    return matchTier && matchStatus && matchSearch;
  });

  // stats
  const total      = subs.length;
  const active     = subs.filter((s: any) => s.status === "ACTIVE").length;
  const enterprise = subs.filter((s: any) => s.tier   === "ENTERPRISE").length;
  const cancelled  = subs.filter((s: any) => s.status === "CANCELLED").length;
  const mrr        = subs.filter((s: any) => s.status === "ACTIVE").reduce((acc: number, s: Subscription) => acc + s.price, 0);

  const statCards = [
    { label: "Total Subscribers", value: total,      icon: <Users      className="w-5 h-5 text-blue-500"   />, filter: "ALL_TIER",       color: "text-blue-600"   },
    { label: "Active",            value: active,     icon: <TrendingUp className="w-5 h-5 text-green-500" />, filter: "ACTIVE_STATUS",  color: "text-green-600"  },
    { label: "Enterprise",        value: enterprise, icon: <CreditCard className="w-5 h-5 text-purple-500"/>, filter: "ENTERPRISE_TIER",color: "text-purple-600" },
    { label: "Cancelled",         value: cancelled,  icon: <Ban        className="w-5 h-5 text-red-500"   />, filter: "CANCELLED_STATUS",color: "text-red-600"   },
  ];

  function handleStatClick(filter: string) {
    if (filter === "ALL_TIER")         { setTierFilter("ALL");        setStatusFilter("ALL");       }
    else if (filter.endsWith("_TIER")) { setTierFilter(filter.replace("_TIER",""));  setStatusFilter("ALL"); }
    else                               { setStatusFilter(filter.replace("_STATUS","")); setTierFilter("ALL"); }
  }

  const planDetails = [
    { tier: "FREE",       price: "KES 0",      features: ["Basic crop tracking", "5 AI scans/month", "Marketplace access", "Community support"] },
    { tier: "PRO",        price: "KES 2,999/mo",features: ["Unlimited AI scans", "Soil & climate reports", "Priority support", "Financing access", "Advanced analytics"] },
    { tier: "ENTERPRISE", price: "Custom",      features: ["All Pro features", "Dedicated account manager", "API access", "Custom integrations", "SLA guarantee"] },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Subscriptions</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Platform subscription plans and billing overview</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s: any) => (
          <Card
            key={s.label}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleStatClick(s.filter)}
          >
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800">{s.icon}</div>
              <div>
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* MRR Banner */}
      <Card className="bg-gradient-to-r from-green-600 to-emerald-500 border-0 text-white">
        <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <p className="text-sm font-medium opacity-80">Monthly Recurring Revenue (MRR)</p>
            <p className="text-3xl font-black">KES {mrr.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-80">Active paying subscribers</p>
            <p className="text-2xl font-bold">{subs.filter((s: any) => s.status === "ACTIVE" && s.price > 0).length}</p>
          </div>
        </CardContent>
      </Card>

      {/* Plan Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        {planDetails.map(({ tier, price, features }) => {
          const cfg = TIER_STYLES[tier];
          const count = subs.filter((s: any) => s.tier === tier).length;
          return (
            <Card key={tier} className={`border-2 ${cfg.border}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-900 dark:text-white">{cfg.label}</span>
                  <Badge variant={cfg.badgeVariant}>{cfg.label}</Badge>
                </div>
                <p className="text-xl font-black text-slate-800 dark:text-slate-200 mb-1">{price}</p>
                <p className={`text-sm font-semibold mb-3 ${cfg.color}`}>{count} subscribers</p>
                <ul className="space-y-1">
                  {features.map((f: any) => (
                    <li key={f} className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Search by name or email..."
              />
            </div>
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="ALL">All Tiers</option>
              <option value="FREE">Free</option>
              <option value="PRO">Pro</option>
              <option value="ENTERPRISE">Enterprise</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="EXPIRED">Expired</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="PAUSED">Paused</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-green-600" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <CreditCard className="w-10 h-10 mb-3" />
              <p className="font-semibold">No subscriptions found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    {["User", "Role", "Tier", "Price", "Start Date", "Renews At", "Status", ""].map((h: any) => (
                      <th key={h} className="px-4 py-3 text-left font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filtered.map((s: Subscription) => {
                    const tierCfg   = TIER_STYLES[s.tier]   ?? TIER_STYLES.FREE;
                    const statusCfg = STATUS_STYLES[s.status] ?? STATUS_STYLES.ACTIVE;
                    return (
                      <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-semibold text-slate-900 dark:text-white">{s.user.name ?? "—"}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{s.user.email}</p>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 uppercase">{s.user.role}</td>
                        <td className="px-4 py-3">
                          <Badge variant={tierCfg.badgeVariant} className="text-xs">{tierCfg.label}</Badge>
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400 text-xs font-medium">{fmtPrice(s.price)}</td>
                        <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">{fmt(s.startDate)}</td>
                        <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">{fmt(s.renewsAt)}</td>
                        <td className="px-4 py-3">
                          <Badge variant={statusCfg.variant} className="text-xs">{statusCfg.label}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Button variant="ghost" size="sm" onClick={() => setSelected(s)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelected(null)}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">{selected.user.name ?? "Unknown"}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{selected.user.email}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelected(null)}><X className="w-4 h-4" /></Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Role",       value: selected.user.role },
                { label: "Tier",       value: TIER_STYLES[selected.tier]?.label ?? selected.tier },
                { label: "Status",     value: STATUS_STYLES[selected.status]?.label ?? selected.status },
                { label: "Price",      value: fmtPrice(selected.price) },
                { label: "Start Date", value: fmt(selected.startDate) },
                { label: "Renews At",  value: fmt(selected.renewsAt) },
                { label: "End Date",   value: fmt(selected.endDate) },
                { label: "Stripe ID",  value: selected.stripeSubId ?? "—" },
              ].map(({ label, value }) => (
                <div key={label} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">{label}</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{value}</p>
                </div>
              ))}
            </div>

            <Button className="w-full" variant="outline" onClick={() => setSelected(null)}>Close</Button>
          </div>
        </div>
      )}
    </div>
  );
}
