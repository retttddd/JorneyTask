import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BOOKING_GUESTS, BOOKING_MAP } from './booking.constants';
import { BookingGuest } from './booking-guests';
import { MapTile } from './booking-map';

export interface BookTileRequest {
  tile: {
    id: string;
    coordinates: {
      x: number;
      y: number;
    };
  };
  user: BookingGuest;
}

@Injectable()
export class BookingService {
  constructor(
    @Inject(BOOKING_MAP) private readonly map: Map<string, MapTile>,
    @Inject(BOOKING_GUESTS)
    private readonly guests: Map<string, BookingGuest>,
  ) {}

  getMap(): MapTile[] {
    return Array.from(this.map.values());
  }

  book({ tile: tileRequest, user }: BookTileRequest): MapTile {
    const guest = this.guests.get(user?.room);
    if (!guest || guest.guestName !== user.guestName) {
      throw new BadRequestException('Room number and guest name do not match.');
    }

    const tile = this.map.get(tileRequest?.id);
    if (
      !tile ||
      tile.coordinates.x !== tileRequest.coordinates?.x ||
      tile.coordinates.y !== tileRequest.coordinates?.y
    ) {
      throw new NotFoundException('The selected tile does not exist.');
    }

    if (tile.name !== 'cabana') {
      throw new BadRequestException('Only cabanas can be booked.');
    }

    if (!tile.vacant) {
      throw new ConflictException('This cabana is no longer available.');
    }

    tile.vacant = false;
    return tile;
  }
}
