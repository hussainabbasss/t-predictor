import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getMessageText(
  parts: Array<{ type: string; text?: string }>,
): string {
  return parts
    .filter((part) => part.type === "text" && part.text)
    .map((part) => part.text!.trim())
    .filter(Boolean)
    .join("\n\n");
}
