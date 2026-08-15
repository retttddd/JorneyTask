import { readFileSync } from 'node:fs';

export type MapTileName = 'empty' | 'cabana' | 'pool' | 'path' | 'chalet';

export interface MapTile {
  id: string;
  coordinates: {
    x: number;
    y: number;
  };
  name: MapTileName;
  vacant: boolean;
}

const tileNames = new Map<string, MapTileName>([
  ['.', 'empty'],
  ['W', 'cabana'],
  ['p', 'pool'],
  ['#', 'path'],
  ['c', 'chalet'],
]);

export function createBookingMap(mapPath: string): Map<string, MapTile> {
  const map = new Map<string, MapTile>();
  const rows = readFileSync(mapPath, 'utf8').trimEnd().split(/\r?\n/);

  rows.forEach((row, y) => {
    for (const [x, character] of Array.from(row).entries()) {
      const name = tileNames.get(character);

      if (!name) {
        throw new Error(`Unsupported map character "${character}" at (${x}, ${y}).`);
      }

      const id = `${name}-${x}-${y}`;
      map.set(id, { id, coordinates: { x, y }, name, vacant: true });
    }
  });

  return map;
}
