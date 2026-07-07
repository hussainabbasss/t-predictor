# Trump Predictor — Design

## Scene

A policy analyst at a home desk at 10pm, laptop open beside muted TV news about tariffs and summit optics — low ambient light, wanting fast serious answers without campaign noise.

## Default theme

Dark

## Color strategy

Committed — deep ink navy chrome, signal red accent (≤15%), amber for precedent highlights only.

## Typography

- Display: Instrument Serif
- UI/body: DM Sans
- Mono: Geist Mono (code references)

## Bans

No side-stripe borders, gradient text, glassmorphism-by-default, hero-metric template, identical card grids, uppercase tracked eyebrows on every section, 01/02/03 section numbering, warm cream body backgrounds.

## Tokens

See `context/ui-tokens.md` and `app/globals.css`.

## Hero graphic

`public/trump.png` — caricature figure on empty state with orbital accents, floating animation, and radial edge mask. Works in both themes.

## Motion

Ease-out exponential; reduced-motion alternatives required. Reveal animations enhance already-visible content.
