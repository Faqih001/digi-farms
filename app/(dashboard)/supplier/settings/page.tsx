"use client";

import { useState, useTransition, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Store, Bell, Truck, Save, Shield, Loader2 } from "lucide-react";
import { getUserProfile, updateUserProfile, updatePassword, updateSupplierProfile, getSupplierProfile } from "@/lib/actions/user";

type UserProfile = Awaited<ReturnType<typeof getUserProfile>>;
type SupplierProfile = Awaited<ReturnType<typeof getSupplierProfile>>;

export default function SupplierSettingsPage() {
  const [userProfile, setUserProfile] = useState<UserProfile>(null);
  const [supplierProfile, setSupplierProfile] = useState<SupplierProfile>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Store form
  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [storePhone, setStorePhone] = useState("");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");

  // Password form
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  const [notifications, setNotifications] = useState({ orders: true, reviews: true, payouts: true, stock: true });

  const [isPendingStore, startStoreTransition] = useTransition();
  const [isPendingPwd, startPwdTransition] = useTransition();

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
        }
      })
      .catch(() => toast.error("Failed to load profile"))
      .finally(() => setLoadingProfile(false));
  }, []);

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

  const initials = companyName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w: any) => w[0].toUpperCase())
    .join("") || "S";

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
                <div className="flex items-center gap-3 py-4">
                  <Loader2 className="w-5 h-5 animate-spin text-green-600" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">Loading…</span>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4">
                    <Avatar className="w-20 h-20">
                      <AvatarFallback className="text-xl bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">{initials}</AvatarFallback>
                    </Avatar>
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
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label>Store Name *</Label>
                      <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Your company name" />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label>Description</Label>
                      <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description of your store" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Store Phone</Label>
                      <Input value={storePhone} onChange={(e) => setStorePhone(e.target.value)} placeholder="+254 700 000 000" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Website</Label>
                      <Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://..." />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label>Physical Address</Label>
                      <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Town, County" />
                    </div>
                  </div>
                  <Button onClick={saveStore} disabled={isPendingStore} className="bg-green-600 hover:bg-green-700 text-white">
                    {isPendingStore ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving…</> : <><Save className="w-4 h-4 mr-2" /> Save Store</>}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader><CardTitle>Notification Preferences</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { key: "orders", label: "New Orders", desc: "Get notified when you receive a new order" },
                  { key: "reviews", label: "Customer Reviews", desc: "Get notified when a customer leaves a review" },
                  { key: "payouts", label: "Payout Updates", desc: "Get notified about payout status changes" },
                  { key: "stock", label: "Low Stock Alerts", desc: "Get notified when products are running low" },
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
              <Button className="mt-4 bg-green-600 hover:bg-green-700 text-white" onClick={() => toast.success("Notification preferences saved")}>
                <Save className="w-4 h-4 mr-2" /> Save
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipping">
          <Card>
            <CardHeader><CardTitle>Shipping Configuration</CardTitle></CardHeader>
            <CardContent className="space-y-4 max-w-2xl">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Default Shipping Fee (KES)</Label>
                  <Input type="number" defaultValue="200" />
                </div>
                <div className="space-y-1.5">
                  <Label>Free Shipping Threshold (KES)</Label>
                  <Input type="number" defaultValue="5000" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Delivery Areas</Label>
                <Input defaultValue="Nakuru, Naivasha, Gilgil" />
                <p className="text-xs text-slate-400">Comma-separated list of delivery areas</p>
              </div>
              <div className="space-y-1.5">
                <Label>Estimated Delivery Time</Label>
                <Input defaultValue="2-5 business days" />
              </div>
              <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => toast.success("Shipping settings saved")}>
                <Save className="w-4 h-4 mr-2" /> Save
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader><CardTitle>Change Password</CardTitle></CardHeader>
            <CardContent className="space-y-4 max-w-md">
              <div className="space-y-1.5">
                <Label>Current Password</Label>
                <Input type="password" value={currentPwd} onChange={(e) => setCurrentPwd(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>New Password</Label>
                <Input type="password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Confirm New Password</Label>
                <Input type="password" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} />
                {confirmPwd && newPwd !== confirmPwd && <p className="text-xs text-red-500">Passwords do not match</p>}
              </div>
              <Button onClick={savePassword} disabled={isPendingPwd || !currentPwd || !newPwd} className="bg-green-600 hover:bg-green-700 text-white">
                {isPendingPwd ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating…</> : "Update Password"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
