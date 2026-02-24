import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, UserPlus, MoreHorizontal, Eye, Ban, CheckCircle } from "lucide-react";

const users = [
  { id: "U-001", name: "John Kamau", email: "john@example.com", role: "FARMER", county: "Nakuru", joined: "Jan 15, 2025", status: "Active", subscription: "Pro" },
  { id: "U-002", name: "Wanjiku Agro", email: "wanjiku@agrosupp.co.ke", role: "SUPPLIER", county: "Nairobi", joined: "Feb 2, 2025", status: "Active", subscription: "Enterprise" },
  { id: "U-003", name: "Equity Agri", email: "agri@equitybank.co.ke", role: "LENDER", county: "Nairobi", joined: "Jan 8, 2025", status: "Active", subscription: "Enterprise" },
  { id: "U-004", name: "Grace Akinyi", email: "grace@farm.co.ke", role: "FARMER", county: "Kisumu", joined: "Mar 5, 2025", status: "Active", subscription: "Free" },
  { id: "U-005", name: "Peter Ochieng", email: "peter@seeds.co.ke", role: "SUPPLIER", county: "Mombasa", joined: "Apr 10, 2025", status: "Suspended", subscription: "Pro" },
  { id: "U-006", name: "Mary Njeri", email: "mary@njeri.co.ke", role: "FARMER", county: "Kiambu", joined: "May 22, 2025", status: "Active", subscription: "Free" },
  { id: "U-007", name: "KCB AgriFinance", email: "agri@kcb.co.ke", role: "LENDER", county: "Nairobi", joined: "Feb 15, 2025", status: "Active", subscription: "Enterprise" },
  { id: "U-008", name: "Alice Chebet", email: "alice@farm.com", role: "FARMER", county: "Uasin Gishu", joined: "Jun 1, 2025", status: "Inactive", subscription: "Free" },
];

const roleVariant: Record<string, "success" | "info" | "warning" | "secondary"> = {
  FARMER: "success",
  SUPPLIER: "info",
  LENDER: "warning",
  ADMIN: "secondary",
};

const statusVariant: Record<string, "success" | "destructive" | "secondary"> = {
  Active: "success",
  Suspended: "destructive",
  Inactive: "secondary",
};

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">User Management</h1>
          <p className="text-sm text-slate-500">Manage platform users and accounts</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700 text-white w-fit"><UserPlus className="w-4 h-4 mr-2" /> Add User</Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: "12,482", color: "text-blue-600" },
          { label: "Active", value: "11,204", color: "text-green-600" },
          { label: "Suspended", value: "156", color: "text-red-600" },
          { label: "Inactive", value: "1,122", color: "text-slate-500" },
        ].map(({ label, value, color }) => (
          <Card key={label}>
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-slate-500">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Search users..." />
            </div>
            <select className="h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm">
              <option>All Roles</option>
              <option>FARMER</option>
              <option>SUPPLIER</option>
              <option>LENDER</option>
              <option>ADMIN</option>
            </select>
            <select className="h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm">
              <option>All Status</option>
              <option>Active</option>
              <option>Suspended</option>
              <option>Inactive</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  {["User", "Role", "County", "Joined", "Subscription", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-900 dark:text-white">{u.name}</p>
                      <p className="text-xs text-slate-400">{u.email}</p>
                    </td>
                    <td className="px-4 py-3"><Badge variant={roleVariant[u.role]} className="text-xs">{u.role}</Badge></td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{u.county}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{u.joined}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 text-xs">{u.subscription}</td>
                    <td className="px-4 py-3"><Badge variant={statusVariant[u.status]} className="text-xs">{u.status}</Badge></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm"><Eye className="w-3 h-3" /></Button>
                        <Button variant="ghost" size="sm"><Ban className="w-3 h-3" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
