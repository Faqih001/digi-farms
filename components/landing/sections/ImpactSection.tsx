import { Badge } from "@/components/ui/badge";

const metrics = [
  { value: "+32%", label: "Average yield improvement", sub: "after first full season on DIGI-FARMS", icon: "🌾" },
  { value: "94%", label: "AI diagnostic accuracy", sub: "across 200+ crop diseases", icon: "🔬" },
  { value: "3.2x", label: "ROI for Pro subscribers", sub: "compared to undigitised farms", icon: "📈" },
  { value: "65%", label: "Reduction in input waste", sub: "via precision recommendation engine", icon: "♻️" },
  { value: "8hrs", label: "Saved per week per farmer", sub: "through automation & smart alerts", icon: "⏱️" },
  { value: "KES 48K", label: "Average additional income/year", sub: "for farmers on the Pro plan", icon: "💰" },
];

export function ImpactSection() {
  return (
    <section
      className="py-24 bg-image-overlay"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1600&q=80&auto=format&fit=crop')",
      }}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <Badge className="mb-4">Impact</Badge>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4">
            Numbers That Matter
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Real results from real farmers across our pilot programs in Kenya, Uganda, and Tanzania.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.map(({ value, label, sub, icon }) => (
            <div
              key={label}
              className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 text-center card-hover"
            >
              <div className="text-4xl mb-3">{icon}</div>
              <div className="text-4xl font-black text-green-600 dark:text-green-400 mb-2">{value}</div>
              <div className="font-bold text-slate-900 dark:text-white mb-1">{label}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
