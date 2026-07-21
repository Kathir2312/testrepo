# SkyScout — Task Breakdown

Status legend: ✅ done · 🔲 not started

## Epic 1 — Project foundation
- ✅ **T1.1** Repo structure: `backend/`, `frontend/`, root compose + docs
- ✅ **T1.2** `.gitignore` / `.dockerignore` hygiene
- ✅ **T1.3** `CLAUDE.md` with architecture, commands and conventions

## Epic 2 — Backend API (Node 22 + Express)
- ✅ **T2.1** Express app skeleton, CORS, JSON errors, `/api/health`
- ✅ **T2.2** Reference data: 30 airports, 16 airlines, `/api/airports?q=` autocomplete
- ✅ **T2.3** Deterministic seeded RNG (`makeRng`) so identical queries return identical results
- ✅ **T2.4** Flight search engine: one-way/return itineraries, stops, cabins, per-adult pricing
- ✅ **T2.5** Hotel search engine: stars, ratings, amenities, per-night/total pricing
- ✅ **T2.6** Car hire search engine: categories, suppliers, transmission, per-day pricing
- ✅ **T2.7** Booking service: create/lookup/list with 6-char references, JSON-file persistence
- ✅ **T2.8** API test suite with `node:test` (7 tests: health, determinism, validation, booking lifecycle)

## Epic 3 — Frontend (React 18 + Vite)
- ✅ **T3.1** App shell: router, Skyscanner-style header/footer, global stylesheet (navy/sky palette)
- ✅ **T3.2** Home page: hero, tabbed search widget (Flights / Hotels / Car hire), USP row, deal cards
- ✅ **T3.3** Search widget: airport autocomplete, return/one-way toggle, travellers, cabin class
- ✅ **T3.4** Flight results: Best/Cheapest/Fastest sort tabs, filters (stops, max-price slider, airlines), itinerary cards with legs/stops/duration
- ✅ **T3.5** Hotel results: star/sort filters, rating pills, amenity chips
- ✅ **T3.6** Car hire results: transmission filter, cancellation/mileage badges
- ✅ **T3.7** Booking page: traveller form + price summary sidebar, POSTs to the API
- ✅ **T3.8** Confirmation page: fetches booking by reference; NotFound page

## Epic 4 — Containerization
- ✅ **T4.1** Backend Dockerfile: node:22-alpine, non-root user, healthcheck
- ✅ **T4.2** Frontend Dockerfile: multi-stage Vite build → nginx:alpine
- ✅ **T4.3** nginx config: SPA fallback, `/api/` reverse proxy to backend, gzip + caching
- ✅ **T4.4** `docker-compose.yml`: two services, named volume for booking persistence, single exposed port 8080

## Epic 5 — Verification
- ✅ **T5.1** Backend test suite green (`npm test`)
- ✅ **T5.2** Frontend production build green (`npm run build`)
- ✅ **T5.3** End-to-end smoke test: search → select → book → confirmation against the running stack

## Epic 6 — UX/UI Pro Max (design system & polish)
- ✅ **T6.1** `uxui-promax` project skill (`.claude/skills/uxui-promax/SKILL.md`): design tokens, motion rules, state requirements, a11y checklist, UI definition of done
- ✅ **T6.2** Token-driven theming with **dark mode** (header toggle, `localStorage` persistence, `prefers-color-scheme` default, no-flash bootstrap)
- ✅ **T6.3** Skeleton loading screens replacing spinners on all result pages
- ✅ **T6.4** Micro-interactions: card hover lift, staggered fade-up on results, button press states, animated origin/destination swap button
- ✅ **T6.5** Flight card tags (Cheapest / Fastest / Best) computed per filtered set
- ✅ **T6.6** Hero upgrade: glow accents, floating plane, subline, trust-stats strip; USP icons; richer multi-column footer
- ✅ **T6.7** Accessibility: `:focus-visible` rings, aria-labels on icon buttons, `prefers-reduced-motion` support
- ✅ **T6.8** Mobile polish: cards collapse to vertical layout at 560px, buy panel becomes bottom row
- ✅ **T6.9** Full playbook polish pass (`/uxui-promax`): error banners gain "Try again" retry actions; empty states gain one-click recovery buttons; `aria-live` result counts; labels tied to inputs across all forms; 40px hit targets; inline gradients moved to tokenized classes; confirmation page gains a booking-details panel with next steps; NotFound gains a real call to action

## Epic 7 — Future enhancements (not started)
- 🔲 **T7.1** Replace JSON-file store with PostgreSQL service in compose
- 🔲 **T7.2** User accounts and "My trips" page (list bookings by email exists in the API already)
- 🔲 **T7.3** Price calendar / "whole month" search
- 🔲 **T7.4** "Everywhere" destination search (cheapest fare per destination)
- 🔲 **T7.5** Multi-currency support (`Accept-Currency` + FX table)
- 🔲 **T7.6** CI pipeline (GitHub Actions: test + build + docker build)
- 🔲 **T7.7** Playwright end-to-end tests
