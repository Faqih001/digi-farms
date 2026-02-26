import type { Metadata } from "next";
import {
  CompanyAboutHeroSection,
  CompanyAboutStatsSection,
  CompanyMissionVisionSection,
  CompanyCoreValuesSection,
  CompanyRoadmapSection,
  CompanySDGSection,
  CompanyAboutCTASection,
} from "@/components/landing/company/about-sections";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about DIGI-FARMS' mission to transform smallholder agriculture across East Africa through AI and precision technology.",
};

export default function AboutPage() {
  return (
    <>
      <CompanyAboutHeroSection />
      <CompanyAboutStatsSection />
      <CompanyMissionVisionSection />
      <CompanyCoreValuesSection />
      <CompanyRoadmapSection />
      <CompanySDGSection />
      <CompanyAboutCTASection />
    </>
  );
}
