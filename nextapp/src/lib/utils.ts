import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";

// ── Class name utility ────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── Date utilities ─────────────────────────────────────────
export function formatDate(date: Date | string): string {
  try {
    return format(new Date(date), "MMM yyyy");
  } catch {
    return String(date);
  }
}

export function formatDateFull(date: Date | string): string {
  try {
    return format(new Date(date), "MMMM d, yyyy");
  } catch {
    return String(date);
  }
}

export function timeAgo(date: Date | string): string {
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch {
    return "recent";
  }
}

// ── String utilities ───────────────────────────────────────
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

// ── Number utilities ───────────────────────────────────────
export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toString();
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// ── URL utilities ──────────────────────────────────────────
export function getAbsoluteUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${baseUrl}${path}`;
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// ── Color utilities ────────────────────────────────────────
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function getLanguageColor(language: string): string {
  const colors: Record<string, string> = {
    JavaScript: "#F7DF1E",
    TypeScript: "#3178C6",
    Python: "#3776AB",
    Java: "#ED8B00",
    "C++": "#00599C",
    C: "#555555",
    HTML: "#E34F26",
    CSS: "#1572B6",
    Shell: "#89E051",
    Go: "#00ADD8",
    Rust: "#CE422B",
    PHP: "#777BB4",
    Ruby: "#CC342D",
    Swift: "#F05138",
    Kotlin: "#A97BFF",
    Dart: "#00B4AB",
  };
  return colors[language] || "#64748b";
}

// ── Delay utility ──────────────────────────────────────────
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Array utilities ────────────────────────────────────────
export function groupBy<T>(
  arr: T[],
  key: keyof T
): Record<string, T[]> {
  return arr.reduce(
    (groups, item) => {
      const group = String(item[key]);
      groups[group] = groups[group] ?? [];
      groups[group].push(item);
      return groups;
    },
    {} as Record<string, T[]>
  );
}

export function sortBy<T>(arr: T[], key: keyof T, direction: "asc" | "desc" = "asc"): T[] {
  return [...arr].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    if (aVal < bVal) return direction === "asc" ? -1 : 1;
    if (aVal > bVal) return direction === "asc" ? 1 : -1;
    return 0;
  });
}

// ── Environment utilities ──────────────────────────────────
export function isDev(): boolean {
  return process.env.NODE_ENV === "development";
}

export function isProd(): boolean {
  return process.env.NODE_ENV === "production";
}

// ── IP Address utility ─────────────────────────────────────
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return realIp || "unknown";
}
