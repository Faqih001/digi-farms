import type { Metadata } from "next";
import {
  DiagnosticsHeroSection,
  DiagnosticsStatsSection,
  DiagnosticsStepsSection,
  DiagnosticsFeaturesSection,
  DiagnosticsDatabaseSection,
  DiagnosticsCTASection,
} from "@/components/landing/platform/diagnostics-sections";

export const metadata: Metadata = {
  title: "AI Crop Diagnostics",
  description: "Instantly diagnose crop diseases and pests using our AI-powered vision technology. 200+ diseases, 94% accuracy.",
};

export default function DiagnosticsPage() {
  return (
    <>
      <DiagnosticsHeroSection />
      <DiagnosticsStatsSection />
      <DiagnosticsStepsSection />
      <DiagnosticsFeaturesSection />
      <DiagnosticsDatabaseSection />
      <DiagnosticsCTASection />
    </>
  );
}
