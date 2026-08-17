export const TILE_NAMES = {
  EMPTY: 'empty',
  CABANA: 'cabana',
  POOL: 'pool',
  PATH: 'path',
  CHALET: 'chalet',
} as const

export type TileName = (typeof TILE_NAMES)[keyof typeof TILE_NAMES]

export const tileNameValues = new Set<TileName>(Object.values(TILE_NAMES))
