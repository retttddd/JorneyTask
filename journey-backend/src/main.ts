import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { resolveResortFiles } from './resort-files';
import { createBookingMap } from './booking/booking-map';
import { createBookingGuests } from './booking/booking-guests';

async function bootstrap() {
  const { mapPath, bookingsPath } = resolveResortFiles();
  const map = createBookingMap(mapPath);
  const guests = createBookingGuests(bookingsPath);
  const app = await NestFactory.create(AppModule.forRoot(map, guests));
  app.enableCors({
    origin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:3001',
  });
  await app.listen(process.env.PORT ?? 8081);
  console.log(`Using map: ${mapPath}`);
  console.log(`Using bookings: ${bookingsPath}`);
}
bootstrap();
