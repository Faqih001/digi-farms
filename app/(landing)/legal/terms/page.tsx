import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "DIGI-FARMS Terms of Service. Understand the terms governing your use of the DIGI-FARMS platform and marketplace.",
};

const lastUpdated = "March 15, 2024";

const sections = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content: [
      { subtitle: "", text: "By accessing or using the DIGI-FARMS platform (web application, mobile applications, and APIs), you agree to be bound by these Terms of Service. If you do not agree, you may not use our services. These terms apply to all users, including farmers, suppliers, agrovets, lenders, and administrators." },
    ],
  },
  {
    id: "eligibility",
    title: "2. Eligibility",
    content: [
      { subtitle: "Age Requirement", text: "You must be at least 18 years old to create an account and use DIGI-FARMS. By registering, you represent that you meet this requirement." },
      { subtitle: "KYC Verification", text: "Certain features (marketplace transactions, financing) require identity verification. You agree to provide accurate, current, and complete information during verification and to keep it updated." },
      { subtitle: "Business Accounts", text: "If you register as a supplier or agrovet, you represent that you have the authority to bind the business entity to these terms." },
    ],
  },
  {
    id: "account",
    title: "3. Account Terms",
    content: [
      { subtitle: "Account Security", text: "You are responsible for maintaining the confidentiality of your login credentials. Notify us immediately at security@digi-farms.com if you suspect unauthorized access to your account." },
      { subtitle: "One Account Per Person", text: "Each individual may only maintain one account. Duplicate accounts may be suspended without notice." },
      { subtitle: "Account Suspension", text: "We reserve the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or remain inactive for more than 12 months." },
    ],
  },
  {
    id: "marketplace",
    title: "4. Marketplace Rules",
    content: [
      { subtitle: "Product Listings", text: "Suppliers are responsible for the accuracy of their listings, including product descriptions, prices, quantities, and images. Misleading listings will be removed and may result in account suspension." },
      { subtitle: "Orders & Transactions", text: "When a buyer places an order, a binding agreement is formed between the buyer and seller. DIGI-FARMS acts as a platform facilitator, not a party to the transaction." },
      { subtitle: "Pricing", text: "All prices are in Kenya Shillings (KES) unless otherwise stated. Suppliers may update prices at any time, but confirmed orders are locked at the price at the time of purchase." },
      { subtitle: "Delivery", text: "Sellers are responsible for delivering products within the timeframe specified in their listing. DIGI-FARMS may facilitate logistics but does not guarantee delivery times." },
      { subtitle: "Returns & Refunds", text: "Buyers may request a refund within 48 hours of delivery if products are significantly different from the listing description, damaged, or defective. Disputes are resolved through our mediation process." },
    ],
  },
  {
    id: "ai-services",
    title: "5. AI Diagnostic Services",
    content: [
      { subtitle: "Nature of Service", text: "Our AI crop diagnostics tool provides suggestions based on image analysis. These are informational only and should not be treated as definitive agricultural advice." },
      { subtitle: "Accuracy", text: "While our AI achieves high accuracy rates, results may occasionally be incorrect. We recommend consulting with local extension officers for critical decisions." },
      { subtitle: "Data Usage", text: "Crop images submitted for diagnosis may be used to improve our AI models. Images are anonymized before use in model training." },
    ],
  },
  {
    id: "financing",
    title: "6. Financing & Insurance",
    content: [
      { subtitle: "Third-Party Services", text: "Loans and insurance products are provided by licensed financial institutions, not by DIGI-FARMS. We facilitate applications and provide data-driven credit assessments." },
      { subtitle: "Credit Scoring", text: "Our AI-generated credit scores are based on your platform activity (transaction history, farm data, payment behavior). You consent to this data being shared with lending partners when you apply." },
      { subtitle: "Repayment", text: "Loan repayment obligations are between you and the lending institution. DIGI-FARMS may facilitate repayment through the platform but is not responsible for your loan obligations." },
    ],
  },
  {
    id: "intellectual-property",
    title: "7. Intellectual Property",
    content: [
      { subtitle: "Our IP", text: "The DIGI-FARMS platform, brand, logos, AI models, and documentation are our intellectual property. You may not copy, modify, distribute, or reverse-engineer any part of our platform." },
      { subtitle: "Your Content", text: "You retain ownership of content you upload (farm photos, product listings, reviews). By uploading, you grant us a non-exclusive, worldwide license to use, display, and process this content for platform operations." },
      { subtitle: "Feedback", text: "Any feedback, suggestions, or ideas you provide about our services may be used by us without obligation to you." },
    ],
  },
  {
    id: "prohibited",
    title: "8. Prohibited Activities",
    content: [
      { subtitle: "", text: "You agree not to: (a) use the platform for illegal purposes; (b) list prohibited agricultural chemicals or counterfeit products; (c) manipulate reviews or ratings; (d) attempt to access other users' accounts; (e) scrape or harvest data from the platform; (f) use automated bots or scripts without authorization; (g) engage in price manipulation or market interference." },
    ],
  },
  {
    id: "liability",
    title: "9. Limitation of Liability",
    content: [
      { subtitle: "Platform Availability", text: "We strive for 99.9% uptime but do not guarantee uninterrupted service. We are not liable for losses caused by platform downtime, data loss, or technical failures." },
      { subtitle: "Maximum Liability", text: "Our total liability for any claim arising from your use of the platform is limited to the fees you have paid to DIGI-FARMS in the 12 months preceding the claim." },
      { subtitle: "Third-Party Services", text: "We are not responsible for the quality, safety, or legality of products sold by suppliers, or the terms of financial products offered by lending partners." },
    ],
  },
  {
    id: "dispute-resolution",
    title: "10. Dispute Resolution",
    content: [
      { subtitle: "Mediation", text: "Disputes between buyers and sellers are first handled through our in-platform mediation process. Our team will review evidence from both parties and issue a decision within 7 business days." },
      { subtitle: "Governing Law", text: "These terms are governed by the laws of the Republic of Kenya. Any disputes not resolved through mediation shall be submitted to the courts of Nairobi." },
    ],
  },
  {
    id: "changes",
    title: "11. Changes to Terms",
    content: [
      { subtitle: "", text: "We may modify these Terms of Service at any time. Significant changes will be communicated via email and in-app notification at least 30 days before taking effect. Continued use of the platform after changes constitutes acceptance of the updated terms." },
    ],
  },
  {
    id: "contact",
    title: "12. Contact",
    content: [
      { subtitle: "", text: "For questions about these Terms of Service, contact us at legal@digi-farms.com or write to: DIGI-FARMS Ltd, Westlands, Nairobi, Kenya." },
    ],
  },
];

