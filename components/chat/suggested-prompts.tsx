"use client";

import { SUGGESTED_PROMPTS } from "@/lib/chat/suggested-prompts";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

type SuggestedPromptsProps = {
  onSelect: (prompt: string) => void;
  className?: string;
};

export function SuggestedPrompts({ onSelect, className }: SuggestedPromptsProps) {
  return (
    <div className={cn("mt-8", className)}>
      <p className="mb-3 text-sm font-medium text-ink">Start with a question</p>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {SUGGESTED_PROMPTS.map((prompt, index) => (
          <Button
            key={prompt}
            variant={index === 0 ? "primary" : "secondary"}
            className={cn(
              "prompt-enter h-auto min-h-11 justify-start rounded-xl px-4 py-3 text-left text-sm leading-snug whitespace-normal",
              index === 0 && "sm:col-span-2",
            )}
            style={{ animationDelay: `${120 + index * 60}ms` }}
            onClick={() => onSelect(prompt)}
          >
            {prompt}
          </Button>
        ))}
      </div>
    </div>
  );
}
