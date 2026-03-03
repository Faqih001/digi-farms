import type { Metadata } from "next";
import {
  TechHeroSection,
  RoboticsSection,
  AIDiagnosticsSection,
  MultispectralSection,
  FarmAnalyticsSection,
  ClimateModeling,
  FarmScoreSection,
  RiskProfilingSection,
  MapsSection,
  MobileAppSection,
  DataPrivacySection,
  TechCTASection,
} from "@/components/landing/technology/sections";

export const metadata: Metadata = {
  title: "Technology – Digi Farms",
  description: "Explore Digi Farms' cutting-edge technology stack: AI diagnostics, multispectral imaging, climate modeling, and precision farm analytics.",
};

export default function TechnologyPage() {
  return (
    <>
      <TechHeroSection />
      <RoboticsSection />
      <AIDiagnosticsSection />
      <MultispectralSection />
      <FarmAnalyticsSection />
      <ClimateModeling />
      <FarmScoreSection />
      <RiskProfilingSection />
      <MapsSection />
      <MobileAppSection />
      <DataPrivacySection />
      <TechCTASection />
    </>
  );
}
