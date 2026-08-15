import { Body, Controller, Get, Post } from '@nestjs/common';
import type { MapTile } from './booking-map';
import { BookingService } from './booking.service';
import type { BookTileRequest } from './booking.service';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get('map')
  getMap(): MapTile[] {
    return this.bookingService.getMap();
  }

  @Post('book')
  book(@Body() request: BookTileRequest): MapTile {
    return this.bookingService.book(request);
  }
}
