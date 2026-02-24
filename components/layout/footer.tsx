import Link from "next/link";
import Image from "next/image";
import { Leaf, Twitter, Linkedin, Facebook, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const footerLinks = {
  Platform: [
    { label: "AI Crop Diagnostics", href: "/platform/diagnostics" },
    { label: "Marketplace", href: "/platform/marketplace" },
    { label: "Agrovet Locator", href: "/platform/agrovet-locator" },
    { label: "Farm Analytics", href: "/platform/analytics" },
    { label: "Financing & Insurance", href: "/platform/financing" },
  ],
  Company: [
    { label: "About Us", href: "/company/about" },
    { label: "Our Team", href: "/company/team" },
    { label: "Careers", href: "/company/careers" },
    { label: "Blog", href: "/company/blog" },
    { label: "Partnerships", href: "/company/partnerships" },
  ],
  Resources: [
    { label: "Documentation", href: "/resources/docs" },
    { label: "API Reference", href: "/resources/api" },
    { label: "Help Center", href: "/resources/help" },
    { label: "Case Studies", href: "/resources/case-studies" },
    { label: "Media Kit", href: "/resources/media-kit" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/legal/privacy" },
    { label: "Terms of Service", href: "/legal/terms" },
    { label: "Cookie Policy", href: "/legal/cookies" },
    { label: "Data Processing", href: "/legal/dpa" },
  ],
};

const socials = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Newsletter section */}
      <div className="border-b border-slate-800">
        <div className="container mx-auto px-4 max-w-7xl py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Stay ahead in agritech</h3>
              <p className="text-sm text-slate-400">Get weekly insights on precision farming, market prices, and weather updates.</p>
            </div>
            <form className="flex gap-3 w-full md:w-auto min-w-[320px]">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 dark:text-slate-400 focus:ring-green-500 rounded-xl"
              />
              <Button type="submit" className="shrink-0">Subscribe</Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto px-4 max-w-7xl py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link href="/" className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden flex items-center justify-center">
                <Image src="/digi-farms-logo.jpeg" alt="DIGI-FARMS" width={80} height={80} quality={90} />
              </div>
              <div className="leading-none">
                <span className="font-black text-3xl text-white tracking-tight">DIGI</span>
                <span className="font-black text-3xl text-green-400 tracking-tight">-FARMS</span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-5 max-w-xs">
              AI-powered precision agriculture platform empowering smallholder farmers across East Africa with smart diagnostics, marketplace access, and financing tools.
            </p>

            <div className="space-y-2 mb-6 text-sm">
              <div className="flex items-center gap-2 text-slate-400">
                <Mail className="w-4 h-4 text-green-500 flex-shrink-0" />
                hello@digi-farms.com
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Phone className="w-4 h-4 text-green-500 flex-shrink-0" />
                +254 (0) 700 DIGI-FARM
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin className="w-4 h-4 text-green-500 flex-shrink-0" />
                Nairobi, Kenya
              </div>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-green-600 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-white mb-4 tracking-wide">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-green-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="container mx-auto px-4 max-w-7xl py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} DIGI-FARMS Ltd. All rights reserved. Built for the Hult Prize 2026.</p>
          <div className="flex items-center gap-4">
            <Link href="/legal/privacy" className="hover:text-green-400 transition-colors">Privacy</Link>
            <Link href="/legal/terms" className="hover:text-green-400 transition-colors">Terms</Link>
            <span className="flex items-center gap-1">Made with <span className="text-green-500">♥</span> in Kenya</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
