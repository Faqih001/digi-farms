import Link from "next/link";
import {
  Camera, Cpu, Zap, Shield, ArrowRight, CheckCircle,
  Smartphone, Cloud, BarChart3, Bug, Leaf, Upload,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  { icon: Camera, title: "Snap a Photo", desc: "Take a picture of the affected leaf or crop area using your phone camera" },
  { icon: Upload, title: "Upload & Scan", desc: "Our AI processes the image in under 3 seconds using edge computing" },
  { icon: Bug, title: "Get Diagnosis", desc: "Receive detailed disease identification with confidence scores" },
  { icon: Leaf, title: "Treatment Plan", desc: "Get tailored treatment recommendations and preventive measures" },
];

const featuresList = [
  { icon: Cpu, title: "Deep Learning Models", desc: "Convolutional neural networks trained on 5M+ annotated crop images from East African farms." },
  { icon: Smartphone, title: "Works Offline", desc: "Compressed TFLite models run directly on your phone — no internet required for basic scans." },
  { icon: Cloud, title: "Cloud Sync", desc: "When connected, results sync to your dashboard for historical tracking and seasonal patterns." },
  { icon: Shield, title: "Verified Treatments", desc: "All recommendations are reviewed by certified agronomists and linked to available agrovet products." },
  { icon: BarChart3, title: "Trend Analysis", desc: "Track disease patterns across your farm over time. Get early warnings before outbreaks spread." },
  { icon: Zap, title: "Instant Alerts", desc: "Regional disease outbreak alerts based on community scanning data — protect your crops early." },
];

const diseases = [
  { name: "Maize Lethal Necrosis", crop: "Maize", severity: "High" },
  { name: "Late Blight", crop: "Tomato", severity: "High" },
  { name: "Black Sigatoka", crop: "Banana", severity: "Medium" },
  { name: "Coffee Berry Disease", crop: "Coffee", severity: "High" },
  { name: "Cassava Mosaic Virus", crop: "Cassava", severity: "High" },
  { name: "Wheat Stem Rust", crop: "Wheat", severity: "Medium" },
  { name: "Bean Anthracnose", crop: "Beans", severity: "Medium" },
  { name: "Potato Early Blight", crop: "Potato", severity: "Low" },
];

export function DiagnosticsHeroSection() {
  return (
    <section className="gradient-hero py-20 lg:py-28">
      <div className="container mx-auto px-4 max-w-7xl text-center">
        <Badge className="mb-6 bg-white/20 text-white border-white/30">AI Crop Diagnostics</Badge>
        <h1 className="text-4xl lg:text-6xl font-black text-white mb-6 leading-tight">
          Diagnose Crop Diseases <br className="hidden sm:block" />
          <span className="text-green-200">In Seconds</span>
        </h1>
        <p className="text-lg text-green-100/90 max-w-2xl mx-auto mb-8">
          Point your camera at any sick plant and let our AI identify the disease, assess severity,
          and recommend treatment — powered by 5 million training images.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="hero" size="lg" asChild>
            <Link href="/register">Try Free Scan <ArrowRight className="ml-2 w-4 h-4" /></Link>
          </Button>
          <Button variant="hero-outline" size="lg" asChild>
            <Link href="/technology">See the Science</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function DiagnosticsStatsSection() {
  return (
    <section className="py-12 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[{ value: "200+", label: "Diseases Detected" }, { value: "94%", label: "Accuracy Rate" }, { value: "<3s", label: "Scan Time" }, { value: "50+", label: "Crop Types" }].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl lg:text-4xl font-black text-green-600 dark:text-green-400">{s.value}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DiagnosticsStepsSection() {
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-14">
          <Badge className="mb-4">How It Works</Badge>
          <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">Four Simple Steps</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <Card key={step.title} className="relative text-center bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-green-600 text-white text-sm font-bold flex items-center justify-center shadow">{i + 1}</div>
                <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-7 h-7 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{step.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DiagnosticsFeaturesSection() {
  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-14">
          <Badge className="mb-4">Capabilities</Badge>
          <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">Enterprise-Grade AI for Every Farmer</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuresList.map((f) => (
            <Card key={f.title} className="group hover:shadow-xl transition-shadow bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <f.icon className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DiagnosticsDatabaseSection() {
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-14">
          <Badge className="mb-4">Disease Database</Badge>
          <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">200+ Diseases We Detect</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-3 max-w-xl mx-auto">Our database covers major crops across East Africa, from staple grains to cash crops.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {diseases.map((d) => (
            <div key={d.name} className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-green-400 dark:hover:border-green-600 transition-colors">
              <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{d.name}</p>
                <p className="text-xs text-slate-400">{d.crop} · {d.severity} severity</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Button variant="outline" asChild>
            <Link href="/register">View Full Database <ArrowRight className="ml-2 w-4 h-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function DiagnosticsCTASection() {
  return (
    <section className="py-20 gradient-mesh">
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mb-4">Start Scanning Today</h2>
        <p className="text-slate-600 dark:text-green-200/80 mb-8">Free tier includes 5 AI scans per month. No credit card required.</p>
        <Button size="lg" asChild>
          <Link href="/register">Create Free Account <ArrowRight className="ml-2 w-4 h-4" /></Link>
        </Button>
      </div>
    </section>
  );
}
