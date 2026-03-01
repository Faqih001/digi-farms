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
  // internal lock to avoid concurrent recreation attempts
  _recreateLock?: boolean;
};

function createPrismaClient() {
  // Reuse the Pool singleton across hot reloads in development so that
  // in-flight WebSocket connections are not abandoned and the "non-101
  // status code" error is avoided.
  if (!globalForPrisma.pool) {
    globalForPrisma.pool = new Pool({ connectionString: process.env.DATABASE_URL! });
    // Attach an error handler to surface WebSocket/Pool errors and attempt
    // a single recreate in development to recover from transient error-events.
    try {
      // Some Pool implementations emit 'error' events (Node EventEmitter).
      // Attach handler defensively; if the pool does not support .on, this will be skipped.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const p = globalForPrisma.pool as any;
      if (p && typeof p.on === "function") {
        p.on("error", (err: any) => {
          console.error("Neon Pool error event:", err);
          // Try one-time recreation in dev to recover from HMR-induced broken sockets.
          if (process.env.NODE_ENV !== "production" && !globalForPrisma._recreateLock) {
            globalForPrisma._recreateLock = true;
            setTimeout(() => {
              try {
                console.warn("Recreating Neon Pool and PrismaClient after pool error (dev only)");
                globalForPrisma.pool = new Pool({ connectionString: process.env.DATABASE_URL! });
                const adapter = new PrismaNeon(globalForPrisma.pool as any);
                globalForPrisma.prisma = new PrismaClient({ adapter, log: ["error", "warn"] });
              } catch (reErr) {
                console.error("Failed to recreate pool/prisma:", reErr);
              } finally {
                // allow future recreate attempts after a delay
                setTimeout(() => (globalForPrisma._recreateLock = false), 60000);
              }
            }, 3000);
          }
        });
      }
    } catch (attachErr) {
      console.warn("Could not attach Pool error handler:", attachErr);
    }
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
