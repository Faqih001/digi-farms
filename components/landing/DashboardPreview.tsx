"use client";

import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Microscope } from "lucide-react";

export default function DashboardPreview() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const t = (window as any).__NEXT_THEME || (document.documentElement.classList.contains("dark") ? "dark" : "light");
      setTheme(t);
    }
  }, []);

  const lightBg = "rgba(255,255,255,0.95)";
  const darkBg = "rgba(15,23,36,0.8)";
  const lightText = "#0f1724";
  const darkText = "#e6eef8";

  const initialFarms = [
    {
      id: "kamau",
      name: "Kamau Family Farm",
      health: 87,
      yieldT: 18.2,
      price: 42,
      rain: "68mm",
      lastScan: "2 min ago",
      status: "Healthy ✓",
    },
    {
      id: "mboga",
      name: "Mboga Cooperative",
      health: 72,
      yieldT: 12.5,
      price: 36,
      rain: "52mm",
      lastScan: "5 min ago",
      status: "Minor pests",
    },
    {
      id: "ndovu",
      name: "Ndovu Organic Farm",
      health: 94,
      yieldT: 22.8,
      price: 48,
      rain: "80mm",
      lastScan: "1 min ago",
      status: "Excellent",
    },
  ];

  const [farms, setFarms] = useState(initialFarms);
  const [selectedFarmIdx, setSelectedFarmIdx] = useState<number>(0);

  const [health, setHealth] = useState<number>(farms[0].health);
  const [yieldVal, setYieldVal] = useState<number>(farms[0].yieldT);
  const [price, setPrice] = useState<number>(farms[0].price);

  // sync local sliders when selected farm changes
  useEffect(() => {
    const f = farms[selectedFarmIdx];
    setHealth(f.health);
    setYieldVal(f.yieldT);
    setPrice(f.price);
  }, [selectedFarmIdx]);

  // update farm record when sliders change
  useEffect(() => {
    setFarms((prev) => {
      const copy = [...prev];
      copy[selectedFarmIdx] = { ...copy[selectedFarmIdx], health, yieldT: yieldVal, price };
      return copy;
    });
  }, [health, yieldVal, price, selectedFarmIdx]);

  return (
    <div
      className="animate-fade-up delay-200 hidden lg:block"
      aria-hidden={false}
    >
      <div
        className="glass-card p-6 border border-white/20 shadow-md"
        style={{
          backgroundColor: mounted && theme === "dark" ? darkBg : lightBg,
          color: mounted && theme === "dark" ? darkText : lightText,
          borderColor: mounted && theme === "dark" ? "rgba(255,255,255,0.06)" : "rgba(15,23,61,0.06)",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className={mounted && theme === "dark" ? "text-green-300 text-xs font-semibold uppercase tracking-wider mb-0.5" : "text-green-900 text-xs font-semibold uppercase tracking-wider mb-0.5"}>Farm Dashboard</p>
            <p style={{ color: mounted && theme === "dark" ? darkText : lightText }} className="font-bold">Kamau Family Farm</p>
          </div>
          <Badge className="bg-green-400 text-green-900 text-xs font-bold">● LIVE</Badge>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Crop Health */}
          <div className={"rounded-xl p-3.5 border shadow-sm"} style={{ backgroundColor: mounted && theme === "dark" ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.06)" }}>
            <div className="text-xl mb-1">🌿</div>
            <div style={{ color: mounted && theme === "dark" ? darkText : lightText }} className="font-bold text-lg leading-none">{health}%</div>
            <div className={mounted && theme === "dark" ? "text-green-300 text-xs mt-0.5" : "text-green-900 text-xs mt-0.5"}>Crop Health Score</div>
            <div className={mounted && theme === "dark" ? "text-green-400 text-xs font-semibold mt-1" : "text-green-800 text-xs font-semibold mt-1"}>+5%</div>
          </div>

          {/* Est. Yield */}
          <div className={"rounded-xl p-3.5 border shadow-sm"} style={{ backgroundColor: mounted && theme === "dark" ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.06)" }}>
            <div className="text-xl mb-1">🌾</div>
            <div style={{ color: mounted && theme === "dark" ? darkText : lightText }} className="font-bold text-lg leading-none">{yieldVal.toFixed(1)}T</div>
            <div className={mounted && theme === "dark" ? "text-green-300 text-xs mt-0.5" : "text-green-900 text-xs mt-0.5"}>Est. Yield</div>
            <div className={mounted && theme === "dark" ? "text-green-400 text-xs font-semibold mt-1" : "text-green-800 text-xs font-semibold mt-1"}>+23%</div>
          </div>

          {/* Market Price */}
          <div className={"rounded-xl p-3.5 border shadow-sm"} style={{ backgroundColor: mounted && theme === "dark" ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.06)" }}>
            <div className="text-xl mb-1">💰</div>
            <div style={{ color: mounted && theme === "dark" ? darkText : lightText }} className="font-bold text-lg leading-none">KES {price}/kg</div>
            <div className={mounted && theme === "dark" ? "text-green-300 text-xs mt-0.5" : "text-green-900 text-xs mt-0.5"}>Market Price</div>
            <div className={mounted && theme === "dark" ? "text-green-400 text-xs font-semibold mt-1" : "text-green-800 text-xs font-semibold mt-1"}>+8%</div>
          </div>

          {/* Rain Forecast (static) */}
          <div className={"rounded-xl p-3.5 border shadow-sm"} style={{ backgroundColor: mounted && theme === "dark" ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.06)" }}>
            <div className="text-xl mb-1">🌧️</div>
            <div style={{ color: mounted && theme === "dark" ? darkText : lightText }} className="font-bold text-lg leading-none">68mm</div>
            <div className={mounted && theme === "dark" ? "text-green-300 text-xs mt-0.5" : "text-green-900 text-xs mt-0.5"}>Rain Forecast</div>
            <div className={mounted && theme === "dark" ? "text-green-400 text-xs font-semibold mt-1" : "text-green-800 text-xs font-semibold mt-1"}>This week</div>
          </div>
        </div>

        {/* Sliders */}
        <div className="space-y-3 mb-4">
          <div>
            <label className="text-xs font-semibold block mb-1" style={{ color: mounted && theme === "dark" ? darkText : lightText }}>Crop Health: <span className="font-bold">{health}%</span></label>
            <input
              type="range"
              min={0}
              max={100}
              value={health}
              onChange={(e) => setHealth(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1" style={{ color: mounted && theme === "dark" ? darkText : lightText }}>Est. Yield (T): <span className="font-bold">{yieldVal.toFixed(1)}</span></label>
            <input
              type="range"
              min={0}
              max={50}
              step={0.1}
              value={yieldVal}
              onChange={(e) => setYieldVal(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1" style={{ color: mounted && theme === "dark" ? darkText : lightText }}>Market Price (KES/kg): <span className="font-bold">{price}</span></label>
            <input
              type="range"
              min={0}
              max={200}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <div className="rounded-xl p-3.5 border shadow-sm" style={{ backgroundColor: mounted && theme === "dark" ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="flex items-center justify-between mb-2">
            <span style={{ color: mounted && theme === "dark" ? darkText : lightText }} className="text-xs font-semibold">AI Diagnostics — Last Scan</span>
            <span className={mounted && theme === "dark" ? "text-green-300 text-xs" : "text-green-900 text-xs"}>2 min ago</span>
          </div>
          <div className="flex items-center gap-3">
            <div className={"w-10 h-10 rounded-lg flex items-center justify-center"} style={{ backgroundColor: mounted && theme === "dark" ? "rgba(74,222,128,0.06)" : "#e6ffef" }}>
              <Microscope className={"w-5 h-5"} style={{ color: mounted && theme === "dark" ? "#86efac" : "#166534" }} />
            </div>
            <div>
              <div style={{ color: mounted && theme === "dark" ? darkText : lightText }} className="text-sm font-semibold">Crop Status: Healthy ✓</div>
              <div className={mounted && theme === "dark" ? "text-green-300/90 text-xs" : "text-green-900/90 text-xs"}>Maize field — Block 2A · No disease detected</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
