/**
 * Demo responses until the real backend is connected.
 * Swap `handleChatRequest` in chat-handler.ts to call your API instead.
 */

export function generateDemoResponse(userMessage: string): string {
  const query = userMessage.trim().toLowerCase();

  if (!query) {
    return "Ask me about a past geopolitical or economic event, or describe a hypothetical scenario. I'll walk through documented patterns from Trump's first and second terms — once the knowledge backend is connected, answers will be grounded in curated sources.";
  }

  if (query.includes("tariff") || query.includes("china")) {
    return `**Historical pattern (Term 1)**\n\nOn trade with China, Trump's documented approach combined public escalation with formal tariff mechanisms — notably Section 301 investigations and staged duty increases through 2018–2019. Rhetoric often preceded or accompanied executive action, and announcements were timed for maximum negotiating leverage.\n\n**Term 2 contrast**\n\nEarly second-term signals suggest a faster willingness to use tariffs as a default instrument across allies and rivals alike, with less emphasis on multistage negotiation before action.\n\n**If this were a new escalation today**\n\nBased on documented pattern — not a prediction of official policy — expect: (1) sharp public framing of the issue as unfair treatment of the U.S., (2) a named tariff threat or signing event within days, and (3) a parallel claim that partners should negotiate bilaterally.\n\n*Demo mode — connect your backend in \`lib/ai/chat-handler.ts\` for live, source-grounded analysis.*`;
  }

  if (query.includes("nato")) {
    return `**Term 1 documented posture**\n\nTrump repeatedly pressed NATO allies on defense spending as a share of GDP, often using blunt bilateral rhetoric while keeping the U.S. formally in the alliance. Public complaints about burden-sharing were a consistent theme at summits.\n\n**Term 2 documented posture**\n\nSecond-term rhetoric has retained the spending critique but paired it more explicitly with transactional framing — linking alliance support to trade and economic outcomes.\n\n**Analytical note**\n\nThe through-line is leverage: public pressure first, private negotiation second, and policy action third. When evidence is thin on a specific hypothetical, treat any prediction as scenario analysis, not a forecast.\n\n*Demo mode — your backend integration will replace these sample answers.*`;
  }

  if (query.includes("opec") || query.includes("oil")) {
    return `**Documented energy posture**\n\nTrump's energy-related responses typically emphasize U.S. production advantage ("energy dominance"), pressure on producers to keep prices lower for consumers, and public criticism of cartel coordination when prices rise.\n\n**Hypothetical OPEC cut scenario**\n\nA sharp production cut would likely trigger: strong public statements favoring increased U.S. drilling, possible diplomatic outreach to Saudi Arabia and Gulf partners, and rhetoric framing high prices as harmful to American workers — with less emphasis on multilateral climate-aligned responses.\n\n*Demo mode — connect your knowledge repo for event-specific citations.*`;
  }

  if (query.includes("iran") || query.includes("sanction")) {
    return `**Sanctions toolkit (documented)**\n\nIran policy in Term 1 centered on withdrawing from the JCPOA, reimposing sanctions, and a "maximum pressure" campaign combining Treasury designations, oil export restrictions, and regional security posturing.\n\n**Mechanisms observed**\n\n- Executive orders and Treasury OFAC listings\n- Allies pressured to reduce Iranian oil purchases\n- Public linkage of sanctions relief to broader behavioral change\n\n**Caution**\n\nSecond-term specifics depend on your connected knowledge base. This demo illustrates structure: precedent → mechanisms → reasoned scenario read.\n\n*Wire up \`lib/ai/chat-handler.ts\` when your backend is ready.*`;
  }

  return `You asked about: "${userMessage.trim()}"\n\n**How Trump Predictor will answer (once connected)**\n\n1. Match your question to documented events from Term 1 (2017–2021) and Term 2 (2025–present).\n2. Separate **what happened** from **what might happen next** in hypotheticals.\n3. Cite mechanisms (executive orders, tariffs, sanctions, public statements) and flag uncertainty.\n\n**Demo response**\n\nWithout the knowledge backend linked, I can't retrieve specific precedents yet. The UI and streaming pipeline are ready — replace \`handleChatRequest\` in \`lib/ai/chat-handler.ts\` with your API call when you're ready.\n\nTry a suggested prompt about tariffs, NATO, OPEC, or Iran sanctions to see richer demo answers.`;
}
