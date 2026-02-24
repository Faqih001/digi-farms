import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CreditCard, CheckCircle, Star, Zap, Crown, ArrowRight, ScanLine, BarChart3, ShoppingCart, Shield, Phone } from "lucide-react";

const tiers = [
  {
    name: "Free",
    price: "KES 0",
    period: "/forever",
    badge: null,
    features: ["5 AI diagnostics/month", "Basic weather alerts", "Marketplace browsing", "Community forum access"],
    limits: ["No analytics dashboard", "No soil reports", "No priority support"],
    cta: "Current Plan",
    current: true,
    icon: Star,
  },
  {
    name: "Pro",
    price: "KES 999",
    period: "/month",
    badge: "Most Popular",
    features: ["Unlimited AI diagnostics", "Full weather & climate insights", "Yield analytics dashboard", "Soil health reports", "Agrovet locator with reviews", "Priority email support", "Marketplace selling"],
    limits: ["No API access", "No team features"],
    cta: "Upgrade to Pro",
    current: false,
    icon: Zap,
  },
  {
    name: "Enterprise",
    price: "KES 4,999",
    period: "/month",
    badge: "Best Value",
    features: ["Everything in Pro", "Multi-farm management", "API access & webhooks", "Dedicated account manager", "Custom AI model training", "Bulk ordering discounts", "Insurance integration", "White-label reports"],
    limits: [],
    cta: "Contact Sales",
    current: false,
    icon: Crown,
  },
];

const usage = [
  { label: "AI Diagnostics", used: 3, limit: 5, unit: "scans" },
  { label: "Weather Alerts", used: 12, limit: 15, unit: "alerts" },
  { label: "Marketplace Listings", used: 0, limit: 2, unit: "listings" },
];

export default function SubscriptionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Subscription</h1>
        <p className="text-sm text-slate-500">Manage your plan and billing</p>
      </div>

      {/* Current Plan */}
      <Card className="border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/10">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Star className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Free Plan</h2>
                  <Badge variant="success">Active</Badge>
                </div>
                <p className="text-sm text-slate-500">Basic access to DIGI-FARMS features</p>
              </div>
            </div>
            <Button>Upgrade Now <ArrowRight className="w-4 h-4" /></Button>
          </div>
        </CardContent>
      </Card>

      {/* Usage */}
      <Card>
        <CardHeader><CardTitle>Current Usage</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-5">
            {usage.map((u) => (
              <div key={u.label}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{u.label}</span>
                  <span className="text-sm text-slate-500">{u.used} / {u.limit} {u.unit}</span>
                </div>
                <Progress value={(u.used / u.limit) * 100} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Plans Comparison */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Choose Your Plan</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <Card key={tier.name} className={tier.badge === "Most Popular" ? "border-green-500 border-2 relative" : ""}>
              {tier.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge>{tier.badge}</Badge>
                </div>
              )}
              <CardContent className="p-6 pt-8">
                <div className="flex items-center gap-2 mb-3">
                  <tier.icon className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{tier.name}</h3>
                </div>
                <div className="mb-6">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">{tier.price}</span>
                  <span className="text-sm text-slate-500">{tier.period}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /> {f}
                    </li>
                  ))}
                </ul>
                <Button variant={tier.current ? "outline" : "default"} className="w-full" disabled={tier.current}>
                  {tier.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: ScanLine, title: "AI Diagnostics", desc: "Unlimited scans with Pro" },
          { icon: BarChart3, title: "Full Analytics", desc: "Yield forecasts & trends" },
          { icon: ShoppingCart, title: "Sell Produce", desc: "List unlimited products" },
          { icon: Phone, title: "Priority Support", desc: "24/7 expert assistance" },
        ].map(({ icon: Icon, title, desc }) => (
          <Card key={title}>
            <CardContent className="p-4 text-center">
              <Icon className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold text-sm text-slate-900 dark:text-white">{title}</h4>
              <p className="text-xs text-slate-500">{desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
