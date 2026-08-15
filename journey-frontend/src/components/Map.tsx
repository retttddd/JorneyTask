import { useMemo, type ComponentType, type SVGProps } from 'react'
import { ArrowCornerSquare } from '../../icons/arrowCornerSquare'
import { ArrowCrossing } from '../../icons/arrowCrossing'
import { ArrowEnd } from '../../icons/arrowEnd'
import { ArrowSplit } from '../../icons/arrowSplit'
import { ArrowStraight } from '../../icons/arrowStraight'
import { Cabana } from '../../icons/cabana'
import { HouseChimney } from '../../icons/houseChimney'
import { ParchmentBasic } from '../../icons/parchmentBasic'
import { Pool } from '../../icons/pool'
import type { MapTile } from '@/lib/booking-api'
import './Map.css'

type Icon = ComponentType<SVGProps<SVGSVGElement>>

interface MapIcon {
  icon: Icon
  rotation: number
}

function getPathIcon(tile: MapTile, tiles: Map<string, MapTile>): MapIcon {
  const { x, y } = tile.coordinates
  const hasPathAt = (offsetX: number, offsetY: number) =>
    tiles.get(`${x + offsetX},${y + offsetY}`)?.name === 'path'
  const north = hasPathAt(0, -1)
  const east = hasPathAt(1, 0)
  const south = hasPathAt(0, 1)
  const west = hasPathAt(-1, 0)
  const connections = [north, east, south, west].filter(Boolean).length

  if (connections === 4) return { icon: ArrowCrossing, rotation: 0 }

  if (connections === 3) {
    if (!west) return { icon: ArrowSplit, rotation: 0 }
    if (!north) return { icon: ArrowSplit, rotation: 90 }
    if (!east) return { icon: ArrowSplit, rotation: 180 }
    return { icon: ArrowSplit, rotation: 270 }
  }

  if (connections === 2 && ((north || south) && (east || west))) {
    if (north && east) return { icon: ArrowCornerSquare, rotation: 0 }
    if (east && south) return { icon: ArrowCornerSquare, rotation: 90 }
    if (south && west) return { icon: ArrowCornerSquare, rotation: 180 }
    return { icon: ArrowCornerSquare, rotation: 270 }
  }

  if (connections === 2) {
    return { icon: ArrowStraight, rotation: east || west ? 90 : 0 }
  }

  if (north) return { icon: ArrowEnd, rotation: 180 }
  if (east) return { icon: ArrowEnd, rotation: 270 }
  if (west) return { icon: ArrowEnd, rotation: 90 }
  return { icon: ArrowEnd, rotation: 0 }
}

function getTileIcon(tile: MapTile, tiles: Map<string, MapTile>): MapIcon {
  switch (tile.name) {
    case 'cabana':
      return { icon: Cabana, rotation: 0 }
    case 'pool':
      return { icon: Pool, rotation: 0 }
    case 'path':
      return getPathIcon(tile, tiles)
    case 'chalet':
      return { icon: HouseChimney, rotation: 0 }
    case 'empty':
      return { icon: ParchmentBasic, rotation: 0 }
  }
}

interface MapGridProps {
  tiles: MapTile[]
  selectedCabanaId: string | null
  onCabanaSelect: (cabana: MapTile) => void
}

function MapGrid({ tiles, selectedCabanaId, onCabanaSelect }: MapGridProps) {
  const positionedTiles = useMemo(() => {
    const tileByCoordinate = new Map(tiles.map((tile) => [`${tile.coordinates.x},${tile.coordinates.y}`, tile]))
    return tiles.map((tile) => ({ ...tile, ...getTileIcon(tile, tileByCoordinate) }))
  }, [tiles])

  const dimensions = useMemo(
    () => ({
      columns: Math.max(...tiles.map((tile) => tile.coordinates.x)) + 1,
      rows: Math.max(...tiles.map((tile) => tile.coordinates.y)) + 1,
    }),
    [tiles],
  )

  return (
    <div className="resort-map-scroll" tabIndex={0} aria-label="Scrollable resort map">
      <div
        className="resort-map-grid"
        role="group"
        aria-label={`Resort map with ${tiles.filter((tile) => tile.name === 'cabana' && tile.vacant).length} available cabanas`}
        style={{
          gridTemplateColumns: `repeat(${dimensions.columns}, var(--map-tile-size))`,
          gridTemplateRows: `repeat(${dimensions.rows}, var(--map-tile-size))`,
        }}
      >
        {positionedTiles.map(({ icon: TileIcon, rotation, ...tile }) => {
          const className = `map-tile map-tile--${tile.name}${tile.name === 'cabana' ? ` map-tile--${tile.vacant ? 'available' : 'booked'}` : ''}${tile.id === selectedCabanaId ? ' map-tile--selected' : ''}`
          const content = (
            <>
              <TileIcon
                aria-hidden="true"
                focusable="false"
                style={rotation === 0 ? undefined : { transform: `rotate(${rotation}deg)` }}
              />
              {tile.name === 'cabana' && <span className="map-tile-status">{tile.vacant ? 'Available' : 'Booked'}</span>}
            </>
          )

          if (tile.name === 'cabana') {
            return (
              <button
                type="button"
                className={className}
                key={tile.id}
                style={{ gridColumn: tile.coordinates.x + 1, gridRow: tile.coordinates.y + 1 }}
                onClick={() => onCabanaSelect(tile)}
                aria-label={`${tile.vacant ? 'Select available' : 'View unavailable'} cabana ${tile.id}`}
                aria-pressed={tile.id === selectedCabanaId}
              >
                {content}
              </button>
            )
          }

          return (
            <div
              className={className}
              key={tile.id}
              style={{ gridColumn: tile.coordinates.x + 1, gridRow: tile.coordinates.y + 1 }}
              title={tile.name}
            >
              {content}
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface MapProps extends MapGridProps {
  error: string | null
  onRetry: () => void
}

export function ResortMap({ tiles, selectedCabanaId, onCabanaSelect, error, onRetry }: MapProps) {
  if (error) {
    return (
      <section className="map-feedback" aria-live="polite">
        <p>{error}</p>
        <button type="button" onClick={onRetry}>Try again</button>
      </section>
    )
  }

  if (tiles.length === 0) {
    return <div className="map-feedback" role="status">Loading resort map…</div>
  }

  return <MapGrid tiles={tiles} selectedCabanaId={selectedCabanaId} onCabanaSelect={onCabanaSelect} />
}
