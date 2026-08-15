I assume that guest validation should work this way: 
  1. Every W in map.ascii represents a cabana.
  2. Initially, all cabanas are available.
  3. bookings.json is actually the guest-validation list.
  4. When a guest successfully books a cabana, the backend stores that booking in memory.
  5.That cabana becomes unavailable until the server restarts.
  6.Names cant contain any numbers(validation process)

# README
This is one repo for [frontend](jorney-frontend) and [backend](jorney-backend)

# HOW TO RUN
Run from root this script to install deps and run both front-end and back-end
``` ./scripts/run.sh --map ./map.ascii --bookings ./bookings.json ```

./scripts/run.sh --map <path> --bookings <path>
for more details check [explonation](scripts/explonation.md)

# STACK
React Tailwind ReactQuery Nest.Js

# FRONTEND

### About
The frontend uses **React**, **TypeScript**, and **Vite**, with **Tailwind** and **hadcn/ui** components with accessible interface. The booking form uses **React Hook Form** with **Zod** for client-side input validation.

Tailwind was used as a native solution for shadcn which was picked as a way of saving foundation time so i wouldnt invent already exisitng components once again. 

### AI
Frontend implementation guidance: [AGENTS.md](jorney-frontend/AGENTS.md).
