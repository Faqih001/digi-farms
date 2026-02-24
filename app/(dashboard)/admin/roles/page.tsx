import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Plus, Edit3, Users } from "lucide-react";

const roles = [
  {
    role: "FARMER",
    description: "Agricultural producers who use the platform to manage crops, access diagnostics, buy inputs, and apply for financing.",
    userCount: 9341,
    color: "text-green-600",
    bg: "bg-green-50 dark:bg-green-950",
    permissions: [
      "View/manage personal farm data",
      "Access AI crop diagnostics",
      "Buy inputs from marketplace",
      "Sell produce in marketplace",
      "Apply for financing",
      "Purchase insurance policies",
      "View weather and soil data",
      "Access subscription features",
    ],
  },
  {
    role: "SUPPLIER",
    description: "Agribusiness entities providing inputs, equipment, and services to farmers through the marketplace.",
    userCount: 284,
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950",
    permissions: [
      "List and manage products",
      "Process and ship orders",
      "Manage inventory",
      "View customer analytics",
      "Process payouts",
      "Respond to reviews",
      "Set shipping policies",
      "Bulk price management",
    ],
  },
  {
    role: "LENDER",
    description: "Financial institutions offering agricultural loans, insurance, and credit to farmers on the platform.",
    userCount: 42,
    color: "text-purple-600",
    bg: "bg-purple-50 dark:bg-purple-950",
    permissions: [
      "Review loan applications",
      "Access AI credit scores",
      "Manage loan portfolio",
      "Process insurance claims",
      "View yield forecasts",
      "Access AI underwriting",
      "View borrower farm data",
      "Manage disbursements",
    ],
  },
  {
    role: "ADMIN",
    description: "Platform administrators with full access to all platform management, analytics, and configuration tools.",
    userCount: 8,
    color: "text-red-600",
    bg: "bg-red-50 dark:bg-red-950",
    permissions: [
      "Full user management",
      "Platform configuration",
      "Access all analytics",
      "Manage subscriptions",
      "Approve partnerships",
      "AI system oversight",
      "Audit log access",
      "Revenue reporting",
    ],
  },
];

export default function AdminRolesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Roles & Permissions</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Platform role definitions and access control</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700 text-white w-fit"><Plus className="w-4 h-4 mr-2" /> New Role</Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {roles.map(({ role, description, userCount, color, bg, permissions }) => (
          <Card key={role}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center`}>
                    <Shield className={`w-4 h-4 ${color}`} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{role}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1"><Users className="w-3 h-3" /> {userCount.toLocaleString()} users</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm"><Edit3 className="w-3 h-3" /></Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{description}</p>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wide">Permissions</p>
              <div className="grid grid-cols-1 gap-1">
                {permissions.map((p) => (
                  <div key={p} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                    {p}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
