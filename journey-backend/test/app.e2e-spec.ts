import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { MapTile } from '../src/booking/booking-map';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const tile: MapTile = {
      id: 'cabana-0-0',
      coordinates: { x: 0, y: 0 },
      name: 'cabana',
      vacant: true,
    };
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule.forRoot(
          new Map([[tile.id, tile]]),
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
        {
          id: 'cabana-0-0',
          coordinates: { x: 0, y: 0 },
          name: 'cabana',
          vacant: true,
        },
      ]);
  });

  it('/booking/book (POST)', async () => {
    await request(app.getHttpServer())
      .post('/booking/book')
      .send({
        tile: { id: 'cabana-0-0', coordinates: { x: 0, y: 0 } },
        user: { room: '101', guestName: 'Alice Smith' },
      })
      .expect(201)
      .expect({
        id: 'cabana-0-0',
        coordinates: { x: 0, y: 0 },
        name: 'cabana',
        vacant: false,
      });

    return request(app.getHttpServer())
      .get('/booking/map')
      .expect(200)
      .expect([
        {
          id: 'cabana-0-0',
          coordinates: { x: 0, y: 0 },
          name: 'cabana',
          vacant: false,
        },
      ]);
  });

  afterEach(async () => {
    await app.close();
  });
});
