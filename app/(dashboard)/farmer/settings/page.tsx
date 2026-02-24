"use client";

import { useState, useTransition, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { User, Bell, Shield, Phone, Mail, Save, Loader2 } from "lucide-react";
import { getUserProfile, updateUserProfile, updatePassword } from "@/lib/actions/user";

type Profile = Awaited<ReturnType<typeof getUserProfile>>;

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Profile form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");

  // Password form state
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  // Notification prefs (local only — no model for this)
  const [notifications, setNotifications] = useState({
    email: true, sms: false, push: true, weather: true, marketplace: true, diagnostics: true,
  });

  const [isPendingProfile, startProfileTransition] = useTransition();
  const [isPendingPwd, startPwdTransition] = useTransition();

  useEffect(() => {
    getUserProfile()
      .then((data) => {
        if (data) {
          setProfile(data);
          setName(data.name ?? "");
          setPhone(data.phone ?? "");
          setCountry(data.country ?? "");
        }
      })
      .catch(() => toast.error("Failed to load profile"))
      .finally(() => setLoadingProfile(false));
  }, []);

  function saveProfile() {
    startProfileTransition(async () => {
      try {
        await updateUserProfile({ name, phone, country });
        toast.success("Profile updated successfully");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to update profile");
      }
    });
  }

  function savePassword() {
    if (newPwd !== confirmPwd) { toast.error("Passwords do not match"); return; }
    if (newPwd.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    startPwdTransition(async () => {
      try {
        await updatePassword(currentPwd, newPwd);
        toast.success("Password updated successfully");
        setCurrentPwd(""); setNewPwd(""); setConfirmPwd("");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to update password");
      }
    });
  }

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w: any) => w[0].toUpperCase())
    .join("") || "?";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Manage your account preferences</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile"><User className="w-4 h-4 mr-1.5" /> Profile</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="w-4 h-4 mr-1.5" /> Notifications</TabsTrigger>
          <TabsTrigger value="security"><Shield className="w-4 h-4 mr-1.5" /> Security</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              {loadingProfile ? (
                <div className="flex items-center gap-3 py-4">
                  <Loader2 className="w-5 h-5 animate-spin text-green-600" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">Loading profile…</span>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={profile?.image ?? ""} />
                      <AvatarFallback className="text-xl bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{name || "—"}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{profile?.email}</p>
                      <Badge className="mt-1 text-xs" variant="outline">{profile?.role}</Badge>
                    </div>
                  </div>
                  <Separator />
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={profile?.email ?? ""} disabled className="opacity-60" />
                      <p className="text-xs text-slate-400">Contact support to change email</p>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+254 700 000 000" />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="county">County / Region</Label>
                      <Input id="county" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="e.g. Nakuru" />
                    </div>
                  </div>
                  <Button onClick={saveProfile} disabled={isPendingProfile} className="bg-green-600 hover:bg-green-700 text-white">
                    {isPendingProfile ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving…</> : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader><CardTitle>Notification Preferences</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Channels</h3>
                  <div className="space-y-3">
                    {[
                      { key: "email", icon: Mail, label: "Email Notifications", desc: "Receive updates via email" },
                      { key: "sms", icon: Phone, label: "SMS Notifications", desc: "Get alerts on your phone" },
                      { key: "push", icon: Bell, label: "Push Notifications", desc: "Browser & app push alerts" },
                    ].map(({ key, icon: Icon, label, desc }) => (
                      <div key={key} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5 text-slate-400" />
                          <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">{label}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{desc}</p>
                          </div>
                        </div>
                        <Switch checked={notifications[key as keyof typeof notifications]} onCheckedChange={(v) => setNotifications({ ...notifications, [key]: v })} />
                      </div>
                    ))}
                  </div>
                </div>
                <Separator />
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Alert Types</h3>
                  <div className="space-y-3">
                    {[
                      { key: "weather", label: "Weather Alerts", desc: "Severe weather & frost warnings" },
                      { key: "marketplace", label: "Marketplace Updates", desc: "New orders & price changes" },
                      { key: "diagnostics", label: "Diagnostic Reports", desc: "AI scan results & recommendations" },
                    ].map(({ key, label, desc }) => (
                      <div key={key} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">{label}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{desc}</p>
                        </div>
                        <Switch checked={notifications[key as keyof typeof notifications]} onCheckedChange={(v) => setNotifications({ ...notifications, [key]: v })} />
                      </div>
                    ))}
                  </div>
                </div>
                <Button onClick={() => toast.success("Notification preferences saved")} className="bg-green-600 hover:bg-green-700 text-white">
                  <Save className="w-4 h-4 mr-2" /> Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Change Password</CardTitle></CardHeader>
              <CardContent className="space-y-4 max-w-md">
                <div className="space-y-1.5">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" value={currentPwd} onChange={(e) => setCurrentPwd(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} />
                  {confirmPwd && newPwd !== confirmPwd && <p className="text-xs text-red-500">Passwords do not match</p>}
                </div>
                <Button onClick={savePassword} disabled={isPendingPwd || !currentPwd || !newPwd || !confirmPwd} className="bg-green-600 hover:bg-green-700 text-white">
                  {isPendingPwd ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating…</> : "Update Password"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Two-Factor Authentication</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">SMS 2FA</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Add extra security with SMS verification</p>
                  </div>
                  <Badge variant="warning">Not Enabled</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200 dark:border-red-900">
              <CardHeader><CardTitle className="text-red-600">Danger Zone</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-950/20 rounded-xl">
                  <div>
                    <p className="font-medium text-red-700 dark:text-red-400">Delete Account</p>
                    <p className="text-xs text-red-500">Permanently delete your account and all data</p>
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => toast.error("Please contact support to delete your account")}>Delete</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
