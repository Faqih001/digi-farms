"use client";

import { useState, useTransition, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  Store, Bell, Truck, Save, Shield, Loader2, Eye, EyeOff,
  CheckCircle2, XCircle, AlertTriangle, Monitor, RefreshCw, Lock, Clock,
  ChevronDown, ChevronRight, MapPin, Phone,
} from "lucide-react";
import {
  getUserProfile, updateSupplierProfile, getSupplierProfile,
  updatePassword, getNotificationPrefs, updateNotificationPrefs, getRecentActivity, saveSupplierShipping,
} from "@/lib/actions/user";
import { AvatarUploadDialog } from "@/components/dashboard/avatar-upload-dialog";

type UserProfile = Awaited<ReturnType<typeof getUserProfile>>;
type SupplierProfile = Awaited<ReturnType<typeof getSupplierProfile>>;
type NotifPrefs = Awaited<ReturnType<typeof getNotificationPrefs>>;
type Activity = Awaited<ReturnType<typeof getRecentActivity>>;

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

const KENYA_COUNTIES: Record<string, string[]> = {
  "Baringo": ["Kabarnet", "Eldama Ravine", "Marigat", "Mogotio"],
  "Bomet": ["Bomet", "Sotik", "Longisa"],
  "Bungoma": ["Bungoma", "Webuye", "Kimilili", "Chwele"],
  "Busia": ["Busia", "Malaba", "Nambale", "Port Victoria"],
  "Elgeyo-Marakwet": ["Iten", "Kapsowar", "Chebara"],
  "Embu": ["Embu", "Siakago", "Runyenjes"],
  "Garissa": ["Garissa", "Dadaab", "Ijara"],
  "Homa Bay": ["Homa Bay", "Kendu Bay", "Oyugis", "Mbita"],
  "Isiolo": ["Isiolo", "Merti", "Garbatulla"],
  "Kajiado": ["Kajiado", "Ngong", "Ongata Rongai", "Kiserian", "Kitengela"],
  "Kakamega": ["Kakamega", "Mumias", "Butere", "Malava"],
  "Kericho": ["Kericho", "Litein", "Londiani"],
  "Kiambu": ["Thika", "Ruiru", "Kiambu", "Kikuyu", "Githunguri", "Limuru"],
  "Kilifi": ["Kilifi", "Malindi", "Watamu", "Mtwapa"],
  "Kirinyaga": ["Kerugoya", "Kutus", "Sagana"],
  "Kisii": ["Kisii", "Ogembo", "Suneka"],
  "Kisumu": ["Kisumu", "Ahero", "Muhoroni", "Maseno"],
  "Kitui": ["Kitui", "Mwingi", "Mutomo"],
  "Kwale": ["Ukunda", "Msambweni", "Kinango", "Lunga Lunga"],
  "Laikipia": ["Nanyuki", "Nyahururu", "Rumuruti"],
  "Lamu": ["Lamu", "Witu", "Mpeketoni"],
  "Machakos": ["Machakos", "Athi River", "Kangundo", "Matuu"],
  "Makueni": ["Wote", "Sultan Hamud", "Emali", "Makindu"],
  "Mandera": ["Mandera", "Elwak", "Rhamu"],
  "Marsabit": ["Marsabit", "Moyale", "Laisamis"],
  "Meru": ["Meru", "Nkubu", "Timau", "Maua"],
  "Migori": ["Migori", "Kehancha", "Awendo"],
  "Mombasa": ["Mombasa CBD", "Nyali", "Bamburi", "Likoni"],
  "Murang'a": ["Murang'a", "Kandara", "Maragua", "Makuyu"],
  "Nairobi": ["CBD", "Westlands", "Embakasi", "Kasarani", "Karen", "Langata"],
  "Nakuru": ["Nakuru", "Naivasha", "Gilgil", "Molo", "Njoro"],
  "Nandi": ["Kapsabet", "Nandi Hills", "Kobujoi"],
  "Narok": ["Narok", "Kilgoris", "Ololulunga"],
  "Nyamira": ["Nyamira", "Keroka", "Nyansiongo"],
  "Nyandarua": ["Ol Kalou", "Engineer", "Ndaragwa"],
  "Nyeri": ["Nyeri", "Karatina", "Othaya"],
  "Samburu": ["Maralal", "Baragoi", "Wamba"],
  "Siaya": ["Siaya", "Bondo", "Ugunja"],
  "Taita-Taveta": ["Voi", "Wundanyi", "Taveta"],
  "Tana River": ["Hola", "Garsen", "Bura"],
  "Tharaka-Nithi": ["Chuka", "Marimba", "Kathwana"],
  "Trans Nzoia": ["Kitale", "Kiminini", "Kwanza"],
  "Turkana": ["Lodwar", "Kakuma", "Lokichar"],
  "Uasin Gishu": ["Eldoret", "Turbo", "Burnt Forest", "Moiben"],
  "Vihiga": ["Vihiga", "Mbale", "Luanda"],
  "Wajir": ["Wajir", "Habaswein", "Bute"],
  "West Pokot": ["Kapenguria", "Alale", "Sebit"],
};

