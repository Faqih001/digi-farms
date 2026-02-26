import type { Metadata } from "next";
import {
  BlogHeroSection,
  BlogCategoriesSection,
  BlogFeaturedPostSection,
  BlogPostGridSection,
  BlogCTASection,
} from "@/components/landing/company/blog-sections";

export const metadata: Metadata = {
  title: "Blog",
  description: "Insights on precision agriculture, agritech innovation, market trends, and farmer success stories from East Africa.",
};

export default function BlogPage() {
  return (
    <>
      <BlogHeroSection />
      <BlogCategoriesSection />
      <BlogFeaturedPostSection />
      <BlogPostGridSection />
      <BlogCTASection />
    </>
  );
}
