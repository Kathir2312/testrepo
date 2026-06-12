# CLAUDE.md

Guidance for Claude Code (and humans) working in this repository.

## What this project is

**SkyScout** — a Skyscanner-style travel metasearch product: search and compare
flights, hotels and car hire, then book with instant confirmation. All inventory
and prices are **simulated** with a deterministic seeded generator (same search
query → same results), so no external APIs or database are required.

## Architecture

```
┌─────────────────────┐        ┌──────────────────────┐
│ frontend (nginx:80) │ /api/* │ backend (node:4000)  │
│ React 18 + Vite SPA ├───────▶│ Express REST API     │
│ served as static    │ proxy  │ seeded mock inventory│
└─────────────────────┘        │ JSON-file bookings   │
   host port 8080              └─────────┬────────────┘
                                  volume: bookings-data
```

- `backend/` — Node 22 + Express (ES modules, no transpilation)
  - `src/app.js` — all routes; `src/server.js` — entrypoint
  - `src/data/` — airports, airlines, and the seeded generators for
    flights/hotels/cars (`random.js` holds the deterministic RNG)
  - `src/store/bookings.js` — bookings persisted to a JSON file
    (path from `BOOKINGS_DB`, a Docker volume in compose)
  - `test/` — API tests using `node:test` (no test framework dependency)
- `frontend/` — React 18 + Vite + React Router, plain CSS in `src/styles.css`
  - `src/pages/` — Home, FlightResults, HotelResults, CarResults, Booking,
    Confirmation, NotFound
  - `src/components/` — Header, Footer, SearchWidget, FlightCard, Loader
  - `src/api/client.js` — fetch wrapper + money/time/duration formatters
- `docker-compose.yml` — two services; nginx in the frontend image proxies
  `/api/` to `backend:4000`, so the browser only ever talks to port 8080.

## API surface

| Method | Path | Notes |
|---|---|---|
| GET | `/api/health` | liveness |
| GET | `/api/airports?q=` | autocomplete source |
| GET | `/api/airlines` | carrier list |
| GET | `/api/flights/search` | `origin, destination, departDate[, returnDate], adults, cabinClass` |
| GET | `/api/hotels/search` | `city, checkIn, checkOut, guests, rooms` |
| GET | `/api/cars/search` | `location, pickUpDate, dropOffDate` |
| POST | `/api/bookings` | `{ type: flight\|hotel\|car, item, contact }` → 201 with `reference` |
| GET | `/api/bookings/:reference` | look up a booking |
| GET | `/api/bookings?email=` | list bookings |

Dates are `YYYY-MM-DD`; errors return `{ "error": "message" }` with 4xx/5xx.

## Commands

```bash
# Full stack (production-like)
docker compose up --build          # then open http://localhost:8080

# Backend dev
cd backend && npm install && npm run dev   # http://localhost:4000
cd backend && npm test                     # node:test API suite

# Frontend dev (proxies /api to localhost:4000 — run the backend too)
cd frontend && npm install && npm run dev  # http://localhost:5173
cd frontend && npm run build               # production bundle in dist/
```

## Conventions

- ES modules everywhere (`"type": "module"`); Node >= 20, no Babel/TypeScript.
- Keep the backend dependency-light (currently just `express` + `cors`).
- All mock data generation must stay **deterministic**: seed RNGs from the
  query string via `makeRng()` in `backend/src/data/random.js`. Never use
  `Math.random()` in search results (booking references are the one exception).
- Frontend styling lives in the single `src/styles.css` using the CSS
  variables at the top (Skyscanner-ish palette: navy `#05203c`, sky `#0770e3`).
- Filtering/sorting of search results happens client-side; the API returns the
  full result set for a query.
- Booking flow passes the selected item via React Router `location.state` to
  `/book`; deep-linking to `/book` intentionally shows an empty state.
- Validation errors in the backend are thrown as `Error` with a `status`
  property and handled by the final error middleware in `app.js`.

## Testing & verification

- `cd backend && npm test` must pass before pushing.
- `cd frontend && npm run build` must complete without errors.
- For an end-to-end check: `docker compose up --build`, then exercise
  search → select → book → confirmation at http://localhost:8080.

## Roadmap / task tracking

See `TASKS.md` for the epic/task breakdown and current status.
