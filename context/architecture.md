# Trump Predictor — Architecture

## Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | **Next.js 16** (App Router) | Already scaffolded; RSC + API routes |
| UI | **React 19** + **Tailwind CSS v4** | Fast iteration, token-driven styling |
| Language | **TypeScript** (strict) | Type safety across chat types |
| AI | **Vercel AI SDK** (`ai` package) | Streaming chat, `useChat` hook |
| LLM | **OpenAI API** (`@ai-sdk/openai`) | Reliable streaming; env-gated |
| Fonts | **Instrument Serif** (display) + **DM Sans** (UI) | Editorial + tool clarity; contrast pairing |
| State | React state + `sessionStorage` | Session persistence without auth |
| Data | Static JSON knowledge file | No DB for v1 |

## Folder structure

```
trump/
├── app/
│   ├── layout.tsx              # Root layout, fonts, theme provider shell
│   ├── page.tsx                # Main chat page (client-heavy)
│   ├── globals.css             # Token imports + Tailwind theme bridge
│   └── api/
│       └── chat/
│           └── route.ts        # POST: stream chat completions
├── components/
│   ├── chat/
│   │   ├── chat-shell.tsx      # Full viewport layout
│   │   ├── message-list.tsx    # Scrollable transcript
│   │   ├── message-bubble.tsx    # User / assistant bubbles
│   │   ├── chat-input.tsx      # Textarea + send
│   │   ├── suggested-prompts.tsx # Starter chips
│   │   └── typing-indicator.tsx
│   ├── layout/
│   │   ├── app-header.tsx      # Title, disclaimer link, theme toggle
│   │   └── disclaimer-dialog.tsx
│   └── ui/
│       ├── theme-toggle.tsx    # Light/dark control (first-class)
│       ├── button.tsx
│       ├── icon-button.tsx
│       └── scroll-area.tsx
├── lib/
│   ├── ai/
│   │   ├── system-prompt.ts    # Persona + rules + safety
│   │   ├── retrieve-context.ts # Keyword/topic match against knowledge JSON
│   │   └── demo-response.ts    # Fallback when no API key
│   ├── chat/
│   │   ├── types.ts            # Message, Role, ChatError types
│   │   └── session-storage.ts  # Persist thread in browser
│   ├── theme/
│   │   ├── theme-provider.tsx  # data-theme + localStorage
│   │   └── use-theme.ts
│   └── utils.ts                # cn(), formatters
├── data/
│   └── trump-knowledge.json    # Curated events + reactions
├── context/                    # Spec files (this directory)
└── public/
    └── og-image.svg            # Open Graph placeholder
```

## System boundaries

```
┌─────────────┐     POST /api/chat      ┌──────────────────┐
│  Browser    │ ──────────────────────► │  Route Handler   │
│  (useChat)  │ ◄── text/event stream ─ │  (server only)   │
└─────────────┘                         └────────┬─────────┘
                                                 │
                    ┌────────────────────────────┼────────────────────────────┐
                    ▼                            ▼                            ▼
           retrieve-context.ts           system-prompt.ts              OpenAI API
           (reads knowledge JSON)        (persona + rules)           (or demo mode)
```

## Architectural constraints

1. **API routes contain no UI logic.** All rendering stays in `components/` and `app/page.tsx`.
2. **Components never call OpenAI directly.** Only `app/api/chat/route.ts` holds the API key.
3. **Knowledge JSON is read server-side only** during chat requests — not exposed as a public static download (import from `lib/`, not `public/`).
4. **Client components** are marked `'use client'` only when they need hooks, events, or browser APIs.
5. **Theme tokens live in CSS variables** (`globals.css` + `ui-tokens.md`); components reference tokens, not raw hex in JSX.
6. **No database queries** in v1; no ORM.
7. **Streaming is the default** for assistant messages; non-streaming fallback only for demo mode.
8. **Errors surface to the user** as inline chat system messages or toast — never silent failure.

## Data model

### Knowledge entry (`data/trump-knowledge.json`)

```typescript
type KnowledgeEntry = {
  id: string;
  title: string;
  category: "trade" | "security" | "diplomacy" | "economy" | "immigration" | "energy" | "other";
  terms: ("first" | "second")[];
  dateRange: { start: string; end?: string }; // ISO dates
  eventSummary: string;
  trumpResponse: string;
  mechanisms: string[];       // e.g. "executive order", "tariff", "Truth Social"
  keywords: string[];         // for retrieval matching
  sources: string[];          // human-readable source labels (not live URLs required)
};
```

### Chat message (client)

```typescript
type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: number;
};
```

### Session (browser)

```typescript
type ChatSession = {
  id: string;
  messages: ChatMessage[];
  updatedAt: number;
};
```

Stored under `sessionStorage` key `trump-predictor:session`.

## API contract

### `POST /api/chat`

**Request body** (Vercel AI SDK compatible):

```json
{
  "messages": [
    { "role": "user", "content": "How did Trump respond to..." }
  ]
}
```

**Behavior:**
1. Validate message array (non-empty, last message is user).
2. Extract retrieval context from `trump-knowledge.json` based on keywords in the latest user message (+ optional thread topic).
3. Build system prompt with persona, safety rules, retrieved entries, and term-comparison guidance.
4. If `OPENAI_API_KEY` is set → stream via AI SDK.
5. If not set → return demo stream with a canned but context-aware response.

**Response:** `text/event-stream` (AI SDK UI message stream).

**Errors:**
- `400` — invalid payload
- `429` — optional simple in-memory rate limit per IP (soft, dev-friendly)
- `500` — provider failure → user-facing error message in stream

## Retrieval strategy (v1)

Simple **keyword scoring** — no embeddings required:

1. Tokenize user message to lowercase words.
2. Score each knowledge entry: `+2` per keyword match, `+1` per title word match, `+1` if category inferred from message.
3. Return top 5 entries as markdown context block injected into system prompt.
4. If score is zero, inject a "no close match" note so the model leans on general patterns with caution.

## Security & safety

- `OPENAI_API_KEY` in `.env.local` only; never `NEXT_PUBLIC_*`.
- System prompt instructs: no impersonation of official statements, no electioneering, cite uncertainty, refuse illegal/harmful requests.
- Disclaimer visible in header and first-visit dialog.
- No PII collection.

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `OPENAI_API_KEY` | No (demo mode if absent) | OpenAI API key |
| `OPENAI_MODEL` | No | Default `gpt-4o-mini` |

## Performance targets

- First token < 2s on warm connection (provider-dependent)
- Lighthouse performance ≥ 90 on chat page (minimal JS beyond chat)
- Knowledge retrieval < 10ms (in-memory JSON parse cached at module level)
