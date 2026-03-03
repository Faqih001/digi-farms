/**
 * Edge-compatible NextAuth config (no Node.js-only imports like Prisma, bcrypt, or ws).
 * Shared between middleware.ts (Edge) and lib/auth.ts (Node.js).
 */
import type { NextAuthConfig } from "next-auth";
import type { Role } from "@prisma/client";

export const authConfig = {
  trustHost: true,
  session: { strategy: "jwt" as const },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  // Providers are added in lib/auth.ts (Node.js only). Edge middleware only
  // needs to verify the JWT — it never calls authorize().
  providers: [],
  callbacks: {
    async jwt({ token, user, trigger, session: updateData }) {
      if (user) {
        token.role = (user as { role?: Role }).role;
        token.id = user.id;
        token.picture =
          (user as { image?: string | null }).image ?? token.picture;
      }
      if (trigger === "update" && updateData?.picture !== undefined) {
        token.picture = updateData.picture;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        if (token.picture !== undefined) {
          session.user.image = (token.picture as string | null) ?? null;
        }
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
