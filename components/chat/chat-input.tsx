"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type FormEvent,
  type KeyboardEvent,
} from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ChatInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
};

export function ChatInput({
  value,
  onChange,
  onSubmit,
  disabled = false,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resize = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
  }, []);

  useEffect(() => {
    resize();
  }, [value, resize]);

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (!disabled && value.trim()) {
        onSubmit();
      }
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!disabled && value.trim()) {
      onSubmit();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-border bg-surface-raised px-4 py-4 shadow-[var(--shadow-sm)] sm:px-6"
    >
      <div className="mx-auto flex max-w-[920px] items-end gap-3">
        <label htmlFor="chat-input" className="sr-only">
          Ask about an event or scenario
        </label>
        <textarea
          id="chat-input"
          ref={textareaRef}
          rows={1}
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe a scenario or paste a headline…"
          className={cn(
            "max-h-40 min-h-11 flex-1 resize-none rounded-xl border border-border bg-surface px-4 py-3 text-base text-ink placeholder:text-ink-muted",
            "transition-colors duration-[var(--duration-fast)] focus:border-border-strong focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)]",
            disabled && "opacity-60",
          )}
        />
        <Button
          type="submit"
          disabled={disabled || !value.trim()}
          className="min-h-11 shrink-0 px-5"
          aria-label="Send message"
        >
          <span className="hidden sm:inline">Send</span>
          <svg
            className="sm:ml-0"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Button>
      </div>
      <p className="mx-auto mt-2 max-w-[920px] text-center text-xs text-ink-muted">
        Enter to send · Shift+Enter for a new line
      </p>
    </form>
  );
}
