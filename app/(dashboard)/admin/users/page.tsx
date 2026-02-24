"use client";

import { useState, useEffect, useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Search, Trash2, Loader2, AlertCircle, Users } from "lucide-react";
import { getUsers, updateUserRole, deleteUser } from "@/lib/actions/admin";

type User = Awaited<ReturnType<typeof getUsers>>[number];

const roleVariant: Record<string, "success" | "info" | "warning" | "secondary"> = {
  FARMER: "success", SUPPLIER: "info", LENDER: "warning", ADMIN: "secondary",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [pending, startTransition] = useTransition();

  const load = (s = search, r = roleFilter) =>
    getUsers({ search: s || undefined, role: r || undefined }).then(setUsers).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const handleSearch = (val: string) => { setSearch(val); load(val, roleFilter); };
  const handleRoleFilter = (val: string) => { setRoleFilter(val); load(search, val); };

  const handleRoleChange = (userId: string, role: "FARMER" | "SUPPLIER" | "LENDER" | "ADMIN") => {
    startTransition(async () => {
      try {
        await updateUserRole(userId, role);
        toast.success("Role updated");
        const data = await getUsers({ search: search || undefined, role: roleFilter || undefined }); setUsers(data);
      } catch (err) { toast.error((err as Error).message); }
    });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    startTransition(async () => {
      try {
        await deleteUser(deleteTarget.id);
        toast.success("User deleted");
        setDeleteTarget(null);
        const data = await getUsers({ search: search || undefined, role: roleFilter || undefined }); setUsers(data);
      } catch (err) { toast.error((err as Error).message); }
    });
  };

  const stats = { total: users.length, farmers: users.filter(u => u.role === "FARMER").length, suppliers: users.filter(u => u.role === "SUPPLIER").length, lenders: users.filter(u => u.role === "LENDER").length };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">User Management</h1>
        <p className="text-sm text-slate-500">Manage platform users and accounts</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: stats.total, color: "text-blue-600" },
          { label: "Farmers", value: stats.farmers, color: "text-green-600" },
          { label: "Suppliers", value: stats.suppliers, color: "text-purple-600" },
          { label: "Lenders", value: stats.lenders, color: "text-amber-600" },
        ].map(({ label, value, color }) => (
          <Card key={label}><CardContent className="p-4 text-center"><p className={`text-2xl font-bold ${color}`}>{value}</p><p className="text-xs text-slate-500">{label}</p></CardContent></Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input className="pl-10" placeholder="Search users by name or email..." value={search} onChange={e => handleSearch(e.target.value)} />
            </div>
            <select className="h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm" value={roleFilter} onChange={e => handleRoleFilter(e.target.value)}>
              <option value="">All Roles</option>
              <option value="FARMER">Farmers</option>
              <option value="SUPPLIER">Suppliers</option>
              <option value="LENDER">Lenders</option>
              <option value="ADMIN">Admins</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {users.length === 0 ? (
        <Card className="p-12 text-center">
          <Users className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">No users found</h3>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    {["User", "Role", "Joined", "Actions"].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-900 dark:text-white">{u.name ?? "—"}</p>
                        <p className="text-xs text-slate-400">{u.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          className="text-xs border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 bg-white dark:bg-slate-900"
                          value={u.role}
                          onChange={e => handleRoleChange(u.id, e.target.value as "FARMER" | "SUPPLIER" | "LENDER" | "ADMIN")}
                          disabled={pending}
                        >
                          {["FARMER", "SUPPLIER", "LENDER", "ADMIN"].map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600" onClick={() => setDeleteTarget(u)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={!!deleteTarget} onOpenChange={open => { if (!open) setDeleteTarget(null); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle className="flex items-center gap-2 text-red-600"><AlertCircle className="w-5 h-5" />Delete User</DialogTitle></DialogHeader>
          <p className="text-slate-600 dark:text-slate-400 text-sm">Are you sure you want to permanently delete <strong>{deleteTarget?.name ?? deleteTarget?.email}</strong>? This action cannot be undone.</p>
          <div className="flex gap-3 pt-2">
            <Button variant="destructive" disabled={pending} onClick={handleDelete} className="flex-1">
              {pending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}Delete User
            </Button>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

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
