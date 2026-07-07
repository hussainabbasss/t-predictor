import { cn } from "@/lib/utils";

type MapBackdropProps = {
  className?: string;
};

export function MapBackdrop({ className }: MapBackdropProps) {
  return (
    <svg
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      viewBox="0 0 800 400"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <pattern id="dot-grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="currentColor" className="text-border" />
        </pattern>
      </defs>
      <rect width="800" height="400" fill="url(#dot-grid)" opacity="0.35" />
      <ellipse
        cx="400"
        cy="200"
        rx="280"
        ry="140"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="text-border"
        opacity="0.4"
      />
      <ellipse
        cx="400"
        cy="200"
        rx="200"
        ry="100"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.75"
        className="text-border-strong"
        opacity="0.25"
      />
    </svg>
  );
}
