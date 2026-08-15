import { DynamicModule, Module } from '@nestjs/common';
import { BOOKING_GUESTS, BOOKING_MAP } from './booking.constants';
import { BookingGuest } from './booking-guests';
import { MapTile } from './booking-map';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';

@Module({})
export class BookingModule {
  static forRoot(
    map: Map<string, MapTile>,
    guests: Map<string, BookingGuest>,
  ): DynamicModule {
    return {
      module: BookingModule,
      controllers: [BookingController],
      providers: [
        BookingService,
        { provide: BOOKING_MAP, useValue: map },
        { provide: BOOKING_GUESTS, useValue: guests },
      ],
    };
  }
}
