import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, isToday, isTomorrow, isPast } from "date-fns";
import { es } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, pattern = "dd MMM yyyy") {
  return format(new Date(date), pattern, { locale: es });
}

export function formatRelative(date: string | Date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: es });
}

export function formatTime(date: string | Date) {
  return format(new Date(date), "HH:mm");
}

export function isOverdue(date: string) {
  return isPast(new Date(date)) && !isToday(new Date(date));
}

export function isDueToday(date: string) {
  return isToday(new Date(date));
}

export function isDueTomorrow(date: string) {
  return isTomorrow(new Date(date));
}

export function formatCurrency(value: number, unit = "USD") {
  if (unit === "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  }
  return `${value.toLocaleString()} ${unit}`;
}

export function getProgressColor(progress: number): string {
  if (progress >= 80) return "accent-green";
  if (progress >= 40) return "accent-purple";
  if (progress >= 20) return "accent-amber";
  return "accent-red";
}

export function truncate(str: string, length: number) {
  if (str.length <= length) return str;
  return str.slice(0, length) + "…";
}
