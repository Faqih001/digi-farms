"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";

const roles = [
  { value: "FARMER", emoji: "🌾", label: "Farmer", desc: "Buy inputs, diagnostics, sell produce" },
  { value: "SUPPLIER", emoji: "🏪", label: "Supplier / Agrovet", desc: "Sell agri-inputs and products" },
  { value: "LENDER", emoji: "🏦", label: "Lender / Insurer", desc: "Provide agri-financing" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>("FARMER");

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "FARMER" },
  });

  const onSubmit = async (data: RegisterInput) => {
    if (!agreed) { toast.error("Please agree to the Terms of Service"); return; }
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          name: `${data.firstName} ${data.lastName}`.trim(),
        }),
      });
      const json = await res.json();
      if (!res.ok) { toast.error(json.error || "Registration failed"); return; }
      toast.success("Account created! Please sign in.");
      router.push("/login");
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setValue("role", role as RegisterInput["role"]);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Create your account</h1>
        <p className="text-slate-500 dark:text-slate-400">Join 50,000+ farmers transforming agriculture</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Role Selection */}
        <div className="space-y-2">
          <Label>I am a...</Label>
          <div className="grid grid-cols-3 gap-2">
            {roles.map(({ value, emoji, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => handleRoleSelect(value)}
                className={`flex flex-col items-center p-3 rounded-xl border-2 text-center transition-all ${
                  selectedRole === value
                    ? "border-green-500 bg-green-50 dark:bg-green-950/30"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                }`}
              >
                <span className="text-xl mb-1">{emoji}</span>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{label}</span>
              </button>
            ))}
          </div>
          <input type="hidden" {...register("role")} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="firstName">First Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input id="firstName" className="pl-10" placeholder="John" {...register("firstName")} aria-invalid={!!errors.firstName} />
            </div>
            {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" placeholder="Kamau" {...register("lastName")} aria-invalid={!!errors.lastName} />
            {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input id="email" type="email" className="pl-10" placeholder="you@example.com" {...register("email")} aria-invalid={!!errors.email} />
          </div>
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" type="tel" placeholder="+254 700 000 000" {...register("phone")} aria-invalid={!!errors.phone} />
          {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input id="password" type={showPassword ? "text" : "password"} className="pl-10 pr-10" placeholder="Min 8 chars, 1 uppercase, 1 number" {...register("password")} aria-invalid={!!errors.password} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-400">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input id="confirmPassword" type="password" placeholder="Repeat password" {...register("confirmPassword")} aria-invalid={!!errors.confirmPassword} />
          {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
        </div>

        <div className="flex items-start gap-2">
          <Checkbox id="terms" checked={agreed} onCheckedChange={(v) => setAgreed(!!v)} className="mt-0.5" />
          <Label htmlFor="terms" className="font-normal text-sm leading-relaxed cursor-pointer">
            I agree to the{" "}
            <Link href="/terms" className="text-green-600 hover:underline">Terms of Service</Link>
            {" "}and{" "}
            <Link href="/privacy" className="text-green-600 hover:underline">Privacy Policy</Link>
          </Label>
        </div>

        <Button type="submit" loading={isSubmitting} className="w-full" size="lg">
          Create Account — It&apos;s Free
        </Button>
      </form>

      <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-green-600 font-semibold hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
