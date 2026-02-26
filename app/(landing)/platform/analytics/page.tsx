import type { Metadata } from "next";
import {
  AnalyticsHeroSection,
  AnalyticsDashboardSection,
  AnalyticsFeaturesSection,
  AnalyticsReportsSection,
  AnalyticsCTASection,
} from "@/components/landing/platform/analytics-sections";

export const metadata: Metadata = {
  title: "Farm Analytics",
  description: "Data-driven insights for precision farming. Track yields, monitor soil health, and optimize every acre with AI-powered analytics.",
};

export default function AnalyticsPage() {
  return (
    <>
      <AnalyticsHeroSection />
      <AnalyticsDashboardSection />
      <AnalyticsFeaturesSection />
      <AnalyticsReportsSection />
      <AnalyticsCTASection />
    </>
  );
}
