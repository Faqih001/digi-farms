import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wallet, Clock, CheckCircle, DollarSign, ArrowRight, Calendar, CreditCard } from "lucide-react";

const payouts = [
  { id: "PAY-201", amount: "KES 45,000", method: "M-Pesa", status: "Completed", date: "Feb 20, 2026", reference: "QK7X9...B2M4" },
  { id: "PAY-200", amount: "KES 38,000", method: "M-Pesa", status: "Completed", date: "Feb 13, 2026", reference: "LM3R6...P8K2" },
  { id: "PAY-199", amount: "KES 52,000", method: "Bank Transfer", status: "Completed", date: "Feb 6, 2026", reference: "TX8W4...N5J1" },
  { id: "PAY-198", amount: "KES 41,000", method: "M-Pesa", status: "Completed", date: "Jan 30, 2026", reference: "RH2Y7...D9F3" },
  { id: "PAY-202", amount: "KES 82,000", method: "M-Pesa", status: "Pending", date: "Feb 27, 2026", reference: "—" },
];

export default function PayoutsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Payouts</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Track your withdrawal history and upcoming payouts</p>
        </div>
        <Button><Wallet className="w-4 h-4" /> Request Payout</Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Available Balance", value: "KES 82,000", icon: Wallet, color: "text-green-600 bg-green-100 dark:bg-green-900/30" },
          { label: "Pending Payout", value: "KES 82,000", icon: Clock, color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30" },
          { label: "This Month", value: "KES 83,000", icon: DollarSign, color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30" },
          { label: "Lifetime Payouts", value: "KES 1.8M", icon: CheckCircle, color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30" },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}><Icon className="w-5 h-5" /></div>
                <div><p className="text-xs text-slate-500 dark:text-slate-400">{label}</p><p className="text-lg font-bold text-slate-900 dark:text-white">{value}</p></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Next Payout */}
      <Card className="border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/10">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Next Payout: Feb 27, 2026</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">KES 82,000 via M-Pesa • Auto-scheduled weekly</p>
              </div>
            </div>
            <Badge variant="warning" className="text-sm px-3 py-1">Processing</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Payout History */}
      <Card>
        <CardHeader><CardTitle>Payout History</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {payouts.map((p: any) => (
              <div key={p.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${p.status === "Completed" ? "bg-green-100 dark:bg-green-900/30" : "bg-amber-100 dark:bg-amber-900/30"}`}>
                    {p.status === "Completed" ? <CheckCircle className="w-5 h-5 text-green-600" /> : <Clock className="w-5 h-5 text-amber-600" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-900 dark:text-white">{p.id}</span>
                      <Badge variant={p.status === "Completed" ? "success" : "warning"} className="text-xs">{p.status}</Badge>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{p.method} • {p.reference}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-slate-900 dark:text-white">{p.amount}</p>
                  <p className="text-xs text-slate-400">{p.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payout Settings */}
      <Card>
        <CardHeader><CardTitle>Payout Settings</CardTitle></CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-4 h-4 text-green-600" />
                <span className="font-medium text-sm text-slate-900 dark:text-white">Primary Method</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">M-Pesa: +254 700 *** 456</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-green-600" />
                <span className="font-medium text-sm text-slate-900 dark:text-white">Payout Schedule</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Weekly (Every Thursday)</p>
            </div>
          </div>
          <Button variant="outline" className="mt-4">Edit Payout Settings <ArrowRight className="w-4 h-4" /></Button>
        </CardContent>
      </Card>
    </div>
  );
}
