import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Calendar, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Data Processing Agreement",
  description: "DIGI-FARMS Data Processing Agreement (DPA). Details on how we process personal data on behalf of our partners and in compliance with data protection laws.",
};

const lastUpdated = "March 15, 2024";

const sections = [
  {
    id: "definitions",
    title: "1. Definitions",
    content: [
      { subtitle: "", text: "\"Controller\" means the entity that determines the purposes and means of processing personal data. \"Processor\" means DIGI-FARMS Ltd, which processes personal data on behalf of the Controller. \"Data Subject\" means the identified or identifiable individual whose personal data is processed. \"Processing\" means any operation performed on personal data, including collection, storage, use, disclosure, and deletion. \"Sub-processor\" means a third party engaged by the Processor to process personal data on behalf of the Controller." },
    ],
  },
  {
    id: "scope",
    title: "2. Scope & Purpose",
    content: [
      { subtitle: "Scope", text: "This DPA applies to all processing of personal data by DIGI-FARMS on behalf of partners, including financial institutions, agrovet networks, NGOs, and government agencies that use our platform to reach or manage farmer and supplier data." },
      { subtitle: "Purpose of Processing", text: "DIGI-FARMS processes personal data solely for the purposes of: (a) providing platform services as described in our Terms of Service; (b) performing AI-powered crop diagnostics and analytics; (c) facilitating marketplace transactions; (d) enabling credit scoring and financing applications; (e) generating aggregated agricultural insights." },
      { subtitle: "Categories of Data", text: "Personal data processed includes: names, phone numbers, email addresses, national ID numbers, location data, farm details, crop images, transaction records, payment information, and platform usage data." },
    ],
  },
  {
    id: "obligations",
    title: "3. Processor Obligations",
    content: [
      { subtitle: "Lawful Processing", text: "DIGI-FARMS will process personal data only on documented instructions from the Controller, unless required by applicable law. We will inform the Controller if we believe an instruction violates data protection laws." },
      { subtitle: "Confidentiality", text: "All personnel authorized to process personal data are bound by confidentiality obligations. Access to personal data is restricted to those who need it for their job functions." },
      { subtitle: "Security Measures", text: "We implement appropriate technical and organizational measures to ensure a level of security appropriate to the risk, including: encryption of data in transit (TLS 1.3) and at rest (AES-256); regular security assessments and penetration testing; access controls and audit logging; incident response procedures; regular backup and disaster recovery testing." },
      { subtitle: "Data Minimization", text: "We collect and process only the minimum personal data necessary for the stated purposes. Data that is no longer needed is securely deleted or anonymized." },
    ],
  },
  {
    id: "sub-processors",
    title: "4. Sub-processors",
    content: [
      { subtitle: "Authorized Sub-processors", text: "The Controller provides general authorization for DIGI-FARMS to engage sub-processors. We maintain a current list of sub-processors and will notify the Controller at least 30 days before adding a new sub-processor." },
      { subtitle: "Current Sub-processors", text: "Our current sub-processors include: Amazon Web Services (cloud hosting & storage, Ireland/South Africa regions); Safaricom M-Pesa (payment processing, Kenya); Google Cloud (AI/ML model training, EU); Vercel (application hosting, global CDN); Resend (transactional email, US)." },
      { subtitle: "Sub-processor Obligations", text: "We ensure sub-processors are bound by data protection obligations no less protective than those in this DPA. We remain fully liable for the actions of our sub-processors." },
    ],
  },
  {
    id: "data-subject-rights",
    title: "5. Data Subject Rights",
    content: [
      { subtitle: "Assistance", text: "DIGI-FARMS will assist the Controller in responding to data subject requests, including requests for access, rectification, erasure, restriction, portability, and objection to processing." },
      { subtitle: "Response Time", text: "We will respond to data subject requests within 72 hours of receipt and complete the request within 30 days unless exceptional circumstances require an extension." },
      { subtitle: "Direct Requests", text: "If a data subject contacts DIGI-FARMS directly, we will promptly redirect the request to the relevant Controller unless we are the Controller for that data." },
    ],
  },
  {
    id: "international-transfers",
    title: "6. International Data Transfers",
    content: [
      { subtitle: "Data Location", text: "Primary data storage is in AWS data centers in Africa (Cape Town) and Europe (Ireland). Data may be transferred to other regions only where necessary for service provision." },
      { subtitle: "Safeguards", text: "For transfers outside of the data subject's jurisdiction, we implement appropriate safeguards including: Standard Contractual Clauses (SCCs) approved by the European Commission; Data Processing Agreements with all sub-processors; Encryption of data during transfer." },
      { subtitle: "Kenya Data Protection Act", text: "We comply with the Kenya Data Protection Act (2019) and regulations issued by the Office of the Data Protection Commissioner. We ensure that personal data of Kenyan residents is processed in accordance with these requirements." },
    ],
  },
  {
    id: "breach-notification",
    title: "7. Data Breach Notification",
    content: [
      { subtitle: "Notification", text: "In the event of a personal data breach, DIGI-FARMS will notify the Controller without undue delay and no later than 48 hours after becoming aware of the breach." },
      { subtitle: "Notification Content", text: "The notification will include: a description of the nature of the breach; categories and approximate number of data subjects affected; likely consequences of the breach; measures taken or proposed to address the breach and mitigate its effects." },
      { subtitle: "Cooperation", text: "We will cooperate with the Controller and relevant supervisory authorities in investigating and remediating the breach. We maintain a breach response team and documented incident response procedures." },
    ],
  },
  {
    id: "audits",
    title: "8. Audits & Compliance",
    content: [
      { subtitle: "Audit Rights", text: "The Controller has the right to audit DIGI-FARMS's compliance with this DPA, subject to reasonable notice (at least 30 days) and confidentiality obligations." },
      { subtitle: "Documentation", text: "We maintain records of all processing activities carried out on behalf of the Controller, including processing purposes, data categories, recipients, transfer safeguards, and retention periods." },
      { subtitle: "Certifications", text: "We maintain SOC 2 Type II certification and undergo annual independent security audits. Audit reports are available to Controllers upon request under NDA." },
    ],
  },
  {
    id: "termination",
    title: "9. Term & Termination",
    content: [
      { subtitle: "Duration", text: "This DPA remains in effect for the duration of our service relationship with the Controller." },
      { subtitle: "Data Return & Deletion", text: "Upon termination, DIGI-FARMS will, at the Controller's election, either return all personal data in a machine-readable format or securely delete it within 90 days. We will provide written confirmation of deletion upon request." },
      { subtitle: "Survival", text: "Obligations regarding confidentiality, data security, and breach notification survive termination of this DPA." },
    ],
  },
  {
    id: "contact",
    title: "10. Contact Information",
    content: [
      { subtitle: "Data Protection Officer", text: "DIGI-FARMS has appointed a Data Protection Officer who can be reached at dpo@digi-farms.com." },
      { subtitle: "General Inquiries", text: "For general questions about this DPA, contact legal@digi-farms.com or write to: DIGI-FARMS Ltd, Data Protection Office, Westlands, Nairobi, Kenya." },
    ],
  },
];

