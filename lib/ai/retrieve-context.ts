import type { KnowledgeEntry } from "./knowledge-types";
import knowledgeData from "@/data/trump-knowledge.json";

const knowledge = knowledgeData as { entries: KnowledgeEntry[] };

let cachedEntries: KnowledgeEntry[] | null = null;

function getEntries(): KnowledgeEntry[] {
  if (!cachedEntries) {
    cachedEntries = knowledge.entries;
  }
  return cachedEntries;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2);
}

const CATEGORY_HINTS: Record<string, KnowledgeEntry["category"]> = {
  tariff: "trade",
  trade: "trade",
  china: "trade",
  nafta: "trade",
  usmca: "trade",
  nato: "security",
  ukraine: "security",
  iran: "security",
  korea: "diplomacy",
  summit: "diplomacy",
  venezuela: "diplomacy",
  tax: "economy",
  fed: "economy",
  market: "economy",
  border: "immigration",
  immigration: "immigration",
  oil: "energy",
  opec: "energy",
  greenland: "diplomacy",
  canada: "trade",
  mexico: "trade",
  eu: "trade",
  gaza: "security",
  israel: "security",
};

function scoreEntry(entry: KnowledgeEntry, queryWords: string[]): number {
  let score = 0;

  for (const word of queryWords) {
    if (entry.keywords.some((kw) => kw.includes(word) || word.includes(kw))) {
      score += 3;
    }
    if (entry.title.toLowerCase().includes(word)) score += 2;
    if (entry.triggers.some((t) => t.toLowerCase().includes(word))) score += 2;
    if (entry.eventSummary.toLowerCase().includes(word)) score += 1;
    if (CATEGORY_HINTS[word] === entry.category) score += 2;
  }

  return score;
}

export function retrieveContext(query: string, limit = 6): KnowledgeEntry[] {
  const queryWords = tokenize(query);
  if (!queryWords.length) return [];

  return getEntries()
    .map((entry) => ({ entry, score: scoreEntry(entry, queryWords) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ entry }) => entry);
}

export function formatContextForPrompt(entries: KnowledgeEntry[]): string {
  if (!entries.length) {
    return "No close matches in the curated archive for this query. Use google_search for recent Trump-related public activity, then reason from documented patterns.";
  }

  return entries
    .map((entry, index) => {
      const terms = entry.terms.map((t) => (t === "first" ? "Term 1" : "Term 2")).join(", ");
      return `### ${index + 1}. ${entry.title} (${terms} · ${entry.category})
**Triggers:** ${entry.triggers.join("; ")}
**Event:** ${entry.eventSummary}
**Decision:** ${entry.trumpDecision}
**Public response:** ${entry.trumpResponse}
**Mechanisms:** ${entry.mechanisms.join(", ")}
${entry.outcomes?.length ? `**Outcomes:** ${entry.outcomes.join("; ")}` : ""}
**Sources:** ${entry.sources.join("; ")}`;
    })
    .join("\n\n");
}

export function searchArchive(query: string, limit = 5): string {
  const entries = retrieveContext(query, limit);
  return formatContextForPrompt(entries);
}
