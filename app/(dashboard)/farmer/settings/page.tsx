"use client";

import { useState, useTransition, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  User, Bell, Shield, Phone, Mail, Save, Loader2, Eye, EyeOff,
  CheckCircle2, XCircle, AlertTriangle, Monitor, RefreshCw, Lock, Clock,
} from "lucide-react";
import {
  getUserProfile, updateUserProfile, updatePassword,
  getNotificationPrefs, updateNotificationPrefs, getRecentActivity,
} from "@/lib/actions/user";
import { AvatarUploadDialog } from "@/components/dashboard/avatar-upload-dialog";

type Profile = Awaited<ReturnType<typeof getUserProfile>>;
type NotifPrefs = Awaited<ReturnType<typeof getNotificationPrefs>>;
type Activity = Awaited<ReturnType<typeof getRecentActivity>>;

// ── Password strength helper ────────────────────────────────────────────────
function getPasswordStrength(pwd: string): { score: number; label: string; color: string } {
  if (!pwd) return { score: 0, label: "", color: "" };
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
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Profile form
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");

  // Password form
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const pwdStrength = getPasswordStrength(newPwd);

  // Notification prefs
  const [notifPrefs, setNotifPrefs] = useState<NotifPrefs | null>(null);
  const [loadingPrefs, setLoadingPrefs] = useState(true);
  const [savedPrefs, setSavedPrefs] = useState<NotifPrefs | null>(null); // last saved state for dirty detection

  // Activity log
  const [activity, setActivity] = useState<Activity>([]);
  const [loadingActivity, setLoadingActivity] = useState(true);

  const [isPendingProfile, startProfileTransition] = useTransition();
  const [isPendingPwd, startPwdTransition] = useTransition();
  const [isPendingPrefs, startPrefsTransition] = useTransition();

  // ── Load all data on mount ───────────────────────────────────────────────
  useEffect(() => {
    getUserProfile()
      .then((data) => {
        if (data) {
          setProfile(data);
          setName(data.name ?? "");
          setPhone(data.phone ?? "");
          setCountry(data.country ?? "");
          setAvatarUrl(data.image ?? null);
        }
      })
      .catch(() => toast.error("Failed to load profile"))
      .finally(() => setLoadingProfile(false));

    getNotificationPrefs()
      .then((p) => { setNotifPrefs(p); setSavedPrefs(p); })
      .catch(() => toast.error("Failed to load notification preferences"))
      .finally(() => setLoadingPrefs(false));

    getRecentActivity()
      .then(setActivity)
      .catch(() => {})
      .finally(() => setLoadingActivity(false));
  }, []);

  // ── Optimistic toggle for notification prefs ─────────────────────────────
  function togglePref(key: keyof NotifPrefs, value: boolean) {
    if (!notifPrefs) return;
    setNotifPrefs({ ...notifPrefs, [key]: value });
  }

  function saveNotifPrefs() {
    if (!notifPrefs) return;
    startPrefsTransition(async () => {
      try {
        await updateNotificationPrefs({
          emailEnabled: (notifPrefs as any).emailEnabled,
          smsEnabled: (notifPrefs as any).smsEnabled,
          pushEnabled: (notifPrefs as any).pushEnabled,
          weatherAlerts: (notifPrefs as any).weatherAlerts,
          marketplaceAlerts: (notifPrefs as any).marketplaceAlerts,
          diagnosticAlerts: (notifPrefs as any).diagnosticAlerts,
        });
        setSavedPrefs({ ...notifPrefs });
        toast.success("Notification preferences saved");
      } catch (e) {
        // Revert optimistic update on failure
        setNotifPrefs(savedPrefs);
        toast.error(e instanceof Error ? e.message : "Failed to save preferences");
      }
    });
  }

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
        // Refresh activity log
        getRecentActivity().then(setActivity).catch(() => {});
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to update password");
      }
    });
  }

  const refreshActivity = useCallback(() => {
    setLoadingActivity(true);
    getRecentActivity().then(setActivity).catch(() => {}).finally(() => setLoadingActivity(false));
  }, []);

  const initials = name
    .split(" ").filter(Boolean).slice(0, 2)
    .map((w) => w[0].toUpperCase()).join("") || "?";

  const prefsChanged = notifPrefs && savedPrefs &&
    Object.keys(notifPrefs).some(
      (k) => (notifPrefs as any)[k] !== (savedPrefs as any)[k]
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Manage your account preferences</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile"><User className="w-4 h-4 mr-1.5" /> Profile</TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-1.5" /> Notifications
            {prefsChanged && <span className="ml-1.5 w-2 h-2 rounded-full bg-amber-500 inline-block" />}
          </TabsTrigger>
          <TabsTrigger value="security"><Shield className="w-4 h-4 mr-1.5" /> Security</TabsTrigger>
        </TabsList>

        {/* ── Profile Tab ───────────────────────────────────────────────── */}
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
                    <AvatarUploadDialog
                      currentImage={avatarUrl}
                      initials={initials}
                      onAvatarChange={(url) => {
                        setAvatarUrl(url);
                        setProfile((p) => p ? { ...p, image: url } : p);
                      }}
                    />
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

        {/* ── Notifications Tab ─────────────────────────────────────────── */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how and when you want to be notified. Changes are saved to your account.</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingPrefs ? (
                <div className="flex items-center gap-3 py-6">
                  <Loader2 className="w-5 h-5 animate-spin text-green-600" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">Loading preferences…</span>
                </div>
              ) : notifPrefs ? (
                <div className="space-y-6">
                  {/* Channels */}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 uppercase tracking-wide">Delivery Channels</h3>
                    <div className="space-y-2">
                      {([
                        { key: "emailEnabled", icon: Mail, label: "Email Notifications", desc: "Receive updates via email" },
                        { key: "smsEnabled", icon: Phone, label: "SMS Notifications", desc: "Get alerts on your phone" },
                        { key: "pushEnabled", icon: Bell, label: "Push Notifications", desc: "Browser & app push alerts" },
                      ] as const).map(({ key, icon: Icon, label, desc }) => (
                        <div key={key} className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${(notifPrefs as any)[key] ? "bg-green-100 dark:bg-green-900/30" : "bg-slate-200 dark:bg-slate-700"}`}>
                              <Icon className={`w-4 h-4 ${(notifPrefs as any)[key] ? "text-green-600" : "text-slate-400"}`} />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-900 dark:text-white">{label}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">{desc}</p>
                            </div>
                          </div>
                          <Switch
                            checked={(notifPrefs as any)[key]}
                            onCheckedChange={(v) => togglePref(key as keyof NotifPrefs, v)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Alert Types */}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 uppercase tracking-wide">Alert Types</h3>
                    <div className="space-y-2">
                      {([
                        { key: "weatherAlerts", label: "Weather Alerts", desc: "Severe weather, frost & drought warnings", emoji: "🌦️" },
                        { key: "marketplaceAlerts", label: "Marketplace Updates", desc: "New orders, price changes & buyer inquiries", emoji: "🛒" },
                        { key: "diagnosticAlerts", label: "Diagnostic Reports", desc: "AI crop scan results & treatment recommendations", emoji: "🔬" },
                      ] as const).map(({ key, label, desc, emoji }) => (
                        <div key={key} className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{emoji}</span>
                            <div>
                              <p className="text-sm font-medium text-slate-900 dark:text-white">{label}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">{desc}</p>
                            </div>
                          </div>
                          <Switch
                            checked={(notifPrefs as any)[key]}
                            onCheckedChange={(v) => togglePref(key as keyof NotifPrefs, v)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <Button
                      onClick={saveNotifPrefs}
                      disabled={isPendingPrefs || !prefsChanged}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {isPendingPrefs
                        ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving…</>
                        : <><Save className="w-4 h-4 mr-2" /> Save Preferences</>}
                    </Button>
                    {prefsChanged && (
                      <span className="text-xs text-amber-500 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> Unsaved changes
                      </span>
                    )}
                    {!prefsChanged && !isPendingPrefs && savedPrefs && (
                      <span className="text-xs text-green-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> All saved
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-500">Could not load preferences. Please refresh.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Security Tab ──────────────────────────────────────────────── */}
        <TabsContent value="security">
          <div className="space-y-6">

            {/* Change Password */}
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Use a strong password with uppercase, numbers and symbols.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 max-w-md">
                <div className="space-y-1.5">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrent ? "text" : "password"}
                      value={currentPwd}
                      onChange={(e) => setCurrentPwd(e.target.value)}
                      className="pr-10"
                    />
                    <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNew ? "text" : "password"}
                      value={newPwd}
                      onChange={(e) => setNewPwd(e.target.value)}
                      className="pr-10"
                    />
                    <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {/* Strength bar */}
                  {newPwd && (
                    <div className="space-y-1 pt-1">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full transition-all ${i <= pwdStrength.score ? pwdStrength.color : "bg-slate-200 dark:bg-slate-700"}`}
                          />
                        ))}
                      </div>
                      <p className={`text-xs font-medium ${pwdStrength.color.replace("bg-", "text-")}`}>{pwdStrength.label}</p>
                    </div>
                  )}
                  <ul className="text-xs text-slate-400 space-y-0.5 pt-1">
                    {[
                      [newPwd.length >= 8, "At least 8 characters"],
                      [/[A-Z]/.test(newPwd), "One uppercase letter"],
                      [/[0-9]/.test(newPwd), "One number"],
                      [/[^A-Za-z0-9]/.test(newPwd), "One special character"],
                    ].map(([ok, text], i) => (
                      <li key={i} className={`flex items-center gap-1.5 ${newPwd ? (ok ? "text-green-600" : "text-slate-400") : "text-slate-300 dark:text-slate-600"}`}>
                        {newPwd ? (ok ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />) : <div className="w-3 h-3 rounded-full border border-current opacity-40" />}
                        {String(text)}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      value={confirmPwd}
                      onChange={(e) => setConfirmPwd(e.target.value)}
                      className="pr-10"
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirmPwd && newPwd !== confirmPwd && (
                    <p className="text-xs text-red-500 flex items-center gap-1"><XCircle className="w-3 h-3" /> Passwords do not match</p>
                  )}
                  {confirmPwd && newPwd === confirmPwd && (
                    <p className="text-xs text-green-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Passwords match</p>
                  )}
                </div>

                <Button
                  onClick={savePassword}
                  disabled={isPendingPwd || !currentPwd || !newPwd || !confirmPwd || newPwd !== confirmPwd}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isPendingPwd
                    ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating…</>
                    : <><Lock className="w-4 h-4 mr-2" /> Update Password</>}
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Account Activity</CardTitle>
                  <CardDescription>Last 10 actions on your account</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={refreshActivity} disabled={loadingActivity}>
                  <RefreshCw className={`w-4 h-4 mr-1.5 ${loadingActivity ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </CardHeader>
              <CardContent>
                {loadingActivity ? (
                  <div className="flex items-center gap-3 py-4">
                    <Loader2 className="w-5 h-5 animate-spin text-green-600" />
                    <span className="text-sm text-slate-500">Loading activity…</span>
                  </div>
                ) : activity.length === 0 ? (
                  <div className="text-center py-8">
                    <Monitor className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">No activity recorded yet.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {activity.map((log) => {
                      const isSecurity = log.action.includes("PASSWORD") || log.action.includes("LOGIN") || log.action.includes("AUTH");
                      return (
                        <div key={log.id} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                          <div className={`mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isSecurity ? "bg-amber-100 dark:bg-amber-900/30" : "bg-green-100 dark:bg-green-900/30"}`}>
                            {isSecurity
                              ? <Shield className="w-3.5 h-3.5 text-amber-600" />
                              : <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                              {log.action.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                              <span className="text-xs text-slate-400 flex items-center gap-1">
                                <Monitor className="w-3 h-3" /> {formatUA(log.userAgent)}
                              </span>
                              {log.ipAddress && (
                                <span className="text-xs text-slate-400">· {log.ipAddress}</span>
                              )}
                            </div>
                          </div>
                          <span className="text-xs text-slate-400 shrink-0 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {timeAgo(log.createdAt)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 2FA */}
            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>Add an extra layer of security to your account.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                      <Phone className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white text-sm">SMS 2FA</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Require a code texted to {profile?.phone || "your phone"} on login</p>
                    </div>
                  </div>
                  <Badge variant="warning">Coming Soon</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-red-200 dark:border-red-900">
              <CardHeader><CardTitle className="text-red-600">Danger Zone</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-950/20 rounded-xl">
                  <div>
                    <p className="font-medium text-red-700 dark:text-red-400 text-sm">Delete Account</p>
                    <p className="text-xs text-red-500">Permanently delete your account and all associated data. This cannot be undone.</p>
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => toast.error("Please contact support at support@digi-farms.com to delete your account.")}>
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
