import type { Metadata } from "next";
import {
  TeamHeroSection,
  TeamLeadershipSection,
  TeamAdvisorsSection,
  TeamDepartmentsSection,
  TeamCTASection,
} from "@/components/landing/company/team-sections";

export const metadata: Metadata = {
  title: "Our Team",
  description: "Meet the people behind DIGI-FARMS — agronomists, engineers, and impact leaders building the future of African agriculture.",
};

export default function TeamPage() {
  return (
    <>
      <TeamHeroSection />
      <TeamLeadershipSection />
      <TeamAdvisorsSection />
      <TeamDepartmentsSection />
      <TeamCTASection />
    </>
  );
}
