import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Mary Wanjiku",
    role: "Maize & Vegetable Farmer",
    location: "Nakuru, Kenya",
    avatar: "MW",
    rating: 5,
    quote:
      "DIGI-FARMS changed how I farm. The AI diagnosed a rust disease on my maize before I could even see it with my eyes. I saved 70% of my crop that season.",
  },
  {
    name: "James Omondi",
    role: "Coffee Farmer",
    location: "Kisii, Kenya",
    avatar: "JO",
    rating: 5,
    quote:
      "I got a KES 80,000 loan through DIGI-FARMS in 2 days. No bank had approved me before. I used it to buy certified seedlings and my yield doubled.",
  },
  {
    name: "Grace Nyambura",
    role: "Horticulture Supplier",
    location: "Machakos, Kenya",
    avatar: "GN",
    rating: 5,
    quote:
      "As a supplier, the marketplace gave me access to thousands of farmers I could never reach before. My sales increased by 340% in 6 months.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <Badge variant="earth" className="mb-4">Testimonials</Badge>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4">
            Trusted by Farmers Across East Africa
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map(({ name, role, location, avatar, rating, quote }) => (
            <Card key={name} className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 italic">
                  &quot;{quote}&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white text-sm font-bold">
                    {avatar}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm">{name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {role} · {location}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