const keyPrinciples = [
  "Data processed only on documented instructions",
  "AES-256 encryption at rest, TLS 1.3 in transit",
  "48-hour breach notification commitment",
  "SOC 2 Type II certified infrastructure",
  "Regular independent security audits",
  "Full data portability and deletion rights",
];

export default function DpaPage() {
  return (
    <>
      {/* Hero */}
      <section className="gradient-hero py-20 lg:py-24">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <Badge className="mb-6 bg-green-600/10 text-green-800 border-green-200 dark:bg-white/20 dark:text-white dark:border-white/30">Legal</Badge>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4 leading-tight">Data Processing Agreement</h1>
          <p className="text-lg text-green-800 dark:text-green-100 max-w-2xl mx-auto mb-4">
            How DIGI-FARMS processes personal data on behalf of partners in compliance with data protection regulations.
          </p>
          <div className="flex items-center justify-center gap-2 text-green-200 text-sm">
            <Calendar className="w-4 h-4" />
            <span>Last updated: {lastUpdated}</span>
          </div>
        </div>
      </section>

      {/* Key Principles */}
      <section style={{ backgroundColor: "#fff", color: "#0f172a" }} className="py-12 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {keyPrinciples.map((p) => (
              <div key={p} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                {p}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section style={{ backgroundColor: "#fff", color: "#0f172a" }} className="py-6 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="text-xs px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-700 transition-colors whitespace-nowrap border border-slate-200 dark:border-slate-700">
                {s.title.replace(/^\d+\.\s/, "")}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section style={{ backgroundColor: "#fff", color: "#0f172a" }} className="py-16 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <Card style={{ backgroundColor: "#fff", color: "#0f172a" }} className="dark:bg-slate-800/50 border-slate-200 dark:border-slate-800">
            <CardContent className="p-6 lg:p-10">
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-200 dark:border-slate-700">
                <ShieldCheck className="w-8 h-8 text-green-600" />
                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white">DIGI-FARMS Data Processing Agreement</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Effective date: {lastUpdated}</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                This Data Processing Agreement (&ldquo;DPA&rdquo;) forms part of the agreement between DIGI-FARMS Ltd (&ldquo;Processor&rdquo;) and the partner organization (&ldquo;Controller&rdquo;) that has entered into a service agreement with DIGI-FARMS. This DPA sets out the terms under which DIGI-FARMS processes personal data on behalf of the Controller in compliance with the Kenya Data Protection Act (2019), the General Data Protection Regulation (GDPR), and other applicable data protection legislation.
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
              See also: <Link href="/legal/privacy" className="text-green-600 hover:underline">Privacy Policy</Link> · <Link href="/legal/terms" className="text-green-600 hover:underline">Terms of Service</Link> · <Link href="/legal/cookies" className="text-green-600 hover:underline">Cookie Policy</Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
