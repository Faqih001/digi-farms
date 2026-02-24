import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Code, ArrowRight, Lock, Zap, Globe, Webhook,
  Terminal, Key, FileJson, Copy, CheckCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "API Reference",
  description: "DIGI-FARMS REST API documentation. Integrate farm data, marketplace, payments, and diagnostics into your applications.",
};

const endpoints = [
  { method: "GET", path: "/api/v1/farms", desc: "List all farms for the authenticated user.", auth: true },
  { method: "POST", path: "/api/v1/diagnostics", desc: "Submit a crop image for AI disease analysis.", auth: true },
  { method: "GET", path: "/api/v1/products", desc: "Search marketplace products with filters.", auth: false },
  { method: "POST", path: "/api/v1/orders", desc: "Create a new marketplace order.", auth: true },
  { method: "GET", path: "/api/v1/weather/{farmId}", desc: "Get weather forecast for a specific farm.", auth: true },
  { method: "GET", path: "/api/v1/analytics/yield", desc: "Retrieve yield analytics and predictions.", auth: true },
];

const sdks = [
  { lang: "JavaScript / TypeScript", pkg: "npm install @digi-farms/sdk", color: "bg-yellow-400" },
  { lang: "Python", pkg: "pip install digi-farms", color: "bg-blue-500" },
  { lang: "PHP", pkg: "composer require digi-farms/sdk", color: "bg-purple-500" },
];

const features = [
  { icon: Lock, title: "OAuth 2.0 & API Keys", desc: "Secure authentication with bearer tokens or API keys for server-to-server integrations." },
  { icon: Zap, title: "Rate Limiting", desc: "1,000 requests/minute on free tier. Enterprise plans offer unlimited throughput." },
  { icon: Globe, title: "RESTful Design", desc: "Standard REST conventions with JSON payloads, pagination, and filtering." },
  { icon: Webhook, title: "Webhooks", desc: "Real-time event notifications for orders, diagnostics, and payment updates." },
  { icon: FileJson, title: "OpenAPI Spec", desc: "Full OpenAPI 3.0 specification available for auto-generating client libraries." },
  { icon: Terminal, title: "Sandbox Mode", desc: "Test your integrations risk-free with our sandbox environment and mock data." },
];

const methodColors: Record<string, string> = {
  GET: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  POST: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
  PUT: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400",
  DELETE: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
};

export default function ApiReferencePage() {
  return (
    <>
      {/* Hero */}
      <section className="gradient-hero py-20 lg:py-28">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <Badge className="mb-6 bg-white/20 text-white border-white/30">API Reference</Badge>
          <h1 className="text-4xl lg:text-6xl font-black text-white mb-6 leading-tight">
            Build With <br className="hidden sm:block" />
            <span className="text-green-300">DIGI-FARMS API</span>
          </h1>
          <p className="text-lg text-green-100 max-w-2xl mx-auto mb-8">
            Integrate farm diagnostics, marketplace, analytics, and payments into your applications. RESTful, well-documented, and developer-friendly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-white text-green-700 hover:bg-green-50">
              <a href="#endpoints">Explore Endpoints <ArrowRight className="ml-2 w-4 h-4" /></a>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white/30 text-white hover:bg-white/10">
              <a href="#auth">Authentication <Key className="ml-2 w-4 h-4" /></a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4">Developer Experience</Badge>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">Built for Developers</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <Card key={f.title} className="group hover:shadow-xl transition-shadow dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-green-400">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <f.icon className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Authentication */}
      <section id="auth" className="py-20 bg-slate-50 dark:bg-slate-950 scroll-mt-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4">Authentication</Badge>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">Getting Authenticated</h2>
          </div>
          <Card className="dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Key className="w-5 h-5 text-green-500" />
                <h3 className="font-bold text-slate-900 dark:text-white">Bearer Token Authentication</h3>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Include your API key in the Authorization header for all authenticated requests.</p>
              <div className="bg-slate-900 dark:bg-slate-950 rounded-xl p-4 font-mono text-sm text-green-400 overflow-x-auto">
                <div className="text-slate-500">{"// Example request"}</div>
                <div className="mt-1">
                  <span className="text-blue-400">curl</span> -X GET https://api.digi-farms.com/v1/farms \
                </div>
                <div className="ml-4">
                  -H <span className="text-yellow-400">&quot;Authorization: Bearer YOUR_API_KEY&quot;</span> \
                </div>
                <div className="ml-4">
                  -H <span className="text-yellow-400">&quot;Content-Type: application/json&quot;</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-3">Generate API keys from your dashboard under Settings → API Keys.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Endpoints */}
      <section id="endpoints" className="py-20 bg-white dark:bg-slate-900 scroll-mt-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4">Endpoints</Badge>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">API Endpoints</h2>
          </div>
          <div className="space-y-3">
            {endpoints.map((e, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-green-400 transition-colors group cursor-pointer">
                <Badge className={`${methodColors[e.method]} font-mono text-xs px-2.5 py-1 rounded-md border-0`}>{e.method}</Badge>
                <code className="text-sm text-slate-900 dark:text-white font-mono flex-shrink-0">{e.path}</code>
                <span className="text-sm text-slate-500 dark:text-slate-400 hidden sm:block flex-1">{e.desc}</span>
                {e.auth && <Lock className="w-4 h-4 text-slate-400 flex-shrink-0" aria-label="Requires authentication" />}
              </div>
            ))}
          </div>
          <p className="text-sm text-slate-400 text-center mt-6">Showing core endpoints. Full reference includes 40+ endpoints across all modules.</p>
        </div>
      </section>

      {/* SDKs */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4">SDKs</Badge>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">Official SDKs</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {sdks.map((s) => (
              <Card key={s.lang} className="dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-green-400 transition-colors">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-3 h-3 rounded-full ${s.color}`} />
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{s.lang}</span>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3 flex items-center justify-between">
                    <code className="text-xs text-slate-700 dark:text-slate-300">{s.pkg}</code>
                    <Copy className="w-4 h-4 text-slate-400 cursor-pointer hover:text-green-500 transition-colors" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-green-700 dark:bg-green-900">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <Code className="w-14 h-14 text-green-300 mx-auto mb-4" />
          <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">Ready to Integrate?</h2>
          <p className="text-green-100 mb-8">Create a free developer account and start building with the DIGI-FARMS API today.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-white text-green-700 hover:bg-green-50">
              <Link href="/auth/register">Get API Keys <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white/30 text-white hover:bg-white/10">
              <Link href="/resources/docs">View Docs <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
