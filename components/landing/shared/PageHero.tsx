import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  badge?: string;
  title: React.ReactNode;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  className?: string;
}

export function PageHero({
  badge,
  title,
  subtitle,
  ctaLabel,
  ctaHref,
  secondaryLabel,
  secondaryHref,
  className,
}: PageHeroProps) {
  return (
    <section className={cn("gradient-hero py-24", className)}>
      <div className="container mx-auto px-4 max-w-7xl text-center">
        {badge && (
          <Badge className="mb-6 bg-white/20 text-white border-white/30 dark:bg-white/10 dark:text-white dark:border-white/20">
            {badge}
          </Badge>
        )}
        <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight mb-6">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xl text-green-100/90 max-w-3xl mx-auto mb-10 leading-relaxed">
            {subtitle}
          </p>
        )}
        {(ctaLabel || secondaryLabel) && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {ctaLabel && ctaHref && (
              <Button variant="hero" size="xl" asChild>
                <Link href={ctaHref}>
                  {ctaLabel}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            )}
            {secondaryLabel && secondaryHref && (
              <Button variant="hero-outline" size="xl" asChild>
                <Link href={secondaryHref}>{secondaryLabel}</Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
