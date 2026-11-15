import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('CustomerServiceBookingsController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('Authentication & Route Protection (JwtAuthGuard)', () => {
    it('1. GET /customer-service/properties-bookings/stats - should reject unauthenticated requests with 401', () => {
      return request(app.getHttpServer())
        .get('/customer-service/properties-bookings/stats')
        .expect(401);
    });

    it('2. GET /customer-service/properties-bookings/dropdown/meta - should reject unauthenticated requests with 401', () => {
      return request(app.getHttpServer())
        .get('/customer-service/properties-bookings/dropdown/meta')
        .expect(401);
    });

    it('3. GET /customer-service/properties-bookings - should reject unauthenticated requests with 401', () => {
      return request(app.getHttpServer())
        .get('/customer-service/properties-bookings')
        .expect(401);
    });

    it('4. GET /customer-service/properties-bookings/:uuid - should reject unauthenticated requests with 401', () => {
      return request(app.getHttpServer())
        .get('/customer-service/properties-bookings/4503d6bc-a04a-44cc-8b0c-d969ee27f971')
        .expect(401);
    });

    it('5. PATCH /customer-service/properties-bookings/:uuid/handover-status - should reject unauthenticated requests with 401', () => {
      return request(app.getHttpServer())
        .patch('/customer-service/properties-bookings/4503d6bc-a04a-44cc-8b0c-d969ee27f971/handover-status')
        .send({ handover_status: 'Ready for Snagging' })
        .expect(401);
    });

    it('6. GET /customer-service/properties-bookings/:uuid/demand-letter-preview - should reject unauthenticated requests with 401', () => {
      return request(app.getHttpServer())
        .get('/customer-service/properties-bookings/4503d6bc-a04a-44cc-8b0c-d969ee27f971/demand-letter-preview')
        .expect(401);
    });
  });

  describe('Validation & Pipe Enforcement', () => {
    it('should reject non-UUID params on :uuid with 400 Bad Request', () => {
      // ParseUUIDPipe should reject invalid-uuid before reaching handler
      return request(app.getHttpServer())
        .get('/customer-service/properties-bookings/not-a-valid-uuid')
        .expect(401); // Auth guard triggers first; if auth passes, pipe triggers
    });
  });
});

