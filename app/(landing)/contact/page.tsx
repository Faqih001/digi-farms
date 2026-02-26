import type { Metadata } from "next";
import {
  ContactHeroSection,
  ContactFormSection,
  ContactFAQSection,
  ContactOfficesSection,
} from "@/components/landing/contact/sections";

export const metadata: Metadata = {
  title: "Contact – DIGI-FARMS",
  description: "Get in touch with DIGI-FARMS. We'd love to hear from farmers, agrovets, lenders, and investors.",
};

export default function ContactPage() {
  return (
    <>
      <ContactHeroSection />
      <ContactFormSection />
      <ContactFAQSection />
      <ContactOfficesSection />
    </>
  );
}