const ALL_COUNTIES = Object.keys(KENYA_COUNTIES).sort();

function CountyChecklist({ selected, onChange }: { selected: Set<string>; onChange: (s: Set<string>) => void }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");

  function toggleCounty(county: string) {
    const next = new Set(selected);
    if (next.has(county)) {
      next.delete(county);
      KENYA_COUNTIES[county].forEach((t) => next.delete(`${county}::${t}`));
    } else {
      next.add(county);
    }
    onChange(next);
  }

  function toggleTown(county: string, town: string) {
    const key = `${county}::${town}`;
    const next = new Set(selected);
    if (next.has(key)) next.delete(key); else next.add(key);
    onChange(next);
  }

  function toggleExpand(county: string) {
    const next = new Set(expanded);
    if (next.has(county)) next.delete(county); else next.add(county);
    setExpanded(next);
  }

  const visible = search ? ALL_COUNTIES.filter((c) => c.toLowerCase().includes(search.toLowerCase())) : ALL_COUNTIES;
  const selectedCount = ALL_COUNTIES.filter((c) => selected.has(c)).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-slate-900 dark:text-white">
            Delivery Counties ({selectedCount} / 47 selected)
          </span>
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={() => onChange(selectedCount === 47 ? new Set() : new Set(ALL_COUNTIES))}>
          {selectedCount === 47 ? "Deselect All" : "Select All"}
        </Button>
      </div>
      <input
        className="w-full h-9 pl-3 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        placeholder="Search counties…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="border border-slate-200 dark:border-slate-700 rounded-xl max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
        {visible.map((county) => {
          const isExp = expanded.has(county);
          const checked = selected.has(county);
          return (
            <div key={county}>
              <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <Checkbox id={`c-${county}`} checked={checked} onCheckedChange={() => toggleCounty(county)} />
                <label htmlFor={`c-${county}`} className="flex-1 text-sm font-medium text-slate-800 dark:text-slate-200 cursor-pointer">{county}</label>
                <button type="button" onClick={() => toggleExpand(county)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded">
                  {isExp ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>
              </div>
              {isExp && (
                <div className="ml-10 pb-2 space-y-1 border-l-2 border-slate-100 dark:border-slate-700 pl-3 pr-4">
                  {KENYA_COUNTIES[county].map((town) => {
                    const key = `${county}::${town}`;
                    return (
                      <div key={town} className="flex items-center gap-2.5 py-1">
                        <Checkbox id={key} checked={selected.has(key)} onCheckedChange={() => toggleTown(county, town)} />
                        <label htmlFor={key} className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer">{town}</label>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function SupplierSettingsPage() {
  const [userProfile, setUserProfile] = useState<UserProfile>(null);
  const [supplierProfile, setSupplierProfile] = useState<SupplierProfile>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [storePhone, setStorePhone] = useState("");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");

  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const pwdStrength = getPasswordStrength(newPwd);

  const [notifPrefs, setNotifPrefs] = useState<NotifPrefs | null>(null);
  const [savedPrefs, setSavedPrefs] = useState<NotifPrefs | null>(null);
  const [loadingPrefs, setLoadingPrefs] = useState(true);

  const [activity, setActivity] = useState<Activity>([]);
  const [loadingActivity, setLoadingActivity] = useState(true);

  const [shippingFee, setShippingFee] = useState("200");
  const [freeThreshold, setFreeThreshold] = useState("5000");
  const [deliveryDays, setDeliveryDays] = useState("2-5 business days");
  const [deliveryCounties, setDeliveryCounties] = useState<Set<string>>(new Set());

  const [isPendingStore, startStoreTransition] = useTransition();
  const [isPendingPwd, startPwdTransition] = useTransition();
  const [isPendingPrefs, startPrefsTransition] = useTransition();
  const [isPendingShip, startShipTransition] = useTransition();

  useEffect(() => {
    Promise.all([getUserProfile(), getSupplierProfile()])
      .then(([user, supplier]) => {
        setUserProfile(user);
        if (supplier) {
          setSupplierProfile(supplier);
          setCompanyName(supplier.companyName ?? "");
          setDescription(supplier.description ?? "");
          setStorePhone(supplier.phone ?? "");
          setAddress(supplier.address ?? "");
          setWebsite(supplier.website ?? "");
          const s = supplier.shippingSettings as any;
          if (s) {
            if (s.shippingFee != null) setShippingFee(String(s.shippingFee));
            if (s.freeShippingThreshold != null) setFreeThreshold(String(s.freeShippingThreshold));
            if (s.deliveryDays) setDeliveryDays(s.deliveryDays);
            if (Array.isArray(s.deliveryCounties)) setDeliveryCounties(new Set(s.deliveryCounties));
          }
        }
        setAvatarUrl(user?.image ?? null);
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

  function togglePref(key: string, value: boolean) {
    if (!notifPrefs) return;
    setNotifPrefs({ ...notifPrefs, [key]: value } as NotifPrefs);
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
        setNotifPrefs(savedPrefs);
        toast.error(e instanceof Error ? e.message : "Failed to save preferences");
      }
    });
  }

  function saveStore() {
    startStoreTransition(async () => {
      try {
        await updateSupplierProfile({ companyName, description, phone: storePhone, address, website });
        toast.success("Store profile updated");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to update store");
      }
    });
  }

  function savePassword() {
    if (newPwd !== confirmPwd) { toast.error("Passwords do not match"); return; }
    if (newPwd.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    startPwdTransition(async () => {
      try {
        await updatePassword(currentPwd, newPwd);
        toast.success("Password updated");
        setCurrentPwd(""); setNewPwd(""); setConfirmPwd("");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to update password");
      }
    });
  }

  const initials = companyName.split(" ").filter(Boolean).slice(0, 2).map((w: string) => w[0].toUpperCase()).join("") || "S";
  const prefsIsDirty = notifPrefs && savedPrefs && JSON.stringify(notifPrefs) !== JSON.stringify(savedPrefs);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Manage your store and account settings</p>
      </div>

      <Tabs defaultValue="store">
        <TabsList className="mb-6">
          <TabsTrigger value="store"><Store className="w-4 h-4 mr-1.5" /> Store</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="w-4 h-4 mr-1.5" /> Notifications</TabsTrigger>
          <TabsTrigger value="shipping"><Truck className="w-4 h-4 mr-1.5" /> Shipping</TabsTrigger>
          <TabsTrigger value="security"><Shield className="w-4 h-4 mr-1.5" /> Security</TabsTrigger>
        </TabsList>

        <TabsContent value="store">
          <Card>
            <CardHeader><CardTitle>Store Profile</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              {loadingProfile ? (
                <div className="flex items-center gap-3 py-4"><Loader2 className="w-5 h-5 animate-spin text-green-600" /><span className="text-sm text-slate-500">Loading…</span></div>
              ) : (
                <>
                  <div className="flex items-center gap-4">
                    <AvatarUploadDialog currentImage={avatarUrl} initials={initials} onAvatarChange={(url) => setAvatarUrl(url)} />
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{companyName || "Your Store"}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{userProfile?.email}</p>
                      {supplierProfile?.isVerified ? (
                        <Badge className="mt-1 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Verified Supplier</Badge>
                      ) : (
                        <Badge variant="warning" className="mt-1 text-xs">Pending Verification</Badge>
                      )}
                    </div>
                  </div>
                  <Separator />
                  <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
                    <div className="space-y-1.5 sm:col-span-2"><Label>Store Name *</Label><Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Your company name" /></div>
                    <div className="space-y-1.5 sm:col-span-2"><Label>Description</Label><Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description of your store" /></div>
                    <div className="space-y-1.5"><Label>Store Phone</Label><Input value={storePhone} onChange={(e) => setStorePhone(e.target.value)} placeholder="+254 700 000 000" /></div>
                    <div className="space-y-1.5"><Label>Website</Label><Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://..." /></div>
                    <div className="space-y-1.5 sm:col-span-2"><Label>Physical Address</Label><Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Town, County" /></div>
                  </div>
                  <Button onClick={saveStore} disabled={isPendingStore} className="bg-green-600 hover:bg-green-700 text-white">
                    {isPendingStore ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving…</> : <><Save className="w-4 h-4 mr-2" />Save Store</>}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader><CardTitle>Notification Preferences</CardTitle><CardDescription>Choose which notifications you receive</CardDescription></CardHeader>
            <CardContent>
              {loadingPrefs ? (
                <div className="flex items-center gap-3 py-4"><Loader2 className="w-5 h-5 animate-spin text-green-600" /><span className="text-sm text-slate-500">Loading…</span></div>
              ) : (
                <>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">Channels</p>
                  <div className="space-y-3 mb-6">
                    {[
                      { key: "emailEnabled", label: "Email Notifications", desc: "Receive updates via email" },
                      { key: "smsEnabled", label: "SMS Notifications", desc: "Receive SMS alerts for critical events" },
                      { key: "pushEnabled", label: "Push Notifications", desc: "Browser and mobile push alerts" },
                    ].map(({ key, label, desc }) => (
                      <div key={key} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                        <div><p className="text-sm font-medium text-slate-900 dark:text-white">{label}</p><p className="text-xs text-slate-500 dark:text-slate-400">{desc}</p></div>
                        <Switch checked={(notifPrefs as any)?.[key] ?? false} onCheckedChange={(v) => togglePref(key, v)} />
                      </div>
                    ))}
                  </div>
                  <Separator className="my-4" />
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">Alert Types</p>
                  <div className="space-y-3">
                    {[
                      { key: "marketplaceAlerts", label: "Orders & Sales", desc: "New orders, confirmations, and payout updates" },
                      { key: "weatherAlerts", label: "Weather Alerts", desc: "Weather events affecting your delivery areas" },
                      { key: "diagnosticAlerts", label: "System Alerts", desc: "Account security and service status" },
                    ].map(({ key, label, desc }) => (
                      <div key={key} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                        <div><p className="text-sm font-medium text-slate-900 dark:text-white">{label}</p><p className="text-xs text-slate-500 dark:text-slate-400">{desc}</p></div>
                        <Switch checked={(notifPrefs as any)?.[key] ?? false} onCheckedChange={(v) => togglePref(key, v)} />
                      </div>
                    ))}
                  </div>
                  <Button className="mt-6 bg-green-600 hover:bg-green-700 text-white" onClick={saveNotifPrefs} disabled={isPendingPrefs || !prefsIsDirty}>
                    {isPendingPrefs ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving…</> : <><Save className="w-4 h-4 mr-2" />Save Preferences</>}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipping">
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Shipping Rates</CardTitle><CardDescription>Configure delivery fees and lead times</CardDescription></CardHeader>
              <CardContent className="space-y-4 max-w-2xl">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5"><Label>Default Shipping Fee (KES)</Label><Input type="number" min={0} value={shippingFee} onChange={(e) => setShippingFee(e.target.value)} /></div>
                  <div className="space-y-1.5"><Label>Free Shipping Threshold (KES)</Label><Input type="number" min={0} value={freeThreshold} onChange={(e) => setFreeThreshold(e.target.value)} /><p className="text-xs text-slate-400">Orders above this get free shipping</p></div>
                </div>
                <div className="space-y-1.5"><Label>Estimated Delivery Time</Label><Input value={deliveryDays} onChange={(e) => setDeliveryDays(e.target.value)} placeholder="e.g. 2-5 business days" /></div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Delivery Coverage</CardTitle><CardDescription>Select counties you deliver to. Expand to specify individual towns.</CardDescription></CardHeader>
              <CardContent>
                <CountyChecklist selected={deliveryCounties} onChange={setDeliveryCounties} />
              </CardContent>
            </Card>
            <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => {
              startShipTransition(async () => {
                const res = await saveSupplierShipping({
                  shippingFee: Number(shippingFee) || 0,
                  freeShippingThreshold: Number(freeThreshold) || 0,
                  deliveryDays: deliveryDays,
                  deliveryCounties: Array.from(deliveryCounties),
                });
                if (res?.error) toast.error(res.error);
                else toast.success("Shipping settings saved!");
              });
            }} disabled={isPendingShip}>
              {isPendingShip ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving…</> : <><Save className="w-4 h-4 mr-2" /> Save Shipping Settings</>}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="space-y-6">
            {/* Change Password */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Lock className="w-5 h-5 text-green-600" />Change Password</CardTitle>
                <CardDescription>Use a strong password with uppercase, numbers and symbols.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 max-w-md">
                <div className="space-y-1.5">
                  <Label>Current Password</Label>
                  <div className="relative">
                    <Input type={showCurrent ? "text" : "password"} value={currentPwd} onChange={(e) => setCurrentPwd(e.target.value)} className="pr-10" />
                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" onClick={() => setShowCurrent((v) => !v)}>
                      {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>New Password</Label>
                  <div className="relative">
                    <Input type={showNew ? "text" : "password"} value={newPwd} onChange={(e) => setNewPwd(e.target.value)} className="pr-10" />
                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" onClick={() => setShowNew((v) => !v)}>
                      {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {newPwd && (
                    <div className="space-y-1">
                      <div className="flex gap-1">{[1,2,3,4,5].map((i) => (<div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= pwdStrength.score ? pwdStrength.color : "bg-slate-200 dark:bg-slate-700"}`} />))}</div>
                      {pwdStrength.label && <p className="text-xs text-slate-500">Strength: <span className="font-semibold">{pwdStrength.label}</span></p>}
                    </div>
                  )}
                  <ul className="text-xs text-slate-400 space-y-0.5 pt-1">
                    {([
                      [newPwd.length >= 8, "At least 8 characters"],
                      [/[A-Z]/.test(newPwd), "One uppercase letter"],
                      [/[0-9]/.test(newPwd), "One number"],
                      [/[^A-Za-z0-9]/.test(newPwd), "One special character"],
                    ] as [boolean, string][]).map(([ok, text], i) => (
                      <li key={i} className={`flex items-center gap-1.5 ${newPwd ? (ok ? "text-green-600" : "text-slate-400") : "text-slate-300 dark:text-slate-600"}`}>
                        {newPwd ? (ok ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />) : <div className="w-3 h-3 rounded-full border border-current opacity-40" />}
                        {text}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-1.5">
                  <Label>Confirm New Password</Label>
                  <div className="relative">
                    <Input type={showConfirm ? "text" : "password"} value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} className="pr-10" />
                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" onClick={() => setShowConfirm((v) => !v)}>
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirmPwd && newPwd !== confirmPwd && <p className="flex items-center gap-1 text-xs text-red-500"><XCircle className="w-3.5 h-3.5" />Passwords do not match</p>}
                  {confirmPwd && newPwd === confirmPwd && newPwd && <p className="flex items-center gap-1 text-xs text-green-600"><CheckCircle2 className="w-3.5 h-3.5" />Passwords match</p>}
                </div>
                <Button onClick={savePassword} disabled={isPendingPwd || !currentPwd || !newPwd || !confirmPwd || newPwd !== confirmPwd} className="bg-green-600 hover:bg-green-700 text-white">
                  {isPendingPwd ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Updating…</> : <><Shield className="w-4 h-4 mr-2" />Update Password</>}
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5 text-slate-500" />Recent Account Activity</CardTitle>
                  <CardDescription>Last 10 actions on your account</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => { setLoadingActivity(true); getRecentActivity().then(setActivity).finally(() => setLoadingActivity(false)); }} disabled={loadingActivity}>
                  <RefreshCw className={`w-4 h-4 mr-1.5 ${loadingActivity ? "animate-spin" : ""}`} />Refresh
                </Button>
              </CardHeader>
              <CardContent>
                {loadingActivity ? (
                  <div className="flex items-center gap-3 py-4"><Loader2 className="w-5 h-5 animate-spin text-green-600" /><span className="text-sm text-slate-500">Loading activity…</span></div>
                ) : activity.length === 0 ? (
                  <div className="text-center py-8">
                    <Monitor className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">No activity recorded yet.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {activity.map((a) => {
                      const isSecurity = a.action?.includes("PASSWORD") || a.action?.includes("LOGIN") || a.action?.includes("AUTH");
                      return (
                        <div key={a.id} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                          <div className={`mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isSecurity ? "bg-amber-100 dark:bg-amber-900/30" : "bg-green-100 dark:bg-green-900/30"}`}>
                            {isSecurity ? <Shield className="w-3.5 h-3.5 text-amber-600" /> : <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                              {a.action?.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c: string) => c.toUpperCase())}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                              <span className="text-xs text-slate-400 flex items-center gap-1"><Monitor className="w-3 h-3" /> {formatUA(a.userAgent)}</span>
                              {a.ipAddress && <span className="text-xs text-slate-400">· {a.ipAddress}</span>}
                            </div>
                          </div>
                          <span className="text-xs text-slate-400 shrink-0 flex items-center gap-1"><Clock className="w-3 h-3" /> {timeAgo(a.createdAt)}</span>
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
                <CardTitle className="flex items-center gap-2"><Monitor className="w-5 h-5 text-blue-600" />Two-Factor Authentication</CardTitle>
                <CardDescription>Add an extra layer of security to your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                      <Phone className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white text-sm">SMS 2FA</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Require a code texted to {storePhone || userProfile?.phone || "your phone"} on login</p>
                    </div>
                  </div>
                  <Badge variant="warning" className="text-xs">Coming Soon</Badge>
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
