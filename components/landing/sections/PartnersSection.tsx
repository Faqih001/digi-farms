const partners = [
  { name: "CGIAR", type: "Research Partner" },
  { name: "Equity Bank", type: "Finance Partner" },
  { name: "Safaricom", type: "Technology Partner" },
  { name: "UAP Old Mutual", type: "Insurance Partner" },
  { name: "AGRA", type: "Agriculture Partner" },
  { name: "Google.org", type: "Tech for Good" },
  { name: "Kenya NDMA", type: "Government Partner" },
  { name: "World Bank IFC", type: "Investment Partner" },
];

export function PartnersSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 border-y border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-500 mb-2">
            Backed by world-class partners
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {partners.map(({ name, type }) => (
            <div
              key={name}
              className="bg-white dark:bg-slate-900 rounded-xl p-4 text-center shadow-sm border border-slate-200 dark:border-slate-800 hover:border-green-300 dark:hover:border-green-700 transition-colors"
            >
              <div className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-1">{name}</div>
              <div className="text-xs text-slate-500">{type}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
