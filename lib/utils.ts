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
