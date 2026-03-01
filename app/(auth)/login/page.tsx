"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      toast.error("Invalid email or password. Please try again.");
    } else {
      toast.success("Welcome back!");
      router.push(callbackUrl);
      router.refresh();
    }
  };

  

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Welcome back</h1>
        <p className="text-slate-500 dark:text-slate-400">Sign in to your DIGI-FARMS account</p>
      </div>

      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input id="email" type="email" className="pl-10" placeholder="you@example.com" {...register("email")} aria-invalid={!!errors.email} />
          </div>
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
            <Link href="/forgot-password" className="text-xs text-green-600 hover:underline">Forgot password?</Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input id="password" type={showPassword ? "text" : "password"} className="pl-10 pr-10" placeholder="••••••••" {...register("password")} aria-invalid={!!errors.password} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-400">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
        </div>

        <div className="flex items-center gap-2">
          <Checkbox id="remember" />
          <Label htmlFor="remember" className="font-normal text-sm cursor-pointer">Remember me for 30 days</Label>
        </div>

        <Button type="submit" loading={isSubmitting} className="w-full" size="lg">
          Sign In
        </Button>
      </form>

      <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-green-600 font-semibold hover:underline">Create one free</Link>
      </p>

      <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-900/30">
        <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-2">Demo Accounts</p>
        <div className="space-y-1 text-xs text-amber-600 dark:text-amber-500">
          <p>🌾 Farmer: john.farmer@digi-farms.com / Farmer@123456</p>
          <p>🏪 Supplier: wanjiku.agro@digi-farms.com / Supplier@123456</p>
          <p>🏦 Lender: equity.agri@digi-farms.com / Lender@123456</p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="w-full max-w-md mx-auto animate-pulse" />}>
      <LoginForm />
    </Suspense>
  );
}
