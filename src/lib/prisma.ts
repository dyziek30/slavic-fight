import { PrismaClient } from "@prisma/client";

// Singleton Prisma — unika wyczerpania połączeń przy hot-reload w dev.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Fallback URL, by brak DATABASE_URL nie wywalał konstrukcji klienta przy imporcie
// (zapytania i tak są w try/catch). W produkcji ustaw realne DATABASE_URL.
const datasourceUrl = process.env.DATABASE_URL ?? "file:./dev.db";

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
