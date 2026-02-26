import type { Metadata } from "next";
import {
  CaseStudiesHeroSection,
  CaseStudiesStatsSection,
  CaseStudiesListSection,
  CaseStudiesCTASection,
} from "@/components/landing/resources/case-studies-sections";

export const metadata: Metadata = {
  title: "Case Studies",
  description: "Real success stories from farmers, suppliers, and partners using DIGI-FARMS to transform agriculture across East Africa.",
};

export default function CaseStudiesPage() {
  return (
    <>
      <CaseStudiesHeroSection />
      <CaseStudiesStatsSection />
      <CaseStudiesListSection />
      <CaseStudiesCTASection />
    </>
  );
}
