import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SectionCTAProps {
  badge?: string;
  title: React.ReactNode;
  subtitle?: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export function SectionCTA({
  badge,
  title,
  subtitle,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: SectionCTAProps) {
  return (
    <section className="py-24 gradient-mesh">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        {badge && (
          <Badge className="mb-6 bg-green-600/10 text-green-800 border-green-200 dark:bg-white/20 dark:text-white dark:border-white/30">
            {badge}
          </Badge>
        )}
        <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xl text-slate-600 dark:text-green-200/80 mb-10 leading-relaxed">
            {subtitle}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="hero" size="xl" asChild>
            <Link href={primaryHref}>
              {primaryLabel}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          {secondaryLabel && secondaryHref && (
            <Button variant="hero-outline" size="xl" asChild>
              <Link href={secondaryHref}>{secondaryLabel}</Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
