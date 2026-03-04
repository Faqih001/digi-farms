"use client";

import { useState, useRef, useCallback } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, Upload, ZoomIn, ZoomOut, Check, Trash2 } from "lucide-react";
import { toast } from "sonner";

// canvas helper
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

interface ImageUploadDialogProps {
  currentImage?: string | null | undefined;
  aspect?: number; // crop aspect ratio (default square)
  label?: string;
  onChange: (url: string | undefined) => void;
}

export default function ImageUploadDialog({ currentImage, aspect = 1, label = "Photo", onChange }: ImageUploadDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"view" | "crop">("view");
  const [rawSrc, setRawSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const onCropComplete = useCallback((_: Area, pixels: Area) => setCroppedAreaPixels(pixels), []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) { toast.error("File must be under 8 MB"); return; }
    const reader = new FileReader();
    reader.onload = () => { setRawSrc(reader.result as string); setStep("crop"); setCrop({ x: 0, y: 0 }); setZoom(1); };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  async function handleUpload() {
    if (!rawSrc || !croppedAreaPixels) return;
    setUploading(true);
    try {
      const blob = await getCroppedBlob(rawSrc, croppedAreaPixels);
      const form = new FormData();
      form.append("file", blob, "image.jpg");
      const res = await fetch("/api/upload/produce", { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Upload failed");
      onChange(json.imageUrl);
      toast.success("Image uploaded");
      setOpen(false);
      setStep("view");
      setRawSrc(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally { setUploading(false); }
  }

  async function handleRemove() {
    // just notify parent to remove local reference; server delete not handled here
    onChange(undefined);
    setOpen(false);
  }

  return (
    <>
      <button type="button" onClick={() => { setStep("view"); setOpen(true); }} className="flex items-center gap-2 text-sm text-slate-700">
        <Camera className="w-4 h-4" /> {label}
      </button>

      <Dialog open={open} onOpenChange={(v) => { if (!uploading) { setOpen(v); if (!v) { setStep("view"); setRawSrc(null); } } }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{step === "crop" ? "Crop Image" : label}</DialogTitle>
          </DialogHeader>

          {step === "view" && (
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="w-40 h-40 rounded-md overflow-hidden border bg-slate-50 flex items-center justify-center">
                {currentImage ? <img src={currentImage} alt="current" className="w-full h-full object-cover"/> : <div className="text-slate-400">No image</div>}
              </div>
              <div className="flex gap-3 w-full">
                <Button variant="outline" className="flex-1" onClick={() => fileRef.current?.click()}>
                  <Upload className="w-4 h-4" /> Upload
                </Button>
                {currentImage && (
                  <Button variant="destructive" className="flex-1" onClick={handleRemove} disabled={uploading}>
                    <Trash2 className="w-4 h-4" /> Remove
                  </Button>
                )}
              </div>
              <p className="text-xs text-slate-400">JPEG, PNG or WebP · Max 8 MB</p>
            </div>
          )}

          {step === "crop" && rawSrc && (
            <div className="flex flex-col gap-4">
              <div className="relative w-full" style={{ height: 360, background: "#111" }}>
                <Cropper
                  image={rawSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={aspect}
                  cropShape="rect"
                  showGrid={false}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>
              <div className="flex items-center gap-3 px-1">
                <ZoomOut className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <input type="range" min={1} max={3} step={0.01} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="flex-1 accent-green-600" />
                <ZoomIn className="w-4 h-4 text-slate-400 flex-shrink-0" />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => { setStep("view"); setRawSrc(null); }} disabled={uploading}>Back</Button>
                <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={handleUpload} disabled={uploading}>{uploading ? "Uploading…" : <><Check className="w-4 h-4" /> Apply</>}</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileChange} />
    </>
  );
}
