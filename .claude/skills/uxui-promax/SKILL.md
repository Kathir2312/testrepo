---
name: uxui-promax
description: Pro-level UX/UI enhancement playbook for SkyScout. Use when designing, reviewing, or polishing any frontend surface in this repo — pages, components, styles, loading/empty/error states, accessibility, or theming. Encodes the design system (tokens, palette, motion) and the polish checklist every screen must pass.
---

# UX/UI Pro Max — SkyScout design playbook

Apply this playbook whenever you build or touch UI in `frontend/`. The goal:
every screen should feel like a polished commercial travel product, not a demo.

## Design tokens (single source of truth)

All visual values live as CSS variables at the top of `frontend/src/styles.css`.
Never hardcode colors, shadows, or radii in components — extend the tokens.

- **Palette**: navy `#05203c` (brand), sky `#0770e3` (action), green `#00a698`
  (positive/savings), amber `#e18c12` (warnings/stops), red `#d1435b` (errors).
- **Theming**: every color must be expressed through a variable that has both a
  light value (`:root`) and a dark value (`[data-theme='dark']`). Theme is
  toggled on `<html data-theme>` and persisted to `localStorage('theme')`,
  defaulting to `prefers-color-scheme`.
- **Elevation**: use the `--shadow-*` scale (xs/sm/md/lg). Cards rest at sm,
  lift to md on hover with a translateY(-2px).
- **Radii**: 12px cards, 8px controls, 999px pills.
- **Spacing**: multiples of 4px only.

## Motion & micro-interactions

- Result lists animate in with a staggered `fadeUp` (≤ 40ms stagger, ≤ 400ms
  duration). Page-level content fades in once — never re-animate on filter.
- Interactive elements get `transition` on transform/box-shadow/background
  (150–200ms ease). Buttons compress slightly on `:active`.
- **Always** respect `@media (prefers-reduced-motion: reduce)` — disable
  transforms and animations there.

## Loading, empty and error states (no screen ships without all three)

- Loading = **skeleton screens** that mirror the final layout (shimmer via the
  shared `.skeleton` class + `Skeleton*` components), never bare spinners for
  list content. Spinners are acceptable only for sub-second lookups.
- Empty states explain *why* and give one next action (link or button).
- Errors are human sentences in `.error-banner`, never raw status codes.

## Accessibility checklist

- Visible `:focus-visible` ring (2px sky outline + offset) on all interactive
  elements; never remove outlines without replacement.
- Hit targets ≥ 40px; labels tied to inputs; icon-only buttons get `aria-label`.
- Color contrast ≥ 4.5:1 for text in both themes (check muted text on cards).
- Decorative emoji/SVG marked `aria-hidden="true"`.

## Layout & responsiveness

- Max content width 1140px (`.container`). Breakpoints: 820px (filters stack
  above results), 560px (cards go vertical, buy panel becomes a bottom row).
- Sticky elements (header, filter rail) must never trap scroll on mobile.

## Copy tone

- Sentence case everywhere. Verbs on buttons ("Search flights", "Confirm and
  book"), outcomes in headings ("You're booked!"). Prices always include
  context (per adult / per night / total).

## Definition of done for any UI change

1. Both themes checked (light + dark) — no hardcoded colors leaking through.
2. Loading skeleton, empty state, and error state all reachable and styled.
3. Keyboard-only walkthrough of the flow succeeds with visible focus.
4. `npm run build` clean; screenshot the affected screens at 1366px and 390px.
