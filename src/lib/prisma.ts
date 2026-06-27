import { PrismaClient } from "@prisma/client";

// Singleton Prisma — unika wyczerpania połączeń przy hot-reload w dev.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Preferuj połączenie bezpośrednie (unpooled) — bezpieczniejsze dla Prisma niż
// pooler Neon (pgbouncer). Fallback na DATABASE_URL, a na końcu na sqlite, by brak
// zmiennej nie wywalał konstrukcji klienta przy imporcie (zapytania są w try/catch).
const datasourceUrl =
  process.env.DATABASE_URL_UNPOOLED ??
  process.env.POSTGRES_URL_NON_POOLING ??
  process.env.DATABASE_URL ??
  "file:./dev.db";

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
