import { Badge } from "@/components/ui/badge";

const steps = [
  {
    step: "01",
    icon: "📲",
    title: "Sign Up & Profile Your Farm",
    desc: "Create your farmer profile in under 3 minutes. Add your farm location, crops, and land size to unlock personalized insights.",
  },
  {
    step: "02",
    icon: "🔬",
    title: "Scan Crops with AI Camera",
    desc: "Point your phone at any crop. Our Vision AI analyzes it instantly — diagnosing disease, nutrient deficiency, or pest damage with 94% accuracy.",
  },
  {
    step: "03",
    icon: "📊",
    title: "Get Smart Recommendations",
    desc: "Receive AI-powered treatment plans, market timing advice, weather alerts, and financing options — all personalized to your specific farm.",
  },
  {
    step: "04",
    icon: "🛒",
    title: "Buy, Sell & Access Finance",
    desc: "Order verified inputs from the marketplace. Sell your produce at fair prices. Apply for crop insurance and micro-loans based on your farm score.",
  },
  {
    step: "05",
    icon: "📈",
    title: "Track & Improve Every Season",
    desc: "Monitor yield trends, financial performance, and sustainability scores. Build your digital farm identity and qualify for better financing each season.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <Badge variant="earth" className="mb-4">Process</Badge>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4">
            How DIGI-FARMS Works
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            From farm registration to harvest optimization — five simple steps to transform your agricultural outcomes.
          </p>
        </div>

        <div className="relative">
          {/* Connector line — desktop only */}
          <div className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-green-200 via-green-400 to-green-200 dark:from-green-900 dark:via-green-600 dark:to-green-900" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {steps.map(({ step, icon, title, desc }, i) => (
              <div
                key={step}
                className="flex flex-col items-center text-center animate-fade-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="relative z-10 w-20 h-20 rounded-2xl bg-white dark:bg-slate-900 border-2 border-green-500 shadow-lg flex items-center justify-center text-3xl mb-4">
                  {icon}
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-green-600 text-white text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-2">{title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
