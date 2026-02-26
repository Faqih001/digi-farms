import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Calendar, CheckCircle } from "lucide-react";

const lastUpdated = "March 15, 2024";

const keyPrinciples = [
  "Lawfulness, fairness and transparency",
  "Purpose limitation",
  "Data minimisation",
  "Accuracy",
  "Storage limitation",
  "Integrity and confidentiality",
];

const sections = [
  {
    id: "definitions",
    title: "1. Definitions",
    content: [
      { subtitle: "Controller", text: "The entity that determines the purpose and means of processing personal data. In the context of this DPA, the Customer (business using DIGI-FARMS APIs or white-label services) is the Controller." },
      { subtitle: "Processor", text: "DIGI-FARMS Ltd, which processes personal data on behalf of the Controller." },
      { subtitle: "Data Subject", text: "An identified or identifiable natural person whose personal data is processed. This includes farmers, suppliers, and end-users on the platform." },
      { subtitle: "Personal Data", text: "Any information relating to an identified or identifiable natural person, as defined under the Kenya Data Protection Act 2019." },
    ],
  },
  {
    id: "scope",
    title: "2. Scope & Duration",
    content: [
      { subtitle: "", text: "This DPA applies to all processing of personal data by DIGI-FARMS on behalf of Customers using our B2B services, APIs, or data services. It remains in effect for the duration of the service agreement and for the data retention period thereafter." },
    ],
  },
  {
    id: "processor-obligations",
    title: "3. Processor Obligations",
    content: [
      { subtitle: "Lawful Basis", text: "DIGI-FARMS will only process personal data according to documented instructions from the Controller, unless required to do so by applicable law." },
      { subtitle: "Confidentiality", text: "All DIGI-FARMS staff authorised to process personal data are bound by contractual confidentiality obligations." },
      { subtitle: "Security Measures", text: "DIGI-FARMS implements appropriate technical and organisational security measures including end-to-end encryption, access controls, audit logging, and regular penetration testing." },
      { subtitle: "Assistance", text: "DIGI-FARMS will provide reasonable assistance to the Controller in fulfilling obligations under applicable data protection law, including responding to data subject requests." },
    ],
  },
  {
    id: "sub-processors",
    title: "4. Sub-processors",
    content: [
      { subtitle: "Authorisation", text: "The Controller provides general authorisation for DIGI-FARMS to use sub-processors. DIGI-FARMS maintains an up-to-date list of sub-processors at digi-farms.com/legal/sub-processors." },
      { subtitle: "Notification", text: "DIGI-FARMS will notify Controllers of any intended changes to sub-processors at least 30 days before the change takes effect, giving Controllers the opportunity to object." },
      { subtitle: "Liability", text: "DIGI-FARMS remains fully liable to the Controller for sub-processor performance of data protection obligations." },
    ],
  },
  {
    id: "data-subject-rights",
    title: "5. Data Subject Rights",
    content: [
      { subtitle: "", text: "DIGI-FARMS will promptly notify the Controller of any data subject requests (access, rectification, erasure, portability, restriction, objection) received directly. DIGI-FARMS will provide technical assistance to help Controllers fulfil such requests within applicable statutory timeframes (typically 30 days under the Kenya DPA)." },
    ],
  },
  {
    id: "international-transfers",
    title: "6. International Data Transfers",
    content: [
      { subtitle: "", text: "DIGI-FARMS primarily stores and processes data within Kenya and the African Union region. Any transfer of personal data outside Kenya is conducted under Standard Contractual Clauses or equivalent safeguards as recognised under the Kenya Data Protection Act 2019. Controllers will be notified of any changes to data residency." },
    ],
  },
  {
    id: "breach-notification",
    title: "7. Data Breach Notification",
    content: [
      { subtitle: "", text: "In the event of a personal data breach, DIGI-FARMS will notify the affected Controller without undue delay and, where feasible, within 72 hours of becoming aware of the breach. Notifications will include the nature of the breach, categories and approximate number of data subjects affected, likely consequences, and measures taken or proposed to address the breach." },
    ],
  },
  {
    id: "audits",
    title: "8. Audits & Compliance",
    content: [
      { subtitle: "", text: "DIGI-FARMS makes available to Controllers all information necessary to demonstrate compliance with this DPA. Controllers may conduct audits (or appoint an auditor) with 30 days prior written notice, subject to confidentiality obligations. DIGI-FARMS undergoes annual third-party security audits, the summary reports of which are available on request." },
    ],
  },
  {
    id: "termination",
    title: "9. Termination & Data Return",
    content: [
      { subtitle: "", text: "Upon termination of the service agreement, DIGI-FARMS will, at the Controller's election, either return all personal data in machine-readable format or securely delete it within 30 days. DIGI-FARMS will provide written confirmation of deletion upon request. Data retained due to legal obligations will be clearly identified." },
    ],
  },
  {
    id: "contact",
    title: "10. Contact & Supervisory Authority",
    content: [
      { subtitle: "Data Protection Officer", text: "DIGI-FARMS DPO can be reached at dpo@digi-farms.com. We aim to respond to all DPA-related inquiries within 5 business days." },
      { subtitle: "Supervisory Authority", text: "The supervisory authority for data protection in Kenya is the Office of the Data Protection Commissioner (ODPC). Data subjects and Controllers have the right to lodge complaints with the ODPC if they believe data protection rights have been violated." },
    ],
  },
];

export function DpaHeroSection() {
  return (
    <section className="gradient-hero py-20 lg:py-24">
      <div className="container mx-auto px-4 max-w-7xl text-center">
        <Badge className="mb-6 bg-white/20 text-white border-white/30">Legal</Badge>
        <h1 className="text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">Data Processing Agreement</h1>
        <p className="text-lg text-green-100 max-w-2xl mx-auto mb-4">
          Our commitment to lawful, secure, and transparent processing of personal data.
        </p>
        <div className="flex items-center justify-center gap-2 text-green-200 text-sm">
          <Calendar className="w-4 h-4" />
          <span>Last updated: {lastUpdated}</span>
        </div>
      </div>
    </section>
  );
}

export function DpaKeyPrinciplesSection() {
  return (
    <section className="py-10 bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 max-w-7xl">
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4 text-center">
          GDPR & Kenya DPA Principles We Uphold
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {keyPrinciples.map((p) => (
            <div
              key={p}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0" />
              <span className="text-sm text-slate-700 dark:text-slate-300">{p}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DpaNavSection() {
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

export function DpaContentSection() {
  return (
    <section className="py-16 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 max-w-7xl">
        <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <CardContent className="p-6 lg:p-10">
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-200 dark:border-slate-700">
              <ShieldCheck className="w-8 h-8 text-green-600" />
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white">Data Processing Agreement (DPA)</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Effective date: {lastUpdated}</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
              This Data Processing Agreement (&ldquo;DPA&rdquo;) forms part of the service agreement between DIGI-FARMS Ltd (&ldquo;Processor&rdquo;) and its business customers (&ldquo;Controller&rdquo;). It governs the processing of personal data carried out by DIGI-FARMS on behalf of the Controller in connection with DIGI-FARMS services, in compliance with the Kenya Data Protection Act 2019 and the EU General Data Protection Regulation (GDPR) where applicable.
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
            <Link href="/legal/terms" className="text-green-600 hover:underline">Terms of Service</Link>
            {" · "}
            <Link href="/legal/cookies" className="text-green-600 hover:underline">Cookie Policy</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
