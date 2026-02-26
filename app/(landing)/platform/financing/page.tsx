import type { Metadata } from "next";
import {
  FinancingHeroSection,
  FinancingLoansSection,
  FinancingHowItWorksSection,
  FinancingInsuranceSection,
  FinancingEligibilitySection,
  FinancingCTASection,
} from "@/components/landing/platform/financing-sections";

export const metadata: Metadata = {
  title: "Financing & Insurance",
  description: "Access agricultural loans and crop insurance designed for smallholder farmers. AI credit scoring, instant approvals, and affordable premiums.",
};

export default function FinancingPage() {
  return (
    <>
      <FinancingHeroSection />
      <FinancingLoansSection />
      <FinancingHowItWorksSection />
      <FinancingInsuranceSection />
      <FinancingEligibilitySection />
      <FinancingCTASection />
    </>
  );
}
