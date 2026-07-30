import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getImageUrl(path: string) {
  // Absolute URLs (e.g. Unsplash, CDN, or already-full links) are returned as-is.
  if (!path) return path;
  if (/^https?:\/\//i.test(path) || path.startsWith("//") || path.startsWith("data:")) {
    return path;
  }
  const baseUrl = import.meta.env.VITE_API_URL?.replace("/api/v1", "") || 'http://localhost:5000';
  return `${baseUrl}${path}`;
}
