# Trump Predictor — Library Docs

Project-specific usage patterns for key dependencies. Read `node_modules/next/dist/docs/` before writing Next.js code — this is Next.js 16 with breaking changes from earlier versions.

## Next.js 16 (App Router)

- **Pages:** `app/page.tsx` is the sole route for v1.
- **API routes:** `app/api/chat/route.ts` — Route Handlers, not Pages API.
- **Metadata:** Set in `app/layout.tsx` via `export const metadata`.
- **Fonts:** Use `next/font/google` for Instrument Serif + DM Sans; remove default Geist if replaced.
- **Do not** use deprecated patterns from Next 13/14 training data; consult local docs when unsure.

## Tailwind CSS v4

- Entry: `app/globals.css` with `@import "tailwindcss"`.
- Theme extension via `@theme inline { ... }` mapping CSS variables from `ui-tokens.md`.
- Dark mode: **class/data-attribute strategy** — `[data-theme="dark"]`, not `dark:` variant alone (toggle must override system pref).
- Prefer semantic utilities (`bg-surface`, `text-ink`) over raw palette names.

## Vercel AI SDK (`ai`)

**Install:** `ai`, `@ai-sdk/openai`, `@ai-sdk/react` (versions compatible with Next 16 / React 19).

### Server (`app/api/chat/route.ts`)

```typescript
import { openai } from "@ai-sdk/openai";
import { streamText, convertToModelMessages } from "ai";

const result = streamText({
  model: openai(process.env.OPENAI_MODEL ?? "gpt-4o-mini"),
  system: buildSystemPrompt(retrievedContext),
  messages: await convertToModelMessages(messages),
});

return result.toUIMessageStreamResponse();
```

### Client

```typescript
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

const { messages, sendMessage, status, error } = useChat({
  transport: new DefaultChatTransport({ api: "/api/chat" }),
});
```

- Use `status` (`ready`, `submitted`, `streaming`, `error`) for typing indicator.
- Messages use `parts` API in AI SDK v5+ — render text parts from `message.parts`.

## OpenAI via AI SDK

- Key: `process.env.OPENAI_API_KEY` — server only.
- Default model: `gpt-4o-mini` (cost-effective, sufficient for v1).
- Max tokens: ~1024 output cap to keep responses concise.
- Temperature: 0.7 for analytical but not robotic tone.

## Demo mode (no API key)

When `OPENAI_API_KEY` is unset:

1. `route.ts` detects missing key.
2. Returns a simulated stream using `demo-response.ts` — still runs retrieval so responses reference matched knowledge entries.
3. Header shows unobtrusive demo banner.

This keeps the app fully demoable in CI and local dev without secrets.

## Knowledge retrieval (custom, no vector DB)

- Import JSON in `lib/ai/retrieve-context.ts`.
- Cache parsed array at module scope after first import.
- Export `retrieveContext(query: string, limit = 5): KnowledgeEntry[]`.
- Format matches as markdown bullet list for system prompt injection.

## Theme (`lib/theme/`)

- `ThemeProvider` wraps app in `layout.tsx`.
- Initial theme: read `localStorage` → else `prefers-color-scheme` → default `dark`.
- Set `data-theme` on `<html>` synchronously via inline script in layout to prevent flash (small blocking script acceptable).

## Session storage (`lib/chat/session-storage.ts`)

- Save `messages` on each update (debounced 300ms).
- Load on mount; merge with `useChat` initial messages if compatible.
- Graceful no-op if `sessionStorage` unavailable.

## `cn()` utility

If adding `clsx` + `tailwind-merge`:

```bash
npm install clsx tailwind-merge
```

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## ESLint

- `eslint-config-next` already configured.
- Run `npm run lint` after each phase.

## Environment files

`.env.example`:

```
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
```

## MCP

No MCP servers in v1.

## Dependencies to add in Phase 2

```bash
npm install ai @ai-sdk/openai @ai-sdk/react clsx tailwind-merge
```

Optional: `lucide-react` for icons — or inline SVGs per ui-rules (inline preferred to reduce bundle if only 4–5 icons).
