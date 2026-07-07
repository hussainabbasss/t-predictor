"use client";

import { useTheme } from "@/lib/theme/theme-provider";

import { IconButton } from "./icon-button";

function SunIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <IconButton
      label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggleTheme}
    >
      <span className="relative block size-5">
        <span
          className="absolute inset-0 transition-opacity duration-[var(--duration-fast)] ease-[var(--ease-out)]"
          style={{ opacity: isDark ? 0 : 1 }}
        >
          <MoonIcon />
        </span>
        <span
          className="absolute inset-0 transition-opacity duration-[var(--duration-fast)] ease-[var(--ease-out)]"
          style={{ opacity: isDark ? 1 : 0 }}
        >
          <SunIcon />
        </span>
      </span>
    </IconButton>
  );
}
