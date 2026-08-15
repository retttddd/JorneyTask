import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'node:path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookingModule } from './booking/booking.module';
import { BookingGuest } from './booking/booking-guests';
import { MapTile } from './booking/booking-map';

@Module({})
export class AppModule {
  static forRoot(
    map: Map<string, MapTile>,
    guests: Map<string, BookingGuest>,
  ) {
    return {
      module: AppModule,
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: resolve(__dirname, '../.env'),
        }),
        BookingModule.forRoot(map, guests),
      ],
      controllers: [AppController],
      providers: [AppService],
    };
  }
}
