"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Building2, Bell, Shield, CreditCard } from "lucide-react";

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
        <p className="text-xs text-slate-500">{description}</p>
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Settings</h1>
        <p className="text-sm text-slate-500">Manage your lending institution preferences</p>
      </div>

      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === id ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label>Institution Name</Label><Input defaultValue="Equity Agri Finance" /></div>
              <div className="space-y-1.5"><Label>License Number</Label><Input defaultValue="CBK/DFI/023" /></div>
              <div className="space-y-1.5"><Label>Contact Email</Label><Input defaultValue="agri@equitybank.co.ke" /></div>
              <div className="space-y-1.5"><Label>Phone Number</Label><Input defaultValue="+254 763 000 000" /></div>
              <div className="space-y-1.5 sm:col-span-2"><Label>Physical Address</Label><Input defaultValue="Equity Centre, Upperhill, Nairobi" /></div>
              <div className="space-y-1.5"><Label>Min. Loan Amount (KES)</Label><Input type="number" defaultValue="10000" /></div>
              <div className="space-y-1.5"><Label>Max. Loan Amount (KES)</Label><Input type="number" defaultValue="5000000" /></div>
              <div className="space-y-1.5"><Label>Base Interest Rate (%)</Label><Input type="number" defaultValue="10.5" /></div>
              <div className="space-y-1.5"><Label>Max. Loan Tenure (months)</Label><Input type="number" defaultValue="36" /></div>
            </div>
            <Button className="bg-green-600 hover:bg-green-700 text-white"><Save className="w-4 h-4 mr-2" /> Save Changes</Button>
          </CardContent>
        </Card>
      )}

      {activeTab === "notifications" && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              <Toggle label="New Loan Applications" description="Alert when new applications are submitted" defaultChecked />
              <Toggle label="Overdue Payment Alerts" description="Notify when a borrower misses a payment" defaultChecked />
              <Toggle label="Application Approvals" description="Confirm when AI auto-approves a loan" defaultChecked />
              <Toggle label="Credit Score Changes" description="Alert when a borrower credit score changes significantly" />
              <Toggle label="Weather Risk Alerts" description="Regional weather risk notifications for portfolio" defaultChecked />
              <Toggle label="Portfolio Reports" description="Weekly portfolio performance digest" />
              <Toggle label="Yield Forecast Updates" description="When new yield forecasts are generated" />
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
              <div className="space-y-1.5"><Label>Current Password</Label><Input type="password" placeholder="••••••••" /></div>
              <div className="space-y-1.5"><Label>New Password</Label><Input type="password" placeholder="••••••••" /></div>
              <div className="space-y-1.5"><Label>Confirm New Password</Label><Input type="password" placeholder="••••••••" /></div>
              <Button className="bg-green-600 hover:bg-green-700 text-white"><Save className="w-4 h-4 mr-2" /> Update Password</Button>
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
              <div className="space-y-0">
                <Toggle label="M-Pesa Direct" description="Disburse loans via M-Pesa mobile money" defaultChecked />
                <Toggle label="Bank Transfer" description="Disburse via EFT/RTGS to farmer bank accounts" defaultChecked />
                <Toggle label="Agrovet Vouchers" description="Disburse as redeemable input vouchers via partner agrovets" />
              </div>
            </div>
            <Button className="bg-green-600 hover:bg-green-700 text-white"><Save className="w-4 h-4 mr-2" /> Save Banking Details</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
