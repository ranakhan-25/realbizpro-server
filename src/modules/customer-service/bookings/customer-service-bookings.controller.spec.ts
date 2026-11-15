import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { CustomerServiceBookingsController } from './customer-service-bookings.controller';
import { CustomerServiceBookingsService } from './customer-service-bookings.service';
import { HandoverStatus } from 'src/database/models/customer-service/cs_booking_handover.model';
import { BookingTabFilter } from './dto/query-properties-bookings.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

describe('CustomerServiceBookingsController (API Integration Tests)', () => {
  let app: INestApplication<App>;
  let mockService: any;

  beforeAll(async () => {
    mockService = {
      getStats: jest.fn().mockResolvedValue({
        success: true,
        data: {
          total_booked_units: 486,
          ready_for_snagging: 18,
          dlp_active: 142,
          handed_over: 210,
          under_construction: 116,
          total_portfolio_valuation: 4520000000,
          total_portfolio_valuation_formatted: '৳ 452.00 Cr',
          total_collected_amount: 3810000000,
          total_collected_amount_formatted: '৳ 381.00 Cr',
          total_outstanding_due: 710000000,
          total_outstanding_due_formatted: '৳ 71.00 Cr',
        },
      }),
      getDropdownMeta: jest.fn().mockResolvedValue({
        success: true,
        data: {
          projects: [
            {
              id: 1,
              uuid: '561dd3c0-c10d-4d07-88f6-41d40195290d',
              name: 'Hena Heights',
            },
          ],
          handover_statuses: [
            { value: 'Under Construction', label: 'Under Construction' },
          ],
          unit_types: [{ value: 'Apartment', label: 'Apartment' }],
        },
      }),
      findBookings: jest.fn().mockResolvedValue({
        success: true,
        data: {
          items: [
            {
              id: 'BK-1082',
              uuid: 'e3bb1141-cfa8-4e22-b383-42f336e29284',
              code: 'BK-1082',
              customer_name: 'Rafiqul Islam',
              handover_status: HandoverStatus.UNDER_CONSTRUCTION,
            },
          ],
          tab_counts: {
            all: 1,
            snagging: 0,
            dlp: 0,
            handedover: 0,
            under_construction: 1,
          },
          meta: {
            total: 1,
            page: 1,
            limit: 10,
            total_pages: 1,
            has_next_page: false,
            has_previous_page: false,
          },
        },
      }),
      getBooking360: jest.fn().mockResolvedValue({
        success: true,
        data: {
          booking: {
            id: 'BK-1082',
            uuid: 'e3bb1141-cfa8-4e22-b383-42f336e29284',
            code: 'BK-1082',
            customer_name: 'Rafiqul Islam',
          },
          unit: { unit_number: 'A-7' },
          project: { name: 'Hena Heights' },
          customer: { customer_name: 'Rafiqul Islam' },
          handover: { handover_status: HandoverStatus.UNDER_CONSTRUCTION },
          cost_breakdown: { grand_total: 22000000 },
          milestone_history: [],
          snag_summary: { total_snags_reported: 0, total_snags_resolved: 0, open_snags: 0 },
        },
      }),
      updateHandoverStatus: jest.fn().mockResolvedValue({
        success: true,
        message: 'Handover status updated to Ready for Snagging',
        data: { handover_status: HandoverStatus.READY_FOR_SNAGGING },
      }),
      getDemandLetterPreview: jest.fn().mockResolvedValue({
        success: true,
        data: {
          booking_code: 'BK-1082',
          demand_letter_reference: 'DL-BK-1082-MS01-20261105',
          current_milestone: { title: 'Installment #1', payable_amount: 500000 },
          bank_instructions: { bank_name: 'Mutual Trust Bank Limited' },
        },
      }),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [CustomerServiceBookingsController],
      providers: [
        {
          provide: CustomerServiceBookingsService,
          useValue: mockService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

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

  describe('Route Order & Endpoint Implementations', () => {
    it('1. GET /customer-service/properties-bookings/stats - should route to getStats()', async () => {
      const res = await request(app.getHttpServer())
        .get('/customer-service/properties-bookings/stats')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.total_booked_units).toBe(486);
      expect(mockService.getStats).toHaveBeenCalled();
    });

    it('2. GET /customer-service/properties-bookings/dropdown/meta - should route to getDropdownMeta()', async () => {
      const res = await request(app.getHttpServer())
        .get('/customer-service/properties-bookings/dropdown/meta')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.projects).toBeDefined();
      expect(mockService.getDropdownMeta).toHaveBeenCalled();
    });

    it('3. GET /customer-service/properties-bookings - should route to findBookings() with query DTO', async () => {
      const res = await request(app.getHttpServer())
        .get('/customer-service/properties-bookings?page=1&limit=10&tab=all')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.items).toHaveLength(1);
      expect(res.body.data.tab_counts.all).toBe(1);
      expect(mockService.findBookings).toHaveBeenCalledWith(
        expect.objectContaining({ page: 1, limit: 10, tab: BookingTabFilter.ALL }),
        undefined,
      );
    });

    it('4. GET /customer-service/properties-bookings/:uuid/demand-letter-preview - should route correctly', async () => {
      const testUuid = 'e3bb1141-cfa8-4e22-b383-42f336e29284';
      const res = await request(app.getHttpServer())
        .get(`/customer-service/properties-bookings/${testUuid}/demand-letter-preview`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.demand_letter_reference).toBe('DL-BK-1082-MS01-20261105');
      expect(mockService.getDemandLetterPreview).toHaveBeenCalledWith(testUuid, undefined);
    });

    it('5. GET /customer-service/properties-bookings/:uuid - should route to getBooking360()', async () => {
      const testUuid = 'e3bb1141-cfa8-4e22-b383-42f336e29284';
      const res = await request(app.getHttpServer())
        .get(`/customer-service/properties-bookings/${testUuid}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.booking.code).toBe('BK-1082');
      expect(mockService.getBooking360).toHaveBeenCalledWith(testUuid, undefined);
    });

    it('6. PATCH /customer-service/properties-bookings/:uuid/handover-status - should validate DTO and call service', async () => {
      const testUuid = 'e3bb1141-cfa8-4e22-b383-42f336e29284';
      const res = await request(app.getHttpServer())
        .patch(`/customer-service/properties-bookings/${testUuid}/handover-status`)
        .send({
          handover_status: 'Ready for Snagging',
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(mockService.updateHandoverStatus).toHaveBeenCalledWith(
        testUuid,
        expect.objectContaining({ handover_status: HandoverStatus.READY_FOR_SNAGGING }),
        undefined,
      );
    });

    it('should reject invalid UUID with 400 Bad Request via ParseUUIDPipe', async () => {
      await request(app.getHttpServer())
        .get('/customer-service/properties-bookings/invalid-uuid-string')
        .expect(400);
    });

    it('should reject invalid handover_status payload with 400 Bad Request via ValidationPipe', async () => {
      const testUuid = 'e3bb1141-cfa8-4e22-b383-42f336e29284';
      await request(app.getHttpServer())
        .patch(`/customer-service/properties-bookings/${testUuid}/handover-status`)
        .send({
          handover_status: 'NonExistentStatus',
        })
        .expect(400);
    });
  });
});

