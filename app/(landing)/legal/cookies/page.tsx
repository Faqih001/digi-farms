import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Cookie, Calendar, CheckCircle, Settings } from "lucide-react";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "DIGI-FARMS Cookie Policy. Understand what cookies we use, why we use them, and how to manage your preferences.",
};

const lastUpdated = "March 15, 2024";

const cookieTypes = [
  {
    category: "Essential Cookies",
    required: true,
    desc: "These cookies are necessary for the platform to function. They enable core features like authentication, security, and session management. Disabling these would prevent the platform from working correctly.",
    cookies: [
      { name: "session_id", purpose: "Maintains your login session", duration: "Session", provider: "DIGI-FARMS" },
      { name: "csrf_token", purpose: "Prevents cross-site request forgery attacks", duration: "Session", provider: "DIGI-FARMS" },
      { name: "auth_token", purpose: "Authenticates API requests", duration: "30 days", provider: "DIGI-FARMS" },
      { name: "cookie_consent", purpose: "Stores your cookie preferences", duration: "1 year", provider: "DIGI-FARMS" },
    ],
  },
  {
    category: "Analytics Cookies",
    required: false,
    desc: "These cookies help us understand how users interact with our platform. Data is aggregated and anonymized. You can opt out without affecting platform functionality.",
    cookies: [
      { name: "_ga", purpose: "Distinguishes unique users for analytics", duration: "2 years", provider: "Google Analytics" },
      { name: "_gid", purpose: "Distinguishes users for 24-hour analytics", duration: "24 hours", provider: "Google Analytics" },
      { name: "mp_*", purpose: "Tracks feature usage and user flows", duration: "1 year", provider: "Mixpanel" },
    ],
  },
  {
    category: "Functional Cookies",
    required: false,
    desc: "These cookies enable enhanced functionality and personalization, such as remembering your language and theme preferences.",
    cookies: [
      { name: "theme", purpose: "Remembers your dark/light mode preference", duration: "1 year", provider: "DIGI-FARMS" },
      { name: "locale", purpose: "Stores your language preference", duration: "1 year", provider: "DIGI-FARMS" },
      { name: "recent_searches", purpose: "Remembers your recent marketplace searches", duration: "30 days", provider: "DIGI-FARMS" },
    ],
  },
  {
    category: "Marketing Cookies",
    required: false,
    desc: "These cookies are used to deliver relevant advertisements and measure campaign effectiveness. We only use these with your explicit consent.",
    cookies: [
      { name: "_fbp", purpose: "Used by Facebook for ad targeting", duration: "90 days", provider: "Meta" },
      { name: "ads/ga-audiences", purpose: "Used for Google Ads remarketing", duration: "Session", provider: "Google" },
    ],
  },
];

const managementOptions = [
  { title: "Browser Settings", desc: "Most browsers allow you to control cookies through their settings. You can block or delete cookies, though this may affect platform functionality." },
  { title: "Cookie Preferences", desc: "Use our cookie consent banner (shown on first visit) to manage which optional cookie categories are active. You can update these preferences at any time." },
  { title: "Opt-Out Links", desc: "For third-party analytics, you can opt out directly: Google Analytics (tools.google.com/dlpage/gaoptout), Mixpanel (mixpanel.com/optout)." },
  { title: "Do Not Track", desc: "We respect the Do Not Track (DNT) browser signal. When enabled, we disable non-essential analytics and marketing cookies automatically." },
];

export default function CookiePolicyPage() {
  return (
    <>
      {/* Hero */}
      <section className="gradient-hero py-20 lg:py-24">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <Badge className="mb-6 bg-white/20 text-white border-white/30">Legal</Badge>
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">Cookie Policy</h1>
          <p className="text-lg text-green-100 max-w-2xl mx-auto mb-4">
            How we use cookies and similar technologies on the DIGI-FARMS platform.
          </p>
          <div className="flex items-center justify-center gap-2 text-green-200 text-sm">
            <Calendar className="w-4 h-4" />
            <span>Last updated: {lastUpdated}</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section style={{ backgroundColor: "#fff" }} className="py-16 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <Card style={{ backgroundColor: "#fff" }} className="dark:bg-slate-800/50 border-slate-200 dark:border-slate-800">
            <CardContent className="p-6 lg:p-10">
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-200 dark:border-slate-700">
                <Cookie className="w-8 h-8 text-green-600" />
                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white">DIGI-FARMS Cookie Policy</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Effective date: {lastUpdated}</p>
                </div>
              </div>

              {/* What Are Cookies */}
              <div className="mb-10">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">What Are Cookies?</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Cookies are small text files placed on your device when you visit a website. They help the site remember your preferences, understand how you use it, and improve your experience. We also use similar technologies like local storage and session storage.
                </p>
              </div>

              {/* Cookie Types */}
              {cookieTypes.map((ct) => (
                <div key={ct.category} className="mb-10">
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{ct.category}</h3>
                    {ct.required ? (
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 border-0 text-xs">Required</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">Optional</Badge>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">{ct.desc}</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-700">
                          <th className="text-left py-2 pr-4 font-semibold text-slate-700 dark:text-slate-300">Cookie</th>
                          <th className="text-left py-2 pr-4 font-semibold text-slate-700 dark:text-slate-300">Purpose</th>
                          <th className="text-left py-2 pr-4 font-semibold text-slate-700 dark:text-slate-300">Duration</th>
                          <th className="text-left py-2 font-semibold text-slate-700 dark:text-slate-300">Provider</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ct.cookies.map((c) => (
                          <tr key={c.name} className="border-b border-slate-100 dark:border-slate-800">
                            <td className="py-2 pr-4 font-mono text-xs text-green-600">{c.name}</td>
                            <td className="py-2 pr-4 text-slate-600 dark:text-slate-400">{c.purpose}</td>
                            <td className="py-2 pr-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">{c.duration}</td>
                            <td className="py-2 text-slate-600 dark:text-slate-400 whitespace-nowrap">{c.provider}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}

              {/* Managing Cookies */}
              <div className="mb-10">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-green-500" />
                  Managing Your Cookies
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {managementOptions.map((m) => (
                    <div key={m.title} className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                      <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {m.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{m.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Changes */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Changes to This Policy</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  We may update this Cookie Policy periodically. Changes will be posted on this page with an updated effective date. For significant changes, we will provide notice through the platform.
                </p>
              </div>

              {/* Contact */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Questions?</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  For questions about our cookie practices, contact us at privacy@digi-farms.com.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-8">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              See also: <Link href="/legal/privacy" className="text-green-600 hover:underline">Privacy Policy</Link> · <Link href="/legal/terms" className="text-green-600 hover:underline">Terms of Service</Link> · <Link href="/legal/dpa" className="text-green-600 hover:underline">Data Processing Agreement</Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
