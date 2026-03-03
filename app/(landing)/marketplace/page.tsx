import type { Metadata } from "next";
import {
  MarketHeroSection,
  MarketSearchSection,
  MarketCategoriesSection,
  FeaturedProductsSection,
  VerifiedSuppliersSection,
  PriceComparisonSection,
  BulkPurchaseSection,
  SellProduceSection,
  SecureTransactionsSection,
  AntiCounterfeitSection,
  MarketFinancingSection,
  MarketCTASection,
} from "@/components/landing/marketplace/sections";

export const metadata: Metadata = {
  title: "Marketplace – Digi Farms",
  description: "Buy certified farm inputs and sell your produce on Africa's largest verified agricultural marketplace.",
};

export default function MarketplacePage() {
  return (
    <>
      <MarketHeroSection />
      <MarketSearchSection />
      <MarketCategoriesSection />
      <FeaturedProductsSection />
      <VerifiedSuppliersSection />
      <PriceComparisonSection />
      <BulkPurchaseSection />
      <SellProduceSection />
      <SecureTransactionsSection />
      <AntiCounterfeitSection />
      <MarketFinancingSection />
      <MarketCTASection />
    </>
  );
}
