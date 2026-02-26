import type { Metadata } from "next";
import {
  ApiHeroSection,
  ApiFeaturesSection,
  ApiAuthSection,
  ApiEndpointsSection,
  ApiSDKsSection,
  ApiCTASection,
} from "@/components/landing/resources/api-sections";

export const metadata: Metadata = {
  title: "API Reference",
  description: "DIGI-FARMS REST API documentation. Integrate farm data, marketplace, payments, and diagnostics into your applications.",
};

export default function ApiPage() {
  return (
    <>
      <ApiHeroSection />
      <ApiFeaturesSection />
      <ApiAuthSection />
      <ApiEndpointsSection />
      <ApiSDKsSection />
      <ApiCTASection />
    </>
  );
}
