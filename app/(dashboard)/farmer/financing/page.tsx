import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { TrendingUp, Shield, CreditCard, ArrowRight, Star, CheckCircle } from "lucide-react";

export default function FinancingProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Financing Profile</h2>
        <p className="text-slate-500 text-sm">Your agri-credit score and financing eligibility</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 text-center p-6">
          <CardContent className="p-0">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto mb-4">
              <Star className="w-10 h-10 text-white" />
            </div>
            <div className="text-5xl font-black text-green-600 mb-1">742</div>
            <div className="text-slate-500 text-sm mb-3">DIGI-FARMS Credit Score</div>
            <Badge variant="success" className="mb-4">Excellent</Badge>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Score Range</span>
                <span className="font-semibold">300–850</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Last Updated</span>
                <span className="font-semibold">Jul 28, 2025</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Max Loan Eligible</span>
                <span className="font-semibold text-green-600">KES 250,000</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Score Breakdown</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Farm Data Completeness", score: 90, max: 100 },
              { label: "Diagnostic Activity", score: 75, max: 100 },
              { label: "Payment History", score: 95, max: 100 },
              { label: "Yield Performance", score: 68, max: 100 },
              { label: "Subscription Status", score: 100, max: 100 },
            ].map(({ label, score, max }) => (
              <div key={label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-slate-600 dark:text-slate-400">{label}</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{score}/{max}</span>
                </div>
                <Progress value={(score / max) * 100} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/10 border-blue-200 dark:border-blue-900">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span className="font-bold text-blue-800 dark:text-blue-300">Loan Eligibility</span>
            </div>
            <div className="text-3xl font-black text-blue-700 dark:text-blue-300 mb-1">KES 250,000</div>
            <p className="text-blue-600/80 dark:text-blue-400/80 text-sm mb-4">Maximum loan amount at 12% p.a.</p>
            <Button asChild><Link href="/farmer/loans">Apply for Loan <ArrowRight className="w-4 h-4" /></Link></Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/10 border-green-200 dark:border-green-900">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="font-bold text-green-800 dark:text-green-300">Insurance</span>
            </div>
            <div className="text-3xl font-black text-green-700 dark:text-green-300 mb-1">Eligible</div>
            <p className="text-green-600/80 dark:text-green-400/80 text-sm mb-4">Crop insurance up to KES 500,000 coverage</p>
            <Button variant="earth" asChild><Link href="/farmer/insurance">View Plans <ArrowRight className="w-4 h-4" /></Link></Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Improve Your Score</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {[
            { done: true, tip: "Complete your farm profile" },
            { done: true, tip: "Run at least 3 crop diagnostics" },
            { done: false, tip: "Upload soil test results" },
            { done: false, tip: "Link your M-Pesa transaction history" },
            { done: false, tip: "Achieve 90%+ yield forecast accuracy" },
          ].map(({ done, tip }) => (
            <div key={tip} className="flex items-center gap-3 text-sm">
              <CheckCircle className={`w-4 h-4 flex-shrink-0 ${done ? "text-green-500" : "text-slate-300 dark:text-slate-600"}`} />
              <span className={done ? "text-slate-500 line-through" : "text-slate-700 dark:text-slate-300"}>{tip}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
