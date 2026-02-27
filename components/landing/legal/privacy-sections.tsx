import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Calendar } from "lucide-react";

const lastUpdated = "March 15, 2024";

const sections = [
  {
    id: "information-we-collect",
    title: "1. Information We Collect",
    content: [
      { subtitle: "Personal Information", text: "When you create an account, we collect your name, email address, phone number, national ID number (for KYC verification), location, and farm details. For suppliers, we also collect business registration information." },
      { subtitle: "Usage Data", text: "We automatically collect information about how you interact with our platform, including pages visited, features used, device type, browser, IP address, and session duration." },
      { subtitle: "Farm & Agricultural Data", text: "When you use our diagnostics and analytics tools, we collect crop images, soil data, yield records, weather preferences, and related agricultural information you provide." },
      { subtitle: "Payment Information", text: "We collect M-Pesa phone numbers, transaction records, and wallet balances. We do not store full payment credentials — these are handled by our PCI-compliant payment partners." },
    ],
  },
  {
    id: "how-we-use",
    title: "2. How We Use Your Information",
    content: [
      { subtitle: "Platform Services", text: "To provide and improve our marketplace, AI diagnostics, farm analytics, agrovet locator, and financing services." },
      { subtitle: "Communication", text: "To send transactional notifications (order updates, payment confirmations), and with your consent, marketing messages about new features and offers." },
      { subtitle: "AI & Analytics", text: "To train and improve our crop disease detection models, yield prediction algorithms, and credit scoring systems. Your data contributes to aggregate models — individual data is never shared." },
      { subtitle: "Security", text: "To detect fraud, prevent unauthorized access, and ensure the integrity of our platform and your account." },
    ],
  },
  {
    id: "data-sharing",
    title: "3. Data Sharing & Disclosure",
    content: [
      { subtitle: "With Your Consent", text: "We share data with financial partners (banks, MFIs) only when you explicitly apply for loans or insurance. Your credit score and farm performance data is shared to support your application." },
      { subtitle: "Service Providers", text: "We share data with trusted third-party providers who help us operate the platform — hosting (AWS), analytics, payment processing (Safaricom M-Pesa), and customer support tools." },
      { subtitle: "Legal Obligations", text: "We may disclose information if required by law, regulation, or valid legal process, or to protect the rights, property, or safety of DIGI-FARMS, our users, or others." },
      { subtitle: "Aggregated Data", text: "We may share anonymized, aggregated data with research partners, government agencies, and NGOs for agricultural development purposes. This data cannot identify individual users." },
    ],
  },
  {
    id: "data-retention",
    title: "4. Data Retention",
    content: [
      { subtitle: "Account Data", text: "We retain your personal information for as long as your account is active. If you request account deletion, we remove your personal data within 30 days, except where required by law." },
      { subtitle: "Transaction Records", text: "Financial transaction records are retained for 7 years as required by Kenya Revenue Authority (KRA) regulations and anti-money laundering laws." },
      { subtitle: "Agricultural Data", text: "Farm data and diagnostic history are retained for the life of your account to provide historical analytics. You can export or delete this data at any time." },
    ],
  },
  {
    id: "your-rights",
    title: "5. Your Rights",
    content: [
      { subtitle: "Access", text: "You have the right to request a copy of all personal data we hold about you. We provide this in a machine-readable format within 30 days." },
      { subtitle: "Correction", text: "You can update your personal information at any time through your dashboard settings, or by contacting our support team." },
      { subtitle: "Deletion", text: "You can request deletion of your account and associated data. Some data may be retained for legal compliance (see Data Retention above)." },
      { subtitle: "Data Portability", text: "You can export your farm data, transaction history, and analytics in CSV or JSON format from your dashboard." },
      { subtitle: "Opt-Out", text: "You can unsubscribe from marketing communications at any time. Transactional notifications cannot be opted out of while your account is active." },
    ],
  },
  {
    id: "security",
    title: "6. Data Security",
    content: [
      { subtitle: "Encryption", text: "All data is encrypted in transit (TLS 1.3) and at rest (AES-256). Passwords are hashed using bcrypt with industry-standard salt rounds." },
      { subtitle: "Infrastructure", text: "Our platform runs on AWS with SOC 2 certified infrastructure, regular security audits, and automated vulnerability scanning." },
      { subtitle: "Access Controls", text: "Employee access to user data is restricted by role, logged, and audited. We follow the principle of least privilege." },
    ],
  },
  {
    id: "cookies",
    title: "7. Cookies & Tracking",
    content: [
      { subtitle: "Essential Cookies", text: "Required for authentication, security, and basic platform functionality. These cannot be disabled." },
      { subtitle: "Analytics Cookies", text: "Used to understand how users interact with our platform. You can opt out via our cookie preferences or browser settings." },
      { subtitle: "Details", text: "For a complete list of cookies we use, see our Cookie Policy." },
    ],
  },
  {
    id: "changes",
    title: "8. Changes to This Policy",
    content: [
      { subtitle: "", text: "We may update this Privacy Policy from time to time. We will notify you of significant changes via email and an in-app notification at least 30 days before they take effect. Continued use of the platform after changes constitutes acceptance." },
    ],
  },
  {
    id: "contact",
    title: "9. Contact Us",
    content: [
      { subtitle: "", text: "If you have any questions about this Privacy Policy or our data practices, please contact us at privacy@digi-farms.com or write to: DIGI-FARMS Ltd, Westlands, Nairobi, Kenya." },
    ],
  },
];

export function PrivacyHeroSection() {
  return (
    <section className="gradient-hero py-20 lg:py-24">
      <div className="container mx-auto px-4 max-w-7xl text-center">
        <Badge className="mb-6 bg-white/20 text-white border-white/30">Legal</Badge>
        <h1 className="text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">Privacy Policy</h1>
        <p className="text-lg text-green-100 max-w-2xl mx-auto mb-4">
          Your privacy matters to us. This policy explains how we handle your personal data.
        </p>
        <div className="flex items-center justify-center gap-2 text-green-200 text-sm">
          <Calendar className="w-4 h-4" />
          <span>Last updated: {lastUpdated}</span>
        </div>
      </div>
    </section>
  );
}

export function PrivacyNavSection() {
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

export function PrivacyContentSection() {
  return (
    <section className="py-16 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 max-w-7xl">
        <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <CardContent className="p-6 lg:p-10">
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-200 dark:border-slate-700">
              <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white">DIGI-FARMS Privacy Policy</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Effective date: {lastUpdated}</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
              DIGI-FARMS Ltd (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) operates the DIGI-FARMS platform (web and mobile applications). This Privacy Policy describes how we collect, use, disclose, and protect your personal information when you use our services. By using DIGI-FARMS, you agree to the terms of this Privacy Policy.
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
            <Link href="/legal/terms" className="text-green-600 hover:underline">Terms of Service</Link>
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
