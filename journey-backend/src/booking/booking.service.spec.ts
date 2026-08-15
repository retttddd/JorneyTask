import { BookingService } from './booking.service';
import { MapTile } from './booking-map';

describe('BookingService', () => {
  it('returns the tiles from the supplied map', () => {
    const tile: MapTile = {
      id: 'cabana-2-4',
      coordinates: { x: 2, y: 4 },
      name: 'cabana',
      vacant: true,
    };
    const service = new BookingService(new Map([[tile.id, tile]]), new Map());

    expect(service.getMap()).toEqual([tile]);
  });

  it('marks a validated cabana as unavailable', () => {
    const tile: MapTile = {
      id: 'cabana-2-4',
      coordinates: { x: 2, y: 4 },
      name: 'cabana',
      vacant: true,
    };
    const service = new BookingService(
      new Map([[tile.id, tile]]),
      new Map([['101', { room: '101', guestName: 'Alice Smith' }]]),
    );

    expect(
      service.book({
        tile: { id: tile.id, coordinates: tile.coordinates },
        user: { room: '101', guestName: 'Alice Smith' },
      }),
    ).toMatchObject({ id: tile.id, vacant: false });
    expect(service.getMap()[0].vacant).toBe(false);
  });
});
