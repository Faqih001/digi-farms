import Link from "next/link";
import { Sprout, ArrowRight, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-24 gradient-mesh">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <Badge className="mb-6 bg-green-600/10 text-green-800 border-green-200 text-sm px-4 py-1.5 dark:bg-white/20 dark:text-white dark:border-white/30">
          🚀 Join 50,000+ Farmers
        </Badge>
        <h2 className="text-4xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
          Ready to Transform <br />
          <span className="text-gradient">Your Farm?</span>
        </h2>
        <p className="text-xl text-slate-600 dark:text-green-200/80 mb-10 leading-relaxed">
          Start your free 14-day trial today. No credit card required. Cancel anytime. Join
          thousands of farmers already using DIGI-FARMS to feed the continent.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="hero" size="xl" asChild>
            <Link href="/register">
              <Sprout className="w-5 h-5" />
              Create Free Account
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button variant="outline" size="xl" asChild>
            <Link href="/contact">
              <Zap className="w-5 h-5" />
              Book a Demo
            </Link>
          </Button>
        </div>

        <div className="mt-16 pt-10 border-t border-slate-200 dark:border-white/20">
          <p className="text-slate-500 dark:text-green-200/60 text-sm mb-4">
            📩 Subscribe to AgriIntelligence Weekly
          </p>
          <form className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 h-12 px-4 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-white/10 dark:border-white/20 dark:text-white dark:placeholder:text-green-200/50 dark:focus:ring-white/30 backdrop-blur-sm text-sm"
            />
            <Button variant="hero" size="lg" type="submit">
              Subscribe
            </Button>
          </form>
          <p className="text-slate-400 dark:text-green-200/40 text-xs mt-3">
            Join 28,000+ subscribers. No spam, ever.
          </p>
        </div>
      </div>
    </section>
  );
}
