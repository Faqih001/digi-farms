"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Search, Menu, X, Settings, LogOut, User, ChevronDown } from "lucide-react";

const breadcrumbMap: Record<string, string> = {
  farmer: "Dashboard", supplier: "Dashboard", lender: "Dashboard", admin: "Dashboard",
  farm: "Farm Profile", diagnostics: "Crop Diagnostics", scans: "Scan History",
  analytics: "Analytics", soil: "Soil Health", climate: "Climate Insights",
  buy: "Buy Inputs", sell: "Sell Produce", agrovets: "Agrovet Locator",
  financing: "Financing Profile", loans: "Loan Applications", insurance: "Insurance",
  subscription: "Subscription", settings: "Settings", products: "Products",
  orders: "Orders", inventory: "Inventory", customers: "Customers",
  revenue: "Revenue", payouts: "Payouts", users: "Users", roles: "Roles & Permissions",
  marketplace: "Marketplace", subscriptions: "Subscriptions", ai: "AI Performance",
  support: "Support Tickets", partnerships: "Partnerships", reports: "Reports",
  audit: "Audit Logs", "risk-profiles": "Risk Profiles", forecasts: "Yield Forecasts",
  underwriting: "Underwriting", portfolio: "Portfolio", claims: "Claims",
  new: "New", edit: "Edit",
};

export function DashboardTopbar({ onMobileMenuToggle, isMobileMenuOpen }: { onMobileMenuToggle: () => void; isMobileMenuOpen: boolean }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [showSearch, setShowSearch] = useState(false);

  const segments = pathname.split("/").filter(Boolean);
  const pageTitle = breadcrumbMap[segments[segments.length - 1]] || "Dashboard";

  const initials = session?.user?.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "DF";

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center px-4 gap-4 sticky top-0 z-30">
      {/* Mobile menu toggle */}
      <button onClick={onMobileMenuToggle} className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Page title */}
      <div className="flex-1 hidden sm:block">
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">{pageTitle}</h1>
        <div className="flex items-center gap-1 text-xs text-slate-400">
          {segments.map((seg, i) => (
            <span key={seg} className="flex items-center gap-1">
              {i > 0 && <span>/</span>}
              <span className={i === segments.length - 1 ? "text-green-600 font-medium" : ""}>{breadcrumbMap[seg] || seg}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Search */}
        {showSearch ? (
          <div className="relative">
            <input
              autoFocus
              onBlur={() => setShowSearch(false)}
              className="w-48 sm:w-64 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Search..."
            />
            <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        ) : (
          <button onClick={() => setShowSearch(true)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <Search className="w-5 h-5 text-slate-500" />
          </button>
        )}

        {/* Notifications */}
        <button className="relative p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <Bell className="w-5 h-5 text-slate-500" />
          <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 p-0 flex items-center justify-center text-[10px]">3</Badge>
        </button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <Avatar className="h-8 w-8">
                <AvatarImage src={session?.user?.image || ""} />
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden sm:block text-sm font-medium text-slate-700 dark:text-slate-300 max-w-[120px] truncate">
                {session?.user?.name || "User"}
              </span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col">
                <p className="text-sm font-semibold">{session?.user?.name}</p>
                <p className="text-xs text-slate-400">{session?.user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/${(session?.user as { role?: string })?.role?.toLowerCase()}/settings`}>
                <User className="w-4 h-4" /> Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/${(session?.user as { role?: string })?.role?.toLowerCase()}/settings`}>
                <Settings className="w-4 h-4" /> Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })} className="text-red-500 focus:text-red-500 focus:bg-red-50">
              <LogOut className="w-4 h-4" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
