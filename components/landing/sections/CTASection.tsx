import Link from "next/link";
import { Sprout, ArrowRight, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-24 bg-[var(--bg-s11)]">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <Badge className="mb-6 bg-white/20 text-white border-white/30 text-sm px-4 py-1.5">
          🚀 Join 50,000+ Farmers
        </Badge>
        <h2 className="text-4xl lg:text-6xl font-black text-white mb-6 leading-tight">
          Ready to Transform <br />
          <span className="text-green-200">Your Farm?</span>
        </h2>
        <p className="text-xl text-green-100/90 mb-10 leading-relaxed">
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
          <Button variant="hero-outline" size="xl" asChild>
            <Link href="/contact">
              <Zap className="w-5 h-5" />
              Book a Demo
            </Link>
          </Button>
        </div>

        <div className="mt-16 pt-10 border-t border-white/20">
          <p className="text-white/80 text-sm mb-4">
            📩 Subscribe to AgriIntelligence Weekly
          </p>
          <form className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 h-12 px-4 rounded-xl bg-white/15 border border-white/30 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 backdrop-blur-sm text-sm"
            />
            <Button variant="hero" size="lg" type="submit">
              Subscribe
            </Button>
          </form>
          <p className="text-white/60 text-xs mt-3">
            Join 28,000+ subscribers. No spam, ever.
          </p>
        </div>
      </div>
    </section>
  );
}
