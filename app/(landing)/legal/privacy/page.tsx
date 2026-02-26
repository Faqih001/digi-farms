import type { Metadata } from "next";
import {
  PrivacyHeroSection,
  PrivacyNavSection,
  PrivacyContentSection,
} from "@/components/landing/legal/privacy-sections";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "DIGI-FARMS Privacy Policy. Learn how we collect, use, store, and protect your personal data.",
};

export default function PrivacyPage() {
  return (
    <>
      <PrivacyHeroSection />
      <PrivacyNavSection />
      <PrivacyContentSection />
    </>
  );
}