export default function TermsOfServicePage() {
  return (
    <>
      {/* Hero */}
      <section className="gradient-hero py-20 lg:py-24">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <Badge className="mb-6 bg-white/20 text-white border-white/30">Legal</Badge>
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">Terms of Service</h1>
          <p className="text-lg text-green-100 max-w-2xl mx-auto mb-4">
            The terms and conditions governing your use of the DIGI-FARMS platform.
          </p>
          <div className="flex items-center justify-center gap-2 text-green-200 text-sm">
            <Calendar className="w-4 h-4" />
            <span>Last updated: {lastUpdated}</span>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="text-xs px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-700 transition-colors whitespace-nowrap">
                {s.title.replace(/^\d+\.\s/, "")}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <Card className="dark:bg-slate-800/50 border-slate-200 dark:border-slate-800">
            <CardContent className="p-6 lg:p-10">
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-200 dark:border-slate-700">
                <FileText className="w-8 h-8 text-green-600" />
                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white">DIGI-FARMS Terms of Service</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Effective date: {lastUpdated}</p>
                </div>
              </div>

              {sections.map((s) => (
                <div key={s.id} id={s.id} className="mb-10 scroll-mt-24">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">{s.title}</h3>
                  <div className="space-y-4">
                    {s.content.map((c, i) => (
                      <div key={i}>
                        {c.subtitle && <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200 mb-1">{c.subtitle}</h4>}
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{c.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="text-center mt-8">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              See also: <Link href="/legal/privacy" className="text-green-600 hover:underline">Privacy Policy</Link> · <Link href="/legal/cookies" className="text-green-600 hover:underline">Cookie Policy</Link> · <Link href="/legal/dpa" className="text-green-600 hover:underline">Data Processing Agreement</Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
