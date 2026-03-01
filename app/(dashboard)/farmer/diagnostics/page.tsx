"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ScanLine, Upload, Camera, CheckCircle, AlertTriangle, Info, Zap, Sprout, History } from "lucide-react";

type DiagResult = {
  id: string;
  disease: string;
  confidence: number;
  severity: string;
  crop: string;
  status: string;
  treatment: string;
  prevention: string;
  imageUrl: string;
  createdAt: string;
};

export default function DiagnosticsPage() {
  const [stage, setStage] = useState<"upload" | "analyzing" | "result">("upload");
  const [result, setResult] = useState<DiagResult | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File too large. Max 10 MB.");
      return;
    }

    // Show preview
    setPreview(URL.createObjectURL(file));
    setStage("analyzing");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/diagnostics", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Analysis failed (${res.status})`);
      }

      setResult(data);
      setStage("result");
      toast.success("Diagnosis complete!");
    } catch (err: any) {
      toast.error(err?.message ?? "Diagnosis failed. Please try again.");
      setStage("upload");
      setPreview(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const resetScan = () => {
    setStage("upload");
    setResult(null);
    setPreview(null);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">AI Crop Diagnostics</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Upload a photo of your crop to detect diseases, pests, and deficiencies</p>
        </div>
        <Link href="/farmer/scans">
          <Button variant="outline" size="sm">
            <History className="w-4 h-4" /> Scan History
          </Button>
        </Link>
      </div>

      {stage === "upload" && (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Upload Crop Photo</CardTitle></CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-2xl p-10 text-center transition-colors cursor-pointer ${dragOver ? "border-green-400 bg-green-50 dark:bg-green-950/20" : "border-slate-300 dark:border-slate-700 hover:border-green-400"}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
              >
                <Upload className="w-10 h-10 mx-auto mb-3 text-slate-400" />
                <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1">Drop your image here</p>
                <p className="text-xs text-slate-400">JPG, PNG, WebP up to 10MB</p>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Button variant="outline" className="w-full" onClick={() => fileRef.current?.click()}>
                  <Upload className="w-4 h-4" /> Choose File
                </Button>
                <Button variant="outline" className="w-full" onClick={() => {
                  if (fileRef.current) {
                    fileRef.current.setAttribute("capture", "environment");
                    fileRef.current.click();
                    fileRef.current.removeAttribute("capture");
                  }
                }}>
                  <Camera className="w-4 h-4" /> Use Camera
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/10 border-green-200 dark:border-green-900">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-5 h-5 text-green-600" />
                  <span className="font-bold text-green-800 dark:text-green-400">AI Capabilities</span>
                </div>
                <ul className="space-y-2 text-sm text-green-700 dark:text-green-300">
                  {["200+ crop diseases detected", "Pest identification", "Nutrient deficiency analysis", "Powered by Gemini AI", "Instant treatment recommendations"].map((f) => (
                    <li key={f} className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />{f}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wide">Tips for best results</p>
                <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                  {["Take photos in natural daylight", "Focus on affected leaves/stems", "Include close-up and wide shots", "Avoid blurry or dark images"].map((t) => (
                    <li key={t} className="flex items-center gap-2"><Info className="w-3 h-3 flex-shrink-0 text-blue-400" />{t}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {stage === "analyzing" && (
        <Card>
          <CardContent className="py-16 text-center">
            {preview && (
              <div className="relative w-32 h-32 rounded-2xl overflow-hidden mx-auto mb-4 border border-slate-200 dark:border-slate-700">
                <Image src={preview} alt="Uploaded crop" fill className="object-cover" sizes="128px" />
              </div>
            )}
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4 animate-pulse">
              <ScanLine className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Analyzing your crop...</h3>
            <p className="text-slate-400 text-sm mb-6">Gemini AI is examining your image for diseases, pests, and deficiencies</p>
            <div className="w-48 h-2 bg-slate-100 dark:bg-slate-800 rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-green-500 rounded-full animate-[slide_4s_ease-in-out_forwards]" style={{ width: "85%" }} />
            </div>
          </CardContent>
        </Card>
      )}

      {stage === "result" && result && (
        <div className="space-y-4">
          {/* Image + diagnosis header */}
          <Card className={`border-2 ${result.severity === "HIGH" ? "border-red-300" : result.severity === "MEDIUM" ? "border-amber-300" : "border-green-300"}`}>
            <CardHeader>
              <div className="flex items-start gap-4">
                {result.imageUrl && (
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200 dark:border-slate-700">
                    <Image src={result.imageUrl} alt="Scanned crop" fill className="object-cover" sizes="80px" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg">{result.disease}</CardTitle>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Detected in: {result.crop}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <Badge variant={result.severity === "HIGH" ? "destructive" : result.severity === "MEDIUM" ? "warning" : "success"}>
                    {result.severity} Severity
                  </Badge>
                  <div className="text-xs text-slate-400 mt-1">{result.confidence}% confidence</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-900">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span className="font-bold text-amber-700 dark:text-amber-400 text-sm">Recommended Treatment</span>
                </div>
                <p className="text-sm text-amber-700 dark:text-amber-300">{result.treatment}</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-200 dark:border-green-900">
                <div className="flex items-center gap-2 mb-2">
                  <Sprout className="w-4 h-4 text-green-600" />
                  <span className="font-bold text-green-700 dark:text-green-400 text-sm">Prevention Tips</span>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300">{result.prevention}</p>
              </div>
              <div className="flex gap-3">
                <Link href="/farmer/buy" className="flex-1">
                  <Button className="w-full">Buy Treatment Now</Button>
                </Link>
                <Button variant="outline" className="flex-1" onClick={resetScan}>New Scan</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
