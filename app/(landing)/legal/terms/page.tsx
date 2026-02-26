import type { Metadata } from "next";
import {
  TermsHeroSection,
  TermsNavSection,
  TermsContentSection,
} from "@/components/landing/legal/terms-sections";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "DIGI-FARMS Terms of Service. Understand the terms governing your use of the DIGI-FARMS platform and marketplace.",
};

export default function TermsPage() {
  return (
    <>
      <TermsHeroSection />
      <TermsNavSection />
      <TermsContentSection />
    </>
  );
}
