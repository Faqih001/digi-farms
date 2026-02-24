"use client";

import Link from "next/link";
import { Home, Search, LifeBuoy } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
      <main className="container mx-auto px-6 py-24 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-extrabold text-slate-900 dark:text-white mb-4">404</h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Oops — the page you&apos;re looking for can&apos;t be found. It might have been moved or removed.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <article className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-50 text-green-700 flex items-center justify-center">
                <Home className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Return Home</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Head back to the homepage to continue exploring DIGI‑FARMS.</p>
            <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition">Go Home</Link>
          </article>

          <article className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Search the site</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Try searching for products, services, or help articles.</p>
            <Link href="/marketplace" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition">Explore Marketplace</Link>
          </article>

          <article className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <LifeBuoy className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Need help?</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Contact our support team and we&apos;ll help you find what you need.</p>
            <Link href="/contact" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-amber-200 text-amber-700 text-sm font-medium hover:bg-amber-50 transition">Contact Support</Link>
          </article>
        </div>

        <div className="mt-12 text-center text-sm text-slate-500 dark:text-slate-400">
          <p>Or try checking the URL for typos — then refresh.</p>
        </div>
      </main>
    </div>
  );
}
