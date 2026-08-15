export type TileName = 'empty' | 'cabana' | 'pool' | 'path' | 'chalet'

export interface MapTile {
  id: string
  coordinates: {
    x: number
    y: number
  }
  name: TileName
  vacant: boolean
}

export interface BookingGuest {
  room: string
  guestName: string
}

const tileNames = new Set<TileName>(['empty', 'cabana', 'pool', 'path', 'chalet'])
const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8081'

function isMapTile(value: unknown): value is MapTile {
  if (!value || typeof value !== 'object') {
    return false
  }

  const tile = value as Record<string, unknown>
  const coordinates = tile.coordinates

  if (!coordinates || typeof coordinates !== 'object') {
    return false
  }

  const position = coordinates as Record<string, unknown>
  return (
    typeof tile.id === 'string' &&
    typeof tile.name === 'string' &&
    tileNames.has(tile.name as TileName) &&
    typeof tile.vacant === 'boolean' &&
    typeof position.x === 'number' &&
    Number.isInteger(position.x) &&
    position.x >= 0 &&
    typeof position.y === 'number' &&
    Number.isInteger(position.y) &&
    position.y >= 0
  )
}

export async function getMap(): Promise<MapTile[]> {
  const response = await fetch(`${apiUrl}/booking/map`)

  if (!response.ok) {
    throw new Error('The resort map is unavailable. Please try again.')
  }

  const payload: unknown = await response.json()
  if (!Array.isArray(payload) || !payload.every(isMapTile)) {
    throw new Error('The resort map data is invalid. Please try again.')
  }

  return payload
}

export async function bookCabana(tile: MapTile, user: BookingGuest): Promise<MapTile> {
  const response = await fetch(`${apiUrl}/booking/book`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tile: {
        id: tile.id,
        coordinates: tile.coordinates,
      },
      user,
    }),
  })

  const payload: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    const message = payload && typeof payload === 'object' && typeof (payload as Record<string, unknown>).message === 'string'
      ? (payload as Record<string, string>).message
      : 'Unable to book this cabana. Please try again.'
    throw new Error(message)
  }

  if (!isMapTile(payload)) {
    throw new Error('The booking response is invalid. Please try again.')
  }

  return payload
}
