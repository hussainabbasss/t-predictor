import { cn } from "@/lib/utils";

type AppMarkProps = {
  className?: string;
};

export function AppMark({ className }: AppMarkProps) {
  return (
    <svg
      className={cn("size-9 shrink-0", className)}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle
        cx="18"
        cy="18"
        r="16"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-border-strong"
      />
      <path
        d="M10 24 L18 10 L26 24"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-accent"
      />
      <line
        x1="12"
        y1="20"
        x2="24"
        y2="20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="text-ink-secondary"
      />
    </svg>
  );
}
