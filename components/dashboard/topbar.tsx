"use client";

import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import type { SessionUser } from "@/components/dashboard/shell";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, Settings, LogOut, User, ChevronDown, Sun, Moon, Home } from "lucide-react";
import { NotificationBell } from "@/components/dashboard/notification-bell";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

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

export function DashboardTopbar({ onMobileMenuToggle, isMobileMenuOpen, user }: { onMobileMenuToggle: () => void; isMobileMenuOpen: boolean; user: SessionUser }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const segments = pathname.split("/").filter(Boolean);
  const pageTitle = breadcrumbMap[segments[segments.length - 1]] || "Dashboard";

  const initials = user?.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "DF";

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center px-4 gap-4 sticky top-0 z-30">
      {/* Mobile menu toggle */}
      <button onClick={onMobileMenuToggle} className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile logo */}
      <Link href="/" className="lg:hidden flex items-center">
        <div className="relative w-14 h-14 rounded-lg overflow-hidden flex items-center justify-center">
          <Image src="/digi-farms-logo.jpeg" alt="DIGI-FARMS" fill quality={90} priority className="object-contain" sizes="56px" />
        </div>
      </Link>

      {/* Page title + breadcrumb */}
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
        {/* Theme toggle */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-500" />}
          </button>
        )}

        {/* Notification bell */}
        <NotificationBell />

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.image || ""} />
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden sm:block text-sm font-medium text-slate-700 dark:text-slate-300 max-w-[120px] truncate">
                {user?.name || "User"}
              </span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col">
                <p className="text-sm font-semibold">{user?.name}</p>
                <p className="text-xs text-slate-400">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/">
                <Home className="w-4 h-4" /> Home
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/${user?.role?.toLowerCase()}/settings`}>
                <User className="w-4 h-4" /> Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/${user?.role?.toLowerCase()}/settings`}>
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
