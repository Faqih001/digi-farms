"use client";

import { useState, useEffect, useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Search, Trash2, Loader2, AlertCircle, Users, BadgeCheck, ShieldOff,
  Power, PowerOff, Zap, RefreshCw, X, ChevronDown, Eye, Pencil,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  getUsers, updateUserRole, deleteUser, verifyUser,
  toggleUserActive, resetUserPrompts, adminUpdateUser,
} from "@/lib/actions/admin";
import AIInsightPanel from "@/components/dashboard/ai-insight-panel";

type User = Awaited<ReturnType<typeof getUsers>>[number];

const ROLES = ["FARMER", "SUPPLIER", "LENDER", "ADMIN"] as const;

const roleCls: Record<string, string> = {
  FARMER: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  SUPPLIER: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  LENDER: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  ADMIN: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all | active | inactive | verified | unverified

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editTarget, setEditTarget] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "", country: "" });

  const [isPending, startTransition] = useTransition();

  async function load() {
    setLoading(true);
    try {
      setUsers(await getUsers({ search: search || undefined, role: roleFilter || undefined }));
    } catch { toast.error("Failed to load users"); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const t = setTimeout(load, 400);
    return () => clearTimeout(t);
  }, [search, roleFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = users.filter(u => {
    if (statusFilter === "active") return u.isActive;
    if (statusFilter === "inactive") return !u.isActive;
    if (statusFilter === "verified") return u.isVerified;
    if (statusFilter === "unverified") return !u.isVerified;
    return true;
  });

  function act(fn: () => Promise<unknown>, successMsg: string) {
    startTransition(async () => {
      try { await fn(); toast.success(successMsg); await load(); }
      catch (e) { toast.error((e as Error).message); }
    });
  }

  const stats = {
    total: users.length,
    verified: users.filter(u => u.isVerified).length,
    active: users.filter(u => u.isActive).length,
    suspended: users.filter(u => !u.isActive).length,
  };

  const contextData = JSON.stringify({
    totalUsers: stats.total, verifiedUsers: stats.verified,
    activeUsers: stats.active, suspendedUsers: stats.suspended,
    byRole: {
      FARMER: users.filter(u => u.role === "FARMER").length,
      SUPPLIER: users.filter(u => u.role === "SUPPLIER").length,
      LENDER: users.filter(u => u.role === "LENDER").length,
      ADMIN: users.filter(u => u.role === "ADMIN").length,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">User Management</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Verify, activate, and manage all platform accounts</p>
        </div>
        <button onClick={load} disabled={loading} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-green-600 disabled:opacity-50">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: stats.total, color: "text-blue-600" },
          { label: "Verified Accounts", value: stats.verified, color: "text-green-600" },
          { label: "Active Users", value: stats.active, color: "text-emerald-600" },
          { label: "Suspended", value: stats.suspended, color: "text-red-600" },
        ].map(({ label, value, color }) => (
          <Card key={label}>
            <CardContent className="p-4 text-center">
              {loading ? <div className="h-7 w-10 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mx-auto mb-1" /> : <p className={`text-2xl font-bold ${color}`}>{value}</p>}
              <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input className="pl-9 rounded-xl" placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {/* Role filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-10 flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm min-w-[130px]">
              {roleFilter || "All Roles"} <ChevronDown className="w-3.5 h-3.5 ml-auto text-slate-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="rounded-xl w-36">
            <DropdownMenuItem className={`rounded-md ${roleFilter === "" ? "bg-green-600 text-white" : ""}`} onClick={() => setRoleFilter("")}>All Roles</DropdownMenuItem>
            <DropdownMenuSeparator />
            {ROLES.map(r => (
              <DropdownMenuItem key={r} className={`rounded-md ${roleFilter === r ? "bg-green-600 text-white" : ""}`} onClick={() => setRoleFilter(r)}>{r}</DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="h-10 pl-3 pr-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Suspended</option>
          <option value="verified">Verified</option>
          <option value="unverified">Unverified</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>
      ) : filtered.length === 0 ? (
        <Card className="p-12 text-center">
          <Users className="w-14 h-14 mx-auto mb-3 text-slate-300" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">No users found</p>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    {["User", "Role", "Status", "AI Usage", "Tier", "Actions"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filtered.map(u => {
                    const promptUsed = u.promptUsage[0]?.used ?? 0;
                    return (
                      <tr key={u.id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${!u.isActive ? "opacity-60" : ""}`}>
                        {/* User */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                              {(u.name ?? u.email).slice(0, 2).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[160px]">{u.name ?? "—"}</span>
                                {u.isVerified && <BadgeCheck className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />}
                              </div>
                              <p className="text-xs text-slate-400 truncate max-w-[200px]">{u.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="px-4 py-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button disabled={isPending} className={`text-xs font-semibold px-2 py-1 rounded-lg ${roleCls[u.role] || "bg-slate-100 text-slate-600"}`}>
                                {u.role}
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="rounded-xl w-32">
                              {ROLES.map((r, i) => (
                                <div key={r}>
                                  <DropdownMenuItem className={`rounded-md ${u.role === r ? "bg-green-600 text-white" : ""}`} onClick={() => act(() => updateUserRole(u.id, r), `Role changed to ${r}`)}>
                                    {r}
                                  </DropdownMenuItem>
                                  {i < ROLES.length - 1 && <DropdownMenuSeparator />}
                                </div>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1">
                            <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full w-fit ${u.isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
                              {u.isActive ? "Active" : "Suspended"}
                            </span>
                            <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full w-fit ${u.isVerified ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"}`}>
                              {u.isVerified ? "✓ Verified" : "Unverified"}
                            </span>
                          </div>
                        </td>

                        {/* AI Usage (current month) */}
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                          <span className="text-xs">{promptUsed} prompt{promptUsed !== 1 ? "s" : ""}</span>
                        </td>

                        {/* Tier */}
                        <td className="px-4 py-3">
                          <span className="text-xs text-slate-500">{u.subscription?.tier ?? "FREE"}</span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            {/* View detail */}
                            <button onClick={() => setSelectedUser(u)} title="View details" className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600">
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            {/* Edit */}
                            <button onClick={() => { setEditTarget(u); setEditForm({ name: u.name ?? "", email: u.email ?? "", phone: u.phone ?? "", country: u.country ?? "" }); }} title="Edit user" className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-400 hover:text-blue-600">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            {/* Verify toggle */}
                            <button
                              onClick={() => act(() => verifyUser(u.id, !u.isVerified), u.isVerified ? "Account unverified" : "Account verified")}
                              disabled={isPending}
                              title={u.isVerified ? "Remove verification" : "Verify account"}
                              className={`p-1.5 rounded-lg transition-colors ${u.isVerified ? "text-green-500 hover:bg-red-50 hover:text-red-500" : "text-slate-400 hover:bg-green-50 hover:text-green-600"}`}
                            >
                              {u.isVerified ? <BadgeCheck className="w-3.5 h-3.5" /> : <ShieldOff className="w-3.5 h-3.5" />}
                            </button>
                            {/* Active toggle */}
                            <button
                              onClick={() => act(() => toggleUserActive(u.id, !u.isActive), u.isActive ? "User suspended" : "User activated")}
                              disabled={isPending}
                              title={u.isActive ? "Suspend user" : "Activate user"}
                              className={`p-1.5 rounded-lg transition-colors ${u.isActive ? "text-emerald-500 hover:bg-red-50 hover:text-red-500" : "text-red-400 hover:bg-green-50 hover:text-green-600"}`}
                            >
                              {u.isActive ? <Power className="w-3.5 h-3.5" /> : <PowerOff className="w-3.5 h-3.5" />}
                            </button>
                            {/* Reset AI prompts */}
                            <button
                              onClick={() => act(() => resetUserPrompts(u.id), "AI prompt usage reset")}
                              disabled={isPending}
                              title="Reset AI prompt count"
                              className="p-1.5 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 text-slate-400 hover:text-amber-600"
                            >
                              <Zap className="w-3.5 h-3.5" />
                            </button>
                            {/* Delete */}
                            <button
                              onClick={() => setDeleteTarget(u)}
                              title="Delete user"
                              className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Insights */}
      {!loading && (
        <AIInsightPanel
          module="admin_users"
          contextData={contextData}
          title="AI User Analytics"
          description="Get AI insights on user engagement, verification patterns, and account health"
          defaultPrompt="Analyze the user account data. Summarize account health, verification rates, and any patterns in suspended accounts. Suggest improvements for user trust and engagement."
        />
      )}

      {/* ─── View Detail Modal ─── */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedUser(null)} />
          <div className="relative z-10 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-900">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold">Account Details</h2>
                {selectedUser.isVerified && <BadgeCheck className="w-4 h-4 text-green-500" />}
              </div>
              <button onClick={() => setSelectedUser(null)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-3">
              {/* Profile */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Name", value: selectedUser.name ?? "—" },
                  { label: "Email", value: selectedUser.email },
                  { label: "Role", value: selectedUser.role },
                  { label: "Phone", value: selectedUser.phone ?? "—" },
                  { label: "Country", value: selectedUser.country ?? "—" },
                  { label: "Joined", value: new Date(selectedUser.createdAt).toLocaleDateString("en-KE") },
                  { label: "Subscription", value: selectedUser.subscription?.tier ?? "FREE" },
                  { label: "Sub Status", value: selectedUser.subscription?.status ?? "—" },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                    <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
                    <p className="text-sm font-medium mt-0.5">{value}</p>
                  </div>
                ))}
              </div>

              {/* Trust status */}
              <div className="flex gap-3">
                <div className={`flex-1 rounded-xl p-3 text-center ${selectedUser.isVerified ? "bg-green-50 dark:bg-green-900/20" : "bg-slate-50 dark:bg-slate-800"}`}>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Verification</p>
                  <p className={`text-sm font-bold mt-0.5 ${selectedUser.isVerified ? "text-green-600" : "text-slate-400"}`}>
                    {selectedUser.isVerified ? "✓ Verified" : "Not Verified"}
                  </p>
                </div>
                <div className={`flex-1 rounded-xl p-3 text-center ${selectedUser.isActive ? "bg-emerald-50 dark:bg-emerald-900/20" : "bg-red-50 dark:bg-red-900/20"}`}>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Account Status</p>
                  <p className={`text-sm font-bold mt-0.5 ${selectedUser.isActive ? "text-emerald-600" : "text-red-600"}`}>
                    {selectedUser.isActive ? "Active" : "Suspended"}
                  </p>
                </div>
              </div>

              {/* AI prompt usage */}
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3">
                <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mb-1">AI Prompt Usage (this month)</p>
                <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{selectedUser.promptUsage[0]?.used ?? 0}</p>
                <p className="text-xs text-amber-600 dark:text-amber-400">prompts used</p>
              </div>

              {/* Profile-specific info */}
              {selectedUser.supplier && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3">
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1">Supplier Profile</p>
                  <p className="text-sm font-medium">{selectedUser.supplier.companyName}</p>
                  <p className="text-xs text-blue-500 mt-0.5">{selectedUser.supplier.isVerified ? "✓ Business Verified" : "Business not verified"}</p>
                </div>
              )}
              {selectedUser.lenderProfile && (
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-3">
                  <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold mb-1">Lender Profile</p>
                  <p className="text-sm font-medium">{selectedUser.lenderProfile.institutionName ?? "Institution not set"}</p>
                  {selectedUser.lenderProfile.licenseNo && <p className="text-xs text-purple-500 mt-0.5">License: {selectedUser.lenderProfile.licenseNo}</p>}
                </div>
              )}

              {/* Quick actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className={selectedUser.isVerified ? "text-red-600 border-red-200" : "text-green-600 border-green-200"}
                  onClick={() => {
                    act(() => verifyUser(selectedUser.id, !selectedUser.isVerified), selectedUser.isVerified ? "Verification removed" : "Account verified");
                    setSelectedUser(prev => prev ? { ...prev, isVerified: !prev.isVerified } : null);
                  }}
                >
                  <BadgeCheck className="w-3.5 h-3.5 mr-1" />
                  {selectedUser.isVerified ? "Remove Verification" : "Verify Account"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className={selectedUser.isActive ? "text-red-600 border-red-200" : "text-green-600 border-green-200"}
                  onClick={() => {
                    act(() => toggleUserActive(selectedUser.id, !selectedUser.isActive), selectedUser.isActive ? "User suspended" : "User activated");
                    setSelectedUser(prev => prev ? { ...prev, isActive: !prev.isActive } : null);
                  }}
                >
                  {selectedUser.isActive ? <PowerOff className="w-3.5 h-3.5 mr-1" /> : <Power className="w-3.5 h-3.5 mr-1" />}
                  {selectedUser.isActive ? "Suspend" : "Activate"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-amber-600 border-amber-200"
                  onClick={() => act(() => resetUserPrompts(selectedUser.id), "AI prompts reset")}
                >
                  <Zap className="w-3.5 h-3.5 mr-1" /> Reset AI
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Edit Modal ─── */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setEditTarget(null)} />
          <div className="relative z-10 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-base font-bold">Edit User</h2>
              <button onClick={() => setEditTarget(null)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-3">
              {(["name", "email", "phone", "country"] as const).map(field => (
                <div key={field} className="space-y-1.5">
                  <Label className="capitalize">{field}</Label>
                  <Input
                    value={editForm[field]}
                    onChange={e => setEditForm(prev => ({ ...prev, [field]: e.target.value }))}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  />
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  disabled={isPending}
                  onClick={() => {
                    act(
                      () => adminUpdateUser(editTarget.id, editForm),
                      "User updated"
                    );
                    setEditTarget(null);
                  }}
                >
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}Save Changes
                </Button>
                <Button variant="outline" onClick={() => setEditTarget(null)}>Cancel</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Delete Confirm Modal ─── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteTarget(null)} />
          <div className="relative z-10 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm p-5 space-y-4">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <h2 className="text-base font-bold">Delete User</h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Permanently delete <strong>{deleteTarget.name ?? deleteTarget.email}</strong>? This removes all their data and cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                variant="destructive"
                className="flex-1"
                disabled={isPending}
                onClick={() => act(() => { setDeleteTarget(null); return deleteUser(deleteTarget.id); }, "User deleted")}
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}Delete
              </Button>
              <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


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

  const stats = { total: users.length, farmers: users.filter((u: any) => u.role === "FARMER").length, suppliers: users.filter((u: any) => u.role === "SUPPLIER").length, lenders: users.filter((u: any) => u.role === "LENDER").length };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">User Management</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Manage platform users and accounts</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: stats.total, color: "text-blue-600" },
          { label: "Farmers", value: stats.farmers, color: "text-green-600" },
          { label: "Suppliers", value: stats.suppliers, color: "text-purple-600" },
          { label: "Lenders", value: stats.lenders, color: "text-amber-600" },
        ].map(({ label, value, color }) => (
          <Card key={label}><CardContent className="p-4 text-center"><p className={`text-2xl font-bold ${color}`}>{value}</p><p className="text-xs text-slate-500 dark:text-slate-400">{label}</p></CardContent></Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input className="pl-10" placeholder="Search users by name or email..." value={search} onChange={e => handleSearch(e.target.value)} />
            </div>
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm text-left w-44">
                    {roleFilter || "All Roles"}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" className="w-44 rounded-xl">
                  <DropdownMenuItem className={`justify-start text-left rounded-md ${roleFilter === "" ? "bg-green-600 text-white" : ""}`} onClick={() => handleRoleFilter("")}>All Roles</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className={`justify-start text-left rounded-md ${roleFilter === "FARMER" ? "bg-green-600 text-white" : ""}`} onClick={() => handleRoleFilter("FARMER")}>Farmers</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className={`justify-start text-left rounded-md ${roleFilter === "SUPPLIER" ? "bg-green-600 text-white" : ""}`} onClick={() => handleRoleFilter("SUPPLIER")}>Suppliers</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className={`justify-start text-left rounded-md ${roleFilter === "LENDER" ? "bg-green-600 text-white" : ""}`} onClick={() => handleRoleFilter("LENDER")}>Lenders</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className={`justify-start text-left rounded-md ${roleFilter === "ADMIN" ? "bg-green-600 text-white" : ""}`} onClick={() => handleRoleFilter("ADMIN")}>Admins</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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
                    {["User", "Role", "Joined", "Actions"].map((h: any) => (
                      <th key={h} className="px-4 py-3 text-left font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {users.map((u: User) => (
                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-900 dark:text-white">{u.name ?? "—"}</p>
                        <p className="text-xs text-slate-400">{u.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="text-xs border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 bg-white dark:bg-slate-900" disabled={pending}>
                              {u.role}
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent side="bottom" className="w-36 rounded-xl">
                            {(["FARMER", "SUPPLIER", "LENDER", "ADMIN"] as const).map((r, idx) => (
                              <div key={r}>
                                <DropdownMenuItem className={`justify-start text-left rounded-md ${u.role === r ? "bg-green-600 text-white" : ""}`} onClick={() => handleRoleChange(u.id, r)}>{r}</DropdownMenuItem>
                                {idx < 3 && <DropdownMenuSeparator />}
                              </div>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
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

