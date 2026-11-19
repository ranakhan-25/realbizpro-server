import { NotFoundException } from '@nestjs/common';
import { CustomerServiceReportsService } from './customer-service-reports.service';

describe('CustomerServiceReportsService Unit Tests', () => {
  let service: CustomerServiceReportsService;
  let mockProjectModel: any;
  let mockBookingModel: any;
  let mockFlatLandModel: any;
  let mockSaleAgreementModel: any;
  let mockInstallmentPlanModel: any;
  let mockHandoverModel: any;
  let mockSnagModel: any;
  let mockDlpClaimModel: any;
  let mockAssociationModel: any;
  let mockServiceChargeModel: any;
  let mockTicketModel: any;
  let mockUtilityTicketModel: any;
  let mockNotificationModel: any;

  const mockUser = {
    id: 6,
    orgId: 1,
    isSuperUser: true,
    roles: ['super-admin'],
  };

  beforeEach(() => {
    mockProjectModel = {
      findAll: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockResolvedValue(null),
    };
    mockBookingModel = {
      findAll: jest.fn().mockResolvedValue([]),
    };
    mockFlatLandModel = {
      findAll: jest.fn().mockResolvedValue([]),
    };
    mockSaleAgreementModel = {
      findAll: jest.fn().mockResolvedValue([]),
    };
    mockInstallmentPlanModel = {
      findAll: jest.fn().mockResolvedValue([]),
    };
    mockHandoverModel = {
      findAll: jest.fn().mockResolvedValue([]),
    };
    mockSnagModel = {
      findAll: jest.fn().mockResolvedValue([]),
    };
    mockDlpClaimModel = {
      findAll: jest.fn().mockResolvedValue([]),
    };
    mockAssociationModel = {
      findOne: jest.fn().mockResolvedValue(null),
    };
    mockServiceChargeModel = {
      findAll: jest.fn().mockResolvedValue([]),
    };
    mockTicketModel = {
      findAll: jest.fn().mockResolvedValue([]),
    };
    mockUtilityTicketModel = {
      findAll: jest.fn().mockResolvedValue([]),
    };
    mockNotificationModel = {
      create: jest.fn().mockResolvedValue({ id: 1 }),
    };

    service = new CustomerServiceReportsService(
      mockProjectModel,
      mockBookingModel,
      mockFlatLandModel,
      mockSaleAgreementModel,
      mockInstallmentPlanModel,
      mockHandoverModel,
      mockSnagModel,
      mockDlpClaimModel,
      mockAssociationModel,
      mockServiceChargeModel,
      mockTicketModel,
      mockUtilityTicketModel,
      mockNotificationModel,
    );
  });

  describe('Collections & Dues Ageing Report', () => {
    it('should return collections ageing report with KPIs, tab counts, and items', async () => {
      const res = await service.getCollectionsAgeingReport({}, mockUser);

      expect(res.success).toBe(true);
      expect(res.kpis).toBeDefined();
      expect(res.kpis.total_overdue_receivables).toBeGreaterThan(0);
      expect(res.tab_counts).toBeDefined();
      expect(res.tab_counts.all).toBeGreaterThan(0);
      expect(Array.isArray(res.items)).toBe(true);
      expect(res.items.length).toBeGreaterThan(0);
      expect(res.items[0].customerName).toBeDefined();
      expect(res.items[0].ageingBracket).toBeDefined();
    });

    it('should filter collections ageing by critical bracket', async () => {
      const res = await service.getCollectionsAgeingReport(
        { bracket: 'critical' },
        mockUser,
      );

      expect(res.success).toBe(true);
      for (const item of res.items) {
        expect(item.ageingBracket).toBe('90+ Days Critical');
      }
    });

    it('should get collections ageing detail for valid record', async () => {
      const all = await service.getCollectionsAgeingReport({}, mockUser);
      const firstId = all.items[0].id;

      const detail = await service.getCollectionsAgeingDetail(firstId, mockUser);
      expect(detail.success).toBe(true);
      expect((detail as any).id).toBe(firstId);
      expect((detail as any).financial_exposure).toBeDefined();
    });

    it('should throw NotFoundException for invalid ageing record', async () => {
      await expect(
        service.getCollectionsAgeingDetail('NON-EXISTENT', mockUser),
      ).rejects.toThrow(NotFoundException);
    });

    it('should issue statutory notice and create notification', async () => {
      const all = await service.getCollectionsAgeingReport({}, mockUser);
      const firstId = all.items[0].id;

      const noticeRes = await service.issueCollectionsNotice(
        firstId,
        { notice_stage: '1st Reminder', remedy_period_days: 30 },
        mockUser,
      );

      expect(noticeRes.success).toBe(true);
      expect((noticeRes as any).notice_reference).toBeDefined();
      expect(mockNotificationModel.create).toHaveBeenCalled();
    });
  });

  describe('Handover & Property Care Report', () => {
    it('should return handover report with KPIs and projects', async () => {
      const res = await service.getHandoverPropertyCareReport({}, mockUser);

      expect(res.success).toBe(true);
      expect(res.kpis).toBeDefined();
      expect(res.kpis.total_handed_over_units).toBeGreaterThan(0);
      expect(res.tab_counts).toBeDefined();
      expect(Array.isArray(res.items)).toBe(true);
      expect(res.items.length).toBeGreaterThan(0);
      expect(res.items[0].projectName).toBeDefined();
      expect(res.items[0].associationStatus).toBeDefined();
    });

    it('should get project handover detail by ID', async () => {
      const all = await service.getHandoverPropertyCareReport({}, mockUser);
      const firstId = all.items[0].id;

      const detail = await service.getHandoverPropertyCareDetail(firstId, mockUser);
      expect(detail.success).toBe(true);
      expect((detail as any).projectName).toBeDefined();
      expect((detail as any).statutory_mandate).toBeDefined();
    });
  });

  describe('Service Ticket & SLA Performance Report', () => {
    it('should return SLA report with adherence metrics', async () => {
      const res = await service.getServiceTicketSlaReport({}, mockUser);

      expect(res.success).toBe(true);
      expect(res.kpis).toBeDefined();
      expect(res.kpis.overall_sla_adherence_pct).toBeGreaterThan(0);
      expect(res.tab_counts).toBeDefined();
      expect(Array.isArray(res.items)).toBe(true);
      expect(res.items.length).toBeGreaterThan(0);
      expect(res.items[0].ticketNo).toBeDefined();
      expect(res.items[0].slaStatus).toBeDefined();
    });

    it('should get ticket SLA audit detail by ticketNo', async () => {
      const all = await service.getServiceTicketSlaReport({}, mockUser);
      const firstTicketNo = all.items[0].ticketNo;

      const detail = await service.getServiceTicketSlaDetail(firstTicketNo, mockUser);
      expect(detail.success).toBe(true);
      expect((detail as any).ticketNo).toBe(firstTicketNo);
      expect((detail as any).turnaround_metrics).toBeDefined();
    });
  });

  describe('Executive Summary', () => {
    it('should return cross-domain executive report summary', async () => {
      const res = await service.getReportExecutiveSummary({}, mockUser);

      expect(res.success).toBe(true);
      expect((res as any).collections).toBeDefined();
      expect((res as any).handover_property_care).toBeDefined();
      expect((res as any).ticket_sla).toBeDefined();
      expect(Array.isArray((res as any).critical_action_items)).toBe(true);
      expect((res as any).critical_action_items.length).toBeGreaterThan(0);
    });
  });
});
