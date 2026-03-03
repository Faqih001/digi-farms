import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/lib/auth";

export default async function LandingLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return (
    <SessionProvider session={session} refetchInterval={0} refetchOnWindowFocus={false}>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </SessionProvider>
  );
}
