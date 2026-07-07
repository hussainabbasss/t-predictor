# Trump Predictor — UI Rules

Visual behavior and component patterns. These rules sit on top of `ui-tokens.md`.

## Absolute bans (enforced during build)

Per `/impeccable` standards — **never use**:

- Side-stripe accent borders (`border-left` / `border-right` > 1px as decoration)
- Gradient text (`background-clip: text`)
- Glassmorphism as default (decorative blur cards)
- Hero-metric template (big number + small label + stat row)
- Identical icon + heading + text card grids
- Uppercase tracked eyebrow above every section
- `01 / 02 / 03` numbered section markers as reflex scaffolding
- Warm cream/sand body backgrounds
- Arbitrary z-index (`999`, `9999`)

## Layout philosophy

Trump Predictor is a **tool**, not a marketing site. The chat transcript is the product. Layout priorities:

1. **Transcript first** — message list occupies maximum vertical space.
2. **Input always reachable** — sticky bottom composer on mobile; fixed footer region on desktop.
3. **Header stays minimal** — product name, theme toggle, disclaimer access only.
4. **No card grid landing** — the empty state is a headline + suggested prompts inline, not a feature grid.

Use flex column for the shell; grid only for the suggested-prompt row (`auto-fit, minmax(200px, 1fr)`).

## App shell

- Full viewport height (`100dvh`) with safe-area insets on mobile.
- Header: 56px height, `--z-sticky`, subtle bottom border (`--color-border`).
- Main: flex-1 overflow hidden; message list scrolls inside.
- Composer: padded, top border, surface-raised background.

## Typography rules

- Page title: `--font-display`, `--text-display`, `text-wrap: balance`.
- Chat messages: `--font-body`, `--text-base`, max-width ~70ch per bubble.
- Timestamps/meta: `--text-xs`, `--color-ink-muted`.
- Code or policy references in messages: `--font-mono`, slightly smaller.

## Buttons

### Primary (send, main CTA)
- Background `--color-accent`, text white/near-white.
- Radius `--radius-lg`, min height 44px (touch target).
- Hover: `--color-accent-hover`; no bounce animation.
- Disabled: reduced opacity, no pointer events.

### Secondary (suggested prompts, new chat)
- Background `--color-surface-raised`, border `--color-border`.
- Hover: border `--color-border-strong`, subtle background shift.
- Full pill shape (`--radius-full`) for prompt chips only.

### Icon button (theme toggle)
- 40×40px hit area, ghost style, visible focus ring.

## Chat bubbles

- **User:** right-aligned, `--color-bubble-user`, no avatar required.
- **Assistant:** left-aligned, `--color-bubble-assistant`, optional small "TP" monogram mark (SVG, not emoji).
- **System/errors:** centered, smaller, `--color-bubble-system`, no bubble tail.
- Border: 1px `--color-border` on assistant bubbles only (subtle definition in dark mode).
- Streaming cursor: blinking block at end of assistant text, respects reduced motion (static bar).

## Inputs

- Textarea auto-grows to max 6 lines, then scrolls.
- Placeholder: "Ask about a past event or hypothetical scenario…"
- Focus ring: 2px `--color-focus-ring`, offset 2px.
- Send on Enter; Shift+Enter for newline.

## Suggested prompts (empty state)

- Show 4 prompts as secondary buttons in a wrapping row.
- Examples tied to product value (not generic "Tell me more"):
  - "How did Trump respond to China tariff escalation in 2018?"
  - "Compare his NATO spending rhetoric: term 1 vs term 2."
  - "If OPEC cuts production sharply, what pattern might he follow?"
  - "What mechanisms did he use for Iran sanctions?"
- Clicking a prompt fills input and sends (or fills only — fill + focus is acceptable; spec prefers auto-send for speed).

## Disclaimer

- First visit: native `<dialog>` modal with short disclaimer (AI-generated, not official, not advice).
- Dismiss persists in `localStorage` key `trump-predictor:disclaimer-seen`.
- Header includes "About" text button to reopen.

## Motion

- Message appear: fade + 8px translate up, `--duration-normal`, `--ease-out`.
- Stagger suggested prompts by 50ms each (max 4 items) — only on empty state mount.
- Theme toggle: icon crossfade, `--duration-fast`.
- **Every animation** has `@media (prefers-reduced-motion: reduce)` → instant or opacity-only.
- **Never gate visibility** on scroll-triggered classes; content is visible by default.

## Icons

- Use inline SVG stroke icons (Lucide-style), 20px default, `currentColor`.
- No emoji as UI icons.

## Empty state copy

Headline (display font): "What would Trump do?"

Subline: "Explore documented reactions from two terms — and reasoned predictions for new scenarios."

## Error states

- Inline in chat: "Connection interrupted. Try again." with retry affordance.
- API key missing (dev): subtle banner in header — "Demo mode — add OPENAI_API_KEY for live AI."
- Rate limit: polite wait message, no technical jargon.

## Responsive breakpoints

| Breakpoint | Behavior |
|---|---|
| < 640px | Full-bleed chat, header compact, prompts stack 1-col |
| 640–1024px | Centered column max-width 720px |
| ≥ 1024px | Centered column max-width 820px, more header breathing room |

## Accessibility

- `lang="en"` on `<html>`.
- Chat log: `role="log"`, `aria-live="polite"` for new assistant messages.
- Theme toggle: `aria-label` reflects target mode.
- Focus order: header → transcript → input → send.
- Color is never the only signal for state (errors include text).

## Graphics (domain-relevant, both themes)

- Header mark: minimal SVG seal-inspired circle with "TP" or abstract podium lines — single color, no flag imagery.
- Empty state: optional subtle SVG world-map dot grid (low opacity) behind headline — decorative, must work in both themes.
- No stock photos of politicians.
