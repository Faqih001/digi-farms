import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// Required: supply the ws WebSocket constructor for Node.js runtime.
// Without this the Neon serverless driver cannot upgrade the HTTP connection
// to WebSocket (HTTP 101), which produces the "non-101 status code" error.
neonConfig.webSocketConstructor = ws;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

function createPrismaClient() {
  // Reuse the Pool singleton across hot reloads in development so that
  // in-flight WebSocket connections are not abandoned and the "non-101
  // status code" error is avoided.
  if (!globalForPrisma.pool) {
    globalForPrisma.pool = new Pool({ connectionString: process.env.DATABASE_URL! });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adapter = new PrismaNeon(globalForPrisma.pool as any);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
