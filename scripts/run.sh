#!/usr/bin/env bash

set -euo pipefail

repository_root="$(cd "$(dirname "$0")/.." && pwd)"

if ! command -v pnpm >/dev/null 2>&1; then
  echo "pnpm is required. Install it, then run this script again." >&2
  exit 1
fi

# The backend supplies ts-node, which bootstraps the TypeScript launcher itself.
CI=true pnpm --dir "$repository_root/jorney-backend" install --frozen-lockfile
CI=true pnpm --dir "$repository_root/jorney-frontend" install --frozen-lockfile
pnpm --dir "$repository_root/jorney-backend" exec ts-node --project "$repository_root/jorney-backend/tsconfig.json" "$repository_root/scripts/start.ts" "$@"
