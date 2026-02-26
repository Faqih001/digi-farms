import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Palette, ArrowRight, Download, FileImage, FileText,
  Type, Image, Globe, Calendar, CheckCircle,
} from "lucide-react";

const brandAssets = [
  { icon: FileImage, title: "Logo Pack", desc: "Full color, monochrome, and white versions in SVG, PNG, and EPS formats.", format: "ZIP • 12 MB" },
  { icon: Type, title: "Brand Guidelines", desc: "Typography, color palette, spacing rules, and logo usage guidelines.", format: "PDF • 4 MB" },
  { icon: Image, title: "Product Screenshots", desc: "High-resolution screenshots of key platform features and dashboards.", format: "ZIP • 28 MB" },
  { icon: Palette, title: "Social Media Kit", desc: "Pre-formatted banners, profile images, and templates for major platforms.", format: "ZIP • 18 MB" },
];

const pressReleases = [
  { date: "March 2024", title: "DIGI-FARMS Surpasses 50,000 Farmers on Platform", desc: "DIGI-FARMS announces major milestone as platform reaches 50,000+ active farmers across three East African countries." },
  { date: "January 2024", title: "Series A Funding: $5M Raised for Agricultural AI", desc: "DIGI-FARMS secures $5M in Series A funding led by Partech Africa to expand AI crop diagnostics and marketplace." },
  { date: "November 2023", title: "Partnership with Equity Bank for Farmer Financing", desc: "New partnership enables AI-scored credit assessments for smallholder farmers, unlocking KES 2B in financing." },
  { date: "August 2023", title: "Launch of Agrovet Locator with 800+ Registered Shops", desc: "DIGI-FARMS launches nationwide agrovet mapping tool covering all 47 counties in Kenya." },
];

const companyFacts = [
  { label: "Founded", value: "2021" },
  { label: "Headquarters", value: "Nairobi, Kenya" },
  { label: "Active Farmers", value: "50,000+" },
  { label: "Countries", value: "Kenya, Uganda, Tanzania" },
  { label: "Team Size", value: "45+" },
  { label: "Total Funding", value: "$7.5M" },
  { label: "Platform GMV", value: "KES 200M+" },
  { label: "Crop Diseases Detected", value: "200+" },
];

const brandColors = [
  { name: "Primary Green", hex: "#16A34A", css: "bg-green-600" },
  { name: "Dark Green", hex: "#15803D", css: "bg-green-700" },
  { name: "Emerald", hex: "#059669", css: "bg-emerald-600" },
  { name: "Slate Dark", hex: "#0F172A", css: "bg-slate-900" },
  { name: "Slate", hex: "#475569", css: "bg-slate-600" },
  { name: "White", hex: "#FFFFFF", css: "bg-white border border-slate-200" },
];

const usageGuidelines = [
  "Always use official logo files — do not recreate or modify the logo.",
  "Maintain minimum clear space equal to the height of the leaf icon around the logo.",
  "Use the full-color logo on white or light backgrounds.",
  "Use the white logo on dark or photographic backgrounds.",
  "Do not rotate, distort, or add effects to the logo.",
  "Refer to the brand guidelines PDF for detailed usage rules.",
];

export function MediaKitHeroSection() {
  return (
    <section className="gradient-hero py-20 lg:py-28">
      <div className="container mx-auto px-4 max-w-7xl text-center">
        <Badge className="mb-6 bg-white/20 text-white border-white/30">Media Kit</Badge>
        <h1 className="text-4xl lg:text-6xl font-black text-white mb-6 leading-tight">
          Brand Assets & <br className="hidden sm:block" />
          <span className="text-green-200">Press Resources</span>
        </h1>
        <p className="text-lg text-green-100 max-w-2xl mx-auto mb-8">
          Everything you need to represent DIGI-FARMS in media, publications, and partnership materials.
        </p>
        <Button size="lg" asChild className="bg-white text-green-700 hover:bg-green-50">
          <a href="#assets">Download Assets <Download className="ml-2 w-4 h-4" /></a>
        </Button>
      </div>
    </section>
  );
}

export function MediaKitFactsSection() {
  return (
    <section className="py-12 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {companyFacts.map((f) => (
            <div key={f.label} className="text-center p-3">
              <div className="text-lg lg:text-xl font-black text-green-600">{f.value}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{f.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function MediaKitAssetsSection() {
  return (
    <section id="assets" className="py-20 bg-slate-50 dark:bg-slate-950 scroll-mt-20">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-14">
          <Badge variant="secondary" className="mb-4">Downloads</Badge>
          <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">Brand Assets</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {brandAssets.map((a) => (
            <Card key={a.title} className="group hover:shadow-xl transition-shadow bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-green-400 cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <a.icon className="w-7 h-7 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{a.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">{a.desc}</p>
                <Badge variant="secondary" className="text-xs">{a.format}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function MediaKitBrandColorsSection() {
  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-14">
          <Badge variant="secondary" className="mb-4">Brand Identity</Badge>
          <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">Color Palette</h2>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {brandColors.map((c) => (
            <div key={c.name} className="text-center">
              <div className={`w-full aspect-square rounded-2xl ${c.css} mb-2 shadow-sm`} />
              <p className="text-xs font-semibold text-slate-900 dark:text-white">{c.name}</p>
              <p className="text-xs text-slate-400 font-mono">{c.hex}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4">Logo Usage Guidelines</h3>
          <div className="grid sm:grid-cols-2 gap-2">
            {usageGuidelines.map((g, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>{g}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function MediaKitPressSection() {
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-14">
          <Badge variant="secondary" className="mb-4">Press</Badge>
          <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">Press Releases</h2>
        </div>
        <div className="space-y-4">
          {pressReleases.map((pr, i) => (
            <Card key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-green-400 transition-colors cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-xs text-slate-400">{pr.date}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-green-600 transition-colors">{pr.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{pr.desc}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function MediaKitCTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-800 dark:to-green-950">
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <Globe className="w-14 h-14 text-green-600 dark:text-green-300 mx-auto mb-4" />
        <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mb-4">Media Inquiries</h2>
        <p className="text-slate-600 dark:text-green-100 mb-8">For press inquiries, interviews, or additional materials, contact our communications team.</p>
        <Button size="lg" asChild className="bg-green-600 text-white hover:bg-green-700 dark:bg-white dark:text-green-700 dark:hover:bg-green-50">
          <Link href="/contact">Contact Press Team <ArrowRight className="ml-2 w-4 h-4" /></Link>
        </Button>
      </div>
    </section>
  );
}
