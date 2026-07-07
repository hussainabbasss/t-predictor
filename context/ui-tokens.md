# Trump Predictor — UI Tokens

All visual values are defined here as CSS custom properties. **No hard-coded colors, spacing, or radii in components** — reference these tokens via Tailwind theme extension or `var(--token)`.

## Scene sentence

A policy analyst at a home desk at 10pm, laptop open beside a muted TV news chyron about tariffs and summit optics — reading in low ambient light, wanting fast, serious answers without campaign noise. **Default theme: dark.**

## Color strategy

**Committed** — deep ink navy carries most of the chrome; a single saturated **signal red** accent (≤15% of visible surface) marks primary actions and key emphasis. Gold/amber appears only as a secondary highlight for "historical precedent" badges, not as a third competing brand color. Avoid flag-gradient clichés; the palette should feel like a newsroom terminal, not a rally poster.

## Typography

| Token | Value |
|---|---|
| `--font-display` | `"Instrument Serif", Georgia, serif` |
| `--font-body` | `"DM Sans", system-ui, sans-serif` |
| `--font-mono` | `"Geist Mono", ui-monospace, monospace` |

### Scale

| Token | Size | Line height | Weight | Use |
|---|---|---|---|---|
| `--text-xs` | 0.75rem | 1.25 | 500 | Meta, timestamps |
| `--text-sm` | 0.875rem | 1.45 | 400 | Secondary body, labels |
| `--text-base` | 1rem | 1.6 | 400 | Chat messages |
| `--text-lg` | 1.125rem | 1.55 | 500 | Input, emphasis |
| `--text-xl` | 1.25rem | 1.4 | 600 | Section titles |
| `--text-2xl` | clamp(1.5rem, 2vw + 1rem, 2rem) | 1.2 | 600 | Page title |
| `--text-display` | clamp(2rem, 3vw + 1rem, 3.5rem) | 1.1 | 600 | Hero headline (max ≤ 6rem) |

Letter-spacing: display headings `--tracking-display: -0.03em` (never tighter than -0.04em).

## Spacing scale

| Token | Value |
|---|---|
| `--space-1` | 0.25rem |
| `--space-2` | 0.5rem |
| `--space-3` | 0.75rem |
| `--space-4` | 1rem |
| `--space-5` | 1.25rem |
| `--space-6` | 1.5rem |
| `--space-8` | 2rem |
| `--space-10` | 2.5rem |
| `--space-12` | 3rem |
| `--space-16` | 4rem |

## Radii

| Token | Value |
|---|---|
| `--radius-sm` | 0.375rem |
| `--radius-md` | 0.625rem |
| `--radius-lg` | 1rem |
| `--radius-xl` | 1.25rem |
| `--radius-full` | 9999px |

## Shadows

| Token | Value |
|---|---|
| `--shadow-sm` | `0 1px 2px oklch(0 0 0 / 0.12)` |
| `--shadow-md` | `0 4px 12px oklch(0 0 0 / 0.18)` |
| `--shadow-lg` | `0 12px 32px oklch(0 0 0 / 0.22)` |

## Motion

| Token | Value |
|---|---|
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `--duration-fast` | 150ms |
| `--duration-normal` | 250ms |
| `--duration-slow` | 400ms |

Reduced motion: all transitions collapse to `0ms` or opacity-only crossfade.

## Z-index scale

| Token | Value | Use |
|---|---|---|
| `--z-base` | 0 | Default |
| `--z-dropdown` | 10 | Suggested prompt menus |
| `--z-sticky` | 20 | App header |
| `--z-modal-backdrop` | 40 | Disclaimer overlay |
| `--z-modal` | 50 | Disclaimer dialog |
| `--z-toast` | 60 | Error toasts |
| `--z-tooltip` | 70 | Tooltips |

---

## Light theme (`:root`, `[data-theme="light"]`)

```css
:root,
[data-theme="light"] {
  /* Surfaces — cool ink-tinted neutrals, NOT warm cream */
  --color-bg: oklch(0.97 0.008 250);
  --color-surface: oklch(1 0.004 250);
  --color-surface-raised: oklch(0.99 0.006 250);
  --color-surface-sunken: oklch(0.94 0.01 250);

  /* Ink */
  --color-ink: oklch(0.22 0.03 255);
  --color-ink-secondary: oklch(0.42 0.025 255);
  --color-ink-muted: oklch(0.48 0.02 255); /* ≥4.5:1 on --color-bg */

  /* Brand */
  --color-accent: oklch(0.52 0.19 25);       /* signal red */
  --color-accent-hover: oklch(0.46 0.2 25);
  --color-accent-subtle: oklch(0.52 0.19 25 / 0.12);
  --color-highlight: oklch(0.72 0.12 75);    /* amber for precedent tags */
  --color-highlight-subtle: oklch(0.72 0.12 75 / 0.15);

  /* Semantic */
  --color-border: oklch(0.88 0.012 250);
  --color-border-strong: oklch(0.78 0.015 250);
  --color-focus-ring: oklch(0.52 0.19 25 / 0.45);

  /* Chat bubbles */
  --color-bubble-user: oklch(0.93 0.015 250);
  --color-bubble-assistant: oklch(1 0.004 250);
  --color-bubble-system: oklch(0.96 0.01 250);

  /* Status */
  --color-success: oklch(0.55 0.14 145);
  --color-warning: oklch(0.65 0.14 75);
  --color-error: oklch(0.55 0.2 25);
}
```

## Dark theme (`[data-theme="dark"]`) — **default**

```css
[data-theme="dark"] {
  --color-bg: oklch(0.16 0.025 255);
  --color-surface: oklch(0.2 0.028 255);
  --color-surface-raised: oklch(0.24 0.03 255);
  --color-surface-sunken: oklch(0.13 0.022 255);

  --color-ink: oklch(0.93 0.01 250);
  --color-ink-secondary: oklch(0.78 0.015 250);
  --color-ink-muted: oklch(0.72 0.012 250); /* ≥4.5:1 on --color-bg */

  --color-accent: oklch(0.62 0.2 25);
  --color-accent-hover: oklch(0.68 0.21 25);
  --color-accent-subtle: oklch(0.62 0.2 25 / 0.18);
  --color-highlight: oklch(0.78 0.11 75);
  --color-highlight-subtle: oklch(0.78 0.11 75 / 0.2);

  --color-border: oklch(0.32 0.025 255);
  --color-border-strong: oklch(0.42 0.03 255);
  --color-focus-ring: oklch(0.62 0.2 25 / 0.5);

  --color-bubble-user: oklch(0.26 0.035 255);
  --color-bubble-assistant: oklch(0.22 0.03 255);
  --color-bubble-system: oklch(0.18 0.025 255);

  --color-success: oklch(0.68 0.14 145);
  --color-warning: oklch(0.78 0.13 75);
  --color-error: oklch(0.65 0.2 25);
}
```

## Tailwind bridge (`@theme inline` in globals.css)

Map tokens to Tailwind color utilities:

- `bg-bg`, `bg-surface`, `text-ink`, `text-ink-secondary`, `text-ink-muted`
- `bg-accent`, `text-accent`, `border-border`
- `bg-bubble-user`, `bg-bubble-assistant`

## Contrast verification notes

- `--color-ink-muted` on `--color-bg`: light ≈ 5.2:1, dark ≈ 5.5:1 (body-secondary safe)
- `--color-ink` on `--color-bg`: light ≈ 12:1, dark ≈ 11:1
- Placeholder text uses `--color-ink-muted`, not lighter gray
- Accent buttons use white/near-white text on `--color-accent` (≥4.5:1)
