# SkyScout ✈️

A full-stack, containerized **Skyscanner-style travel search product**: compare
flights, hotels and car hire, filter and sort results, and book with instant
confirmation. All inventory is simulated with a deterministic generator — no
external APIs or keys needed.

> Demo project. Not affiliated with Skyscanner Ltd.

## Quick start

```bash
docker compose up --build
```

Open **http://localhost:8080** — search flights (e.g. `LHR → JFK`), pick an
itinerary, enter traveller details and get a booking reference.

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, React Router, plain CSS — served by nginx |
| Backend | Node 22, Express, deterministic seeded mock data, `node:test` |
| Persistence | Bookings in a JSON file on a Docker named volume |
| Infra | Docker multi-stage builds, docker-compose, nginx reverse proxy |

## Local development

```bash
# Terminal 1 — API on :4000
cd backend && npm install && npm run dev

# Terminal 2 — UI on :5173 (proxies /api to :4000)
cd frontend && npm install && npm run dev
```

Run the API tests with `cd backend && npm test`.

## Docs

- [`CLAUDE.md`](CLAUDE.md) — architecture, API surface, conventions
- [`TASKS.md`](TASKS.md) — epic/task breakdown and roadmap
