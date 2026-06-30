import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Reads a CSS custom property (e.g. "--orange") off :root at runtime so the
 * WebGL hero can consume the brand palette without duplicating hex values.
 * Returns the provided fallback during SSR or if the variable is missing.
 */
export function getCssColor(variable: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim();
  return value || fallback;
}
