import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "./env";
import { logger } from "./logger";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

// Connection pool configuration for production
const POOL_CONFIG = {
  // Maximum number of clients in the pool
  max: process.env.NODE_ENV === "production" ? 20 : 5,
  // Minimum number of idle clients
  min: process.env.NODE_ENV === "production" ? 2 : 1,
  // Close idle clients after 30 seconds
  idleTimeoutMillis: 30000,
  // Return an error after 10 seconds if connection cannot be established
  connectionTimeoutMillis: 10000,
  // Maximum time a query can run (5 minutes)
  statement_timeout: 300000,
  // Close connections that have been idle for too long
  allowExitOnIdle: process.env.NODE_ENV !== "production",
};

function createPrismaClient() {
  const connectionString = env.DATABASE_URL;

  const pool = new Pool({
    connectionString,
    ...POOL_CONFIG,
  });

  // Handle pool errors
  pool.on("error", (err) => {
    logger.error("Unexpected database pool error", {
      error: err instanceof Error ? err.message : "Unknown error",
    });
  });

  // Store pool reference for cleanup
  globalForPrisma.pool = pool;

  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Graceful shutdown handler
export async function disconnectPrisma(): Promise<void> {
  await prisma.$disconnect();
  if (globalForPrisma.pool) {
    await globalForPrisma.pool.end();
  }
}
