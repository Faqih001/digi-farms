import type { Metadata } from "next";
import {
  AgrovetHeroSection,
  AgrovetMapSection,
  AgrovetFeaturesSection,
  AgrovetStatsSection,
  AgrovetCTASection,
} from "@/components/landing/platform/agrovet-sections";

export const metadata: Metadata = {
  title: "Agrovet Locator",
  description: "Find certified agricultural input dealers near you. Verified agrovets, real-time stock, and doorstep delivery across East Africa.",
};

export default function AgrovetLocatorPage() {
  return (
    <>
      <AgrovetHeroSection />
      <AgrovetMapSection />
      <AgrovetFeaturesSection />
      <AgrovetStatsSection />
      <AgrovetCTASection />
    </>
  );
}
