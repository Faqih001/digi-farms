import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "KES") {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    ...options,
  }).format(new Date(date));
}

export function formatRelativeTime(date: Date | string) {
  const now = new Date();
  const d = new Date(date);
  const diff = now.getTime() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 7) return formatDate(date);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "Just now";
}

export function truncate(str: string, length: number) {
  return str.length > length ? `${str.slice(0, length)}...` : str;
}

export function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function generateOrderId() {
  return `DF-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
}

export function getRoleRedirectPath(role: string) {
  switch (role) {
    case "FARMER": return "/farmer";
    case "SUPPLIER": return "/supplier";
    case "LENDER": return "/lender";
    case "ADMIN": return "/admin";
    default: return "/farmer";
  }
}

export function getStatusColor(status: string) {
  const map: Record<string, string> = {
    HEALTHY: "text-green-600 bg-green-50",
    AT_RISK: "text-amber-600 bg-amber-50",
    DISEASED: "text-red-600 bg-red-50",
    UNKNOWN: "text-gray-600 bg-gray-50",
    ACTIVE: "text-green-600 bg-green-50",
    APPROVED: "text-green-600 bg-green-50",
    PENDING: "text-amber-600 bg-amber-50",
    SUBMITTED: "text-blue-600 bg-blue-50",
    REJECTED: "text-red-600 bg-red-50",
    DELIVERED: "text-green-600 bg-green-50",
    CANCELLED: "text-red-600 bg-red-50",
    EXPIRED: "text-gray-600 bg-gray-50",
  };
  return map[status] ?? "text-gray-600 bg-gray-50";
}

export function formatPrismaError(err: unknown): { message: string; code?: string; meta?: unknown; stack?: string } {
  try {
    if (!err) return { message: "Unknown database error" };
    if (err instanceof Error) {
      // @ts-ignore
      const code = (err as any).code as string | undefined;
      // @ts-ignore
      const meta = (err as any).meta;
      const msg = err.message?.trim();
      return {
        message: msg || "Database connection error. Please try again.",
        code,
        meta,
        stack: err.stack,
      };
    }
    if (typeof err === "object") {
      const o = err as Record<string, unknown>;
      const msg = typeof o.message === "string" ? o.message.trim() : "";
      return {
        message: msg || "Database connection error. Please try again.",
        code: o.code as string | undefined,
        meta: o.meta,
        stack: o.stack as string | undefined,
      };
    }
    return { message: String(err) || "Unknown database error" };
  } catch {
    return { message: "Database error" };
  }
}

export async function retryAsync<T>(fn: () => Promise<T>, attempts = 4, delayMs = 400): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      if (i < attempts - 1) await new Promise((r) => setTimeout(r, delayMs * (i + 1)));
    }
  }
  // After all retries, throw a clean Error so callers always get an Error instance
  const info = formatPrismaError(lastErr);
  throw new Error(info.message);
}
