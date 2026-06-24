import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [], // Providers are added in auth.ts to keep edge bundle small
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = "admin";
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
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-key-32-chars-for-dev",
} satisfies NextAuthConfig;
