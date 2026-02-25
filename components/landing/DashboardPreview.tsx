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
  const darkText = "#ffffff";

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

  // Swipe handling
  const [startX, setStartX] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [anim, setAnim] = useState<"left" | "right" | null>(null);

  function handleMove(deltaX: number) {
    const threshold = 50; // px
    if (deltaX > threshold) {
      // swipe right -> previous
      setAnim("left");
      setSelectedFarmIdx((i) => (i > 0 ? i - 1 : farms.length - 1));
      window.setTimeout(() => setAnim(null), 400);
    } else if (deltaX < -threshold) {
      // swipe left -> next
      setAnim("right");
      setSelectedFarmIdx((i) => (i < farms.length - 1 ? i + 1 : 0));
      window.setTimeout(() => setAnim(null), 400);
    }
  }

  function onTouchStart(e: React.TouchEvent) {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (startX == null) return setIsDragging(false);
    const endX = e.changedTouches[0].clientX;
    const delta = endX - startX;
    handleMove(delta);
    setStartX(null);
    setIsDragging(false);
  }

  function onMouseDown(e: React.MouseEvent) {
    setStartX(e.clientX);
    setIsDragging(true);
  }

  function onMouseUp(e: React.MouseEvent) {
    if (startX == null) return setIsDragging(false);
    const delta = e.clientX - startX;
    handleMove(delta);
    setStartX(null);
    setIsDragging(false);
  }

  return (
    <div
      className="animate-fade-up delay-200 hidden lg:block"
      aria-hidden={false}
    >
      <div
        className={"glass-card p-6 shadow-md text-slate-900 dark:text-white" + (anim === "left" ? " animate-slide-left" : anim === "right" ? " animate-slide-right" : "")}
      >
        <div
          className="flex items-center justify-between mb-4"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
        >
          <div>
            <p className="text-green-700 dark:text-green-300 text-xs font-semibold uppercase tracking-wider mb-0.5">Farm Dashboard</p>
            <p className="font-bold text-slate-900 dark:text-white" style={{ color: mounted && theme === "dark" ? "#ffffff" : "#0f1724" }}>{farms[selectedFarmIdx].name}</p>
          </div>
          <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold" style={{ background: '#16a34a', color: '#ffffff' }}>● LIVE</div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Crop Health */}
          <div className={"card-surface rounded-xl p-3.5 shadow-sm"}>
            <div className="text-xl mb-1">🌿</div>
            <div className="font-bold text-lg leading-none text-slate-900 dark:text-white" style={{ color: mounted && theme === "dark" ? "#ffffff" : "#0f1724" }}>{health}%</div>
            <div className="text-green-700 dark:text-green-300 text-xs mt-0.5">Crop Health Score</div>
            <div className="text-green-700 dark:text-green-400 text-xs font-semibold mt-1">+5%</div>
          </div>

          {/* Est. Yield */}
          <div className={"card-surface rounded-xl p-3.5 shadow-sm"}>
            <div className="text-xl mb-1">🌾</div>
            <div className="font-bold text-lg leading-none text-slate-900 dark:text-white" style={{ color: mounted && theme === "dark" ? "#ffffff" : "#0f1724" }}>{yieldVal.toFixed(1)}T</div>
            <div className="text-green-700 dark:text-green-300 text-xs mt-0.5">Est. Yield</div>
            <div className="text-green-700 dark:text-green-400 text-xs font-semibold mt-1">+23%</div>
          </div>

          {/* Market Price */}
          <div className={"card-surface rounded-xl p-3.5 shadow-sm"}>
            <div className="text-xl mb-1">💰</div>
            <div className="font-bold text-lg leading-none text-slate-900 dark:text-white" style={{ color: mounted && theme === "dark" ? "#ffffff" : "#0f1724" }}>KES {price}/kg</div>
            <div className="text-green-700 dark:text-green-300 text-xs mt-0.5">Market Price</div>
            <div className="text-green-700 dark:text-green-400 text-xs font-semibold mt-1">+8%</div>
          </div>

          {/* Rain Forecast (static) */}
          <div className={"card-surface rounded-xl p-3.5 shadow-sm"}>
            <div className="text-xl mb-1">🌧️</div>
            <div className="font-bold text-lg leading-none text-slate-900 dark:text-white" style={{ color: mounted && theme === "dark" ? "#ffffff" : "#0f1724" }}>68mm</div>
            <div className="text-green-700 dark:text-green-300 text-xs mt-0.5">Rain Forecast</div>
            <div className="text-green-700 dark:text-green-400 text-xs font-semibold mt-1">This week</div>
          </div>
        </div>

        {/* Aggregate progress bars (below cards) */}
        <div className="space-y-4 mb-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-slate-900 dark:text-white" style={{ color: mounted && theme === "dark" ? "#ffffff" : "#0f1724" }}>Crop Health</div>
              <div className="text-sm font-semibold text-slate-900 dark:text-white" style={{ color: mounted && theme === "dark" ? "#ffffff" : "#0f1724" }}>{health}%</div>
            </div>
            <div className="progress-track" role="progressbar" aria-valuenow={health} aria-valuemin={0} aria-valuemax={100}>
              <div className="progress-fill" style={{ width: `${Math.max(0, Math.min(100, health))}%` }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-slate-900 dark:text-white" style={{ color: mounted && theme === "dark" ? "#ffffff" : "#0f1724" }}>Est. Yield (T)</div>
              <div className="text-sm font-semibold text-slate-900 dark:text-white" style={{ color: mounted && theme === "dark" ? "#ffffff" : "#0f1724" }}>{yieldVal.toFixed(1)}</div>
            </div>
            <div className="progress-track" role="progressbar" aria-valuenow={Math.round((yieldVal / 50) * 100)} aria-valuemin={0} aria-valuemax={100}>
              <div className="progress-fill" style={{ width: `${Math.max(0, Math.min(100, (yieldVal / 50) * 100))}%` }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-slate-900 dark:text-white" style={{ color: mounted && theme === "dark" ? "#ffffff" : "#0f1724" }}>Market Price (KES/kg)</div>
              <div className="text-sm font-semibold text-slate-900 dark:text-white" style={{ color: mounted && theme === "dark" ? "#ffffff" : "#0f1724" }}>KES {price}</div>
            </div>
            <div className="progress-track" role="progressbar" aria-valuenow={Math.round((price / 200) * 100)} aria-valuemin={0} aria-valuemax={100}>
              <div className="progress-fill" style={{ width: `${Math.max(0, Math.min(100, (price / 200) * 100))}%` }} />
            </div>
          </div>

          {/* Dots (farm selector) */}
          <div className="flex items-center gap-2 justify-center">
            {farms.map((f, idx) => {
              const selected = idx === selectedFarmIdx;
              const background = mounted && theme === "dark"
                ? (selected ? "#ffffff" : "rgba(255,255,255,0.16)")
                : (selected ? "#0f1724" : "rgba(15,23,36,0.12)");
              return (
                <button
                  key={f.id}
                  onClick={() => setSelectedFarmIdx(idx)}
                  aria-label={`Select ${f.name}`}
                  data-selected={selected}
                  className="w-3 h-3 rounded-full transition-all swiper-dot"
                />
              );
            })}
          </div>
        </div>

        {/* Sliders removed from preview card (interactive controls kept internal) */}

        <div className="card-surface rounded-xl p-3.5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-900 dark:text-white" style={{ color: mounted && theme === "dark" ? "#ffffff" : "#0f1724" }}>AI Diagnostics — Last Scan</span>
            <span className="text-green-700 dark:text-green-300 text-xs">2 min ago</span>
          </div>
            <div className="flex items-center gap-3">
            <div className={"w-10 h-10 rounded-lg flex items-center justify-center bg-green-50 dark:bg-[rgba(74,222,128,0.06)]"}>
              <Microscope className={"w-5 h-5 text-green-700 dark:text-green-300"} />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-white" style={{ color: mounted && theme === "dark" ? "#ffffff" : "#0f1724" }}>Crop Status: Healthy ✓</div>
              <div className="text-green-700 dark:text-green-300 text-xs" style={{ color: mounted && theme === "dark" ? "#86efac" : "#059669" }}>Maize field — Block 2A · No disease detected</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
