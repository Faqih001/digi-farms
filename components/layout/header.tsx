"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, Leaf, LogIn, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

const navLinks = [
  {
    label: "Platform",
    href: "#",
    children: [
      { label: "AI Crop Diagnostics", href: "/technology#diagnostics", description: "Scan & diagnose crop diseases instantly" },
      { label: "Marketplace", href: "/marketplace", description: "Buy inputs, sell produce" },
      { label: "Agrovet Locator", href: "/technology#locator", description: "Find certified agrovets near you" },
      { label: "Farm Analytics", href: "/technology#analytics", description: "Data-driven farm performance insights" },
    ],
  },
  {
    label: "Technology",
    href: "/technology",
    children: [
      { label: "AI Engine", href: "/technology#ai", description: "Vision AI for plant pathology" },
      { label: "Multispectral Imaging", href: "/technology#imaging", description: "Drone & satellite imaging" },
      { label: "Climate Modeling", href: "/technology#climate", description: "Hyperlocal weather forecasts" },
      { label: "Financing & Insurance", href: "/technology#finance", description: "Risk-scored lending tools" },
    ],
  },
  { label: "Marketplace", href: "/marketplace" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Topbar */}
      <div className="hidden md:flex items-center justify-between bg-green-800 text-green-100 text-xs px-6 py-1.5">
        <div className="flex items-center gap-6">
          <span>📞 +254 (0) 700 DIGI-FARM</span>
          <span>✉️ hello@digi-farms.com</span>
        </div>
        <div className="flex items-center gap-4">
          <span>🌍 Kenya · East Africa</span>
          <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
          <span>|</span>
          <Link href="/register" className="hover:text-white transition-colors font-semibold">Register Free</Link>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          isScrolled
            ? "bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-md"
            : "bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800"
        )}
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div className="leading-none">
                <span className="font-black text-xl text-slate-900 dark:text-white tracking-tight">DIGI</span>
                <span className="font-black text-xl text-green-600 tracking-tight">-FARMS</span>
                <div className="text-[9px] text-slate-400 font-medium tracking-widest uppercase">Precision Agriculture</div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) =>
                link.children ? (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(link.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-950 transition-all">
                      {link.label}
                      <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", openDropdown === link.label && "rotate-180")} />
                    </button>

                    {openDropdown === link.label && (
                      <div className="absolute top-full left-0 mt-1.5 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-2 animate-fade-in">
                        {link.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            className="flex items-start gap-3 p-3 rounded-xl hover:bg-green-50 dark:hover:bg-green-950/50 transition-colors group"
                          >
                            <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0 group-hover:scale-125 transition-transform" />
                            <div>
                              <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">{child.label}</div>
                              <div className="text-xs text-slate-500">{child.description}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-950 transition-all"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              )}
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Get Started Free</Link>
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 animate-fade-up">
            <div className="container mx-auto px-4 py-4 space-y-1 max-h-[80vh] overflow-y-auto">
              {navLinks.map((link) => (
                <div key={link.label}>
                  <Link
                    href={link.href ?? "#"}
                    className="flex items-center justify-between py-2.5 px-3 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-green-50 dark:hover:bg-green-950/50 hover:text-green-600 transition-colors"
                    onClick={() => !link.children && setMobileOpen(false)}
                  >
                    {link.label}
                    {link.children && <ChevronDown className="w-4 h-4" />}
                  </Link>
                  {link.children && (
                    <div className="ml-4 mt-1 space-y-1">
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="block py-2 px-3 rounded-xl text-xs text-slate-600 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors"
                          onClick={() => setMobileOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="flex items-center gap-2 py-2.5 px-3 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-green-50 dark:hover:bg-green-950/50 transition-colors w-full"
                >
                  {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </button>
              )}
              <div className="pt-4 space-y-2 border-t border-slate-200 dark:border-slate-700">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/login" onClick={() => setMobileOpen(false)}>Sign In</Link>
                </Button>
                <Button className="w-full" asChild>
                  <Link href="/register" onClick={() => setMobileOpen(false)}>Get Started Free</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
