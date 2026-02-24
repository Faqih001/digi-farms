"use client";

import { useState } from "react";
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
import { User, Bell, Shield, Palette, Globe, Phone, Mail, Save, Camera } from "lucide-react";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true, sms: false, push: true, weather: true, marketplace: true, diagnostics: true,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Settings</h1>
        <p className="text-sm text-slate-500">Manage your account preferences</p>
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
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-xl">JK</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm"><Camera className="w-4 h-4" /> Change Photo</Button>
                  <p className="text-xs text-slate-400 mt-1">JPG, PNG up to 2MB</p>
                </div>
              </div>
              <Separator />
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="John" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Kamau" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="john.farmer@digi-farms.com" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" defaultValue="+254 700 123 456" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="county">County</Label>
                  <Input id="county" defaultValue="Nakuru" />
                </div>
              </div>
              <Button onClick={() => toast.success("Profile updated!")}><Save className="w-4 h-4" /> Save Changes</Button>
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
                  <div className="space-y-4">
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
                            <p className="text-xs text-slate-500">{desc}</p>
                          </div>
                        </div>
                        <Switch
                          checked={notifications[key as keyof typeof notifications]}
                          onCheckedChange={(v) => setNotifications({ ...notifications, [key]: v })}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <Separator />
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Alert Types</h3>
                  <div className="space-y-4">
                    {[
                      { key: "weather", label: "Weather Alerts", desc: "Severe weather & frost warnings" },
                      { key: "marketplace", label: "Marketplace Updates", desc: "New orders & price changes" },
                      { key: "diagnostics", label: "Diagnostic Reports", desc: "AI scan results & recommendations" },
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
                </div>
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
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
                <Button onClick={() => toast.success("Password updated!")}>Update Password</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Two-Factor Authentication</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">SMS 2FA</p>
                    <p className="text-xs text-slate-500">Add extra security with SMS verification</p>
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
                  <Button variant="destructive" size="sm">Delete</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
