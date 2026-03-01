import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MobileNav from "@/components/layout/mobile-nav";
import { SessionProvider } from "next-auth/react";

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Header />
      <main className="min-h-screen pb-16 md:pb-0">{children}</main>
      <Footer />
      <MobileNav />
    </SessionProvider>
  );
}
