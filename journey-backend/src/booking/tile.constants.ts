export const MAP_TILE_NAMES = {
  EMPTY: 'empty',
  CABANA: 'cabana',
  POOL: 'pool',
  PATH: 'path',
  CHALET: 'chalet',
} as const;

export type MapTileName = (typeof MAP_TILE_NAMES)[keyof typeof MAP_TILE_NAMES];
