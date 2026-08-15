
# My Assumptions
  2. Initially, all cabanas are available.
  3. bookings.json is actually the guest-validation list.
  5. That cabana becomes unavailable until the server restarts
  6. Names cant contain any numbers
  7. Many pools nearby are not water, but a bunch of pools
  8. I can use loosly cors for demonstration purposes, but in production it should be more strict.
  9. I wont put my workflow in AI.md because most agents still read AGENTS.md and i will put it there
# README

This is a mmonorepo containing the [frontend](journey-frontend) and [backend](journey-backend) applications of task from juorney.

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
React Tailwind Nest.Js

# BACKEND

The NestJS backend loads the ASCII map and guest list once at startup, then keeps both in memory. Successful bookings update only the in-memory tile state, so all cabanas become available again after a server restart.

The API is available at `http://localhost:8081`. CORS allows the Vite frontend at `http://localhost:3001` to call it via proxy

**Why Nest.js ?** - easy to set up, has a lot of built-in features, and is a good fit for REST APIs. It also has a nice CLI for generating boilerplate code and tests 

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
### AI
Did not use Ai enough to setup guardrails for the backend, but used it to generate some boilerplate code. The endpoints are small and do not require much because they have tests.

# FRONTEND

### About
The frontend uses **React**, **TypeScript**, and **Vite**, with **Tailwind** and **hadcn/ui** components with accessible interface. The booking form uses **React Hook Form** with **Zod** for client-side input validation.

Tailwind was used as a native solution for shadcn which was picked as a way of saving foundation time so i wouldnt invent already exisitng components once again. 

Vite was used to implement monorepo, have faster bundle time and test integration. It might seem as overkill but in my opinion boilerplate code is a big part of the task and i wanted to save time on that.

### AI
Frontend implementation guidance: [AGENTS.md](journey-frontend/AGENTS.md). Made accent on mobile version and used guardrailed compoents from shadcn/ui. Used AI to generate some boilerplate code. Some of a more complex logic was implemnted on my own. Some parts of ui was using AGENTS.md and product design skills in Codex.
