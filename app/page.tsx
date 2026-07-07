import { ChatPage } from "@/components/chat/chat-page";
import { isGeminiConfigured } from "@/lib/ai/chat-handler";

export default function Home() {
  return <ChatPage showDemoBanner={!isGeminiConfigured()} />;
}
