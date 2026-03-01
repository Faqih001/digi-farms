import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "sonner";
import FloatingChatWrapper from "@/components/chat/FloatingChatWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Digi Farms – Precision Agriculture Platform",
    template: "%s | Digi Farms",
  },
  description:
    "AI-powered precision agriculture platform connecting farmers to diagnostics, marketplace, financing, and agrovets across East Africa.",
  keywords: ["agriculture", "farming", "AI", "crop diagnostics", "agritech", "Kenya", "East Africa"],
  authors: [{ name: "DIGI-FARMS Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://digi-farms.com",
    title: "Digi Farms – Precision Agriculture Platform",
    description: "AI-powered precision agriculture platform",
    siteName: "Digi Farms",
  },
  icons: {
    icon: [
      { url: "/digi-farms-logo.ico" },
    ],
    shortcut: "/digi-farms-logo.ico",
    apple: "/digi-farms-logo.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              style: { fontFamily: "var(--font-geist-sans)" },
            }}
          />
          <FloatingChatWrapper />
        </ThemeProvider>
      </body>
    </html>
  );
}
