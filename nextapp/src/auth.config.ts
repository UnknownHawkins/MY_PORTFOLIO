import type { NextAuthConfig } from "next-auth";

// In production, NEXTAUTH_SECRET MUST be set. Never use a hardcoded fallback.
// In development, a placeholder is used so the server can start.
const secret = process.env.NEXTAUTH_SECRET;
if (!secret && process.env.NODE_ENV === "production") {
  throw new Error(
    "[AUTH] NEXTAUTH_SECRET must be set in production environment variables."
  );
}

const isProduction = process.env.NODE_ENV === "production";

export const authConfig = {
  providers: [], // Providers are added in auth.ts to keep the edge bundle small
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 60 * 60,   // Refresh session token every hour
  },
  pages: {
    signIn: "/letsfuck",
    error: "/letsfuck",
  },
  // Required for Render deployment — trusts the forwarded host header
  trustHost: true,
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = "admin";
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },
  },
  secret: secret || "dev-only-insecure-secret-change-in-production",
} satisfies NextAuthConfig;
