"use client";

import { useEffect, useRef } from "react";
import type { UIMessage } from "ai";

import { ScrollArea } from "@/components/ui/scroll-area";
import type { ResearchStatusData } from "@/lib/ai/chat-types";
import { getMessageText } from "@/lib/utils";

import { EmptyState } from "./empty-state";
import { MessageBubble } from "./message-bubble";
import { ResearchStatus } from "./research-status";

type MessageListProps = {
  messages: UIMessage[];
  isLoading: boolean;
  showResearchStatus: boolean;
  researchStatus: ResearchStatusData;
  onSelectPrompt: (prompt: string) => void;
};

export function MessageList({
  messages,
  isLoading,
  showResearchStatus,
  researchStatus,
  onSelectPrompt,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const isEmpty = messages.length === 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isLoading, researchStatus, showResearchStatus]);

  return (
    <ScrollArea
      className="relative flex-1"
      role="log"
      aria-live="polite"
      aria-relevant="additions"
      aria-label="Chat messages"
    >
      {isEmpty ? (
        <EmptyState onSelectPrompt={onSelectPrompt} />
      ) : (
        <div className="mx-auto max-w-[920px] py-6">
          {messages.map((message, index) => {
            const content = getMessageText(message.parts);
            const isLastMessage = index === messages.length - 1;
            const isEmptyAssistantPlaceholder =
              showResearchStatus &&
              isLastMessage &&
              message.role === "assistant" &&
              !content.trim();

            if (isEmptyAssistantPlaceholder) {
              return null;
            }

            return (
              <MessageBubble
                key={message.id}
                role={message.role}
                content={content}
                isStreaming={
                  isLoading &&
                  message.role === "assistant" &&
                  message.id === messages.at(-1)?.id
                }
              />
            );
          })}
          {showResearchStatus ? (
            <ResearchStatus status={researchStatus} />
          ) : null}
        </div>
      )}
      <div ref={bottomRef} />
    </ScrollArea>
  );
}
