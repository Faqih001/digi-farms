import type { Metadata } from "next";
import {
  PartnershipsHeroSection,
  PartnershipsStatsSection,
  PartnershipsProgramsSection,
  PartnershipsNetworkSection,
  PartnershipsWhySection,
  PartnershipsCTASection,
} from "@/components/landing/company/partnerships-sections";

export const metadata: Metadata = {
  title: "Partnerships",
  description: "Partner with DIGI-FARMS to reach 50,000+ farmers across East Africa. Programs for agrovets, lenders, NGOs, and technology providers.",
};

export default function PartnershipsPage() {
  return (
    <>
      <PartnershipsHeroSection />
      <PartnershipsStatsSection />
      <PartnershipsProgramsSection />
      <PartnershipsNetworkSection />
      <PartnershipsWhySection />
      <PartnershipsCTASection />
    </>
  );
}
