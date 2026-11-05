import "server-only";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const hasDb = Boolean(process.env.DATABASE_URL);

/** null when DATABASE_URL is not set: callers fall back to seed data. */
export const prisma: PrismaClient | null = hasDb
  ? (globalForPrisma.prisma ?? (globalForPrisma.prisma = new PrismaClient()))
  : null;
