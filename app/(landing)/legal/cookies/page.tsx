import type { Metadata } from "next";
import {
  CookiesHeroSection,
  CookiesContentSection,
} from "@/components/landing/legal/cookies-sections";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "DIGI-FARMS Cookie Policy. Understand what cookies we use, why we use them, and how to manage your preferences.",
};

export default function CookiesPage() {
  return (
    <>
      <CookiesHeroSection />
      <CookiesContentSection />
    </>
  );
}
