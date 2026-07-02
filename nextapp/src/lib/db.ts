import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

// Prevent multiple instances of Prisma Client in development
// https://www.prisma.io/docs/guides/performance-and-optimization/connection-management

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const createPrismaClient = () => {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN;

  const logOption: ("query" | "error" | "warn")[] =
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"];

  if (tursoUrl && tursoToken) {
    try {
      const adapter = new PrismaLibSql({
        url: tursoUrl,
        authToken: tursoToken,
      });
      return new PrismaClient({
        adapter,
        log: logOption,
      });
    } catch (err) {
      console.error("Failed to create libSQL adapter:", err);
      throw err;
    }
  }

  return new PrismaClient({
    log: logOption,
  });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
