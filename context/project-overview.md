# Trump Predictor — Project Overview

## What it is

**Trump Predictor** is a single-page AI chat application that helps users explore how Donald Trump has historically responded to geopolitical and economic events — and how he might respond to new scenarios. The assistant is grounded in documented decisions, statements, and policy patterns from his **first presidential term (2017–2021)** and **second term (2025–present)**, with clear sourcing and appropriate uncertainty when predicting future behavior.

There is **no authentication** in v1. Users open the app and start chatting immediately.

## Who it is for

- **Policy and geopolitical analysts** stress-testing scenarios (tariffs, sanctions, alliances, trade deals).
- **Journalists and researchers** looking for historical parallels to current headlines.
- **Traders and market watchers** seeking a structured read on likely rhetorical or policy reactions.
- **Curious citizens** who want a serious, sourced conversation — not partisan cheerleading.

## Problems it solves

1. **Scattered history** — Trump's reactions across two terms are spread across speeches, Truth Social posts, executive orders, and press conferences. The app consolidates patterns into a conversational interface.
2. **Scenario exploration** — Users can pose hypothetical events ("China announces new rare-earth export controls") and receive responses framed as historical precedent + reasoned prediction.
3. **Fast orientation** — Suggested prompts and example questions lower the barrier to a useful first exchange.

## Primary user flows

### Flow 1 — First visit → first answer
1. User lands on the chat interface with a concise value proposition and 3–4 suggested prompts.
2. User clicks a suggestion or types a question.
3. Assistant streams a response with: historical context, documented reactions, confidence framing, and (when applicable) first-term vs second-term contrast.
4. User continues the thread or starts a new conversation.

### Flow 2 — Deep dive on a specific event
1. User asks about a real past event (e.g., North Korea summit cycle, Section 232 tariffs, Ukraine aid posture).
2. Assistant cites the event timeline, Trump's documented response, and relevant policy mechanisms.
3. User asks follow-ups; conversation history is preserved in-session.

### Flow 3 — Hypothetical prediction
1. User describes a hypothetical geopolitical or economic shock.
2. Assistant separates **what happened before** (precedent) from **what might happen next** (prediction), with explicit limits.
3. Assistant avoids false certainty; uses language like "based on documented pattern…" and flags when evidence is thin.

### Flow 4 — Theme toggle
1. User switches light/dark mode via a persistent control in the app shell.
2. Preference is remembered across visits.

## In scope (v1)

- Full-screen chat UI with streaming responses
- Session-scoped conversation history (in-memory / `sessionStorage`; no accounts)
- Curated knowledge base of major geopolitical/economic events and Trump's documented reactions (both terms)
- System prompt + retrieval-style grounding from local knowledge JSON (no external vector DB required for v1)
- Suggested starter prompts and empty-state onboarding copy
- Loading, streaming, error, and rate-limit states
- Light/dark theme toggle with `prefers-color-scheme` default
- Mobile-responsive layout (phone → desktop)
- Disclaimer that outputs are AI-generated analysis, not official statements
- API route secured by server-side env key (user never sees the key)

## Out of scope (v1)

- User accounts, login, logout, or saved cross-device history
- Admin panel for editing the knowledge base
- Real-time news ingestion or live headline feeds
- Voice input/output
- Multi-language support
- Sharing or exporting conversations (may add later)
- Fine-tuned proprietary model weights (v1 uses a hosted LLM + curated context)
- Fact-checking pipeline or citation verification against primary sources in real time

## Assumptions

1. **LLM provider:** OpenAI-compatible API via `OPENAI_API_KEY` (default model: `gpt-4o-mini` or similar cost-effective model). If no key is present at dev time, the app ships a **demo mode** with deterministic sample responses so the UI is fully testable.
2. **Knowledge base:** A hand-curated `data/trump-knowledge.json` file (~30–50 high-signal events/decision clusters) maintained in-repo. Not exhaustive; quality over quantity.
3. **Tone:** Analytical and neutral — describes patterns and documented quotes without endorsing or attacking. The UI copy reflects "analysis tool," not campaign material.
4. **Second-term data:** Includes publicly documented decisions and statements through mid-2026 as available in the curated dataset; the assistant acknowledges knowledge cutoff when asked about very recent events not in the dataset.
5. **Audience location:** Primarily US/English-speaking users reading US political news.
6. **Deployment target:** Vercel or similar Node hosting; single-region, no database.
7. **Legal posture:** Prominent disclaimer that this is not affiliated with Donald Trump or any government entity; predictions are speculative.
8. **No login** means conversations are ephemeral unless stored locally in the browser session.
