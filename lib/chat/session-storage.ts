import type { UIMessage } from "ai";

import { getMessageText } from "@/lib/utils";

import type { ChatSession, StoredMessage } from "./types";

const SESSION_KEY = "trump-predictor:session";

function createSessionId() {
  return `session-${Date.now()}`;
}

export function loadSession(): ChatSession | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ChatSession;
  } catch {
    return null;
  }
}

export function saveSession(messages: UIMessage[]) {
  if (typeof window === "undefined") return;

  try {
    const existing = loadSession();
    const storedMessages: StoredMessage[] = messages
      .filter((message) => message.role !== "system")
      .map((message) => ({
        id: message.id,
        role: message.role,
        content: getMessageText(message.parts),
        createdAt: Date.now(),
      }));

    const session: ChatSession = {
      id: existing?.id ?? createSessionId(),
      messages: storedMessages,
      updatedAt: Date.now(),
    };

    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // Private browsing or quota exceeded — fail silently.
  }
}

export function clearSession() {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // Ignore storage errors.
  }
}

export function sessionToUIMessages(session: ChatSession): UIMessage[] {
  return session.messages.map((message) => ({
    id: message.id,
    role: message.role,
    parts: [{ type: "text" as const, text: message.content }],
  }));
}
