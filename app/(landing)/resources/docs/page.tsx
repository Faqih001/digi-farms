import type { Metadata } from "next";
import {
  DocsHeroSection,
  DocsGettingStartedSection,
  DocsCategoriesSection,
  DocsPopularArticlesSection,
  DocsCTASection,
} from "@/components/landing/resources/docs-sections";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Comprehensive guides and tutorials to get started with Digi Farms. Learn how to use the platform, integrate APIs, and manage your farm digitally.",
};

export default function DocsPage() {
  return (
    <>
      <DocsHeroSection />
      <DocsGettingStartedSection />
      <DocsCategoriesSection />
      <DocsPopularArticlesSection />
      <DocsCTASection />
    </>
  );
}
