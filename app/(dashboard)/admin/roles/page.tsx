"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Plus, Edit3, Users, X, Check, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { getRoleUserCounts } from "@/lib/actions/admin";

const SYSTEM_ROLES = [
  {
    role: "FARMER",
    description: "Agricultural producers who use the platform to manage crops, access diagnostics, buy inputs, and apply for financing.",
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

interface RoleEntry {
  role: string;
  description: string;
  color: string;
  bg: string;
  permissions: string[];
  custom?: boolean;
}

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<RoleEntry[]>(SYSTEM_ROLES);
  const [userCounts, setUserCounts] = useState<Record<string, number>>({});
  const [loadingCounts, setLoadingCounts] = useState(true);
  const [editTarget, setEditTarget] = useState<RoleEntry | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [form, setForm] = useState({ role: "", description: "", permissions: "" });

  useEffect(() => {
    getRoleUserCounts()
      .then(setUserCounts)
      .catch(() => toast.error("Failed to load user counts"))
      .finally(() => setLoadingCounts(false));
  }, []);

  function openEdit(r: RoleEntry) {
    setEditTarget(r);
    setForm({ role: r.role, description: r.description, permissions: r.permissions.join("\n") });
  }

  function saveEdit() {
    if (!editTarget) return;
    setRoles(prev =>
      prev.map(r =>
        r.role === editTarget.role
          ? { ...r, description: form.description.trim(), permissions: form.permissions.split("\n").map(p => p.trim()).filter(Boolean) }
          : r
      )
    );
    setEditTarget(null);
    toast.success(`"${editTarget.role}" role updated`);
  }

  function createRole() {
    const roleName = form.role.toUpperCase().replace(/\s+/g, "_").replace(/[^A-Z0-9_]/g, "");
    if (!roleName) { toast.error("Role name is required"); return; }
    if (roles.find(r => r.role === roleName)) { toast.error("Role already exists"); return; }
    setRoles(prev => [...prev, {
      role: roleName,
      description: form.description,
      color: "text-slate-700 dark:text-slate-300",
      bg: "bg-slate-100 dark:bg-slate-800",
      permissions: form.permissions.split("\n").map(p => p.trim()).filter(Boolean),
      custom: true,
    }]);
    setShowCreate(false);
    setForm({ role: "", description: "", permissions: "" });
    toast.success(`Role "${roleName}" created`);
  }

  function confirmDelete(roleName: string) {
    setRoles(prev => prev.filter(r => r.role !== roleName));
    setDeleteTarget(null);
    toast.success("Role removed");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Roles & Permissions</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Platform role definitions and access control</p>
        </div>
        <Button
          onClick={() => { setShowCreate(true); setForm({ role: "", description: "", permissions: "" }); }}
          className="bg-green-600 hover:bg-green-700 text-white w-fit"
        >
          <Plus className="w-4 h-4 mr-2" /> New Role
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {SYSTEM_ROLES.map(({ role, color, bg }) => (
          <Card key={role}>
            <CardContent className="p-4 text-center">
              <div className={`w-8 h-8 rounded-xl ${bg} flex items-center justify-center mx-auto mb-2`}>
                <Shield className={`w-4 h-4 ${color}`} />
              </div>
              {loadingCounts
                ? <div className="h-6 w-12 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mx-auto mb-1" />
                : <p className={`text-xl font-bold ${color}`}>{(userCounts[role] ?? 0).toLocaleString()}</p>
              }
              <p className="text-xs text-slate-500 dark:text-slate-400">{role}s</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Role Cards */}
      <div className="grid lg:grid-cols-2 gap-4">
        {roles.map((r) => (
          <Card key={r.role}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${r.bg} flex items-center justify-center flex-shrink-0`}>
                    <Shield className={`w-5 h-5 ${r.color}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-slate-900 dark:text-white">{r.role}</p>
                      {r.custom && (
                        <span className="text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-1.5 py-0.5 rounded-full">custom</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {loadingCounts
                        ? <span className="inline-block w-8 h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                        : `${(userCounts[r.role] ?? 0).toLocaleString()} users`
                      }
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(r)} title="Edit role">
                    <Edit3 className="w-3.5 h-3.5" />
                  </Button>
                  {r.custom && (
                    <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(r.role)} title="Remove role">
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                    </Button>
                  )}
                </div>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                {r.description || <span className="italic">No description</span>}
              </p>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Permissions</p>
              <div className="space-y-1">
                {r.permissions.length === 0
                  ? <p className="text-xs text-slate-400 italic">No permissions defined</p>
                  : r.permissions.map((p) => (
                    <div key={p} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                      {p}
                    </div>
                  ))
                }
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Modal */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setEditTarget(null)} />
          <div className="relative z-10 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-900">
              <h2 className="text-base font-bold">Edit Role — {editTarget.role}</h2>
              <button onClick={() => setEditTarget(null)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <Label>Description</Label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Permissions <span className="text-slate-400 font-normal">(one per line)</span></Label>
                <textarea
                  value={form.permissions}
                  onChange={e => setForm(f => ({ ...f, permissions: e.target.value }))}
                  rows={10}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 font-mono resize-none"
                />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <Button variant="outline" onClick={() => setEditTarget(null)}>Cancel</Button>
                <Button onClick={saveEdit} className="bg-green-600 hover:bg-green-700 text-white"><Check className="w-4 h-4 mr-1" /> Save Changes</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowCreate(false)} />
          <div className="relative z-10 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-900">
              <h2 className="text-base font-bold">Create New Role</h2>
              <button onClick={() => setShowCreate(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <Label>Role Name</Label>
                <Input
                  placeholder="e.g. MODERATOR"
                  value={form.role}
                  onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                  className="rounded-xl font-mono uppercase"
                />
                <p className="text-xs text-slate-400">Custom roles are display-only. System-level auth requires a platform schema update.</p>
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <textarea
                  placeholder="Describe this role's purpose and responsibilities..."
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Permissions <span className="text-slate-400 font-normal">(one per line)</span></Label>
                <textarea
                  placeholder={"View data\nManage records\nAccess reports..."}
                  value={form.permissions}
                  onChange={e => setForm(f => ({ ...f, permissions: e.target.value }))}
                  rows={6}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 font-mono resize-none"
                />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
                <Button onClick={createRole} className="bg-green-600 hover:bg-green-700 text-white"><Plus className="w-4 h-4 mr-1" /> Create Role</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteTarget(null)} />
          <div className="relative z-10 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="text-center mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-3">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Remove Role?</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Are you sure you want to remove the <span className="font-mono font-bold">{deleteTarget}</span> role?
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setDeleteTarget(null)}>Cancel</Button>
              <Button onClick={() => confirmDelete(deleteTarget)} className="flex-1 bg-red-600 hover:bg-red-700 text-white">Remove</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
