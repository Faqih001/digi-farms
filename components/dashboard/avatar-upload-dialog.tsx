"use client";

import { useState, useRef, useCallback } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Trash2, Upload, ZoomIn, ZoomOut, Check } from "lucide-react";
import { toast } from "sonner";

// ─── canvas helper ────────────────────────────────────────────────────────────
async function getCroppedBlob(imageSrc: string, pixelCrop: Area): Promise<Blob> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", reject);
    img.src = imageSrc;
  });

  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(
    image,
    pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
    0, 0, pixelCrop.width, pixelCrop.height
  );

  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Canvas is empty"))), "image/jpeg", 0.9)
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface AvatarUploadDialogProps {
  currentImage?: string | null;
  initials: string;
  onAvatarChange: (url: string | null) => void;
}

export function AvatarUploadDialog({ currentImage, initials, onAvatarChange }: AvatarUploadDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"view" | "crop">("view");
  const [rawSrc, setRawSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("File must be under 5 MB"); return; }
    const reader = new FileReader();
    reader.onload = () => { setRawSrc(reader.result as string); setStep("crop"); setCrop({ x: 0, y: 0 }); setZoom(1); };
    reader.readAsDataURL(file);
    // reset input so same file can be re-selected
    e.target.value = "";
  }

  async function handleUpload() {
    if (!rawSrc || !croppedAreaPixels) return;
    setUploading(true);
    try {
      const blob = await getCroppedBlob(rawSrc, croppedAreaPixels);
      const form = new FormData();
      form.append("file", blob, "avatar.jpg");
      const res = await fetch("/api/upload/avatar", { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Upload failed");
      onAvatarChange(json.imageUrl);
      toast.success("Avatar updated!");
      setOpen(false);
      setStep("view");
      setRawSrc(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete() {
    setUploading(true);
    try {
      const res = await fetch("/api/upload/avatar", { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      onAvatarChange(null);
      toast.success("Avatar removed");
      setOpen(false);
    } catch {
      toast.error("Failed to remove avatar");
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      {/* Clickable avatar with camera overlay */}
      <button
        type="button"
        onClick={() => { setStep("view"); setOpen(true); }}
        className="relative group w-20 h-20 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
      >
        <Avatar className="w-20 h-20">
          <AvatarImage src={currentImage ?? ""} />
          <AvatarFallback className="text-xl bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">{initials}</AvatarFallback>
        </Avatar>
        <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
          <Camera className="w-6 h-6 text-white" />
        </div>
      </button>

      <Dialog open={open} onOpenChange={(v) => { if (!uploading) { setOpen(v); if (!v) { setStep("view"); setRawSrc(null); } } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{step === "crop" ? "Crop Your Photo" : "Profile Photo"}</DialogTitle>
          </DialogHeader>

          {step === "view" && (
            <div className="flex flex-col items-center gap-6 py-4">
              <Avatar className="w-32 h-32">
                <AvatarImage src={currentImage ?? ""} />
                <AvatarFallback className="text-4xl bg-green-100 dark:bg-green-900 text-green-700">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex gap-3 w-full">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => fileRef.current?.click()}
                >
                  <Upload className="w-4 h-4" />
                  {currentImage ? "Change Photo" : "Upload Photo"}
                </Button>
                {currentImage && (
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={handleDelete}
                    disabled={uploading}
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </Button>
                )}
              </div>
              <p className="text-xs text-slate-400 text-center">JPEG, PNG or WebP · Max 5 MB · Square crop recommended</p>
            </div>
          )}

          {step === "crop" && rawSrc && (
            <div className="flex flex-col gap-4">
              {/* Crop canvas */}
              <div className="relative w-full" style={{ height: 300, background: "#111" }}>
                <Cropper
                  image={rawSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  showGrid={false}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>
              {/* Zoom slider */}
              <div className="flex items-center gap-3 px-1">
                <ZoomOut className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <input
                  type="range"
                  min={1} max={3} step={0.01}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="flex-1 accent-green-600"
                />
                <ZoomIn className="w-4 h-4 text-slate-400 flex-shrink-0" />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => { setStep("view"); setRawSrc(null); }} disabled={uploading}>
                  Back
                </Button>
                <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={handleUpload} disabled={uploading}>
                  {uploading ? "Uploading…" : <><Check className="w-4 h-4" /> Apply</>}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Hidden file input */}
      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileChange} />
    </>
  );
}
