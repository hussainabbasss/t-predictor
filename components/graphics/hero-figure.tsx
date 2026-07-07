"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";

type HeroFigureProps = {
  className?: string;
};

export function HeroFigure({ className }: HeroFigureProps) {
  return (
    <div
      className={cn(
        "hero-figure relative mx-auto aspect-square w-full max-w-[260px] sm:max-w-[300px] lg:max-w-[340px]",
        className,
      )}
      aria-hidden
    >
      <div className="hero-glow pointer-events-none absolute inset-[10%] rounded-full bg-accent-subtle blur-3xl" />

      <svg
        className="pointer-events-none absolute inset-0 size-full"
        viewBox="0 0 360 360"
        fill="none"
        aria-hidden
      >
        <g className="hero-orbit" style={{ transformOrigin: "180px 190px" }}>
          <ellipse
            cx="180"
            cy="190"
            rx="148"
            ry="50"
            className="text-border"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="4 8"
            fill="none"
          />
          <circle cx="328" cy="190" r="4" className="fill-accent" />
        </g>
        <g
          className="hero-orbit-reverse"
          style={{ transformOrigin: "180px 190px" }}
        >
          <ellipse
            cx="180"
            cy="190"
            rx="128"
            ry="40"
            className="text-border-strong"
            stroke="currentColor"
            strokeWidth="0.75"
            opacity="0.45"
            strokeDasharray="2 10"
            fill="none"
          />
          <circle cx="52" cy="190" r="3" className="fill-highlight" />
        </g>
      </svg>

      <div className="hero-signal hero-signal-a absolute left-[4%] top-[20%] rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] font-medium text-ink-secondary shadow-sm">
        Tariffs
      </div>
      <div className="hero-signal hero-signal-b absolute right-0 top-[36%] rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] font-medium text-ink-secondary shadow-sm">
        NATO
      </div>
      <div className="hero-signal hero-signal-c absolute bottom-[26%] left-[8%] rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] font-medium text-ink-secondary shadow-sm">
        Trade deals
      </div>

      <div className="hero-figure-float relative z-[var(--z-base)] flex h-full flex-col items-center justify-end">
        <div className="mb-1 h-2 w-[55%] rounded-full bg-ink/10 blur-md" />
        <Image
          src="/trump.png"
          alt=""
          width={653}
          height={653}
          priority
          className="hero-figure-image -mt-1 h-auto w-[90%] object-contain object-bottom"
        />
      </div>
    </div>
  );
}
