import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getImageUrl(path: string) {
  if (!path) return path;
  // Absolute URLs or direct local static assets in public/images
  if (
    /^https?:\/\//i.test(path) ||
    path.startsWith("//") ||
    path.startsWith("data:")
  ) {
    return path;
  }
  if (path.startsWith("/images/") || path.startsWith("images/")) {
    return path.startsWith("/") ? path : `/${path}`;
  }
  const baseUrl = import.meta.env.VITE_API_URL?.replace("/api/v1", "") || 'http://localhost:5000';
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}

