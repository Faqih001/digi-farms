import type { Metadata } from "next";
import {
  ContactHeroSection,
  ContactFormSection,
  ContactFAQSection,
  ContactOfficesSection,
} from "@/components/landing/contact/sections";

export const metadata: Metadata = {
  title: "Contact – Digi Farms",
  description: "Get in touch with Digi Farms. We'd love to hear from farmers, agrovets, lenders, and investors.",
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
