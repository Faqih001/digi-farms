"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Globe, Bell, Shield, CreditCard, Cpu } from "lucide-react";

const tabs = [
  { id: "general", label: "General", icon: Globe },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "ai", label: "AI Config", icon: Cpu },
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

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Platform Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Global platform configuration and preferences</p>
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

      {activeTab === "general" && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">Platform Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label>Platform Name</Label><Input defaultValue="DIGI-FARMS" /></div>
              <div className="space-y-1.5"><Label>Support Email</Label><Input defaultValue="support@digifarms.co.ke" /></div>
              <div className="space-y-1.5"><Label>HQ Location</Label><Input defaultValue="Nairobi, Kenya" /></div>
              <div className="space-y-1.5"><Label>Default Currency</Label><Input defaultValue="KES" /></div>
              <div className="space-y-1.5"><Label>Marketplace Commission (%)</Label><Input type="number" defaultValue="3.5" /></div>
              <div className="space-y-1.5"><Label>Max File Upload Size (MB)</Label><Input type="number" defaultValue="50" /></div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Platform Toggles</p>
              <Toggle label="Maintenance Mode" description="Temporarily disable platform for maintenance" />
              <Toggle label="New User Registrations" description="Allow new users to register on the platform" defaultChecked />
              <Toggle label="Marketplace Active" description="Enable buying and selling on the marketplace" defaultChecked />
            </div>
            <Button className="bg-green-600 hover:bg-green-700 text-white"><Save className="w-4 h-4 mr-2" /> Save Changes</Button>
          </CardContent>
        </Card>
      )}

      {activeTab === "notifications" && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">Platform Notification Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-0">
            <Toggle label="New User Welcome Emails" description="Send welcome email when users register" defaultChecked />
            <Toggle label="Subscription Expiry Reminders" description="Notify users 7 days before subscription renewal" defaultChecked />
            <Toggle label="Order Status Updates" description="Email users on each order status change" defaultChecked />
            <Toggle label="Loan Application Updates" description="Notify farmers and lenders on loan status changes" defaultChecked />
            <Toggle label="AI Diagnostic Results" description="Send scan results via email and push notification" defaultChecked />
            <Toggle label="System Maintenance Alerts" description="Notify all users before platform maintenance" />
            <Toggle label="Admin Digest Reports" description="Weekly platform summary emails to admins" defaultChecked />
          </CardContent>
        </Card>
      )}

      {activeTab === "security" && (
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold">Security Policies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-0">
              <Toggle label="Enforce 2FA for Admins" description="Require two-factor authentication for all admin accounts" defaultChecked />
              <Toggle label="Enforce 2FA for Lenders" description="Require 2FA for all lender accounts" />
              <Toggle label="Session Timeout (30 min)" description="Auto-logout inactive users after 30 minutes" defaultChecked />
              <Toggle label="Rate Limiting" description="Limit API requests per IP to prevent abuse" defaultChecked />
              <Toggle label="Audit All Admin Actions" description="Log every admin action in the audit trail" defaultChecked />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold">Access Control</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5"><Label>Max Login Attempts</Label><Input type="number" defaultValue="5" /></div>
                <div className="space-y-1.5"><Label>Lockout Duration (minutes)</Label><Input type="number" defaultValue="30" /></div>
              </div>
              <Button className="bg-green-600 hover:bg-green-700 text-white"><Save className="w-4 h-4 mr-2" /> Save Security Settings</Button>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "billing" && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">Billing & Payment Config</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label>M-Pesa Paybill</Label><Input defaultValue="400200" /></div>
              <div className="space-y-1.5"><Label>Stripe Public Key</Label><Input defaultValue="pk_live_••••••••••••" /></div>
              <div className="space-y-1.5"><Label>KES to USD Rate</Label><Input type="number" defaultValue="129.50" /></div>
              <div className="space-y-1.5"><Label>Payout Schedule</Label>
                <select className="h-10 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm">
                  <option>Weekly</option>
                  <option>Bi-weekly</option>
                  <option>Monthly</option>
                </select>
              </div>
            </div>
            <div>
              <Toggle label="Auto Payout to Suppliers" description="Automatically process supplier payouts on schedule" defaultChecked />
              <Toggle label="Require Invoice for Payout" description="Suppliers must upload invoice before payout" />
            </div>
            <Button className="bg-green-600 hover:bg-green-700 text-white"><Save className="w-4 h-4 mr-2" /> Save Billing Config</Button>
          </CardContent>
        </Card>
      )}

      {activeTab === "ai" && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">AI & Machine Learning Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label>Min. Confidence Threshold (%)</Label><Input type="number" defaultValue="70" /></div>
              <div className="space-y-1.5"><Label>AI Scan Daily Limit (Free)</Label><Input type="number" defaultValue="5" /></div>
              <div className="space-y-1.5"><Label>Credit Score Refresh (days)</Label><Input type="number" defaultValue="30" /></div>
              <div className="space-y-1.5"><Label>Yield Forecast Interval</Label>
                <select className="h-10 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm">
                  <option>Weekly</option>
                  <option>Bi-weekly</option>
                  <option>Monthly</option>
                </select>
              </div>
            </div>
            <div>
              <Toggle label="AI Auto-Approve Loans" description="Allow AI to auto-approve loans above 85% confidence score" defaultChecked />
              <Toggle label="Disease Alert Push Notifications" description="Instant alerts when AI detects disease outbreaks in a region" defaultChecked />
              <Toggle label="Collect Training Data" description="Allow anonymized farm data to improve AI model accuracy" defaultChecked />
            </div>
            <Button className="bg-green-600 hover:bg-green-700 text-white"><Save className="w-4 h-4 mr-2" /> Save AI Config</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
