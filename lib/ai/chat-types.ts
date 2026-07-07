import type { UIMessage } from "ai";

export type ResearchPhase =
  | "start"
  | "truth-social"
  | "archive"
  | "analysis"
  | "search"
  | "complete";

export type ResearchStatusData = {
  phase: ResearchPhase;
  label: string;
  state: "active" | "complete";
};

export type TrumpChatDataParts = {
  "research-status": ResearchStatusData;
};

export type TrumpUIMessage = UIMessage<never, TrumpChatDataParts>;

export const RESEARCH_STATUS_STREAM_ID = "research-status";

export const RESEARCH_PHASE_ORDER: ResearchPhase[] = [
  "start",
  "truth-social",
  "archive",
  "analysis",
  "search",
];
