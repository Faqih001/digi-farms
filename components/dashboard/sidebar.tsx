"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard, Sprout, ScanLine, BarChart3, Droplets, CloudSun, ShoppingCart,
  Store, MapPin, Wallet, FileText, Shield, CreditCard, Settings, LogOut,
  Package, Truck, Users, DollarSign, TrendingUp, ClipboardList, PieChart,
  UserCheck, BrainCircuit, Leaf
} from "lucide-react";

const farmerNav = [
  { label: "Overview", href: "/farmer", icon: LayoutDashboard },
  { label: "Farm Profile", href: "/farmer/farm", icon: Sprout },
  { label: "Crop Diagnostics", href: "/farmer/diagnostics", icon: ScanLine },
  { label: "Scan History", href: "/farmer/scans", icon: ClipboardList },
  { label: "Yield Analytics", href: "/farmer/analytics", icon: BarChart3 },
  { label: "Soil Health", href: "/farmer/soil", icon: Droplets },
  { label: "Climate Insights", href: "/farmer/climate", icon: CloudSun },
  { label: "Buy Inputs", href: "/farmer/buy", icon: ShoppingCart },
  { label: "Sell Produce", href: "/farmer/sell", icon: Store },
  { label: "Agrovet Locator", href: "/farmer/agrovets", icon: MapPin },
  { label: "Financing Profile", href: "/farmer/financing", icon: Wallet },
  { label: "Loan Applications", href: "/farmer/loans", icon: FileText },
  { label: "Insurance", href: "/farmer/insurance", icon: Shield },
  { label: "Subscription", href: "/farmer/subscription", icon: CreditCard },
  { label: "Settings", href: "/farmer/settings", icon: Settings },
];

const supplierNav = [
  { label: "Overview", href: "/supplier", icon: LayoutDashboard },
  { label: "Products", href: "/supplier/products", icon: Package },
  { label: "Add Product", href: "/supplier/products/new", icon: Sprout },
  { label: "Orders", href: "/supplier/orders", icon: Truck },
  { label: "Inventory", href: "/supplier/inventory", icon: ClipboardList },
  { label: "Analytics", href: "/supplier/analytics", icon: BarChart3 },
  { label: "Customers", href: "/supplier/customers", icon: Users },
  { label: "Revenue", href: "/supplier/revenue", icon: DollarSign },
  { label: "Payouts", href: "/supplier/payouts", icon: Wallet },
  { label: "Settings", href: "/supplier/settings", icon: Settings },
];

const lenderNav = [
  { label: "Overview", href: "/lender", icon: LayoutDashboard },
  { label: "Risk Profiles", href: "/lender/risk-profiles", icon: UserCheck },
  { label: "Loan Applications", href: "/lender/applications", icon: FileText },
  { label: "Yield Forecasts", href: "/lender/forecasts", icon: TrendingUp },
  { label: "Underwriting", href: "/lender/underwriting", icon: BrainCircuit },
  { label: "Portfolio", href: "/lender/portfolio", icon: PieChart },
  { label: "Claims", href: "/lender/claims", icon: Shield },
  { label: "Revenue", href: "/lender/revenue", icon: DollarSign },
  { label: "Risk Analytics", href: "/lender/analytics", icon: BarChart3 },
  { label: "Settings", href: "/lender/settings", icon: Settings },
];

const adminNav = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Roles & Permissions", href: "/admin/roles", icon: UserCheck },
  { label: "Marketplace", href: "/admin/marketplace", icon: Store },
  { label: "Orders", href: "/admin/orders", icon: Truck },
  { label: "Revenue", href: "/admin/revenue", icon: DollarSign },
  { label: "Subscriptions", href: "/admin/subscriptions", icon: CreditCard },
  { label: "AI Performance", href: "/admin/ai", icon: BrainCircuit },
  { label: "Support Tickets", href: "/admin/support", icon: ClipboardList },
  { label: "Partnerships", href: "/admin/partnerships", icon: Leaf },
  { label: "Reports", href: "/admin/reports", icon: BarChart3 },
  { label: "Audit Logs", href: "/admin/audit", icon: FileText },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

const navByRole: Record<string, typeof farmerNav> = {
  FARMER: farmerNav,
  SUPPLIER: supplierNav,
  LENDER: lenderNav,
  ADMIN: adminNav,
};

const roleLabel: Record<string, string> = {
  FARMER: "Farmer",
  SUPPLIER: "Supplier",
  LENDER: "Lender",
  ADMIN: "Admin",
};

const roleBadgeVariant: Record<string, "default" | "secondary" | "earth" | "success"> = {
  FARMER: "success",
  SUPPLIER: "earth",
  LENDER: "secondary",
  ADMIN: "default",
};

export function Sidebar({ role }: { role: string }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const nav = navByRole[role] || farmerNav;

  const initials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "DF";

  return (
    <div className="flex h-full flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-200 dark:border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center flex-shrink-0">
          <Leaf className="w-5 h-5 text-white" />
        </div>
        <span className="font-black text-slate-900 dark:text-white text-lg">DIGI-FARMS</span>
      </div>

      {/* User */}
      <div className="px-4 py-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={session?.user?.image || ""} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{session?.user?.name || "Farmer"}</p>
            <p className="text-xs text-slate-400 truncate">{session?.user?.email}</p>
          </div>
          <Badge variant={roleBadgeVariant[role] || "default"} className="text-xs flex-shrink-0">{roleLabel[role]}</Badge>
        </div>
      </div>

      {/* Nav */}
      <ScrollArea className="flex-1 px-3 py-3">
        <nav className="space-y-0.5">
          {nav.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href || (href !== `/${role}` && pathname.startsWith(href));
            return (
              <Link key={href} href={href} className={cn("sidebar-link", isActive && "sidebar-link-active")}>
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <Separator />
      <div className="p-3">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="sidebar-link w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
