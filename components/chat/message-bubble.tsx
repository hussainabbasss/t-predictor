import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type MessageBubbleProps = {
  role: "user" | "assistant" | "system";
  content: string;
  isStreaming?: boolean;
  className?: string;
};

function parseInlineMarkdown(text: string, lineKey: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const boldPattern = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let partIndex = 0;

  while ((match = boldPattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    parts.push(
      <strong key={`${lineKey}-bold-${partIndex}`}>{match[1]}</strong>,
    );

    lastIndex = match.index + match[0].length;
    partIndex += 1;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length ? parts : [text];
}

function formatContent(content: string) {
  const lines = content.split("\n");

  return lines.map((line, index) => {
    const key = `${index}-${line.slice(0, 12)}`;

    if (line.startsWith("*") && line.endsWith("*") && !line.includes("**")) {
      return (
        <p key={key} className="mt-3 text-sm italic text-ink-muted">
          {line.slice(1, -1)}
        </p>
      );
    }

    if (!line.trim()) {
      return <div key={key} className="h-2" />;
    }

    const bulletMatch = line.match(/^[-*]\s+(.*)$/);
    const lineText = bulletMatch ? `• ${bulletMatch[1]}` : line;

    return (
      <p key={key} className="mt-2 first:mt-0 text-pretty">
        {parseInlineMarkdown(lineText, key)}
      </p>
    );
  });
}

export function MessageBubble({
  role,
  content,
  isStreaming = false,
  className,
}: MessageBubbleProps) {
  if (role === "system") {
    return (
      <div className={cn("flex justify-center px-4 py-2", className)}>
        <p className="max-w-lg rounded-lg bg-bubble-system px-4 py-2 text-center text-sm text-ink-muted">
          {content}
        </p>
      </div>
    );
  }

  const isUser = role === "user";

  return (
    <div
      className={cn(
        "message-enter flex gap-3 px-4 py-2",
        isUser ? "justify-end" : "justify-start",
        className,
      )}
    >
      {!isUser ? (
        <div
          className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-surface-raised text-[10px] font-semibold tracking-wide text-accent"
          aria-hidden
        >
          TP
        </div>
      ) : null}
      <div
        className={cn(
          "prose-chat max-w-[min(100%,42rem)] rounded-xl px-4 py-3 text-sm leading-relaxed sm:text-base",
          isUser
            ? "bg-bubble-user text-ink"
            : "border border-border bg-bubble-assistant text-ink",
          isStreaming && !isUser && "streaming-cursor",
        )}
      >
        {formatContent(content)}
      </div>
    </div>
  );
}
