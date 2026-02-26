import type { Metadata } from "next";
import { HeroSection } from "@/components/landing/sections/HeroSection";
import { ProblemSection } from "@/components/landing/sections/ProblemSection";
import { SolutionSection } from "@/components/landing/sections/SolutionSection";
import { HowItWorksSection } from "@/components/landing/sections/HowItWorksSection";
import { FeaturesSection } from "@/components/landing/sections/FeaturesSection";
import { MarketplacePreviewSection } from "@/components/landing/sections/MarketplacePreviewSection";
import { AgrovetSection } from "@/components/landing/sections/AgrovetSection";
import { FinancingSection } from "@/components/landing/sections/FinancingSection";
import { ImpactSection } from "@/components/landing/sections/ImpactSection";
import { TestimonialsSection } from "@/components/landing/sections/TestimonialsSection";
import { PartnersSection } from "@/components/landing/sections/PartnersSection";
import { CTASection } from "@/components/landing/sections/CTASection";

export const metadata: Metadata = {
  title: "DIGI-FARMS – Precision Agriculture Platform",
  description:
    "AI-powered precision agriculture platform connecting farmers to diagnostics, marketplace, financing, and agrovets across East Africa.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <HowItWorksSection />
      <FeaturesSection />
      <MarketplacePreviewSection />
      <AgrovetSection />
      <FinancingSection />
      <ImpactSection />
      <TestimonialsSection />
      <PartnersSection />
      <CTASection />
    </>
  );
}

