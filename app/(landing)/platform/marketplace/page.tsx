import type { Metadata } from "next";
import {
  PlatformMarketHeroSection,
  PlatformMarketStatsSection,
  PlatformMarketFeaturesSection,
  PlatformMarketSellSection,
  PlatformMarketCTASection,
} from "@/components/landing/platform/platform-marketplace-sections";

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Buy certified farm inputs and sell your produce directly to buyers. Transparent pricing, verified suppliers, doorstep delivery.",
};

export default function PlatformMarketplacePage() {
  return (
    <>
      <PlatformMarketHeroSection />
      <PlatformMarketStatsSection />
      <PlatformMarketFeaturesSection />
      <PlatformMarketSellSection />
      <PlatformMarketCTASection />
    </>
  );
}
