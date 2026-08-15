import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

export interface ResortFiles {
  mapPath: string;
  bookingsPath: string;
}

export function resolveResortFiles(): ResortFiles {
  const mapPath = resolve(process.env.MAP_PATH ?? '../map.ascii');
  const bookingsPath = resolve(process.env.BOOKINGS_PATH ?? '../bookings.json');

  for (const [name, path] of Object.entries({ mapPath, bookingsPath })) {
    if (!existsSync(path)) {
      throw new Error(`Configured ${name} does not exist: ${path}`);
    }
  }

  return { mapPath, bookingsPath };
}
