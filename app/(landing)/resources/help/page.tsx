import type { Metadata } from "next";
import {
  HelpHeroSection,
  HelpCategoriesSection,
  HelpFAQSection,
  HelpContactSection,
  HelpCTASection,
} from "@/components/landing/resources/help-sections";

export const metadata: Metadata = {
  title: "Help Center",
  description: "Get help with DIGI-FARMS. Browse FAQs, contact support, and find answers to common questions about the platform.",
};

export default function HelpPage() {
  return (
    <>
      <HelpHeroSection />
      <HelpCategoriesSection />
      <HelpFAQSection />
      <HelpContactSection />
      <HelpCTASection />
    </>
  );
}
