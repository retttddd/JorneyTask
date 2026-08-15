import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { resolveResortFiles } from './resort-files';

async function bootstrap() {
  const { mapPath, bookingsPath } = resolveResortFiles();
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 8081);
  console.log(`Using map: ${mapPath}`);
  console.log(`Using bookings: ${bookingsPath}`);
}
bootstrap();
