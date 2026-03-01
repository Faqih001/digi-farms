"use client";

import dynamic from "next/dynamic";

// ssr: false is only valid inside a Client Component — hence this wrapper.
const FloatingChat = dynamic(() => import("@/components/chat/FloatingChat"), { ssr: false });

export default function FloatingChatWrapper() {
  return <FloatingChat />;
}
