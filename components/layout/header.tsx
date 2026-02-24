"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
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
      <div className="hidden md:block relative z-60 bg-white dark:bg-green-700 border-b border-slate-200 dark:border-green-600 text-slate-700 dark:text-white text-xs">
        <div className="container mx-auto px-4 max-w-7xl flex items-center justify-between py-1.5">
          <div className="flex items-center gap-6">
            <span>📞 +254 (0) 700 DIGI-FARM</span>
            <span>✉️ hello@digi-farms.com</span>
          </div>
          <div className="flex items-center gap-4">
            <span>🌍 Kenya · East Africa</span>
            <span className="text-sm">Office Hours: Mon–Fri 08:00–17:00</span>
            <div className="relative" ref={langMenuRef}>
              <button
                type="button"
                onClick={(e) => {
                  console.debug("lang button clicked", { langMenuOpen });
                  e.stopPropagation();
                  setLangMenuOpen((s) => !s);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-100 dark:bg-green-800 text-sm font-semibold text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-green-700 transition-colors"
                aria-haspopup="true"
                aria-expanded={langMenuOpen}
              >
                {lang}
                <ChevronDown className="w-3 h-3" />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-28 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 p-1 z-50 pointer-events-auto">
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
                        ? "bg-green-50 dark:bg-green-950/30"
                        : "hover:bg-green-50 dark:hover:bg-green-950/30"
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
                        ? "bg-green-50 dark:bg-green-950/30"
                        : "hover:bg-green-50 dark:hover:bg-green-950/30"
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
            ? "bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-md"
            : "bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800"
        )}
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between h-28">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-5 group">
              <div className="w-28 h-28 rounded-xl overflow-hidden flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Image src="/digi-farms-logo.jpeg" alt="DIGI-FARMS" width={112} height={112} quality={90} priority />
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
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-950 transition-all">
                      {link.label}
                      <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", openDropdown === link.label && "rotate-180")} />
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
                              <div className="text-xs text-slate-500 dark:text-slate-400">{child.description}</div>
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
                    className="px-4 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-950 transition-all"
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
                  className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              )}
              <Button variant="outline" size="lg" asChild>
                <Link href="/login">
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>
              </Button>
              <Button size="lg" asChild>
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
