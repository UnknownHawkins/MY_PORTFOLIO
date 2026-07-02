import type { NextAuthConfig } from "next-auth";

const secret =
  process.env.NEXTAUTH_SECRET ||
  process.env.AUTH_SECRET ||
  "portfolio-default-secret-key-change-in-prod-env";

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
  secret,
} satisfies NextAuthConfig;
