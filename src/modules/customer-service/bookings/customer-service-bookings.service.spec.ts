import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  ALLOWED_TRANSITIONS,
  computeDlpDates,
  CustomerServiceBookingsService,
  formatBdtCurrency,
} from './customer-service-bookings.service';
import { HandoverStatus } from 'src/database/models/customer-service/cs_booking_handover.model';
import { BookingTabFilter } from './dto/query-properties-bookings.dto';

describe('CustomerServiceBookingsService (Unit Tests)', () => {
  describe('DLP Date Calculation & Currency Helpers', () => {
    it('should calculate dlp_start_date as possession_date and dlp_expiry_date as possession_date + 2 years minus 1 day', () => {
      const possessionDate = '2026-11-05';
      const { dlpStartDate, dlpExpiryDate } = computeDlpDates(possessionDate, 2);

      expect(dlpStartDate).toBe('2026-11-05');
      expect(dlpExpiryDate).toBe('2028-11-04');
    });

    it('should correctly format currency in BDT Crore, Lac, and Standard notations', () => {
      expect(formatBdtCurrency(4520000000)).toBe('৳ 452.00 Cr');
      expect(formatBdtCurrency(3500000)).toBe('৳ 35.00 Lac');
      expect(formatBdtCurrency(45000)).toBe('৳ 45,000.00');
    });
  });

  describe('Handover State Machine Transition Whitelist', () => {
    it('should allow valid sequential transitions', () => {
      expect(ALLOWED_TRANSITIONS[HandoverStatus.UNDER_CONSTRUCTION]).toEqual([
        HandoverStatus.READY_FOR_SNAGGING,
      ]);
      expect(ALLOWED_TRANSITIONS[HandoverStatus.READY_FOR_SNAGGING]).toEqual([
        HandoverStatus.DLP_ACTIVE,
      ]);
      expect(ALLOWED_TRANSITIONS[HandoverStatus.DLP_ACTIVE]).toEqual([
        HandoverStatus.HANDED_OVER,
      ]);
      expect(ALLOWED_TRANSITIONS[HandoverStatus.HANDED_OVER]).toEqual([]);
    });

    it('should disallow backward and skipped transitions', () => {
      // Cannot skip Ready for Snagging
      expect(
        ALLOWED_TRANSITIONS[HandoverStatus.UNDER_CONSTRUCTION].includes(
          HandoverStatus.DLP_ACTIVE,
        ),
      ).toBe(false);

      // Cannot move backward from Handed Over to Under Construction
      expect(
        ALLOWED_TRANSITIONS[HandoverStatus.HANDED_OVER].includes(
          HandoverStatus.UNDER_CONSTRUCTION,
        ),
      ).toBe(false);
    });
  });

  describe('Service Business Logic & Guards', () => {
    let service: CustomerServiceBookingsService;
    let mockSequelize: any;
    let mockBookingModel: any;
    let mockHandoverModel: any;
    let mockProjectModel: any;
    let mockFlatLandModel: any;
    let mockCustomerProfileModel: any;
    let mockSaleAgreementModel: any;
    let mockInstallmentPlanModel: any;
    let mockNotificationModel: any;

    beforeEach(() => {
      mockSequelize = {
        query: jest.fn(),
        where: jest.fn(),
        fn: jest.fn(),
        col: jest.fn(),
        transaction: jest.fn((callback) => callback({})),
      };

      mockBookingModel = {
        findOne: jest.fn(),
      };

      mockHandoverModel = {
        findOne: jest.fn(),
        create: jest.fn(),
      };

      mockProjectModel = {
        findAll: jest.fn(),
      };

      mockFlatLandModel = {};
      mockCustomerProfileModel = {
        findOne: jest.fn(),
      };
      mockSaleAgreementModel = {
        findOne: jest.fn(),
      };
      mockInstallmentPlanModel = {
        findAll: jest.fn().mockResolvedValue([]),
      };
      mockNotificationModel = {
        create: jest.fn(),
      };

      service = new CustomerServiceBookingsService(
        mockSequelize as any,
        mockBookingModel as any,
        mockHandoverModel as any,
        mockProjectModel as any,
        mockFlatLandModel as any,
        mockCustomerProfileModel as any,
        mockSaleAgreementModel as any,
        mockInstallmentPlanModel as any,
        mockNotificationModel as any,
      );
    });

    it('should throw NotFoundException if booking is not found during status transition', async () => {
      mockBookingModel.findOne.mockResolvedValue(null);

      await expect(
        service.updateHandoverStatus('00000000-0000-0000-0000-000000000000', {
          handover_status: HandoverStatus.READY_FOR_SNAGGING,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if backward status transition is attempted', async () => {
      mockBookingModel.findOne.mockResolvedValue({
        code: 'BK-1082',
        customerName: 'Rafiqul Islam',
      });
      mockHandoverModel.findOne.mockResolvedValue({
        handoverStatus: HandoverStatus.HANDED_OVER,
      });

      await expect(
        service.updateHandoverStatus('00000000-0000-0000-0000-000000000000', {
          handover_status: HandoverStatus.UNDER_CONSTRUCTION,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if transition to DLP Active has unresolved snags', async () => {
      mockBookingModel.findOne.mockResolvedValue({
        code: 'BK-1082',
        customerName: 'Rafiqul Islam',
      });
      mockHandoverModel.findOne.mockResolvedValue({
        handoverStatus: HandoverStatus.READY_FOR_SNAGGING,
        totalSnagsReported: 3,
        totalSnagsResolved: 1, // 2 open snags
      });

      await expect(
        service.updateHandoverStatus('00000000-0000-0000-0000-000000000000', {
          handover_status: HandoverStatus.DLP_ACTIVE,
          possession_date: '2026-11-05',
        }),
      ).rejects.toThrow('Cannot transition to DLP Active with 2 unresolved snags');
    });

    it('should throw BadRequestException if transition to DLP Active is missing possession_date', async () => {
      mockBookingModel.findOne.mockResolvedValue({
        code: 'BK-1082',
        customerName: 'Rafiqul Islam',
      });
      mockHandoverModel.findOne.mockResolvedValue({
        handoverStatus: HandoverStatus.READY_FOR_SNAGGING,
        totalSnagsReported: 0,
        totalSnagsResolved: 0,
      });

      await expect(
        service.updateHandoverStatus('00000000-0000-0000-0000-000000000000', {
          handover_status: HandoverStatus.DLP_ACTIVE,
        }),
      ).rejects.toThrow('possession_date is required when transitioning to DLP Active');
    });

    it('should successfully update handover status and calculate DLP expiry date', async () => {
      const mockHandoverInstance = {
        handoverStatus: HandoverStatus.READY_FOR_SNAGGING,
        totalSnagsReported: 2,
        totalSnagsResolved: 2,
        update: jest.fn().mockResolvedValue(true),
      };

      mockBookingModel.findOne.mockResolvedValue({
        code: 'BK-1082',
        customerName: 'Rafiqul Islam',
      });
      mockHandoverModel.findOne.mockResolvedValue(mockHandoverInstance);
      mockCustomerProfileModel.findOne.mockResolvedValue({ id: 10 });

      const result = await service.updateHandoverStatus(
        '00000000-0000-0000-0000-000000000000',
        {
          handover_status: HandoverStatus.DLP_ACTIVE,
          possession_date: '2026-11-05',
        },
        1,
      );

      expect(result.success).toBe(true);
      expect(mockHandoverInstance.update).toHaveBeenCalledWith(
        expect.objectContaining({
          handoverStatus: HandoverStatus.DLP_ACTIVE,
          possessionDate: '2026-11-05',
          dlpStartDate: '2026-11-05',
          dlpExpiryDate: '2028-11-04',
        }),
        expect.any(Object),
      );
    });

    it('should return aggregation stats from getStats', async () => {
      mockSequelize.query.mockResolvedValueOnce([
        {
          total_booked_units: 486,
          ready_for_snagging: 18,
          dlp_active: 142,
          handed_over: 210,
          under_construction: 116,
          total_portfolio_valuation: '4520000000',
          total_collected_amount: '3810000000',
          total_outstanding_due: '710000000',
        },
      ]);

      const res = await service.getStats();

      expect(res.success).toBe(true);
      expect(res.data.total_booked_units).toBe(486);
      expect(res.data.ready_for_snagging).toBe(18);
      expect(res.data.total_portfolio_valuation_formatted).toBe('৳ 452.00 Cr');
    });

    describe('Bug 2 & 3 Regression Tests', () => {
      it('BUG 2: getStats and findBookings should resolve numeric projectId and use text cast for sys_users to avoid varchar = bigint mismatch', async () => {
        mockProjectModel.findByPk = jest.fn().mockResolvedValue({ id: 4, uuid: 'f87a8b41-396a-4950-8b42-1e967a57fa78' });
        mockSequelize.query.mockResolvedValueOnce([
          {
            total_booked_units: 10,
            ready_for_snagging: 2,
            dlp_active: 3,
            handed_over: 5,
            under_construction: 0,
            total_portfolio_valuation: '1000000',
            total_collected_amount: '800000',
            total_outstanding_due: '200000',
          },
        ]);

        const res = await service.getStats('4', { orgId: 36, isSuperAdmin: false });

        expect(res.success).toBe(true);
        expect(mockProjectModel.findByPk).toHaveBeenCalledWith(4, expect.any(Object));
        expect(mockSequelize.query).toHaveBeenCalledWith(
          expect.stringContaining('SELECT id::text FROM sys_users WHERE org_id = :orgId'),
          expect.objectContaining({
            replacements: expect.objectContaining({
              projUuid: 'f87a8b41-396a-4950-8b42-1e967a57fa78',
              orgId: 36,
            }),
          }),
        );
      });

      it('BUG 3: getBooking360 queries saleAgreementModel with explicit attributes to prevent selecting non-existent project_id column', async () => {
        mockBookingModel.findOne.mockResolvedValue({
          id: 10,
          uuid: 'f7f5e05e-d2d7-4cb8-ac0d-f6239dfdceb9',
          code: 'BK-10',
          customerName: 'Arafat Hossain',
          projectId: 'f87a8b41-396a-4950-8b42-1e967a57fa78',
        });
        mockProjectModel.findOne = jest.fn().mockResolvedValue({ id: 4, uuid: 'f87a8b41-396a-4950-8b42-1e967a57fa78', name: 'Test Project' });
        mockFlatLandModel.findOne = jest.fn().mockResolvedValue({ uuid: 'flat-1', flatLandNo: 'A1' });
        mockHandoverModel.findOne.mockResolvedValue(null);
        mockCustomerProfileModel.findOne.mockResolvedValue(null);
        mockSaleAgreementModel.findOne.mockResolvedValue({
          id: 1,
          uuid: 'sa-1',
          agreement_number: 'SA-001',
          customer_name: 'Arafat Hossain',
        });

        const res = await service.getBooking360('f7f5e05e-d2d7-4cb8-ac0d-f6239dfdceb9');

        expect(res.success).toBe(true);
        expect(mockSaleAgreementModel.findOne).toHaveBeenCalledWith(
          expect.objectContaining({
            attributes: expect.arrayContaining([
              'id',
              'uuid',
              'agreement_number',
              'customer_name',
              'customer_phone',
              'property_type',
              'unit_identifier',
              'total_price',
              'status',
            ]),
          }),
        );
      });
    });
  });
});

