export type KnowledgeCategory =
  | "trade"
  | "security"
  | "diplomacy"
  | "economy"
  | "immigration"
  | "energy"
  | "domestic"
  | "other";

export type KnowledgeTerm = "first" | "second";

export type KnowledgeEntry = {
  id: string;
  title: string;
  category: KnowledgeCategory;
  terms: KnowledgeTerm[];
  dateRange: { start: string; end?: string };
  /** Geopolitical/economic/political events that prompted the decision */
  triggers: string[];
  eventSummary: string;
  /** What Trump decided or did — policy mechanisms and sequence */
  trumpDecision: string;
  /** Public rhetoric, posts, speeches */
  trumpResponse: string;
  mechanisms: string[];
  outcomes?: string[];
  keywords: string[];
  sources: string[];
};

export type TrumpKnowledgeBase = {
  version: string;
  updatedAt: string;
  description: string;
  entries: KnowledgeEntry[];
};
