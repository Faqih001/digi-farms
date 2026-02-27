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
    <section className="py-20 bg-white dark:bg-[#0E1D16] border-y border-[#c3dfc9] dark:border-[#2a4a38]">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#4a7a58] dark:text-[#7aaa87] mb-2">
            Backed by world-class partners
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {partners.map(({ name, type }) => (
            <div
              key={name}
              className="bg-[#F4FAF6] dark:bg-[#162D24] rounded-xl p-4 text-center shadow-sm border border-[#c3dfc9] dark:border-[#2a4a38] hover:border-green-400 dark:hover:border-green-600 transition-colors"
            >
              <div className="font-bold text-sm text-[#182C1E] dark:text-[#e1ece3] mb-1">{name}</div>
              <div className="text-xs text-[#4a7a58] dark:text-[#7aaa87]">{type}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
