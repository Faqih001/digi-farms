import type { Metadata } from "next";
import {
  CareersHeroSection,
  CareersCultureSection,
  CareersPerksSection,
  CareersOpenRolesSection,
  CareersCTASection,
} from "@/components/landing/company/careers-sections";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join DIGI-FARMS and help build the future of African agriculture. We're hiring engineers, agronomists, and impact leaders.",
};

export default function CareersPage() {
  return (
    <>
      <CareersHeroSection />
      <CareersCultureSection />
      <CareersPerksSection />
      <CareersOpenRolesSection />
      <CareersCTASection />
    </>
  );
}
