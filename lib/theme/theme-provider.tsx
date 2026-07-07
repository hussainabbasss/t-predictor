"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "trump-predictor:theme";
const THEME_EVENT = "trump-predictor:theme-change";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readTheme(): Theme {
  if (typeof window === "undefined") {
    return "dark";
  }

  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (stored === "light" || stored === "dark") {
    return stored;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function subscribe(onStoreChange: () => void) {
  const handleChange = () => onStoreChange();

  window.addEventListener(THEME_EVENT, handleChange);
  window.addEventListener("storage", handleChange);

  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", handleChange);

  return () => {
    window.removeEventListener(THEME_EVENT, handleChange);
    window.removeEventListener("storage", handleChange);
    media.removeEventListener("change", handleChange);
  };
}

function useThemeValue() {
  return useSyncExternalStore(subscribe, readTheme, () => "dark" as Theme);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useThemeValue();

  const setTheme = useCallback((next: Theme) => {
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.setAttribute("data-theme", next);
    window.dispatchEvent(new Event(THEME_EVENT));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(readTheme() === "dark" ? "light" : "dark");
  }, [setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
