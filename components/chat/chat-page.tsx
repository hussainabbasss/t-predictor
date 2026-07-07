"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

import { ChatInput } from "@/components/chat/chat-input";
import { MessageList } from "@/components/chat/message-list";
import { AppHeader } from "@/components/layout/app-header";
import {
  DisclaimerDialog,
  hasSeenDisclaimer,
} from "@/components/layout/disclaimer-dialog";
import type { ResearchStatusData, TrumpUIMessage } from "@/lib/ai/chat-types";
import {
  clearSession,
  loadSession,
  saveSession,
  sessionToUIMessages,
} from "@/lib/chat/session-storage";
import { useIsClient } from "@/lib/hooks/use-is-client";
import { getMessageText } from "@/lib/utils";

type ChatPageProps = {
  showDemoBanner?: boolean;
};

const INITIAL_RESEARCH_STATUS: ResearchStatusData = {
  phase: "start",
  label: "Preparing analysis…",
  state: "active",
};

export function ChatPage({ showDemoBanner = true }: ChatPageProps) {
  const [input, setInput] = useState("");
  const [aboutOpen, setAboutOpen] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const [researchStatus, setResearchStatus] =
    useState<ResearchStatusData | null>(null);
  const isClient = useIsClient();

  const disclaimerOpen =
    aboutOpen || (isClient && !acknowledged && !hasSeenDisclaimer());

  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/chat" }),
    [],
  );

  const { messages, sendMessage, setMessages, status, error, clearError } =
    useChat<TrumpUIMessage>({
      transport,
      onData: (dataPart) => {
        if (dataPart.type === "data-research-status") {
          setResearchStatus(dataPart.data);
        }
      },
    });

  const isLoading = status === "submitted" || status === "streaming";

  const lastMessage = messages.at(-1);
  const lastAssistantText =
    lastMessage?.role === "assistant"
      ? getMessageText(lastMessage.parts)
      : "";

  const showResearchStatus =
    isLoading && !lastAssistantText.trim();

  useEffect(() => {
    const session = loadSession();
    if (session?.messages.length) {
      setMessages(sessionToUIMessages(session) as TrumpUIMessage[]);
    }
  }, [setMessages]);

  useEffect(() => {
    if (messages.length > 0 && !isLoading) {
      saveSession(messages);
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      setResearchStatus(null);
    }
  }, [isLoading]);

  useEffect(() => {
    if (error) {
      setMessages((current) => [
        ...current,
        {
          id: `error-${Date.now()}`,
          role: "system",
          parts: [
            {
              type: "text",
              text: "Connection interrupted. Try sending your message again.",
            },
          ],
        },
      ]);
      clearError();
    }
  }, [error, setMessages, clearError]);

  const sendUserMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;
      setResearchStatus(INITIAL_RESEARCH_STATUS);
      sendMessage({ text: trimmed });
      setInput("");
    },
    [isLoading, sendMessage],
  );

  function handleNewChat() {
    clearSession();
    setMessages([]);
    setInput("");
    setResearchStatus(null);
    clearError();
  }

  return (
    <div className="flex h-[100dvh] flex-col bg-bg">
      <AppHeader
        onAboutClick={() => setAboutOpen(true)}
        onNewChat={handleNewChat}
        showDemoBanner={showDemoBanner}
      />
      <MessageList
        messages={messages}
        isLoading={isLoading}
        showResearchStatus={showResearchStatus}
        researchStatus={researchStatus ?? INITIAL_RESEARCH_STATUS}
        onSelectPrompt={sendUserMessage}
      />
      <ChatInput
        value={input}
        onChange={setInput}
        onSubmit={() => sendUserMessage(input)}
        disabled={isLoading}
      />
      <DisclaimerDialog
        open={disclaimerOpen}
        onClose={() => {
          setAcknowledged(true);
          setAboutOpen(false);
        }}
      />
    </div>
  );
}
