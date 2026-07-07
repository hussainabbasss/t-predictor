# Trump Predictor — Build Plan

Ordered phases. Complete each before moving on. Definition of done includes **both themes** and **mobile + desktop** unless noted.

---

## Phase 0 — Project foundation

**Goal:** Dependencies, tokens, theme infrastructure, path aliases.

**Tasks:**
1. Install AI SDK packages + `clsx` + `tailwind-merge`.
2. Replace `globals.css` with full token system from `ui-tokens.md` + Tailwind `@theme` bridge.
3. Swap fonts to Instrument Serif + DM Sans in `layout.tsx`.
4. Add `ThemeProvider` + inline anti-FOUC script for `data-theme`.
5. Build `ThemeToggle` component; register in `ui-registry.md`.
6. Add `lib/utils.ts` with `cn()`.
7. Configure `@/` path alias in `tsconfig.json` if missing.
8. Add `.env.example`.
9. Update `metadata` title/description.

**Done when:**
- `npm run build` passes.
- Theme toggle switches light/dark; persists on reload.
- Both themes render correct token colors on a placeholder page.

---

## Phase 1 — Knowledge base & AI layer

**Goal:** Server-side intelligence ready before UI wiring.

**Tasks:**
1. Create `data/trump-knowledge.json` with ≥30 curated entries spanning:
   - Trade/tariffs (China, EU, USMCA)
   - Security (NATO, Iran, North Korea, Ukraine)
   - Diplomacy (summits, withdrawals)
   - Economy (tax policy reactions, Fed criticism)
   - Immigration/border
   - Energy
   - Mix of first-term and second-term events
2. Implement `lib/ai/retrieve-context.ts` with keyword scoring.
3. Implement `lib/ai/system-prompt.ts` with persona, safety, citation framing.
4. Implement `lib/ai/demo-response.ts` for no-key fallback.
5. Implement `app/api/chat/route.ts` with streaming + demo branch.
6. Add `lib/chat/types.ts`.

**Done when:**
- `curl` POST to `/api/chat` returns streamed text (with or without API key).
- Retrieved context visibly influences demo responses for matched queries.
- No API keys in client bundle.

---

## Phase 2 — UI primitives

**Goal:** Reusable building blocks.

**Tasks:**
1. `Button`, `IconButton`, `ScrollArea`.
2. `AppMark` SVG + optional `MapBackdrop`.
3. `DisclaimerDialog`.
4. Register all as `built` in `ui-registry.md`.

**Done when:**
- Components render in isolation on a dev scratch or story-less smoke test in page temporarily.
- Focus rings, touch targets, and tokens verified in both themes.

---

## Phase 3 — Chat components

**Goal:** Complete chat UI pieces.

**Tasks:**
1. `MessageBubble` (user / assistant / system).
2. `TypingIndicator`.
3. `MessageList` with auto-scroll to bottom on new messages.
4. `ChatInput` with Enter/Shift+Enter behavior.
5. `SuggestedPrompts` with 4 domain-specific prompts.
6. `NewChatButton`.
7. `AppHeader` composing mark, title, about, theme toggle, optional demo banner.

**Done when:**
- Components accept mock props and render all states.
- `prefers-reduced-motion` respected on message enter animation.

---

## Phase 4 — Chat shell & page integration

**Goal:** Wire `useChat` to UI; full working app.

**Tasks:**
1. `ChatShell` layout (header + list + input).
2. Client `ChatPage` component with `useChat` from `@ai-sdk/react`.
3. Replace `app/page.tsx` with chat experience.
4. Implement `session-storage.ts` — persist/restore messages.
5. Empty state: headline + map backdrop + suggested prompts.
6. Streaming: show typing indicator while `status === 'streaming' | 'submitted'`.
7. Error handling via `onError` → system message.
8. New chat clears session.

**Done when:**
- End-to-end chat works in browser (demo or live mode).
- Suggested prompts send messages.
- Session survives page refresh.
- Disclaimer shows once, reopenable from header.

---

## Phase 5 — Polish, harden, ship

**Goal:** Production-quality pass before `/impeccable`.

**Tasks:**
1. Responsive pass: 375px, 768px, 1280px.
2. Keyboard navigation audit.
3. `aria-live` on message list.
4. Loading edge cases (empty send blocked, double-submit prevented).
5. `npm run lint` clean; `npm run build` clean.
6. Remove any scaffold leftover (Next.js default homepage content).
7. Add `public/og-image.svg` or similar for metadata.
8. Update `progress-tracker.md` to complete.
9. Derive `PRODUCT.md` and `DESIGN.md` from context files for impeccable.
10. Run `/impeccable` elevation pass per produce Phase 3.

**Done when:**
- All flows from `project-overview.md` work.
- Both themes polished.
- Impeccable pass issues resolved.

---

## Build order summary

```
Phase 0 (foundation) → Phase 1 (AI) → Phase 2 (primitives) → Phase 3 (chat UI) → Phase 4 (integration) → Phase 5 (harden + impeccable)
```

**Estimated knowledge entries:** 30–50  
**Estimated new components:** 15  
**Routes:** 1 page + 1 API
