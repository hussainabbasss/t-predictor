import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
};

export function IconButton({
  className,
  label,
  children,
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-lg text-ink-secondary transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:bg-surface-raised hover:text-ink",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
