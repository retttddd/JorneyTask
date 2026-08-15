# Startup

Requirements: Node.js and pnpm.

From the repository root, install dependencies once:

```bash
pnpm install
```

Then start both applications with the required input files:

```bash
pnpm dev -- --map <path-to-map> --bookings <path-to-bookings>
```

The first `--` forwards the runtime options through pnpm. Both workspace packages start in parallel; Nest reads and validates the paths, while Vite ignores the extra runtime options. Relative paths are resolved from the repository root, and Ctrl+C stops both servers.

Configuration secrets and ordinary environment settings belong in `journey-backend/.env` and are loaded by `@nestjs/config`.
