"use client";

import { cn } from "@/lib/utils";
import {
  RESEARCH_PHASE_ORDER,
  type ResearchStatusData,
} from "@/lib/ai/chat-types";

type ResearchStatusProps = {
  status: ResearchStatusData;
  className?: string;
};

function ActivityPulse() {
  return (
    <span className="relative flex size-2 shrink-0" aria-hidden>
      <span className="absolute inset-0 rounded-full bg-accent/30 motion-safe:animate-ping" />
      <span className="relative size-2 rounded-full bg-accent" />
    </span>
  );
}

function PhaseDots({ phase }: { phase: ResearchStatusData["phase"] }) {
  const activeIndex = RESEARCH_PHASE_ORDER.indexOf(phase);

  return (
    <div
      className="flex items-center gap-1.5"
      aria-hidden
    >
      {RESEARCH_PHASE_ORDER.map((step, index) => {
        const isActive = index === activeIndex;
        const isComplete = activeIndex >= 0 && index < activeIndex;

        return (
          <span
            key={step}
            className={cn(
              "h-1 rounded-full transition-all duration-300",
              isActive ? "w-5 bg-accent" : "w-1",
              isComplete ? "bg-accent/45" : !isActive ? "bg-border-strong" : null,
            )}
          />
        );
      })}
    </div>
  );
}

export function ResearchStatus({ status, className }: ResearchStatusProps) {
  const label = status.label;

  return (
    <div
      className={cn("message-enter flex gap-3 px-4 py-2", className)}
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
    >
      <div
        className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-surface-raised text-[10px] font-semibold text-accent"
        aria-hidden
      >
        TP
      </div>

      <div className="min-w-0 max-w-[min(100%,42rem)] rounded-xl border border-border bg-bubble-assistant px-4 py-3">
        <div className="flex items-center gap-2.5">
          <ActivityPulse />
          <p
            key={status.phase}
            className="research-status-label min-w-0 flex-1 truncate text-sm text-ink-secondary"
          >
            {label}
          </p>
        </div>

        <div className="mt-2.5 flex items-center justify-between gap-3">
          <PhaseDots phase={status.phase} />
          <span className="shrink-0 font-mono text-[11px] text-ink-muted">
            Researching
          </span>
        </div>
      </div>
    </div>
  );
}
