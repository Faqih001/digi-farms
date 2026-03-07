"use client";

import { useState, useEffect, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Building2, Bell, Shield, CreditCard, Loader2, Eye, EyeOff, CheckCircle2, XCircle, AlertTriangle, Monitor, RefreshCw, Lock, Clock } from "lucide-react";
import { toast } from "sonner";
import { getUserProfile, updateUserProfile, updatePassword, getRecentActivity } from "@/lib/actions/user";
import { AvatarUploadDialog } from "@/components/dashboard/avatar-upload-dialog";

const tabs = [
  { id: "organization", label: "Organization", icon: Building2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "banking", label: "Banking", icon: CreditCard },
];

function Toggle({ label, description, defaultChecked = false }: { label: string; description: string; defaultChecked?: boolean }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <div>
        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{label}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      <button
        onClick={() => setOn(!on)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none ${on ? "bg-green-500" : "bg-slate-200 dark:bg-slate-700"}`}
      >
        <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 mt-0.5 ${on ? "translate-x-5" : "translate-x-0.5"}`} />
      </button>
    </div>
  );
}

export default function LenderSettingsPage() {
  const [activeTab, setActiveTab] = useState("organization");

  // Profile fields
  const [name,   setName]   = useState("");
  const [phone,  setPhone]  = useState("");
  const [email,  setEmail]  = useState("");
  const [country, setCountry] = useState("");
  const [profileLoading, startProfileLoad] = useTransition();
  const [saving, startSave] = useTransition();

  // Password fields
  const [currentPw,  setCurrentPw]  = useState("");
  const [newPw,      setNewPw]      = useState("");
  const [confirmPw,  setConfirmPw]  = useState("");
  const [pwSaving, startPwSave] = useTransition();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Recent activity
  const [activity, setActivity] = useState<any[]>([]);
  const [loadingActivity, setLoadingActivity] = useState(true);

  // Lender-specific local fields (no DB model backing)
  const [licenseNo,  setLicenseNo]  = useState("CBK/DFI/023");
  const [address,    setAddress]    = useState("Equity Centre, Upperhill, Nairobi");
  const [minLoan,    setMinLoan]    = useState("10000");
  const [maxLoan,    setMaxLoan]    = useState("5000000");
  const [interest,   setInterest]   = useState("10.5");
  const [tenure,     setTenure]     = useState("36");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    startProfileLoad(async () => {
      try {
        const profile = await getUserProfile();
        if (profile) {
          setName(profile.name ?? "");
          setEmail(profile.email ?? "");
          setPhone(profile.phone ?? "");
          setCountry(profile.country ?? "");
          setAvatarUrl(profile.image ?? null);
        }
      } catch {
        toast.error("Failed to load profile");
      }
    });
  }, []);

  function handleSaveOrg() {
    startSave(async () => {
      try {
        await updateUserProfile({ name, phone, country });
        toast.success("Organization profile saved");
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : "Failed to save");
      }
    });
  }

  function handleSaveNotifications() {
    toast.success("Notification preferences saved");
  }

  function handleUpdatePassword() {
    if (newPw !== confirmPw) { toast.error("Passwords do not match"); return; }
    if (newPw.length < 8)    { toast.error("Password must be at least 8 characters"); return; }
    startPwSave(async () => {
      try {
        await updatePassword(currentPw, newPw);
        toast.success("Password updated");
        setCurrentPw(""); setNewPw(""); setConfirmPw("");
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : "Failed to update password");
      }
    });
  }

  // ── Security helpers (password strength, UA formatting) ─────────────────
  function getPasswordStrength(pwd: string) {
    if (!pwd) return { score: 0, label: "", color: "" } as any;
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score <= 1) return { score, label: "Weak", color: "bg-red-500" };
    if (score <= 3) return { score, label: "Fair", color: "bg-amber-500" };
    if (score === 4) return { score, label: "Good", color: "bg-blue-500" };
    return { score, label: "Strong", color: "bg-green-500" };
  }

  function formatUA(ua: string | null | undefined) {
    if (!ua) return "Unknown device";
    if (/iPhone|iPad/.test(ua)) return "iOS device";
    if (/Android/.test(ua)) return "Android device";
    if (/Windows/.test(ua)) return "Windows PC";
    if (/Mac/.test(ua)) return "Mac";
    if (/Linux/.test(ua)) return "Linux";
    return "Unknown device";
  }

  function timeAgo(date: Date | string) {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  }

  async function refreshActivity() {
    setLoadingActivity(true);
    try {
      const logs = await getRecentActivity();
      setActivity(logs ?? []);
    } catch (e) {
      toast.error("Failed to load activity");
    } finally {
      setLoadingActivity(false);
    }
  }

  useEffect(() => { refreshActivity(); }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Manage your lending institution preferences</p>
      </div>

      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit overflow-x-auto">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === id ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"}`}
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {activeTab === "organization" && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">Organization Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profileLoading ? (
              <div className="flex items-center gap-2 text-slate-400 py-4">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading profile…
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4 mb-2">
                  <AvatarUploadDialog
                    currentImage={avatarUrl}
                    initials={name.split(" ").filter(Boolean).slice(0, 2).map((w: string) => w[0].toUpperCase()).join("") || "L"}
                    onAvatarChange={(url) => setAvatarUrl(url)}
                  />
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{name || "Lender"}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Institution / Contact Name</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Equity Agri Finance" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>License Number</Label>
                    <Input value={licenseNo} onChange={(e) => setLicenseNo(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Contact Email</Label>
                    <Input value={email} disabled className="opacity-60 cursor-not-allowed" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Phone Number</Label>
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+254 7xx xxx xxx" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Country</Label>
                    <Input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="e.g. Kenya" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Physical Address</Label>
                    <Input value={address} onChange={(e) => setAddress(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Min. Loan Amount (KES)</Label>
                    <Input type="number" value={minLoan} onChange={(e) => setMinLoan(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Max. Loan Amount (KES)</Label>
                    <Input type="number" value={maxLoan} onChange={(e) => setMaxLoan(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Base Interest Rate (%)</Label>
                    <Input type="number" value={interest} onChange={(e) => setInterest(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Max. Loan Tenure (months)</Label>
                    <Input type="number" value={tenure} onChange={(e) => setTenure(e.target.value)} />
                  </div>
                </div>
                <Button onClick={handleSaveOrg} disabled={saving} className="bg-green-600 hover:bg-green-700 text-white">
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Changes
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "notifications" && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <Toggle label="New Loan Applications"     description="Alert when new applications are submitted"                        defaultChecked />
            <Toggle label="Overdue Payment Alerts"    description="Notify when a borrower misses a payment"                          defaultChecked />
            <Toggle label="Application Approvals"     description="Confirm when AI auto-approves a loan"                             defaultChecked />
            <Toggle label="Credit Score Changes"      description="Alert when a borrower credit score changes significantly" />
            <Toggle label="Weather Risk Alerts"       description="Regional weather risk notifications for portfolio"                 defaultChecked />
            <Toggle label="Portfolio Reports"         description="Weekly portfolio performance digest" />
            <Toggle label="Yield Forecast Updates"    description="When new yield forecasts are generated" />
            <div className="pt-3">
              <Button onClick={handleSaveNotifications} className="bg-green-600 hover:bg-green-700 text-white">
                <Save className="w-4 h-4 mr-2" /> Save Preferences
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "security" && (
        <div className="space-y-6">

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold">Change Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Current Password</Label>
                <div className="relative">
                  <Input type={showCurrent ? "text" : "password"} placeholder="••••••••" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} className="pr-10" />
                  <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>New Password</Label>
                <div className="relative">
                  <Input type={showNew ? "text" : "password"} placeholder="••••••••" value={newPw} onChange={(e) => setNewPw(e.target.value)} className="pr-10" />
                  <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {newPw && (
                  <div className="space-y-1 pt-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= getPasswordStrength(newPw).score ? getPasswordStrength(newPw).color : "bg-slate-200 dark:bg-slate-700"}`} />
                      ))}
                    </div>
                    <p className={`text-xs font-medium ${getPasswordStrength(newPw).color.replace("bg-", "text-")}`}>{getPasswordStrength(newPw).label}</p>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <Label>Confirm New Password</Label>
                <div className="relative">
                  <Input type={showConfirm ? "text" : "password"} placeholder="••••••••" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} className="pr-10" />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPw && newPw !== confirmPw && (
                  <p className="text-xs text-red-500">Passwords do not match</p>
                )}
              </div>

              <Button onClick={handleUpdatePassword} disabled={pwSaving} className="bg-green-600 hover:bg-green-700 text-white">
                {pwSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} Update Password
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold">Recent Account Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-end mb-3">
                <Button variant="outline" size="sm" onClick={refreshActivity} disabled={loadingActivity}>
                  <RefreshCw className={`w-4 h-4 mr-1.5 ${loadingActivity ? "animate-spin" : ""}`} /> Refresh
                </Button>
              </div>
              {loadingActivity ? (
                <div className="flex items-center gap-3 py-4"><Loader2 className="w-5 h-5 animate-spin text-green-600" /><span className="text-sm text-slate-500">Loading activity…</span></div>
              ) : activity.length === 0 ? (
                <div className="text-center py-8"><Monitor className="w-10 h-10 text-slate-300 mx-auto mb-2" /><p className="text-sm text-slate-500">No activity recorded yet.</p></div>
              ) : (
                <div className="space-y-2">
                  {activity.map((log: any) => {
                    const isSecurity = log.action.includes("PASSWORD") || log.action.includes("LOGIN") || log.action.includes("AUTH");
                    return (
                      <div key={log.id} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                        <div className={`mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isSecurity ? "bg-amber-100 dark:bg-amber-900/30" : "bg-green-100 dark:bg-green-900/30"}`}>
                          {isSecurity ? <Shield className="w-3.5 h-3.5 text-amber-600" /> : <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{String(log.action).replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c: string) => c.toUpperCase())}</p>
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap"><span className="text-xs text-slate-400 flex items-center gap-1"><Monitor className="w-3 h-3" /> {formatUA(log.userAgent)}</span>{log.ipAddress && <span className="text-xs text-slate-400">· {log.ipAddress}</span>}</div>
                        </div>
                        <span className="text-xs text-slate-400 shrink-0 flex items-center gap-1"><Clock className="w-3 h-3" /> {timeAgo(log.createdAt)}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold">Two-Factor Authentication</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center"><Monitor className="w-4 h-4 text-amber-600" /></div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white text-sm">SMS 2FA</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Require a code texted to your phone on login</p>
                  </div>
                </div>
                <div className="text-xs text-slate-500"><em>Coming Soon</em></div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 dark:border-red-900">
            <CardHeader><CardTitle className="text-red-600">Danger Zone</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-950/20 rounded-xl">
                <div>
                  <p className="font-medium text-red-700 dark:text-red-400 text-sm">Delete Organization Account</p>
                  <p className="text-xs text-red-500">Permanently delete your lender account and all associated data. This cannot be undone.</p>
                </div>
                <Button variant="destructive" size="sm" onClick={() => toast.error("Please contact support at support@digi-farms.com to delete your account.")}>Delete</Button>
              </div>
            </CardContent>
          </Card>

        </div>
      )}

      {activeTab === "banking" && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">Banking & Disbursement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label>Bank Name</Label><Input defaultValue="Equity Bank Kenya" /></div>
              <div className="space-y-1.5"><Label>Account Number</Label><Input defaultValue="0100***2345" /></div>
              <div className="space-y-1.5"><Label>M-Pesa Paybill</Label><Input defaultValue="220220" /></div>
              <div className="space-y-1.5"><Label>Account Name</Label><Input defaultValue="Equity Agri Finance Ltd" /></div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Disbursement Methods</p>
              <div>
                <Toggle label="M-Pesa Direct"    description="Disburse loans via M-Pesa mobile money"                          defaultChecked />
                <Toggle label="Bank Transfer"    description="Disburse via EFT/RTGS to farmer bank accounts"                   defaultChecked />
                <Toggle label="Agrovet Vouchers" description="Disburse as redeemable input vouchers via partner agrovets" />
              </div>
            </div>
            <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => toast.success("Banking details saved")}>
              <Save className="w-4 h-4 mr-2" /> Save Banking Details
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
