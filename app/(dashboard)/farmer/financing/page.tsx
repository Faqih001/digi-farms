import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { TrendingUp, Shield, ArrowRight, Star, CheckCircle, RefreshCw } from "lucide-react";
import { getCreditScore } from "@/lib/actions/credit-score";

function scoreColor(score: number) {
  if (score >= 750) return "text-green-600";
  if (score >= 700) return "text-emerald-600";
  if (score >= 650) return "text-blue-600";
  if (score >= 600) return "text-amber-600";
  return "text-red-600";
}
function scoreBadge(riskLevel: string): "success" | "info" | "warning" | "destructive" | "secondary" {
  if (riskLevel === "Excellent" || riskLevel === "Very Good") return "success";
  if (riskLevel === "Good") return "info";
  if (riskLevel === "Fair") return "warning";
  return "destructive";
}

export default async function FinancingProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  let credit;
  try {
    credit = await getCreditScore();
  } catch {
    redirect("/login");
  }

  const breakdown = [
    { label: "Farm Data Completeness",  score: credit.factors.farmCompleteness,   weight: "20%" },
    { label: "Diagnostic Activity",     score: credit.factors.diagnosticActivity, weight: "20%" },
    { label: "Payment History",         score: credit.factors.paymentHistory,     weight: "25%" },
    { label: "Yield Performance",       score: credit.factors.yieldPerformance,   weight: "20%" },
    { label: "Subscription Status",     score: credit.factors.subscriptionStatus, weight: "15%" },
  ];

  const tips = [
    { done: credit.factors.farmCompleteness >= 80,      tip: "Complete your farm profile (name, location, size, soil type)" },
    { done: credit.factors.diagnosticActivity >= 60,    tip: "Run at least 3 crop diagnostics in the last 90 days" },
    { done: credit.factors.paymentHistory >= 90,        tip: "Repay existing loans on time" },
    { done: credit.factors.yieldPerformance >= 70,      tip: "Achieve 90%+ of expected crop yields" },
    { done: credit.factors.subscriptionStatus === 100,  tip: "Maintain an active DIGI-FARMS subscription" },
  ];

  const lastUpdated = new Date(credit.calculatedAt).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Financing Profile</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Your agri-credit score and financing eligibility</p>
        </div>
        <form action="/farmer/financing">
          <Button type="submit" variant="outline" size="sm">
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh Score
          </Button>
        </form>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Score Card */}
        <Card className="lg:col-span-1 text-center p-6">
          <CardContent className="p-0">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto mb-4">
              <Star className="w-10 h-10 text-white" />
            </div>
            <div className={`text-5xl font-black mb-1 ${scoreColor(credit.score)}`}>{credit.score}</div>
            <div className="text-slate-500 dark:text-slate-400 text-sm mb-3">DIGI-FARMS Credit Score</div>
            <Badge variant={scoreBadge(credit.riskLevel)} className="mb-4">{credit.riskLevel}</Badge>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Score Range</span>
                <span className="font-semibold">300–850</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Last Updated</span>
                <span className="font-semibold">{lastUpdated}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Max Loan Eligible</span>
                <span className={`font-semibold ${scoreColor(credit.score)}`}>
                  KES {credit.maxLoanEligible.toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Score Breakdown */}
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Score Breakdown</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {breakdown.map(({ label, score, weight }) => (
              <div key={label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-slate-600 dark:text-slate-400">{label} <span className="text-xs text-slate-400">(weight {weight})</span></span>
                  <span className="font-semibold text-slate-900 dark:text-white">{Math.round(score)}/100</span>
                </div>
                <Progress value={score} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Loan Eligibility + Insurance */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/10 border-blue-200 dark:border-blue-900">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span className="font-bold text-blue-800 dark:text-blue-300">Loan Eligibility</span>
            </div>
            <div className="text-3xl font-black text-blue-700 dark:text-blue-300 mb-1">
              KES {credit.maxLoanEligible.toLocaleString()}
            </div>
            <p className="text-blue-600/80 dark:text-blue-400/80 text-sm mb-4">Maximum loan amount at competitive rates</p>
            <Button asChild><Link href="/farmer/loans">Apply for Loan <ArrowRight className="w-4 h-4" /></Link></Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/10 border-green-200 dark:border-green-900">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="font-bold text-green-800 dark:text-green-300">Insurance</span>
            </div>
            <div className="text-3xl font-black text-green-700 dark:text-green-300 mb-1">
              {credit.score >= 600 ? "Eligible" : "Limited"}
            </div>
            <p className="text-green-600/80 dark:text-green-400/80 text-sm mb-4">
              {credit.score >= 600 ? "Crop insurance up to KES 500,000 coverage" : "Improve your score to access full insurance benefits"}
            </p>
            <Button variant="earth" asChild><Link href="/farmer/insurance">View Plans <ArrowRight className="w-4 h-4" /></Link></Button>
          </CardContent>
        </Card>
      </div>

      {/* Improvement Tips */}
      <Card>
        <CardHeader><CardTitle className="text-base">Improve Your Score</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {tips.map(({ done, tip }) => (
            <div key={tip} className="flex items-center gap-3 text-sm">
              <CheckCircle className={`w-4 h-4 flex-shrink-0 ${done ? "text-green-500" : "text-slate-300 dark:text-slate-600"}`} />
              <span className={done ? "text-slate-500 dark:text-slate-400 line-through" : "text-slate-700 dark:text-slate-300"}>{tip}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
