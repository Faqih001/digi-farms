"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const FloatingChat = dynamic(() => import("@/components/chat/FloatingChat"), { ssr: false });

const DASHBOARD_PREFIXES = ["/farmer", "/admin", "/supplier", "/lender"];

export default function FloatingChatWrapper() {
  const pathname = usePathname();
  if (DASHBOARD_PREFIXES.some((p) => pathname?.startsWith(p))) return null;
  return <FloatingChat />;
}
