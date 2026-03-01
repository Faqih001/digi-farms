"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, Leaf, LogIn, Sun, Moon, Settings, LogOut, User, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useSession, signOut } from "next-auth/react";

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
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const { data: session } = useSession();
  const sessionUser = session?.user as { name?: string | null; email?: string | null; image?: string | null; role?: string } | undefined;
  const [lang, setLang] = useState<string>("EN");
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("df_lang");
    if (stored) {
      setLang(stored);
      document.documentElement.lang = stored === "SW" ? "sw" : "en";
    } else {
      // Use a TS-safe access for potential non-standard userLanguage
      const nav = (navigator as any).language || (navigator as any).userLanguage || "en";
      const initial = String(nav).toLowerCase().startsWith("sw") ? "SW" : "EN";
      setLang(initial);
      document.documentElement.lang = initial === "SW" ? "sw" : "en";
    }
  }, []);

  function selectLang(code: string) {
    setLang(code);
    setLangMenuOpen(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("df_lang", code);
      document.documentElement.lang = code === "SW" ? "sw" : "en";
    }
  }

  // Close the language menu when clicking outside
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!langMenuRef.current) return;
      const el = e.target as Node;
      if (langMenuOpen && !langMenuRef.current.contains(el)) {
        setLangMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [langMenuOpen]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Topbar */}
      <div
        className={cn(
          "block relative z-60 text-xs",
          mounted && theme === "dark"
            ? "bg-slate-900 border-b border-slate-800 text-white"
            : "bg-white border-b border-slate-200 text-slate-900"
        )}
      >
        <div className="container mx-auto px-4 max-w-7xl flex items-center justify-between py-1.5">
          <div className="flex items-center gap-3 md:gap-6">
            <span>📞 +254 (0) 700 DIGI-FARM</span>
            <span className="hidden sm:inline">✉️ hello@digi-farms.com</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline">🌍 Kenya · East Africa</span>
            <span className="hidden lg:inline text-sm">Office Hours: Mon–Fri 08:00–17:00</span>
              <div className="relative" ref={langMenuRef}>
                <button
                  type="button"
                  onClick={(e) => {
                    console.debug("lang button clicked", { langMenuOpen });
                    e.stopPropagation();
                    setLangMenuOpen((s) => !s);
                  }}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold transition-colors",
                    mounted && theme === "dark"
                      ? "bg-slate-800 text-slate-50 hover:bg-slate-700"
                      : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                  )}
                  style={{ color: mounted && theme === "dark" ? "#e6eef8" : "#0f1724" }}
                  aria-haspopup="true"
                  aria-expanded={langMenuOpen}
                >
                  {lang}
                  <ChevronDown className="w-3 h-3" />
                </button>

                {langMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-28 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 p-1 z-60 pointer-events-auto"
                    style={{ backgroundColor: mounted && theme === "dark" ? "#0f1724" : "#ffffff", color: mounted && theme === "dark" ? "#e6eef8" : "#0f1724" }}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        console.debug("selectLang EN");
                        e.stopPropagation();
                        selectLang("EN");
                      }}
                      role="menuitem"
                      tabIndex={0}
                      className={cn(
                        "w-full text-left px-3 py-2 text-sm rounded-md transition-colors cursor-pointer",
                        lang === "EN"
                          ? "bg-green-600 text-white dark:bg-green-600"
                          : mounted && theme === "dark"
                          ? "text-slate-200 hover:bg-slate-800/40"
                          : "text-slate-900 hover:bg-slate-50"
                      )}
                    >
                      English
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        console.debug("selectLang SW");
                        e.stopPropagation();
                        selectLang("SW");
                      }}
                      role="menuitem"
                      tabIndex={0}
                      className={cn(
                        "w-full text-left px-3 py-2 text-sm rounded-md transition-colors cursor-pointer",
                        lang === "SW"
                          ? "bg-green-600 text-white dark:bg-green-600"
                          : mounted && theme === "dark"
                          ? "text-slate-200 hover:bg-slate-800/40"
                          : "text-slate-900 hover:bg-slate-50"
                      )}
                    >
                      Kiswahili
                    </button>
                  </div>
                )}
              </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          isScrolled
            ? mounted && theme === "dark"
              ? "bg-slate-900/95 backdrop-blur-md shadow-md"
              : "bg-white/95 backdrop-blur-md shadow-md"
            : mounted && theme === "dark"
            ? "bg-slate-900 border-b border-slate-800"
            : "bg-white border-b border-slate-200"
        )}
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between h-28">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-5 group">
              <div className="relative w-28 h-28 rounded-xl overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform">
                <Image src="/digi-farms-logo.jpeg" alt="DIGI-FARMS" fill quality={90} priority className="object-contain" />
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-4">
              {navLinks.map((link) =>
                link.children ? (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(link.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg text-base font-medium hover:text-green-600 transition-all",
                        openDropdown === link.label
                          ? mounted && theme === "dark"
                            ? "bg-slate-800 text-slate-50"
                            : "bg-slate-50 text-slate-900"
                          : mounted && theme === "dark"
                          ? "text-slate-50 dark:text-slate-50"
                          : "text-slate-900"
                      )}
                      style={{ color: mounted && theme === "dark" ? "#e6eef8" : "#0f1724" }}
                    >
                      {link.label}
                      <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", openDropdown === link.label && "rotate-180")} />
                    </button>

                    {openDropdown === link.label && (
                      <div
                        className="absolute top-full left-0 mt-1.5 w-72 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-2 animate-fade-in"
                        style={{ backgroundColor: mounted && theme === "dark" ? "#0f1724" : "#ffffff", color: mounted && theme === "dark" ? "#e6eef8" : "#0f1724" }}
                      >
                        {link.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                          >
                            <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0 group-hover:scale-125 transition-transform" />
                            <div>
                              <div className={cn("text-sm font-semibold", mounted && theme === "dark" ? "text-slate-50" : "text-slate-900")}>{child.label}</div>
                              <div className="text-xs text-slate-800 dark:text-slate-400">{child.description}</div>
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
                    className={cn(
                      "px-4 py-2 rounded-lg text-base font-medium transition-all",
                      mounted && theme === "dark"
                        ? "text-slate-50 hover:bg-slate-800/60"
                        : "text-slate-900 hover:bg-slate-50 hover:text-slate-900"
                    )}
                    style={{ color: mounted && theme === "dark" ? "#e6eef8" : "#0f1724" }}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-5">
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    mounted && theme === "dark"
                      ? "bg-slate-800 text-slate-50 hover:bg-slate-700"
                      : "bg-transparent text-slate-900 hover:bg-slate-100"
                  )}
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              )}
              {sessionUser ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={sessionUser.image || ""} />
                        <AvatarFallback className="text-xs bg-green-100 dark:bg-green-900 text-green-700">
                          {sessionUser.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "DF"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 max-w-[120px] truncate">
                        {sessionUser.name || "Account"}
                      </span>
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col">
                        <p className="text-sm font-semibold">{sessionUser.name}</p>
                        <p className="text-xs text-slate-400">{sessionUser.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={`/${(sessionUser.role ?? "farmer").toLowerCase()}`}>
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/${(sessionUser.role ?? "farmer").toLowerCase()}/settings`}>
                        <User className="w-4 h-4" /> Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/${(sessionUser.role ?? "farmer").toLowerCase()}/settings`}>
                        <Settings className="w-4 h-4" /> Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })} className="text-red-500 focus:text-red-500 focus:bg-red-50">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/login">
                      <LogIn className="w-4 h-4" />
                      Sign In
                    </Link>
                  </Button>
                  <Button size="lg" asChild>
                    <Link href="/register">Get Started Free</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
              <button
              className="lg:hidden p-2 rounded-lg text-slate-900 dark:text-slate-50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div
            className={cn(
              "lg:hidden animate-fade-up",
              mounted && theme === "dark"
                ? "border-t border-slate-800 bg-slate-900"
                : "border-t border-slate-200 bg-white"
            )}
          >
            <div className="container mx-auto px-4 py-4 space-y-1 max-h-[80vh] overflow-y-auto">
              {navLinks.map((link) => (
                <div key={link.label}>
                  {link.children ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setMobileDropdownOpen((prev) => (prev === link.label ? null : link.label))}
                        className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl text-sm font-medium text-slate-900 dark:text-slate-50 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-green-600 transition-colors"
                        aria-expanded={mobileDropdownOpen === link.label}
                      >
                        <span>{link.label}</span>
                        <ChevronDown className={cn("w-4 h-4 transition-transform", mobileDropdownOpen === link.label && "rotate-180")} />
                      </button>

                      {mobileDropdownOpen === link.label && (
                        <div className="ml-4 mt-1 space-y-1">
                          {link.children.map((child) => (
                            <Link
                              key={child.label}
                              href={child.href}
                              className="block py-2 px-3 rounded-xl text-xs text-slate-800 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                              onClick={() => {
                                setMobileOpen(false);
                                setMobileDropdownOpen(null);
                              }}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={link.href ?? "#"}
                      className="flex items-center justify-between py-2.5 px-3 rounded-xl text-sm font-medium text-slate-900 dark:text-slate-50 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-green-600 transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className={cn(
                    "flex items-center gap-2 py-2.5 px-3 rounded-xl text-sm font-medium transition-colors w-full",
                    mounted && theme === "dark"
                      ? "bg-slate-800 text-slate-50 hover:bg-slate-700"
                      : "bg-transparent text-slate-900 hover:bg-slate-50"
                  )}
                >
                  {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </button>
              )}
              <div className="pt-4 space-y-2 border-t border-slate-200 dark:border-slate-700">
                {sessionUser ? (
                  <>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={`/${(sessionUser.role ?? "farmer").toLowerCase()}`} onClick={() => setMobileOpen(false)}>
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-500" onClick={() => { setMobileOpen(false); signOut({ callbackUrl: "/" }); }}>
                      <LogOut className="w-4 h-4" /> Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/login" onClick={() => setMobileOpen(false)}>Sign In</Link>
                    </Button>
                    <Button className="w-full" asChild>
                      <Link href="/register" onClick={() => setMobileOpen(false)}>Get Started Free</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
