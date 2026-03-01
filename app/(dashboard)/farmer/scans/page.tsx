"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScanLine, CheckCircle, AlertTriangle, AlertOctagon, X, Sprout, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Scan = {
  id: string;
  crop: string;
  disease: string | null;
  severity: string | null;
  confidence: number | null;
  status: string;
  imageUrl: string;
  treatment: string;
  prevention: string;
  createdAt: string;
};

const PERIODS = [
  { value: "all", label: "All" },
  { value: "day", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "year", label: "This Year" },
];

export default function ScanHistoryPage() {
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("");
  const [selectedScan, setSelectedScan] = useState<Scan | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Scan | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/diagnostics?period=${period}`)
      .then((r) => r.json())
      .then((data) => {
        setScans(Array.isArray(data) ? data : []);
      })
      .catch(() => toast.error("Failed to load scan history"))
      .finally(() => setLoading(false));
  }, [period]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/diagnostics?id=${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete scan");
      toast.success("Scan deleted");
      setScans((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      setDeleteTarget(null);
      if (selectedScan?.id === deleteTarget.id) setSelectedScan(null);
    } catch { toast.error("Failed to delete scan"); }
    finally { setDeleting(false); }
  };

  const filtered = severityFilter
    ? scans.filter((s) => s.severity === severityFilter)
    : scans;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Scan History</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">All your AI diagnostic scan results</p>
        </div>
        <Link href="/farmer/diagnostics">
          <Button size="sm">
            <Plus className="w-4 h-4" /> New Scan
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="flex gap-1 mr-4">
          {PERIODS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setPeriod(value)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                period === value
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-green-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          {[
            { value: "", label: "All Severity" },
            { value: "HIGH", label: "High", variant: "destructive" as const },
            { value: "MEDIUM", label: "Medium", variant: "warning" as const },
            { value: "LOW", label: "Low", variant: "success" as const },
          ].map(({ value, label }) => (
            <button
              key={label}
              onClick={() => setSeverityFilter(value)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                severityFilter === value
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white"
                  : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-400"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Scans list */}
      {loading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ScanLine className="w-8 h-8 mx-auto mb-3 text-slate-400 animate-pulse" />
            <p className="text-sm text-slate-400">Loading scan history...</p>
          </CardContent>
        </Card>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ScanLine className="w-8 h-8 mx-auto mb-3 text-slate-300" />
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
              {scans.length === 0 ? "No scans yet. Run your first crop diagnostic!" : "No scans match your filters."}
            </p>
            {scans.length === 0 && (
              <Link href="/farmer/diagnostics">
                <Button size="sm">Start First Scan</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((scan) => (
                <button
                  key={scan.id}
                  onClick={() => setSelectedScan(scan)}
                  className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
                >
                  {/* Thumbnail */}
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200 dark:border-slate-700">
                    <Image src={scan.imageUrl} alt={scan.disease ?? "Scan"} fill className="object-cover" sizes="40px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-sm text-slate-900 dark:text-white truncate">{scan.disease ?? "Unknown"}</span>
                      <span className="text-xs text-slate-400">· {scan.crop}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span>{new Date(scan.createdAt).toLocaleDateString("en-KE", { year: "numeric", month: "short", day: "numeric" })}</span>
                      <span>·</span>
                      <span>{scan.confidence ?? 0}% confidence</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant={
                      scan.severity === "HIGH" ? "destructive" : scan.severity === "MEDIUM" ? "warning" : "success"
                    } className="text-xs">{scan.severity ?? "N/A"}</Badge>
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeleteTarget(scan); }}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                      title="Delete scan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detail modal */}
      {selectedScan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedScan(null)} />
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto border border-slate-200 dark:border-slate-700">
            <div className="sticky top-0 flex items-center justify-between px-5 py-3 border-b border-slate-100 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
              <h3 className="font-bold text-slate-900 dark:text-white">Scan Details</h3>
              <div className="flex items-center gap-2">
                <button onClick={() => { setDeleteTarget(selectedScan); setSelectedScan(null); }} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors" title="Delete scan"><Trash2 className="w-4 h-4" /></button>
                <button onClick={() => setSelectedScan(null)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><X className="w-5 h-5" /></button>
              </div>
            </div>
            <div className="p-5 space-y-4">
              {selectedScan.imageUrl && (
                <div className="relative w-full h-48 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                  <Image src={selectedScan.imageUrl} alt={selectedScan.disease ?? "Crop scan"} fill className="object-cover" sizes="(max-width: 512px) 100vw, 512px" />
                </div>
              )}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-lg text-slate-900 dark:text-white">{selectedScan.disease ?? "Unknown"}</p>
                  <p className="text-sm text-slate-500">{selectedScan.crop} · {new Date(selectedScan.createdAt).toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" })}</p>
                </div>
                <Badge variant={selectedScan.severity === "HIGH" ? "destructive" : selectedScan.severity === "MEDIUM" ? "warning" : "success"}>
                  {selectedScan.severity} · {selectedScan.confidence}%
                </Badge>
              </div>
              {selectedScan.treatment && (
                <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-900">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span className="font-bold text-amber-700 dark:text-amber-400 text-sm">Treatment</span>
                  </div>
                  <p className="text-sm text-amber-700 dark:text-amber-300">{selectedScan.treatment}</p>
                </div>
              )}
              {selectedScan.prevention && (
                <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-200 dark:border-green-900">
                  <div className="flex items-center gap-2 mb-2">
                    <Sprout className="w-4 h-4 text-green-600" />
                    <span className="font-bold text-green-700 dark:text-green-400 text-sm">Prevention</span>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300">{selectedScan.prevention}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">Delete Scan</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Delete the scan for <strong>{deleteTarget.disease ?? "Unknown"}</strong>? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                disabled={deleting}
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
