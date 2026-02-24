import type { Metadata } from "next";
import Link from "next/link";
import { Leaf } from "lucide-react";

export const metadata: Metadata = {
  title: "DIGI-FARMS | Account",
  description: "Sign in or create your DIGI-FARMS account",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="relative z-10 flex flex-col justify-between h-full p-12">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black text-white">DIGI-FARMS</span>
          </Link>

          <div>
            <h2 className="text-4xl font-black text-white mb-4 leading-tight">
              Precision Agriculture<br />for Every Farmer
            </h2>
            <p className="text-green-100/80 text-lg mb-8">
              AI-powered crop diagnostics, smart marketplace, and agri-finance — all in one platform.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[["50K+", "Active Farmers"], ["94%", "Diagnostic Accuracy"], ["KES 2.4B", "Loans Facilitated"], ["47", "Counties Covered"]].map(([v, l]) => (
                <div key={l} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="text-2xl font-black text-white">{v}</div>
                  <div className="text-xs text-green-200">{l}</div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-green-200/60 text-sm">© 2025 DIGI-FARMS Ltd. Nairobi, Kenya</p>
        </div>
      </div>

      {/* Right panel — auth form */}
      <div className="flex flex-col justify-center py-12 px-4 sm:px-8 lg:px-16 bg-white dark:bg-slate-950">
            <div className="lg:hidden flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black text-slate-900 dark:text-white">DIGI-FARMS</span>
        </div>
            <div className="flex justify-end mb-6 lg:mb-8">
              <a href="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-green-600 transition-colors">
                ← Home
              </a>
            </div>
        {children}
      </div>
    </div>
  );
}
