import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createBookingMap } from './booking-map';
import { MAP_TILE_NAMES } from './tile.constants';

describe('createBookingMap', () => {
  let temporaryDirectory: string;

  beforeEach(() => {
    temporaryDirectory = mkdtempSync(join(tmpdir(), 'resort-map-'));
  });

  afterEach(() => {
    rmSync(temporaryDirectory, { recursive: true, force: true });
  });

  it('parses every supported map symbol into a tile', () => {
    const mapPath = join(temporaryDirectory, 'map.ascii');
    writeFileSync(mapPath, '.W#pc');

    expect(Array.from(createBookingMap(mapPath).values())).toEqual([
      { id: 'empty-0-0', coordinates: { x: 0, y: 0 }, name: MAP_TILE_NAMES.EMPTY, vacant: true },
      { id: 'cabana-1-0', coordinates: { x: 1, y: 0 }, name: MAP_TILE_NAMES.CABANA, vacant: true },
      { id: 'path-2-0', coordinates: { x: 2, y: 0 }, name: MAP_TILE_NAMES.PATH, vacant: true },
      { id: 'pool-3-0', coordinates: { x: 3, y: 0 }, name: MAP_TILE_NAMES.POOL, vacant: true },
      { id: 'chalet-4-0', coordinates: { x: 4, y: 0 }, name: MAP_TILE_NAMES.CHALET, vacant: true },
    ]);
  });

  it('rejects an unsupported map symbol', () => {
    const mapPath = join(temporaryDirectory, 'invalid-map.ascii');
    writeFileSync(mapPath, 'W?');

    expect(() => createBookingMap(mapPath)).toThrow('Unsupported map character "?" at (1, 0).');
  });
});
