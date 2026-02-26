import { Badge } from "@/components/ui/badge";

export function ProblemSection() {
  const problems = [
    { stat: "40%", desc: "of Sub-Saharan Africa's harvest is lost post-planting due to disease & pests", icon: "🌿" },
    { stat: "$48B", desc: "in annual crop losses from preventable diseases across the continent", icon: "💸" },
    { stat: "80%", desc: "of smallholder farmers lack access to affordable crop insurance and financing", icon: "🏦" },
    { stat: "3.1B", desc: "people in food-insecure households depend on smallholder agriculture globally", icon: "🌍" },
  ];

  return (
    <section
      className="py-24 bg-image-overlay"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=1600&q=80&auto=format&fit=crop')" }}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <Badge variant="destructive" className="mb-4">The Crisis</Badge>
          <h2
            className="text-4xl lg:text-5xl font-black mb-4"
            style={{ color: "var(--foreground)" }}
          >
            African Agriculture is <span className="text-red-600">Bleeding</span>
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: "var(--foreground-muted)" }}
          >
            Smallholder farmers — who produce 70% of Africa&apos;s food supply — are losing billions
            annually to preventable problems that technology can solve.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map(({ stat, desc, icon }) => (
            <div
              key={stat}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 card-hover text-center"
            >
              <div className="text-4xl mb-3">{icon}</div>
              <div className="text-4xl font-black text-red-600 dark:text-red-400 mb-3">{stat}</div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/60 dark:to-orange-950/60 rounded-2xl p-8 border border-red-200 dark:border-red-900/50 text-center backdrop-blur-sm">
          <p className="text-slate-700 dark:text-slate-300 text-lg max-w-3xl mx-auto">
            &quot;Without intervention, climate change will push <strong>100 million</strong> more African
            farmers into extreme poverty by 2030. DIGI-FARMS was built to reverse this.&quot;
          </p>
        </div>
      </div>
    </section>
  );
}
