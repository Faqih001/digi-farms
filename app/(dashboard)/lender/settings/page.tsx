"use client";

import { useState, useEffect, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Building2, Bell, Shield, CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getUserProfile, updateUserProfile, updatePassword } from "@/lib/actions/user";
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
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold">Change Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Current Password</Label>
                <Input type="password" placeholder="••••••••" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>New Password</Label>
                <Input type="password" placeholder="••••••••" value={newPw} onChange={(e) => setNewPw(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Confirm New Password</Label>
                <Input type="password" placeholder="••••••••" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} />
                {newPw && confirmPw && newPw !== confirmPw && (
                  <p className="text-xs text-red-500">Passwords do not match</p>
                )}
              </div>
              <Button onClick={handleUpdatePassword} disabled={pwSaving} className="bg-green-600 hover:bg-green-700 text-white">
                {pwSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Update Password
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold">Two-Factor Authentication</CardTitle>
            </CardHeader>
            <CardContent>
              <Toggle label="Enable 2FA" description="Add an extra layer of security to your account" />
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
