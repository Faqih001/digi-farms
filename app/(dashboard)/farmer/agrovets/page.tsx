import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Clock, Star, Navigation } from "lucide-react";

const agrovets = [
  { name: "Wanjiku Agro Supplies", distance: "1.2 km", county: "Nakuru", address: "Rongai Town Centre", phone: "+254 712 345 678", rating: 4.8, reviews: 89, open: true, services: ["Seeds", "Fertilizers", "Pesticides", "Vet Drugs"] },
  { name: "Milimani Farm Inputs", distance: "2.8 km", county: "Nakuru", address: "Milimani Estate", phone: "+254 722 456 789", rating: 4.5, reviews: 54, open: true, services: ["Seeds", "Fertilizers", "Equipment"] },
  { name: "Green Valley Agrovet", distance: "5.1 km", county: "Nakuru", address: "Naivasha Road", phone: "+254 733 567 890", rating: 4.3, reviews: 36, open: false, services: ["Pesticides", "Vet Drugs", "Advisory"] },
  { name: "KARI Certified Inputs", distance: "7.4 km", county: "Nakuru", address: "Egerton University Road", phone: "+254 700 678 901", rating: 4.9, reviews: 142, open: true, services: ["Seeds", "Fertilizers", "Research", "Soil Testing"] },
];

export default function AgrovetLocatorPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Agrovet Locator</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Find certified agrovets near your farm</p>
      </div>

      <div className="bg-gradient-to-br from-slate-100 to-green-50 dark:from-slate-800 dark:to-green-950/20 rounded-2xl h-48 flex items-center justify-center border border-slate-200 dark:border-slate-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.05)_1px,transparent_1px)] bg-[size:30px_30px]" />
        <div className="text-center relative z-10">
          <MapPin className="w-10 h-10 text-green-600 mx-auto mb-2" />
          <p className="font-semibold text-slate-700 dark:text-slate-300">Interactive Map</p>
          <p className="text-xs text-slate-400">Enable location to see agrovets on map</p>
          <Button size="sm" className="mt-3"><Navigation className="w-3.5 h-3.5" /> Enable Location</Button>
        </div>
      </div>

      <div className="space-y-3">
        {agrovets.map(({ name, distance, county, address, phone, rating, reviews, open, services }) => (
          <Card key={name} className="p-4">
            <CardContent className="p-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-white">{name}</h3>
                    <Badge variant={open ? "success" : "destructive"} className="text-xs">{open ? "Open" : "Closed"}</Badge>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                    <MapPin className="w-3 h-3" />{address}, {county}
                    <span className="ml-2 text-green-600 font-semibold">{distance}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-semibold">{rating}</span>
                  </div>
                  <div className="text-xs text-slate-400">({reviews} reviews)</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {services.map((s: any) => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1"><Phone className="w-3.5 h-3.5" /> {phone}</Button>
                <Button size="sm" className="flex-1"><Navigation className="w-3.5 h-3.5" /> Directions</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
