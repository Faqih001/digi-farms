import type { Metadata } from "next";
import {
  MissionVisionSection,
  StorySection,
  AboutProblemSection,
  TechInfraSection,
  AIEngineSection,
  TeamSection,
  AdvisorsSection,
  CoreValuesSection,
  MilestonesSection,
  SDGSection,
  AboutCTASection,
} from "@/components/landing/about/sections";

export const metadata: Metadata = {
  title: "About – DIGI-FARMS",
  description: "Learn about DIGI-FARMS' mission to transform smallholder agriculture across East Africa through AI and precision technology.",
};

export default function AboutPage() {
  return (
    <>
      <MissionVisionSection />
      <StorySection />
      <AboutProblemSection />
      <TechInfraSection />
      <AIEngineSection />
      <TeamSection />
      <AdvisorsSection />
      <CoreValuesSection />
      <MilestonesSection />
      <SDGSection />
      <AboutCTASection />
    </>
  );
}
