"use client";

import { useState } from "react";
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
import { Store, Bell, Shield, Truck, Save, Camera } from "lucide-react";

export default function SupplierSettingsPage() {
  const [notifications, setNotifications] = useState({ orders: true, reviews: true, payouts: true, stock: true });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Settings</h1>
        <p className="text-sm text-slate-500">Manage your store and account settings</p>
      </div>

      <Tabs defaultValue="store">
        <TabsList className="mb-6">
          <TabsTrigger value="store"><Store className="w-4 h-4 mr-1.5" /> Store</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="w-4 h-4 mr-1.5" /> Notifications</TabsTrigger>
          <TabsTrigger value="shipping"><Truck className="w-4 h-4 mr-1.5" /> Shipping</TabsTrigger>
        </TabsList>

        <TabsContent value="store">
          <Card>
            <CardHeader><CardTitle>Store Profile</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarFallback className="text-xl">WA</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm"><Camera className="w-4 h-4" /> Change Logo</Button>
                  <p className="text-xs text-slate-400 mt-1">Recommended: 200x200px</p>
                </div>
              </div>
              <Separator />
              <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>Store Name</Label>
                  <Input defaultValue="Wanjiku Agro Supplies" />
                </div>
                <div className="space-y-1.5">
                  <Label>Contact Email</Label>
                  <Input type="email" defaultValue="wanjiku.agro@digi-farms.com" />
                </div>
                <div className="space-y-1.5">
                  <Label>Phone</Label>
                  <Input defaultValue="+254 711 234 567" />
                </div>
                <div className="space-y-1.5">
                  <Label>County</Label>
                  <Input defaultValue="Nakuru" />
                </div>
                <div className="space-y-1.5">
                  <Label>Town</Label>
                  <Input defaultValue="Nakuru Town" />
                </div>
              </div>
              <Button onClick={() => toast.success("Store profile updated!")}><Save className="w-4 h-4" /> Save</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader><CardTitle>Notification Preferences</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { key: "orders", label: "New Orders", desc: "Get notified when you receive a new order" },
                  { key: "reviews", label: "Customer Reviews", desc: "Get notified when a customer leaves a review" },
                  { key: "payouts", label: "Payout Updates", desc: "Get notified about payout status changes" },
                  { key: "stock", label: "Low Stock Alerts", desc: "Get notified when products are running low" },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{label}</p>
                      <p className="text-xs text-slate-500">{desc}</p>
                    </div>
                    <Switch
                      checked={notifications[key as keyof typeof notifications]}
                      onCheckedChange={(v) => setNotifications({ ...notifications, [key]: v })}
                    />
                  </div>
                ))}
              </div>
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
                <Input defaultValue="Nakuru, Naivasha, Gilgil, Subukia, Njoro" />
                <p className="text-xs text-slate-400">Comma-separated list of delivery areas</p>
              </div>
              <div className="space-y-1.5">
                <Label>Estimated Delivery Time</Label>
                <Input defaultValue="2-5 business days" />
              </div>
              <Button onClick={() => toast.success("Shipping settings saved!")}><Save className="w-4 h-4" /> Save</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
