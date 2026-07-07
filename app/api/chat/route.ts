import { handleChatRequest } from "@/lib/ai/chat-handler";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    return await handleChatRequest(req);
  } catch {
    return new Response("Something went wrong. Please try again.", {
      status: 500,
    });
  }
}
