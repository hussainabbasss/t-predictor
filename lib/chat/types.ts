export type ChatRole = "user" | "assistant" | "system";

export type StoredMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
};

export type ChatSession = {
  id: string;
  messages: StoredMessage[];
  updatedAt: number;
};
