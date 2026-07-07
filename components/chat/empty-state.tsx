"use client";

import { HeroFigure } from "@/components/graphics/hero-figure";
import { MapBackdrop } from "@/components/graphics/map-backdrop";

import { SuggestedPrompts } from "./suggested-prompts";

type EmptyStateProps = {
  onSelectPrompt: (prompt: string) => void;
};

export function EmptyState({ onSelectPrompt }: EmptyStateProps) {
  return (
    <div className="relative mx-auto flex min-h-full w-full max-w-[920px] flex-col justify-center px-4 py-8 sm:px-6 sm:py-10 lg:py-14">
      <MapBackdrop className="opacity-40" />

      <div className="relative z-[var(--z-base)] grid items-center gap-6 sm:gap-8 lg:grid-cols-[minmax(220px,0.9fr)_minmax(0,1.1fr)] lg:gap-12">
        <div className="hero-panel-enter flex justify-center lg:justify-end">
          <HeroFigure />
        </div>

        <div className="hero-copy-enter text-center lg:text-left">
          <h1
            className="mx-auto max-w-xl text-[length:var(--text-display)] font-semibold leading-[1.08] tracking-[var(--tracking-display)] text-balance lg:mx-0"
            style={{ fontFamily: "var(--font-display)" }}
          >
            What would Trump do?
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-lg leading-relaxed text-ink-secondary text-pretty lg:mx-0">
            Paste a headline or describe a scenario. See how he moved on trade,
            security, and diplomacy — then get a reasoned read on what he might
            do next.
          </p>

          <div className="mt-5 flex flex-wrap justify-center gap-2 lg:justify-start">
            <span className="rounded-full border border-border bg-surface-raised px-3 py-1 text-xs font-medium text-ink-secondary">
              Term 1 · 2017–2021
            </span>
            <span className="rounded-full border border-border bg-highlight-subtle px-3 py-1 text-xs font-medium text-ink">
              Term 2 · 2025–present
            </span>
          </div>

          <SuggestedPrompts onSelect={onSelectPrompt} className="lg:justify-start" />
        </div>
      </div>
    </div>
  );
}
