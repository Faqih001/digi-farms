import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Handshake, Plus, Eye, Building2, Globe, CheckCircle, Clock, XCircle } from "lucide-react";

const partners = [
  { name: "Equity Agri Finance", type: "Lender", country: "Kenya", since: "Jan 2024", revenue: "KES 2.8M", status: "Active", tier: "Gold", contact: "agri@equitybank.co.ke" },
  { name: "APA Insurance Group", type: "Insurance", country: "Kenya", since: "Mar 2024", revenue: "KES 1.2M", status: "Active", tier: "Silver", contact: "agri@apa.co.ke" },
  { name: "Pioneer Seeds Kenya", type: "Supplier", country: "Kenya", since: "Jun 2024", revenue: "KES 4.6M", status: "Active", tier: "Gold", contact: "partnership@pioneer.co.ke" },
  { name: "KCB AgriFinance", type: "Lender", country: "Kenya", since: "Feb 2025", revenue: "KES 1.8M", status: "Active", tier: "Silver", contact: "agri@kcb.co.ke" },
  { name: "USAID Agri Program", type: "NGO/Grant", country: "USA", since: "Aug 2024", revenue: "USD 120K grant", status: "Active", tier: "Platinum", contact: "africa@usaid.gov" },
  { name: "CropSense Global", type: "Tech Partner", country: "Netherlands", since: "Nov 2025", revenue: "Revenue share", status: "Under Review", tier: "N/A", contact: "biz@cropsense.io" },
  { name: "UCP Fertilizers", type: "Supplier", country: "Kenya", since: "Dec 2025", revenue: "KES 0", status: "Pending", tier: "N/A", contact: "sales@ucpfertilizers.co.ke" },
];

const tierConfig: Record<string, "success" | "info" | "warning" | "secondary"> = {
  Platinum: "success",
  Gold: "warning",
  Silver: "info",
  "N/A": "secondary",
};

const statusConfig: Record<string, "success" | "warning" | "secondary"> = {
  Active: "success",
  "Under Review": "warning",
  Pending: "secondary",
};

export default function AdminPartnershipsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Partnerships</h1>
          <p className="text-sm text-slate-500">Strategic partners, integrations, and revenue sharing</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700 text-white w-fit"><Plus className="w-4 h-4 mr-2" /> Add Partner</Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Partners", value: "5", color: "text-green-600" },
          { label: "Under Review", value: "1", color: "text-amber-600" },
          { label: "Partner Revenue (MTD)", value: "KES 10.4M", color: "text-blue-600" },
          { label: "Partnership Countries", value: "3", color: "text-purple-600" },
        ].map(({ label, value, color }) => (
          <Card key={label}>
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-slate-500">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4">
        {partners.map((p) => (
          <Card key={p.name}>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center">
                    <Handshake className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-slate-900 dark:text-white">{p.name}</p>
                      <Badge variant={tierConfig[p.tier]} className="text-xs">{p.tier}</Badge>
                    </div>
                    <p className="text-xs text-slate-400">{p.type} • <Globe className="w-3 h-3 inline" /> {p.country} • Partner since: {p.since}</p>
                    <p className="text-xs text-slate-400">Contact: {p.contact}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-600">{p.revenue}</p>
                    <p className="text-xs text-slate-400">Revenue</p>
                  </div>
                  <Badge variant={statusConfig[p.status]} className="text-xs">{p.status}</Badge>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm"><Eye className="w-3 h-3" /></Button>
                    {p.status === "Under Review" && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white"><CheckCircle className="w-3 h-3" /></Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
