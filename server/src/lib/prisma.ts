import { PrismaClient } from "@prisma/client";
import type { Config } from "../config";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export function createPrismaClient(config: Config): PrismaClient {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  const client = new PrismaClient({
    datasourceUrl: config.DATABASE_URL,
    log: config.NODE_ENV === "development" ? ["query", "error"] : ["error"],
  });

  if (config.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }

  return client;
}
