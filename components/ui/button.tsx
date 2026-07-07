import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-white hover:bg-accent-hover disabled:opacity-50 disabled:pointer-events-none",
  secondary:
    "bg-surface-raised text-ink border border-border hover:border-border-strong hover:bg-surface",
  ghost:
    "bg-transparent text-ink-secondary hover:text-ink hover:bg-surface-raised",
};

export function Button({
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)]",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
