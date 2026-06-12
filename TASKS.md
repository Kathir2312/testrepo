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

## Epic 6 — Future enhancements (not started)
- 🔲 **T6.1** Replace JSON-file store with PostgreSQL service in compose
- 🔲 **T6.2** User accounts and "My trips" page (list bookings by email exists in the API already)
- 🔲 **T6.3** Price calendar / "whole month" search
- 🔲 **T6.4** "Everywhere" destination search (cheapest fare per destination)
- 🔲 **T6.5** Multi-currency support (`Accept-Currency` + FX table)
- 🔲 **T6.6** CI pipeline (GitHub Actions: test + build + docker build)
- 🔲 **T6.7** Playwright end-to-end tests
