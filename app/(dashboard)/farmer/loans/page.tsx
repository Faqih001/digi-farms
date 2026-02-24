"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { FileText, Clock, CheckCircle, XCircle, Plus } from "lucide-react";

const loans = [
  { id: "LN001", lender: "Equity Agri Finance", amount: 150000, status: "APPROVED", applied: "Jun 15", approved: "Jun 22", due: "Dec 22", balance: 95000 },
  { id: "LN002", lender: "KCB Kilimo", amount: 50000, status: "PENDING", applied: "Jul 20", approved: null, due: null, balance: 50000 },
];

export default function LoanApplicationsPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Loan Applications</h2>
          <p className="text-slate-500 text-sm">Apply for agricultural financing and track your loans</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}><Plus className="w-4 h-4" /> New Application</Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader><CardTitle className="text-base">New Loan Application</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Loan Amount (KES)</Label>
                <Input type="number" placeholder="50,000" />
              </div>
              <div className="space-y-1.5">
                <Label>Purpose</Label>
                <Input placeholder="e.g., Buy fertilizers, seeds" />
              </div>
              <div className="space-y-1.5">
                <Label>Repayment Period</Label>
                <Input placeholder="6 months" />
              </div>
              <div className="space-y-1.5">
                <Label>Collateral</Label>
                <Input placeholder="Farm title, equipment..." />
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => { toast.success("Application submitted!"); setShowForm(false); }}>Submit Application</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {loans.map(({ id, lender, amount, status, applied, approved, due, balance }) => (
          <Card key={id} className="p-4">
            <CardContent className="p-0">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-900 dark:text-white">{lender}</h3>
                    <Badge variant={status === "APPROVED" ? "success" : status === "PENDING" ? "warning" : status === "REJECTED" ? "destructive" : "secondary"} className="text-xs">{status}</Badge>
                  </div>
                  <div className="text-xs text-slate-400">Ref: {id} · Applied {applied}</div>
                </div>
                <div className="text-right">
                  <div className="font-black text-lg text-slate-900 dark:text-white">KES {amount.toLocaleString()}</div>
                  <div className="text-xs text-slate-400">Balance: KES {balance.toLocaleString()}</div>
                </div>
              </div>
              {status === "APPROVED" && (
                <div className="grid grid-cols-3 gap-3 text-center bg-slate-50 dark:bg-slate-800 rounded-xl p-3 text-xs">
                  <div><div className="text-slate-400">Approved</div><div className="font-semibold">{approved}</div></div>
                  <div><div className="text-slate-400">Due Date</div><div className="font-semibold">{due}</div></div>
                  <div><div className="text-slate-400">Interest</div><div className="font-semibold text-green-600">12% p.a.</div></div>
                </div>
              )}
              {status === "PENDING" && (
                <div className="flex items-center gap-2 text-amber-600 text-xs">
                  <Clock className="w-3.5 h-3.5" /> Under review by lender — typically 3–5 business days
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
