"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { DashboardTopbar } from "@/components/dashboard/topbar";

export type SessionUser = {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
};

export default function DashboardShell({ children, role, user: initialUser }: { children: React.ReactNode; role: string; user: SessionUser }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<SessionUser>(initialUser);

  // Keep image in sync when avatar is uploaded/deleted
  useEffect(() => {
    function onAvatarEvent(e: Event) {
      try {
        const evt = e as CustomEvent;
        setUser((prev) => ({ ...prev, image: evt.detail?.imageUrl ?? null }));
        // Also re-fetch authoritative user record from server to ensure DB value
        fetch('/api/users/me').then((r) => r.ok ? r.json() : null).then((data) => {
          if (data?.user?.image !== undefined) setUser((p) => ({ ...p, image: data.user.image }));
        }).catch(() => null);
      } catch {
        // noop
      }
    }
    window.addEventListener("df:avatar-updated", onAvatarEvent as EventListener);
    return () => window.removeEventListener("df:avatar-updated", onAvatarEvent as EventListener);
  }, []);

  // On mount, fetch authoritative user record (covers case where JWT/session wasn't updated)
  useEffect(() => {
    fetch('/api/users/me').then((r) => r.ok ? r.json() : null).then((data) => {
      if (data?.user) setUser((p) => ({ ...p, ...data.user }));
    }).catch(() => null);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex w-64 flex-col flex-shrink-0 h-full">
        <Sidebar role={role} user={user} />
      </aside>

      {/* Sidebar — mobile overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 z-50">
            <Sidebar role={role} user={user} onNavigate={() => setIsMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardTopbar
          user={user}
          onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          isMobileMenuOpen={isMobileMenuOpen}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
