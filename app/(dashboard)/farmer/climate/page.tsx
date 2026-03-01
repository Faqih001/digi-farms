"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CloudSun, CloudRain, Sun, Wind, Droplets, Thermometer, Loader2, RefreshCw, MapPin } from "lucide-react";
import { toast } from "sonner";

type Current = { temp: number; feelsLike: number; humidity: number; wind: number; rain: number; uvIndex: string; condition: string; location: string };
type Forecast = { day: string; high: number; low: number; rain: number; condition: string };
type Advisory = { msg: string; type: "warning" | "success" | "info" };
type Seasonal = { longRains: string; shortRains: string; enso: string; droughtRisk: string };

function conditionIcon(cond: string) {
  const c = cond?.toLowerCase() || "";
  if (c.includes("rain") || c.includes("shower")) return CloudRain;
  if (c.includes("cloud") || c.includes("overcast") || c.includes("partly")) return CloudSun;
  return Sun;
}

export default function ClimateInsightsPage() {
  const [current, setCurrent] = useState<Current | null>(null);
  const [forecast, setForecast] = useState<Forecast[]>([]);
  const [advisories, setAdvisories] = useState<Advisory[]>([]);
  const [seasonal, setSeasonal] = useState<Seasonal | null>(null);
  const [loading, setLoading] = useState(false);
  const [locationInput, setLocationInput] = useState("");

  const fetchWeather = async (lat?: number, lng?: number, location?: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/climate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat, lng, location }),
      });
      if (!res.ok) throw new Error("Failed to fetch weather");
      const data = await res.json();
      setCurrent(data.current ?? null);
      setForecast(data.forecast ?? []);
      setAdvisories(data.advisories ?? []);
      setSeasonal(data.seasonal ?? null);
    } catch { toast.error("Failed to load weather data"); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        () => fetchWeather(undefined, undefined, "Nairobi, Kenya")
      );
    } else {
      fetchWeather(undefined, undefined, "Nairobi, Kenya");
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (locationInput.trim()) fetchWeather(undefined, undefined, locationInput.trim());
  };

  const CondIcon = current ? conditionIcon(current.condition) : CloudSun;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Climate Insights</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Weather forecasts and farming advisories for your location</p>
        </div>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
            <MapPin className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
            <Input placeholder="Enter location..." value={locationInput} onChange={(e) => setLocationInput(e.target.value)} className="pl-8 w-48" />
          </div>
          <Button type="submit" size="sm" variant="outline" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          </Button>
        </form>
      </div>

      {loading && !current && (
        <div className="flex items-center justify-center h-48"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /><span className="ml-3 text-sm text-slate-500">Getting weather data...</span></div>
      )}

      {current && (
        <Card className="bg-gradient-to-br from-blue-600 to-blue-800 border-0 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm mb-1">{current.location}</p>
                <div className="flex items-end gap-4">
                  <div className="text-6xl font-black">{current.temp}°C</div>
                  <div>
                    <div className="text-blue-200 text-sm">{current.condition}</div>
                    <div className="text-blue-200 text-sm">Feels like {current.feelsLike}°C</div>
                  </div>
                </div>
              </div>
              <CondIcon className="w-20 h-20 opacity-30" />
            </div>
            <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/20">
              {[
                { icon: Droplets, label: "Humidity", val: `${current.humidity}%` },
                { icon: Wind, label: "Wind", val: `${current.wind} km/h` },
                { icon: CloudRain, label: "Rain today", val: `${current.rain} mm` },
                { icon: Thermometer, label: "UV Index", val: current.uvIndex },
              ].map(({ icon: Icon, label, val }) => (
                <div key={label} className="text-center">
                  <Icon className="w-5 h-5 mx-auto mb-1 text-blue-200" />
                  <div className="text-xs text-blue-300">{label}</div>
                  <div className="font-bold">{val}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {forecast.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">7-Day Forecast</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {forecast.map(({ day, high, low, rain, condition }) => {
                const Icon = conditionIcon(condition);
                return (
                  <div key={day} className="text-center p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <div className="text-xs text-slate-400 mb-2">{day}</div>
                    <Icon className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                    <div className="text-xs font-bold text-slate-900 dark:text-white">{high}°</div>
                    <div className="text-xs text-slate-400">{low}°</div>
                    {rain > 0 && <Badge variant="info" className="text-[10px] px-1 mt-1">{rain}%</Badge>}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {advisories.length > 0 && (
          <Card>
            <CardHeader><CardTitle className="text-base">Farming Advisory</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {advisories.map(({ msg, type }, i) => (
                <div key={i} className={`flex items-start gap-2 p-3 rounded-lg text-sm ${type === "warning" ? "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-300" : type === "success" ? "bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-300" : "bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-300"}`}>
                  {msg}
                </div>
              ))}
            </CardContent>
          </Card>
        )}
        {seasonal && (
          <Card>
            <CardHeader><CardTitle className="text-base">Seasonal Outlook</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex justify-between"><span>Long Rains (Mar–May)</span><Badge variant={seasonal.longRains === "Good" ? "success" : "warning"}>{seasonal.longRains}</Badge></div>
              <div className="flex justify-between"><span>Short Rains (Oct–Dec)</span><Badge variant={seasonal.shortRains === "Good" ? "success" : "warning"}>{seasonal.shortRains}</Badge></div>
              <div className="flex justify-between"><span>ENSO Outlook</span><Badge variant="info">{seasonal.enso}</Badge></div>
              <div className="flex justify-between"><span>Drought Risk</span><Badge variant={seasonal.droughtRisk === "Low" ? "secondary" : seasonal.droughtRisk === "High" ? "destructive" : "warning"}>{seasonal.droughtRisk}</Badge></div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
