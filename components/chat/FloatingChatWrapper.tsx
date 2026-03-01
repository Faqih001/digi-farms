"use client";

import dynamic from "next/dynamic";
import { SessionProvider } from "next-auth/react";

// ssr: false is only valid inside a Client Component — hence this wrapper.
// SessionProvider is needed because FloatingChat uses useSession and is
// rendered from the root layout which has no SessionProvider of its own.
const FloatingChat = dynamic(() => import("@/components/chat/FloatingChat"), { ssr: false });

export default function FloatingChatWrapper() {
  return (
    <SessionProvider>
      <FloatingChat />
    </SessionProvider>
  );
}
