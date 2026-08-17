import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { MapTile } from '../src/booking/booking-map';
import { MAP_TILE_NAMES } from '../src/booking/tile.constants';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  const cabana: MapTile = {
    id: 'cabana-0-0',
    coordinates: { x: 0, y: 0 },
    name: MAP_TILE_NAMES.CABANA,
    vacant: true,
  };
  const pool: MapTile = {
    id: 'pool-1-0',
    coordinates: { x: 1, y: 0 },
    name: MAP_TILE_NAMES.POOL,
    vacant: true,
  };
  const validBooking = {
    tile: { id: cabana.id, coordinates: cabana.coordinates },
    user: { room: '101', guestName: 'Alice Smith' },
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule.forRoot(
          new Map([
            [cabana.id, { ...cabana }],
            [pool.id, { ...pool }],
          ]),
          new Map([['101', { room: '101', guestName: 'Alice Smith' }]]),
        ),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/booking/map (GET)', () => {
    return request(app.getHttpServer())
      .get('/booking/map')
      .expect(200)
      .expect([
        cabana,
        pool,
      ]);
  });

  it('/booking/book (POST) books a cabana and keeps it booked after a conflict', async () => {
    await request(app.getHttpServer())
      .post('/booking/book')
      .send(validBooking)
      .expect(201)
      .expect({
        id: 'cabana-0-0',
        coordinates: { x: 0, y: 0 },
        name: MAP_TILE_NAMES.CABANA,
        vacant: false,
      });

    await request(app.getHttpServer())
      .post('/booking/book')
      .send(validBooking)
      .expect(409)
      .expect({
        message: 'This cabana is no longer available.',
        error: 'Conflict',
        statusCode: 409,
      });

    return request(app.getHttpServer())
      .get('/booking/map')
      .expect(200)
      .expect([
        {
          id: 'cabana-0-0',
          coordinates: { x: 0, y: 0 },
          name: MAP_TILE_NAMES.CABANA,
          vacant: false,
        },
        pool,
      ]);
  });

  it('/booking/book (POST) rejects guest details that do not match', () => {
    return request(app.getHttpServer())
      .post('/booking/book')
      .send({ ...validBooking, user: { room: '101', guestName: 'Incorrect Name' } })
      .expect(400)
      .expect({
        message: 'Room number and guest name do not match.',
        error: 'Bad Request',
        statusCode: 400,
      });
  });

  it('/booking/book (POST) rejects non-cabana tiles', () => {
    return request(app.getHttpServer())
      .post('/booking/book')
      .send({ ...validBooking, tile: { id: pool.id, coordinates: pool.coordinates } })
      .expect(400)
      .expect({
        message: 'Only cabanas can be booked.',
        error: 'Bad Request',
        statusCode: 400,
      });
  });

  it('/booking/book (POST) rejects an unknown tile and mismatched coordinates', async () => {
    await request(app.getHttpServer())
      .post('/booking/book')
      .send({ ...validBooking, tile: { id: 'cabana-9-9', coordinates: { x: 9, y: 9 } } })
      .expect(404);

    return request(app.getHttpServer())
      .post('/booking/book')
      .send({ ...validBooking, tile: { id: cabana.id, coordinates: { x: 1, y: 0 } } })
      .expect(404);
  });

  afterEach(async () => {
    await app.close();
  });
});
