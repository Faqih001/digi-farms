import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Cookie, Calendar, Settings, BarChart2, Layers, Target } from "lucide-react";

const lastUpdated = "March 15, 2024";

const cookieTypes = [
  {
    name: "Essential Cookies",
    icon: Settings,
    description: "These cookies are necessary for the platform to function. They cannot be disabled.",
    canDisable: false,
    cookies: [
      { name: "session_id", purpose: "Maintains your login session", duration: "Session", provider: "DIGI-FARMS" },
      { name: "csrf_token", purpose: "Prevents cross-site request forgery", duration: "Session", provider: "DIGI-FARMS" },
      { name: "auth_token", purpose: "Authenticates API requests", duration: "30 days", provider: "DIGI-FARMS" },
      { name: "locale", purpose: "Stores language preference", duration: "1 year", provider: "DIGI-FARMS" },
    ],
  },
  {
    name: "Analytics Cookies",
    icon: BarChart2,
    description: "Help us understand how you use the platform so we can improve it.",
    canDisable: true,
    cookies: [
      { name: "_ga", purpose: "Distinguishes users for Google Analytics", duration: "2 years", provider: "Google" },
      { name: "_gid", purpose: "Stores page view data", duration: "24 hours", provider: "Google" },
      { name: "mixpanel_id", purpose: "Tracks feature usage events", duration: "1 year", provider: "Mixpanel" },
      { name: "hotjar_id", purpose: "Records user session heatmaps", duration: "365 days", provider: "Hotjar" },
    ],
  },
  {
    name: "Functional Cookies",
    icon: Layers,
    description: "Enable enhanced features and personalization.",
    canDisable: true,
    cookies: [
      { name: "theme", purpose: "Remembers light/dark mode preference", duration: "1 year", provider: "DIGI-FARMS" },
      { name: "dashboard_layout", purpose: "Saves your dashboard widget layout", duration: "6 months", provider: "DIGI-FARMS" },
      { name: "map_zoom", purpose: "Remembers map zoom level", duration: "30 days", provider: "DIGI-FARMS" },
      { name: "intercom_id", purpose: "Enables in-app chat support", duration: "9 months", provider: "Intercom" },
    ],
  },
  {
    name: "Marketing Cookies",
    icon: Target,
    description: "Used to show relevant ads and measure campaign effectiveness. Requires explicit consent.",
    canDisable: true,
    cookies: [
      { name: "fbp", purpose: "Facebook Pixel for conversion tracking", duration: "90 days", provider: "Meta" },
      { name: "fr", purpose: "Facebook advertising cookie", duration: "90 days", provider: "Meta" },
      { name: "li_fat_id", purpose: "LinkedIn ad conversion tracking", duration: "30 days", provider: "LinkedIn" },
      { name: "ttclid", purpose: "TikTok ad attribution", duration: "7 days", provider: "TikTok" },
    ],
  },
];

const managementOptions = [
  {
    title: "Cookie Preferences",
    description: "Use the cookie preferences panel (accessible from the footer) to enable or disable optional cookie categories.",
  },
  {
    title: "Browser Settings",
    description: "Most browsers allow you to block or delete cookies via settings. Note that blocking essential cookies will prevent platform login.",
  },
  {
    title: "Opt-Out Tools",
    description: "For analytics, use the Google Analytics opt-out browser add-on. For advertising, use industry opt-out tools like YourAdChoices.",
  },
  {
    title: "Clear Existing Cookies",
    description: "You can clear all cookies via your browser settings. This will log you out of all sessions and reset your preferences.",
  },
];

export function CookiesHeroSection() {
  return (
    <section className="gradient-hero py-20 lg:py-24">
      <div className="container mx-auto px-4 max-w-7xl text-center">
        <Badge className="mb-6 bg-white/20 text-white border-white/30">Legal</Badge>
        <h1 className="text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">Cookie Policy</h1>
        <p className="text-lg text-green-100 max-w-2xl mx-auto mb-4">
          We use cookies to provide a great experience. Here&apos;s exactly what we use and why.
        </p>
        <div className="flex items-center justify-center gap-2 text-green-200 text-sm">
          <Calendar className="w-4 h-4" />
          <span>Last updated: {lastUpdated}</span>
        </div>
      </div>
    </section>
  );
}

export function CookiesContentSection() {
  return (
    <section className="py-16 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 max-w-7xl">
        <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <CardContent className="p-6 lg:p-10">
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-200 dark:border-slate-700">
              <Cookie className="w-8 h-8 text-green-600 dark:text-green-400" />
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white">Cookie Policy</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Effective date: {lastUpdated}</p>
              </div>
            </div>

            <div className="mb-10">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">What Are Cookies?</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Cookies are small text files placed on your device when you visit a website. They help websites remember your preferences, maintain sessions, and collect analytics data. DIGI-FARMS uses cookies and similar technologies (local storage, session storage) to operate and improve our platform.
              </p>
            </div>

            {cookieTypes.map((type) => {
              const Icon = type.icon;
              return (
                <div key={type.name} className="mb-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white">{type.name}</h3>
                      {!type.canDisable && (
                        <span className="text-xs text-red-500 dark:text-red-400">Required — cannot be disabled</span>
                      )}
                      {type.canDisable && (
                        <span className="text-xs text-slate-500 dark:text-slate-400">Optional — can be disabled</span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{type.description}</p>
                  <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-700/50">
                          <th className="text-left px-4 py-2 text-slate-700 dark:text-slate-300 font-semibold">Name</th>
                          <th className="text-left px-4 py-2 text-slate-700 dark:text-slate-300 font-semibold">Purpose</th>
                          <th className="text-left px-4 py-2 text-slate-700 dark:text-slate-300 font-semibold">Duration</th>
                          <th className="text-left px-4 py-2 text-slate-700 dark:text-slate-300 font-semibold">Provider</th>
                        </tr>
                      </thead>
                      <tbody>
                        {type.cookies.map((cookie, i) => (
                          <tr key={i} className="border-t border-slate-100 dark:border-slate-700">
                            <td className="px-4 py-2 font-mono text-xs text-slate-800 dark:text-slate-200">{cookie.name}</td>
                            <td className="px-4 py-2 text-slate-600 dark:text-slate-400">{cookie.purpose}</td>
                            <td className="px-4 py-2 text-slate-600 dark:text-slate-400 whitespace-nowrap">{cookie.duration}</td>
                            <td className="px-4 py-2 text-slate-600 dark:text-slate-400">{cookie.provider}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Managing Your Cookies</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {managementOptions.map((opt, i) => (
                  <div key={i} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700">
                    <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-1">{opt.title}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{opt.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="text-center mt-8">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            See also:{" "}
            <Link href="/legal/privacy" className="text-green-600 hover:underline">Privacy Policy</Link>
            {" · "}
            <Link href="/legal/terms" className="text-green-600 hover:underline">Terms of Service</Link>
            {" · "}
            <Link href="/legal/dpa" className="text-green-600 hover:underline">Data Processing Agreement</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
