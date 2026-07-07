import type { UIMessage } from "ai";
import { createGoogle } from "@ai-sdk/google";
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  isStepCount,
  streamText,
  toUIMessageStream,
} from "ai";

import {
  RESEARCH_STATUS_STREAM_ID,
  type ResearchStatusData,
} from "./chat-types";
import { generateDemoResponse } from "./demo-response";
import { formatContextForPrompt, retrieveContext } from "./retrieve-context";
import { buildSystemPrompt } from "./system-prompt";
import { fetchTruthSocialContext } from "./truth-social";
import { getMessageText } from "@/lib/utils";

function getGeminiApiKey(): string | undefined {
  return (
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? process.env.GEMINI_API_KEY
  );
}

function extractLastUserText(messages: UIMessage[]): string {
  const lastUserMessage = [...messages]
    .reverse()
    .find((message) => message.role === "user");

  if (!lastUserMessage) return "";

  return getMessageText(lastUserMessage.parts);
}

function extractRetrievalQuery(messages: UIMessage[]): string {
  const userMessages = messages.filter((message) => message.role === "user");

  if (!userMessages.length) return "";

  const recent = userMessages
    .slice(-2)
    .map((message) => getMessageText(message.parts))
    .filter(Boolean)
    .join(" ");

  return recent || extractLastUserText(messages);
}

type StreamWriter = {
  write: (part: {
    type: "data-research-status";
    id: string;
    data: ResearchStatusData;
    transient: true;
  }) => void;
};

function writeResearchStatus(
  writer: StreamWriter,
  data: ResearchStatusData,
) {
  writer.write({
    type: "data-research-status",
    id: RESEARCH_STATUS_STREAM_ID,
    data,
    transient: true,
  });
}

async function emitDemoResearchStatuses(writer: StreamWriter) {
  const steps: ResearchStatusData[] = [
    {
      phase: "start",
      label: "Preparing analysis…",
      state: "active",
    },
    {
      phase: "truth-social",
      label: "Fetching from Trump's Truth Social…",
      state: "active",
    },
    {
      phase: "archive",
      label: "Searching his past actions archive…",
      state: "active",
    },
    {
      phase: "analysis",
      label: "Running precedent analysis…",
      state: "active",
    },
  ];

  for (const step of steps) {
    writeResearchStatus(writer, step);
    await new Promise((resolve) => setTimeout(resolve, 420));
  }
}

async function streamDemoResponse(
  messages: UIMessage[],
  userText: string,
): Promise<Response> {
  const responseText = generateDemoResponse(userText);

  const stream = createUIMessageStream({
    originalMessages: messages,
    async execute({ writer }) {
      await emitDemoResearchStatuses(writer);

      const textId = "assistant-response";

      writer.write({ type: "text-start", id: textId });

      for (const chunk of responseText.split(/(\s+)/)) {
        if (!chunk) continue;
        writer.write({ type: "text-delta", id: textId, delta: chunk });
        await new Promise((resolve) => setTimeout(resolve, 10));
      }

      writer.write({ type: "text-end", id: textId });
    },
  });

  return createUIMessageStreamResponse({ stream });
}

/**
 * Main chat handler — Gemini + Google Search + curated archive context.
 */
export async function handleChatRequest(req: Request): Promise<Response> {
  const { messages }: { messages: UIMessage[] } = await req.json();

  if (!messages?.length) {
    return new Response("Messages are required.", { status: 400 });
  }

  const userText = extractRetrievalQuery(messages);
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    return streamDemoResponse(messages, userText);
  }

  const modelId = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
  const google = createGoogle({ apiKey });

  const searchTool = google.tools.googleSearch({
    searchTypes: { webSearch: {} },
  });

  const stream = createUIMessageStream({
    originalMessages: messages,
    async execute({ writer }) {
      writeResearchStatus(writer, {
        phase: "start",
        label: "Preparing analysis…",
        state: "active",
      });

      writeResearchStatus(writer, {
        phase: "truth-social",
        label: "Fetching from Trump's Truth Social…",
        state: "active",
      });

      const truthSocial = await fetchTruthSocialContext(userText);

      writeResearchStatus(writer, {
        phase: "archive",
        label: "Searching his past actions archive…",
        state: "active",
      });

      const archiveContext = formatContextForPrompt(
        retrieveContext(userText, 6),
      );

      writeResearchStatus(writer, {
        phase: "analysis",
        label: "Running precedent analysis…",
        state: "active",
      });

      const result = streamText({
        model: google(modelId),
        system: buildSystemPrompt(archiveContext, truthSocial.context),
        messages: await convertToModelMessages(messages),
        maxOutputTokens: 2048,
        tools: {
          google_search: searchTool,
        },
        stopWhen: isStepCount(8),
        onStepFinish: ({ toolCalls }) => {
          if (toolCalls.some((call) => call.toolName === "google_search")) {
            writeResearchStatus(writer, {
              phase: "search",
              label: "Cross-checking primary sources…",
              state: "active",
            });
          }
        },
      });

      writer.merge(
        toUIMessageStream({
          stream: result.stream,
          originalMessages: messages,
          tools: { google_search: searchTool },
          sendSources: true,
        }),
      );
    },
  });

  return createUIMessageStreamResponse({ stream });
}

export function isGeminiConfigured(): boolean {
  return Boolean(getGeminiApiKey());
}
