import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CloudSun, CloudRain, Sun, Wind, Droplets, Thermometer } from "lucide-react";

const forecast = [
  { day: "Today", icon: Sun, high: 26, low: 14, rain: 0, desc: "Sunny" },
  { day: "Thu", icon: CloudSun, high: 24, low: 13, rain: 10, desc: "Partly Cloudy" },
  { day: "Fri", icon: CloudRain, high: 20, low: 12, rain: 70, desc: "Rain" },
  { day: "Sat", icon: CloudRain, high: 19, low: 11, rain: 80, desc: "Heavy Rain" },
  { day: "Sun", icon: CloudSun, high: 23, low: 13, rain: 20, desc: "Partly Cloudy" },
  { day: "Mon", icon: Sun, high: 27, low: 15, rain: 5, desc: "Sunny" },
  { day: "Tue", icon: Sun, high: 28, low: 16, rain: 0, desc: "Clear" },
];

export default function ClimateInsightsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Climate Insights</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Weather forecasts and climate analytics for your farm location</p>
      </div>

      <Card className="bg-gradient-to-br from-blue-600 to-blue-800 border-0 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm mb-1">Rongai, Nakuru — Updated 2h ago</p>
              <div className="flex items-end gap-4">
                <div className="text-6xl font-black">24°C</div>
                <div>
                  <div className="text-blue-200 text-sm">Partly Cloudy</div>
                  <div className="text-blue-200 text-sm">Feels like 22°C</div>
                </div>
              </div>
            </div>
            <CloudSun className="w-20 h-20 opacity-30" />
          </div>
          <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/20">
            {[
              { icon: Droplets, label: "Humidity", val: "68%" },
              { icon: Wind, label: "Wind", val: "12 km/h" },
              { icon: CloudRain, label: "Rain today", val: "0 mm" },
              { icon: Thermometer, label: "UV Index", val: "5 (Moderate)" },
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

      <Card>
        <CardHeader><CardTitle className="text-base">7-Day Forecast</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {forecast.map(({ day, icon: Icon, high, low, rain, desc }) => (
              <div key={day} className="text-center p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <div className="text-xs text-slate-400 mb-2">{day}</div>
                <Icon className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                <div className="text-xs font-bold text-slate-900 dark:text-white">{high}°</div>
                <div className="text-xs text-slate-400">{low}°</div>
                {rain > 0 && <Badge variant="info" className="text-[10px] px-1 mt-1">{rain}%</Badge>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Farming Advisory</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { msg: "Heavy rain Friday–Saturday. Postpone fertilizer application.", type: "warning" },
              { msg: "Ideal planting window: Monday–Tuesday next week", type: "success" },
              { msg: "Irrigate today and Thursday before rain", type: "info" },
            ].map(({ msg, type }) => (
              <div key={msg} className={`flex items-start gap-2 p-3 rounded-lg text-sm ${type === "warning" ? "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-300" : type === "success" ? "bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-300" : "bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-300"}`}>
                {msg}
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Seasonal Outlook</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex justify-between"><span>Long Rains (Mar–May)</span><Badge variant="success">Good</Badge></div>
            <div className="flex justify-between"><span>Short Rains (Oct–Dec)</span><Badge variant="warning">Below Normal</Badge></div>
            <div className="flex justify-between"><span>ENSO Outlook</span><Badge variant="info">La Niña</Badge></div>
            <div className="flex justify-between"><span>Drought Risk</span><Badge variant="secondary">Low</Badge></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
