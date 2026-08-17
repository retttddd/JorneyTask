import { readFileSync } from 'node:fs';
import { MAP_TILE_NAMES, type MapTileName } from './tile.constants';

export type { MapTileName } from './tile.constants';

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
  ['.', MAP_TILE_NAMES.EMPTY],
  ['W', MAP_TILE_NAMES.CABANA],
  ['p', MAP_TILE_NAMES.POOL],
  ['#', MAP_TILE_NAMES.PATH],
  ['c', MAP_TILE_NAMES.CHALET],
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
