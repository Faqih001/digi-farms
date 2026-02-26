import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Calendar } from "lucide-react";

const lastUpdated = "March 15, 2024";

const sections = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content: [
      { subtitle: "", text: "By accessing or using the DIGI-FARMS platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this platform." },
    ],
  },
  {
    id: "eligibility",
    title: "2. Eligibility",
    content: [
      { subtitle: "", text: "You must be at least 18 years old and legally capable of entering contracts under Kenyan law. Farmers registering on the platform must operate a farm within Kenya. Suppliers must have a valid business registration. Financial partners must be licensed by the Central Bank of Kenya or relevant regulatory authority." },
    ],
  },
  {
    id: "account-terms",
    title: "3. Account Terms",
    content: [
      { subtitle: "Account Security", text: "You are responsible for maintaining the confidentiality of your login credentials. You must immediately notify us of any unauthorized access to your account. We are not liable for losses resulting from unauthorized use of your account." },
      { subtitle: "Account Accuracy", text: "You must provide accurate, complete, and current information when registering. False or misleading information may result in immediate account termination." },
      { subtitle: "KYC Verification", text: "Certain features (including marketplace transactions and loan applications) require KYC verification. You authorize us to verify your identity through national ID databases and credit bureaus." },
    ],
  },
  {
    id: "marketplace-rules",
    title: "4. Marketplace Rules",
    content: [
      { subtitle: "Listing Requirements", text: "All products listed must accurately describe the goods being sold. Suppliers are responsible for accurate pricing, availability, and quality representation." },
      { subtitle: "Prohibited Items", text: "You may not list counterfeit products, unregistered pesticides, stolen goods, or any items prohibited by Kenyan law or agricultural regulations." },
      { subtitle: "Transaction Obligations", text: "Buyers and sellers must fulfill agreed transactions. DIGI-FARMS acts as an intermediary and is not responsible for product quality disputes, though we provide a dispute resolution service." },
      { subtitle: "Pricing", text: "DIGI-FARMS takes a commission on marketplace transactions. Current commission rates are displayed in your dashboard and may be updated with 30 days notice." },
    ],
  },
  {
    id: "ai-services",
    title: "5. AI & Diagnostic Services",
    content: [
      { subtitle: "Advisory Nature", text: "AI-generated crop diagnostics, yield predictions, and soil recommendations are advisory in nature. They do not replace professional agronomic advice. DIGI-FARMS is not liable for agricultural decisions made solely based on AI outputs." },
      { subtitle: "Data Contribution", text: "By using AI features, you consent to your anonymized agricultural data being used to improve our models. You retain ownership of your farm data." },
      { subtitle: "Accuracy", text: "We strive for high accuracy in our AI models, but we make no guarantee of correctness. Diagnostic confidence scores are provided to help you assess reliability." },
    ],
  },
  {
    id: "financing",
    title: "6. Financing Services",
    content: [
      { subtitle: "Credit Assessment", text: "DIGI-FARMS may provide credit scoring and financial profiling to partner lenders. You consent to this when applying for financing products." },
      { subtitle: "Loan Agreements", text: "Loan terms are agreed between you and the lending institution. DIGI-FARMS facilitates introductions and data sharing but is not a party to loan agreements." },
      { subtitle: "Repayment", text: "Non-repayment of loans may result in suspension of your DIGI-FARMS account, adverse credit bureau reporting, and legal action by the lender." },
    ],
  },
  {
    id: "intellectual-property",
    title: "7. Intellectual Property",
    content: [
      { subtitle: "DIGI-FARMS IP", text: "The platform, including all software, designs, logos, algorithms, and content created by DIGI-FARMS, is our exclusive property or licensed to us. You may not copy, modify, or distribute our intellectual property." },
      { subtitle: "Your Content", text: "You retain ownership of content you create (farm data, product listings, photos). By uploading content, you grant DIGI-FARMS a non-exclusive license to use, process, and display that content to provide our services." },
    ],
  },
  {
    id: "prohibited-conduct",
    title: "8. Prohibited Conduct",
    content: [
      { subtitle: "", text: "You agree not to: attempt to reverse engineer or hack the platform; use automated bots or scrapers; engage in fraudulent transactions; harass other users; circumvent our fee structures; create multiple accounts to abuse features or promotions; or use the platform for any illegal purpose." },
    ],
  },
  {
    id: "liability",
    title: "9. Limitation of Liability",
    content: [
      { subtitle: "", text: "To the maximum extent permitted by law, DIGI-FARMS shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including lost profits, agricultural losses, or business interruption, whether or not we have been advised of the possibility of such damages. Our total liability shall not exceed the fees you paid to DIGI-FARMS in the 12 months preceding the claim." },
    ],
  },
  {
    id: "dispute-resolution",
    title: "10. Dispute Resolution",
    content: [
      { subtitle: "In-Platform Disputes", text: "Disputes between buyers and sellers should first be raised through our in-platform dispute resolution tool. We aim to resolve disputes within 14 business days." },
      { subtitle: "Governing Law", text: "These terms are governed by the laws of Kenya. Any disputes not resolved through our internal process shall be referred to the Courts of Kenya." },
    ],
  },
  {
    id: "changes",
    title: "11. Changes to Terms",
    content: [
      { subtitle: "", text: "We may update these Terms of Service. We will notify active users of material changes via email and in-app notification at least 30 days before they take effect. Continued use of the platform after the effective date constitutes acceptance of the updated terms." },
    ],
  },
  {
    id: "contact",
    title: "12. Contact",
    content: [
      { subtitle: "", text: "For questions about these terms, contact us at legal@digi-farms.com or write to DIGI-FARMS Ltd, Westlands, Nairobi, Kenya." },
    ],
  },
];

export function TermsHeroSection() {
  return (
    <section className="gradient-hero py-20 lg:py-24">
      <div className="container mx-auto px-4 max-w-7xl text-center">
        <Badge className="mb-6 bg-white/20 text-white border-white/30">Legal</Badge>
        <h1 className="text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">Terms of Service</h1>
        <p className="text-lg text-green-100 max-w-2xl mx-auto mb-4">
          Please read these terms carefully before using the DIGI-FARMS platform.
        </p>
        <div className="flex items-center justify-center gap-2 text-green-200 text-sm">
          <Calendar className="w-4 h-4" />
          <span>Last updated: {lastUpdated}</span>
        </div>
      </div>
    </section>
  );
}

export function TermsNavSection() {
  return (
    <section className="py-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="text-xs px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-700 dark:hover:text-green-400 transition-colors whitespace-nowrap"
            >
              {s.title.replace(/^\d+\.\s/, "")}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TermsContentSection() {
  return (
    <section className="py-16 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 max-w-7xl">
        <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <CardContent className="p-6 lg:p-10">
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-200 dark:border-slate-700">
              <FileText className="w-8 h-8 text-green-600" />
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white">DIGI-FARMS Terms of Service</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Effective date: {lastUpdated}</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
              These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of the DIGI-FARMS platform, including our website, mobile applications, and all related services (collectively, the &ldquo;Service&rdquo;), operated by DIGI-FARMS Ltd (&ldquo;DIGI-FARMS,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;).
            </p>
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
            See also:{" "}
            <Link href="/legal/privacy" className="text-green-600 hover:underline">Privacy Policy</Link>
            {" · "}
            <Link href="/legal/cookies" className="text-green-600 hover:underline">Cookie Policy</Link>
            {" · "}
            <Link href="/legal/dpa" className="text-green-600 hover:underline">Data Processing Agreement</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
