"use client";

import { AppMark } from "@/components/graphics/app-mark";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";

type AppHeaderProps = {
  onAboutClick: () => void;
  onNewChat: () => void;
  showDemoBanner?: boolean;
};

export function AppHeader({
  onAboutClick,
  onNewChat,
  showDemoBanner = true,
}: AppHeaderProps) {
  return (
    <header className="z-[var(--z-sticky)] shrink-0 border-b border-border bg-surface">
      {showDemoBanner ? (
        <div className="border-b border-border bg-surface-sunken px-4 py-1.5 text-center text-[11px] text-ink-muted">
          Demo mode — add <code className="font-mono text-ink-secondary">GOOGLE_GENERATIVE_AI_API_KEY</code> for Gemini + live search.
        </div>
      ) : null}
      <div className="mx-auto flex h-14 max-w-[920px] items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <AppMark className="text-accent" />
          <div className="min-w-0">
            <p
              className="truncate text-base font-semibold leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Trump Predictor
            </p>
            <p className="truncate text-xs text-ink-muted">
              Two terms of precedent. One clear read.
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Button variant="ghost" className="min-h-9 px-3 text-xs sm:hidden" onClick={onNewChat}>
            New
          </Button>
          <Button variant="ghost" className="hidden min-h-9 px-3 text-xs sm:inline-flex" onClick={onNewChat}>
            New chat
          </Button>
          <Button variant="ghost" className="min-h-9 px-3 text-xs" onClick={onAboutClick}>
            About
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
