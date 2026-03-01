"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CloudSun, CloudRain, Sun, Wind, Droplets, Thermometer, Loader2, RefreshCw, MapPin, Send, ChevronDown, ChevronUp, Bot, User } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type Current = { temp: number; feelsLike: number; humidity: number; wind: number; rain: number; uvIndex: string; condition: string; location: string };
type Forecast = { day: string; high: number; low: number; rain: number; condition: string };
type Advisory = { msg: string; type: "warning" | "success" | "info" };
type Seasonal = { longRains: string; shortRains: string; enso: string; droughtRisk: string };
type QAMessage = { role: "user" | "ai"; text: string };

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
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Q&A state
  const [qaOpen, setQaOpen] = useState(false);
  const [qaMessages, setQaMessages] = useState<QAMessage[]>([]);
  const [qaInput, setQaInput] = useState("");
  const [qaLoading, setQaLoading] = useState(false);

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
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserCoords(coords);
          fetchWeather(coords.lat, coords.lng);
        },
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

  const askGemini = async (e: React.FormEvent) => {
    e.preventDefault();
    const question = qaInput.trim();
    if (!question || qaLoading) return;

    const weatherContext = current
      ? `Current weather at ${current.location}: ${current.temp}°C, ${current.condition}, humidity ${current.humidity}%, wind ${current.wind} km/h, rain ${current.rain}mm, UV index: ${current.uvIndex}.`
      : "No weather data currently loaded.";

    // Build conversation history for the API
    const historyMsgs = qaMessages.map(m => ({
      role: m.role === "ai" ? "assistant" : "user" as "user" | "assistant",
      text: m.text,
    }));
    // Build full message list: context primer + existing history + new question
    const apiMessages = [
      { role: "user" as const, text: `You are an agricultural climate advisor. ${weatherContext}` },
      { role: "assistant" as const, text: "Understood! I'm ready to answer your farming and weather questions based on the current conditions." },
      ...historyMsgs,
      { role: "user" as const, text: question },
    ];

    setQaMessages(prev => [...prev, { role: "user", text: question }]);
    setQaInput("");
    setQaLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          model: "gemini-2.5-flash",
          ...(userCoords ?? {}),
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buffer = "";
      let aiText = "";

      setQaMessages(prev => [...prev, { role: "ai", text: "" }]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += dec.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const event = JSON.parse(line) as { t: "thought" | "answer" | "error"; d: string };
            if (event.t === "answer") {
              aiText += event.d;
              setQaMessages(prev => {
                const copy = [...prev];
                copy[copy.length - 1] = { role: "ai", text: aiText };
                return copy;
              });
            } else if (event.t === "error") {
              throw new Error(event.d);
            }
          } catch { /* ignore parse errors for individual lines */ }
        }
      }
    } catch {
      toast.error("Failed to get AI response");
      setQaMessages(prev => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: "ai", text: "Sorry, something went wrong. Please try again." };
        return copy;
      });
    } finally {
      setQaLoading(false);
    }
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

      {/* Ask Gemini Q&A Panel */}
      <Card>
        <CardHeader
          className="cursor-pointer select-none"
          onClick={() => setQaOpen(v => !v)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Bot className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-base">Ask Gemini about the weather</CardTitle>
                <p className="text-xs text-slate-400 mt-0.5">Get AI-powered farming advice based on current conditions</p>
              </div>
            </div>
            {qaOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
          </div>
        </CardHeader>

        {qaOpen && (
          <CardContent className="pt-0 space-y-4">
            {/* Suggested questions */}
            {qaMessages.length === 0 && (
              <div className="flex flex-wrap gap-2">
                {[
                  "Is it safe to apply pesticides today?",
                  "Should I irrigate my crops?",
                  "What crops suit this weather?",
                  "Any flood or drought risk this week?",
                ].map(q => (
                  <button
                    key={q}
                    onClick={() => { setQaInput(q); }}
                    className="text-xs px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors border border-blue-200 dark:border-blue-800"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Chat messages */}
            {qaMessages.length > 0 && (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {qaMessages.map((msg, i) => (
                  <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.role === "ai" && (
                      <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Bot className="w-3.5 h-3.5 text-blue-600" />
                      </div>
                    )}
                    <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                      msg.role === "user"
                        ? "bg-green-600 text-white rounded-tr-sm"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm"
                    }`}>
                      {msg.text || (qaLoading && i === qaMessages.length - 1 ? (
                        <span className="flex gap-1 items-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0ms]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:150ms]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:300ms]" />
                        </span>
                      ) : "")}
                    </div>
                    {msg.role === "user" && (
                      <div className="w-7 h-7 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <User className="w-3.5 h-3.5 text-green-600" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Input */}
            <form onSubmit={askGemini} className="flex gap-2">
              <Textarea
                value={qaInput}
                onChange={e => setQaInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); askGemini(e as any); } }}
                placeholder="Ask about your weather conditions, farming advice..."
                className="min-h-[44px] max-h-24 resize-none text-sm"
                rows={1}
              />
              <Button type="submit" size="sm" disabled={qaLoading || !qaInput.trim()} className="h-11 px-3">
                {qaLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </form>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
