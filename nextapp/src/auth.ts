import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const emailStr = credentials.email as string;
        const passwordStr = credentials.password as string;

        const adminEmail = process.env.ADMIN_EMAIL || "jonsnower07@gmail.com";
        const adminPassword = process.env.ADMIN_PASSWORD || "change-me-after-first-login";

        // Try to query the database first
        try {
          const user = await prisma.user.findUnique({
            where: { email: emailStr },
          });

          if (user) {
            const isValid = await bcrypt.compare(passwordStr, user.password);
            if (isValid) {
              return {
                id: user.id,
                email: user.email,
                name: "Anubhav Singh",
              };
            }
          }
        } catch (dbError) {
          console.error("Database authorization failed, falling back to static config check:", dbError);
        }

        // Static fallback if DB is down or empty, matching local development default env variables
        if (emailStr === adminEmail && passwordStr === adminPassword) {
          return {
            id: "static-admin",
            email: adminEmail,
            name: "Anubhav Singh (Fallback)",
          };
        }

        return null;
      },
    }),
  ],
});
