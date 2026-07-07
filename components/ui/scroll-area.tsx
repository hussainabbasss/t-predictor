import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type ScrollAreaProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function ScrollArea({ className, children, ...props }: ScrollAreaProps) {
  return (
    <div
      className={cn("scrollbar-thin overflow-y-auto overscroll-contain", className)}
      {...props}
    >
      {children}
    </div>
  );
}
