"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Star, Navigation, Loader2, Search, ExternalLink } from "lucide-react";
import { toast } from "sonner";

type Agrovet = {
  name: string;
  address: string;
  phone?: string;
  rating?: number;
  reviews?: number;
  open?: boolean;
  services: string[];
  latitude?: number;
  longitude?: number;
  mapsUrl?: string | null;
};

export default function AgrovetLocatorPage() {
  const [agrovets, setAgrovets] = useState<Agrovet[]>([]);
  const [loading, setLoading] = useState(false);
  const [located, setLocated] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  const findAgrovets = async (lat: number, lng: number) => {
    setLoading(true);
    try {
      const res = await fetch("/api/agrovets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitude: lat, longitude: lng }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Search failed");
      setAgrovets(Array.isArray(data) ? data : []);
      if (Array.isArray(data) && data.length === 0) {
        toast.info("No agrovets found nearby. Try a different area.");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to find agrovets");
    } finally {
      setLoading(false);
    }
  };

  const enableLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });
        setLocated(true);
        findAgrovets(latitude, longitude);
      },
      (err) => {
        setLoading(false);
        toast.error(err.message || "Failed to get location. Please enable location services.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const openDirections = (agrovet: Agrovet) => {
    if (agrovet.latitude && agrovet.longitude) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${agrovet.latitude},${agrovet.longitude}`, "_blank");
    } else {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(agrovet.name + " " + agrovet.address)}`, "_blank");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Agrovet Locator</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Find certified agrovets near your farm using AI-powered search</p>
      </div>

      {/* Map / location prompt */}
      <div className="bg-gradient-to-br from-slate-100 to-green-50 dark:from-slate-800 dark:to-green-950/20 rounded-2xl h-48 flex items-center justify-center border border-slate-200 dark:border-slate-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.05)_1px,transparent_1px)] bg-[size:30px_30px]" />
        <div className="text-center relative z-10">
          {loading && !located ? (
            <>
              <Loader2 className="w-10 h-10 text-green-600 mx-auto mb-2 animate-spin" />
              <p className="font-semibold text-slate-700 dark:text-slate-300">Getting your location...</p>
            </>
          ) : located && coords ? (
            <>
              <MapPin className="w-10 h-10 text-green-600 mx-auto mb-2" />
              <p className="font-semibold text-slate-700 dark:text-slate-300">Location Found</p>
              <p className="text-xs text-slate-400">{coords.lat.toFixed(4)}°, {coords.lng.toFixed(4)}°</p>
              <Button size="sm" className="mt-3" onClick={() => findAgrovets(coords.lat, coords.lng)} disabled={loading}>
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                Refresh Results
              </Button>
            </>
          ) : (
            <>
              <MapPin className="w-10 h-10 text-green-600 mx-auto mb-2" />
              <p className="font-semibold text-slate-700 dark:text-slate-300">Interactive Map</p>
              <p className="text-xs text-slate-400">Enable location to find agrovets near you</p>
              <Button size="sm" className="mt-3" onClick={enableLocation}>
                <Navigation className="w-3.5 h-3.5" /> Enable Location
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Loading state */}
      {loading && located && agrovets.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Loader2 className="w-8 h-8 mx-auto mb-3 text-green-600 animate-spin" />
            <p className="text-sm text-slate-500 dark:text-slate-400">Searching for agrovets near you with Gemini AI...</p>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {agrovets.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-slate-500 dark:text-slate-400">{agrovets.length} agrovet{agrovets.length !== 1 ? "s" : ""} found</p>
          {agrovets.map((agrovet, i) => (
            <Card key={`${agrovet.name}-${i}`} className="p-4">
              <CardContent className="p-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 dark:text-white">{agrovet.name}</h3>
                      {agrovet.open !== undefined && (
                        <Badge variant={agrovet.open ? "success" : "destructive"} className="text-xs">
                          {agrovet.open ? "Open" : "Closed"}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                      <MapPin className="w-3 h-3" />{agrovet.address}
                    </div>
                  </div>
                  {agrovet.rating && (
                    <div className="text-right flex-shrink-0">
                      <div className="flex items-center gap-1 justify-end">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-semibold">{agrovet.rating}</span>
                      </div>
                      {agrovet.reviews !== undefined && (
                        <div className="text-xs text-slate-400">({agrovet.reviews} reviews)</div>
                      )}
                    </div>
                  )}
                </div>
                {agrovet.services.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {agrovet.services.map((s) => (
                      <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {agrovet.phone && (
                    <a href={`tel:${agrovet.phone}`} className="flex-1 min-w-[120px]">
                      <Button size="sm" variant="outline" className="w-full">
                        <Phone className="w-3.5 h-3.5" /> {agrovet.phone}
                      </Button>
                    </a>
                  )}
                  <Button size="sm" className="flex-1 min-w-[100px]" onClick={() => openDirections(agrovet)}>
                    <Navigation className="w-3.5 h-3.5" /> Directions
                  </Button>
                  {agrovet.mapsUrl && (
                    <a href={agrovet.mapsUrl} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-[100px]">
                      <Button size="sm" variant="outline" className="w-full">
                        <ExternalLink className="w-3.5 h-3.5" /> View on Maps
                      </Button>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* No results */}
      {!loading && located && agrovets.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <MapPin className="w-8 h-8 mx-auto mb-3 text-slate-300" />
            <p className="text-sm text-slate-500 dark:text-slate-400">No agrovets found. Try refreshing or adjust your location.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
