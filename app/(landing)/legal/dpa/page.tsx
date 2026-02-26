import type { Metadata } from "next";
import {
  DpaHeroSection,
  DpaKeyPrinciplesSection,
  DpaNavSection,
  DpaContentSection,
} from "@/components/landing/legal/dpa-sections";

export const metadata: Metadata = {
  title: "Data Processing Agreement",
  description: "DIGI-FARMS Data Processing Agreement (DPA). Details on how we process personal data on behalf of our partners and in compliance with data protection laws.",
};

export default function DpaPage() {
  return (
    <>
      <DpaHeroSection />
      <DpaKeyPrinciplesSection />
      <DpaNavSection />
      <DpaContentSection />
    </>
  );
}
