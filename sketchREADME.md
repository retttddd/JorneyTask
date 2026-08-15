I assume that guest validation should work this way: 
  1. Every W in map.ascii represents a cabana.
  2. Initially, all cabanas are available.
  3. bookings.json is actually the guest-validation list.
  4. When a guest successfully books a cabana, the backend stores that booking in memory.
  5.That cabana becomes unavailable until the server restarts.
  6.Names cant contain any numbers(validation process)

# README

This repository contains the [frontend](jorney-frontend) and [backend](jorney-backend) applications.

# HOW TO RUN

From the repository root, install dependencies and start both applications:

```bash
pnpm install
pnpm dev -- --map ./map.ascii --bookings ./bookings.json
```

`--map` and `--bookings` are required and must reference readable files. Paths are resolved from the repository root. The first `--` passes those arguments through pnpm to the development scripts.

For alternate input files:

```bash
pnpm dev -- --map <path> --bookings <path>
```

# STACK
React Tailwind ReactQuery Nest.Js

# FRONTEND

### About
The frontend uses **React**, **TypeScript**, and **Vite**, with **Tailwind** and **hadcn/ui** components with accessible interface. The booking form uses **React Hook Form** with **Zod** for client-side input validation.

Tailwind was used as a native solution for shadcn which was picked as a way of saving foundation time so i wouldnt invent already exisitng components once again. 

### AI
Frontend implementation guidance: [AGENTS.md](jorney-frontend/AGENTS.md).
