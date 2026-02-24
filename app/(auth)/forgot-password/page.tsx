"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { toast.error("Please enter your email"); return; }
    setLoading(true);
    try {
      // Attempt to call a backend endpoint. If missing, we still provide UX.
      const res = await fetch("/api/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        toast.error(json?.error || "Unable to send reset link");
      } else {
        toast.success("If that email exists, a reset link has been sent.");
        router.push("/login");
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Forgot your password?</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Enter your email and we&apos;ll send reset instructions.</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="email">Email address</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>

        <div className="flex items-center gap-2">
          <Button type="submit" loading={loading} className="flex-1">Send reset link</Button>
          <Link href="/login" className="text-sm text-slate-500 hover:underline">Back to Sign in</Link>
        </div>
      </form>

      <p className="text-xs text-slate-500 mt-6">Don&apos;t have an account? <Link href="/register" className="text-green-600 hover:underline">Create one</Link></p>
    </div>
  );
}
