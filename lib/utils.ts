import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function stripHtml(html: string): string {
  if (!html) return "";
  
  // Remove style tags and their contents
  let cleaned = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
  // Remove script tags and their contents
  cleaned = cleaned.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");
  // Remove all other HTML tags
  cleaned = cleaned.replace(/<[^>]+>/g, "");
  
  // Replace HTML entities
  cleaned = cleaned
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  // Trim and collapse multiple spaces/newlines
  return cleaned.replace(/\s+/g, " ").trim();
}

