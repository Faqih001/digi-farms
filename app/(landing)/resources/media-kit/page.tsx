import type { Metadata } from "next";
import {
  MediaKitHeroSection,
  MediaKitFactsSection,
  MediaKitAssetsSection,
  MediaKitBrandColorsSection,
  MediaKitPressSection,
  MediaKitCTASection,
} from "@/components/landing/resources/media-kit-sections";

export const metadata: Metadata = {
  title: "Media Kit",
  description: "DIGI-FARMS brand assets, logos, press releases, and company information for media, press, and partnership materials.",
};

export default function MediaKitPage() {
  return (
    <>
      <MediaKitHeroSection />
      <MediaKitFactsSection />
      <MediaKitAssetsSection />
      <MediaKitBrandColorsSection />
      <MediaKitPressSection />
      <MediaKitCTASection />
    </>
  );
}
