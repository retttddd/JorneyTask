# Startup

Requirements: Node.js and pnpm.

Run from the repository root:

```bash
./scripts/run.sh --map <path-to-map> --bookings <path-to-bookings>
```

Both options are optional: they default to `./map.ascii` and `./bookings.json`. The shell script installs both projects, and the TypeScript runner checks the file paths before starting Vite and Nest together. Ctrl+C stops both.

It passes the resolved paths to Nest as `MAP_PATH` and `BOOKINGS_PATH`, ready for the booking API to read.
