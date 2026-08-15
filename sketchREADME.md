I assume that guest validation should work this way: 
  1. Every W in map.ascii represents a cabana.
  2. Initially, all cabanas are available.
  3. bookings.json is actually the guest-validation list.
  4. When a guest successfully books a cabana, the backend stores that booking in memory.
  5. That cabana becomes unavailable until the server restarts
  6. Names cant contain any numbers(validation process)

# README

This repository contains the [frontend](journey-frontend) and [backend](journey-backend) applications.

# HOW TO RUN

From the repository root, install dependencies and start both applications:

```bash
pnpm install
pnpm dev
```

By default, the backend uses `map.ascii` and `bookings.json` from the repository root. Both files must be readable. Paths are resolved from the repository root.

For alternate input files:

```bash
pnpm dev -- --map <path> --bookings <path>
```

# STACK
React Tailwind ReactQuery Nest.Js

# BACKEND

The NestJS backend loads the ASCII map and guest list once at startup, then keeps both in memory. Successful bookings update only the in-memory tile state, so all cabanas become available again after a server restart. This keeps the solution small while meeting the real-time map-update requirement.

The API is available at `http://localhost:8081`. CORS allows the Vite frontend at `http://localhost:3001` to call it directly. Set `FRONTEND_ORIGIN` when using a different frontend origin.

### Endpoints

- `GET /booking/map` returns every map tile with a unique `id`, zero-based `coordinates`, `name`, and `vacant` status.
- `POST /booking/book` books a vacant cabana after validating the guest against `bookings.json`.

Example booking request:

```json
{
  "tile": {
    "id": "cabana-11-2",
    "coordinates": { "x": 11, "y": 2 }
  },
  "user": {
    "room": "101",
    "guestName": "Alice Smith"
  }
}
```

Only cabanas can be booked. Invalid guest details, a missing tile, and an already-booked cabana return a short error response.

### Backend tests

From `journey-backend`:

```bash
```

# FRONTEND

### About
The frontend uses **React**, **TypeScript**, and **Vite**, with **Tailwind** and **hadcn/ui** components with accessible interface. The booking form uses **React Hook Form** with **Zod** for client-side input validation.

Tailwind was used as a native solution for shadcn which was picked as a way of saving foundation time so i wouldnt invent already exisitng components once again. 

### AI
Frontend implementation guidance: [AGENTS.md](journey-frontend/AGENTS.md).
