# Trump Predictor — Code Standards

## TypeScript

- `strict: true` — no `any` unless justified with a one-line comment.
- Prefer `type` over `interface` for props and data shapes unless extending.
- Export types from `lib/*/types.ts`, not from component files.
- Use `satisfies` for const objects (knowledge categories, prompt lists).

## Naming

| Kind | Convention | Example |
|---|---|---|
| Components | PascalCase | `MessageBubble.tsx` |
| Files (components) | kebab-case | `message-bubble.tsx` |
| Hooks | `use` prefix | `useTheme` |
| Utilities | camelCase | `retrieveContext` |
| Constants | SCREAMING_SNAKE | `SESSION_STORAGE_KEY` |
| CSS variables | kebab-case | `--color-ink-muted` |

## File patterns

- One default export component per file.
- Colocate component-specific types at bottom of file if used only there.
- Server-only modules: import `server-only` package or place exclusively under `app/api/` and `lib/ai/` server paths.

## React

- Server Components by default; `'use client'` only when needed.
- `app/page.tsx` may be a thin server wrapper importing a client `ChatPage` component if hooks are required.
- No `useEffect` for data that can be derived from props/state.
- Keys on lists: stable `id` fields, never array index for messages.

## Styling

- Tailwind utility classes referencing theme tokens (`bg-surface`, `text-ink-muted`).
- Use `cn()` from `lib/utils.ts` for conditional classes (clsx + tailwind-merge if added).
- **No inline `style={{ color: '#...' }}`** except for dynamic values not available as tokens.
- No `@apply` blocks except in `globals.css` for base resets.

## API routes

```typescript
// app/api/chat/route.ts pattern
export async function POST(req: Request) {
  // 1. parse + validate
  // 2. retrieve context
  // 3. stream or demo
  // 4. return stream response
}
```

- Always wrap provider calls in try/catch; return structured error streams.
- Never log full user messages in production (dev-only debug).

## AI / prompts

- System prompt lives in `lib/ai/system-prompt.ts` as a function `buildSystemPrompt(context: string): string`.
- Keep prompt text versioned with a `PROMPT_VERSION` constant for future tuning.
- Retrieval logic pure and testable in `lib/ai/retrieve-context.ts`.

## Error handling

| Layer | Pattern |
|---|---|
| API route | try/catch → `Response` with appropriate status or error stream |
| Client fetch | `useChat` `onError` → append system message |
| Storage | try/catch around `sessionStorage` (private mode fallback) |

User-facing errors: short, actionable, no stack traces.

## Imports

Order: React → Next → third-party → `@/lib` → `@/components` → relative.

Use `@/` path alias (configure in `tsconfig.json` if not present).

## Comments

- Self-documenting code preferred.
- Comment only: non-obvious retrieval scoring, prompt safety rules, browser storage fallbacks.

## Git / env

- `.env.local` in `.gitignore`; provide `.env.example` with `OPENAI_API_KEY=` and `OPENAI_MODEL=`.
- No secrets in client bundle.

## Linting

- Run `npm run lint` before marking a build phase complete.
- Fix all errors; warnings only if pre-existing.

## Testing (v1)

- No formal test suite required for v1.
- Manual verification checklist per build phase (see `build-plan.md`).
