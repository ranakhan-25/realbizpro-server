import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CustomerServiceChargeService } from './customer-service-charge.service';

describe('CustomerServiceChargeService Unit Tests', () => {
  let service: CustomerServiceChargeService;
  let mockRateModel: any;
  let mockFlatChargeModel: any;
  let mockIncomeModel: any;
  let mockExpenseModel: any;
  let mockParkingRentalModel: any;
  let mockSecurityCompanyModel: any;
  let mockProjectModel: any;
  let mockFlatLandModel: any;
  let mockFlatBookingModel: any;

  const mockUserTenantA = {
    id: 10,
    orgId: 1,
    isSuperUser: false,
  };

  const mockUserTenantB = {
    id: 20,
    orgId: 2,
    isSuperUser: false,
  };

  const projectTenantA = {
    id: 101,
    uuid: 'proj-tenant-a-uuid',
    name: 'Green Villa',
    organizationId: 1,
  };

  beforeEach(() => {
    mockRateModel = {
      findOne: jest.fn(),
      findByPk: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
    };

    mockFlatChargeModel = {
      findOne: jest.fn(),
      findByPk: jest.fn(),
      findAll: jest.fn(),
      findAndCountAll: jest.fn(),
      create: jest.fn(),
    };

    mockIncomeModel = {
      findOne: jest.fn(),
      findByPk: jest.fn(),
      findAll: jest.fn(),
      findAndCountAll: jest.fn(),
      create: jest.fn(),
    };

    mockExpenseModel = {
      findOne: jest.fn(),
      findByPk: jest.fn(),
      findAll: jest.fn(),
      findAndCountAll: jest.fn(),
      create: jest.fn(),
    };

    mockParkingRentalModel = {
      findAll: jest.fn(),
    };

    mockSecurityCompanyModel = {
      findAll: jest.fn(),
    };

    mockProjectModel = {
      findOne: jest.fn(),
      findAll: jest.fn(),
    };

    mockFlatLandModel = {
      findAll: jest.fn(),
    };

    mockFlatBookingModel = {
      findAll: jest.fn(),
    };

    service = new CustomerServiceChargeService(
      mockRateModel,
      mockFlatChargeModel,
      mockIncomeModel,
      mockExpenseModel,
      mockParkingRentalModel,
      mockSecurityCompanyModel,
      mockProjectModel,
      mockFlatLandModel,
      mockFlatBookingModel,
    );
  });

  describe('1. Summary Math Verification', () => {
    it('correctly calculates total gross income, expenses, and net surplus', async () => {
      // 10 flats: each billed 7,500 ৳ (total receivable 75,000 ৳), collected 60,000 ৳
      mockFlatChargeModel.findAll.mockResolvedValue([
        { totalAmount: 7500, paidAmount: 7500 },
        { totalAmount: 7500, paidAmount: 7500 },
        { totalAmount: 7500, paidAmount: 7500 },
        { totalAmount: 7500, paidAmount: 7500 },
        { totalAmount: 7500, paidAmount: 7500 },
        { totalAmount: 7500, paidAmount: 7500 },
        { totalAmount: 7500, paidAmount: 7500 },
        { totalAmount: 7500, paidAmount: 7500 },
        { totalAmount: 7500, paidAmount: 0 }, // due 7500
        { totalAmount: 7500, paidAmount: 0 }, // due 7500
      ]);

      // Extra direct incomes: Community hall (15,000 ৳) + Rooftop rent (25,000 ৳) = 40,000 ৳
      mockIncomeModel.findAll.mockResolvedValue([
        { incomeType: 'COMMUNITY_HALL', amount: 15000 },
        { incomeType: 'ROOFTOP_RENT', amount: 25000 },
      ]);

      // Direct expenses: Lift AMC (12,000 ৳) + Utilities (18,000 ৳) + Cleaning (10,000 ৳) = 40,000 ৳
      mockExpenseModel.findAll.mockResolvedValue([
        { expenseType: 'LIFT', amount: 12000 },
        { expenseType: 'UTILITIES', amount: 18000 },
        { expenseType: 'CLEANING', amount: 10000 },
      ]);

      // No cross-module items
      mockParkingRentalModel.findAll.mockResolvedValue([]);
      mockSecurityCompanyModel.findAll.mockResolvedValue([]);

      const result = await service.getMonthlySummary(
        mockUserTenantA,
        projectTenantA.uuid,
        '2026-11',
      );

      // Charges: receivable = 75,000, collected = 60,000, due = 15,000
      expect(result.service_charges.total_receivable).toBe(75000);
      expect(result.service_charges.collected).toBe(60000);
      expect(result.service_charges.due).toBe(15000);
      expect(result.service_charges.collection_rate_percent).toBe(80);

      // Extra Incomes: 40,000
      expect(result.extra_incomes.total).toBe(40000);
      expect(result.extra_incomes.breakdown.COMMUNITY_HALL).toBe(15000);
      expect(result.extra_incomes.breakdown.ROOFTOP_RENT).toBe(25000);

      // Total Gross Income = 60,000 + 40,000 = 100,000
      expect(result.summary.total_gross_income).toBe(100000);

      // Total Expenses = 40,000
      expect(result.summary.total_expenses).toBe(40000);

      // Net Balance = 100,000 - 40,000 = 60,000 (SURPLUS)
      expect(result.summary.net_balance).toBe(60000);
      expect(result.summary.financial_status).toBe('SURPLUS');
    });

    it('correctly reports DEFICIT when expenses exceed gross income', async () => {
      // Charges collected 10,000 ৳
      mockFlatChargeModel.findAll.mockResolvedValue([
        { totalAmount: 30000, paidAmount: 10000 },
      ]);
      mockIncomeModel.findAll.mockResolvedValue([]);
      mockExpenseModel.findAll.mockResolvedValue([
        { expenseType: 'LIFT', amount: 25000 },
      ]);
      mockParkingRentalModel.findAll.mockResolvedValue([]);
      mockSecurityCompanyModel.findAll.mockResolvedValue([]);

      const result = await service.getMonthlySummary(
        mockUserTenantA,
        projectTenantA.uuid,
        '2026-11',
      );

      expect(result.summary.total_gross_income).toBe(100000 ? 10000 : 10000);
      expect(result.summary.total_expenses).toBe(25000);
      expect(result.summary.net_balance).toBe(-15000);
      expect(result.summary.financial_status).toBe('DEFICIT');
    });
  });

  describe('2. Cross-Module Feeds (Parking & Security)', () => {
    it('automatically feeds parking external rentals and security company contract into monthly summary', async () => {
      // 0 direct service charges collected
      mockFlatChargeModel.findAll.mockResolvedValue([]);
      // 0 direct incomes
      mockIncomeModel.findAll.mockResolvedValue([]);
      // 0 direct expenses
      mockExpenseModel.findAll.mockResolvedValue([]);

      // Prompt 8 Cross Feed: 2 active parking rentals (3,000 ৳ paid + 2,500 ৳ paid = 5,500 ৳ collected)
      mockParkingRentalModel.findAll.mockResolvedValue([
        {
          id: 1,
          monthlyRent: 3000,
          paymentStatus: 'PAID',
        },
        {
          id: 2,
          monthlyRent: 2500,
          paymentStatus: 'PAID',
        },
      ]);

      // Prompt 7 Cross Feed: 1 security company contract with 35,000 ৳ monthly cost
      mockSecurityCompanyModel.findAll.mockResolvedValue([
        {
          id: 5,
          name: 'Elite Security Services',
          monthlyCost: 35000,
          status: 'ACTIVE',
        },
      ]);

      const result = await service.getMonthlySummary(
        mockUserTenantA,
        projectTenantA.uuid,
        '2026-11',
      );

      // Parking income cross fed: 5,500 ৳
      expect(result.cross_module_feeds.parking.active_external_rentals_count).toBe(2);
      expect(result.cross_module_feeds.parking.monthly_rent_collected).toBe(5500);
      expect(result.cross_module_feeds.parking.feed_included_in_income).toBe(true);
      expect(result.extra_incomes.breakdown.PARKING).toBe(5500);
      expect(result.summary.total_gross_income).toBe(5500);

      // Security cost cross fed: 35,000 ৳
      expect(result.cross_module_feeds.security.active_companies_count).toBe(1);
      expect(result.cross_module_feeds.security.contracted_monthly_cost).toBe(35000);
      expect(result.cross_module_feeds.security.feed_included_in_expense).toBe(true);
      expect(result.expenses.breakdown.SECURITY).toBe(35000);
      expect(result.summary.total_expenses).toBe(35000);

      // Net balance: 5,500 - 35,000 = -29,500 (DEFICIT)
      expect(result.summary.net_balance).toBe(-29500);
    });
  });

  describe('3. Tenant Isolation', () => {
    it('scopes flat charge collection to tenant organization', async () => {
      // Charge belongs to org 1; user is from org 2
      mockFlatChargeModel.findOne.mockResolvedValue(null);

      await expect(
        service.collectChargePayment(mockUserTenantB, 'charge-uuid-1', {
          paid_amount: 5000,
        }),
      ).rejects.toThrow(NotFoundException);

      expect(mockFlatChargeModel.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            uuid: 'charge-uuid-1',
            organizationId: 2,
          }),
        }),
      );
    });

    it('scopes listFlatCharges query to the current user orgId', async () => {
      mockFlatChargeModel.findAndCountAll.mockResolvedValue({
        count: 0,
        rows: [],
      });
      mockFlatChargeModel.findAll.mockResolvedValue([]);

      await service.listFlatCharges(mockUserTenantA, {
        project_id: projectTenantA.uuid,
      });

      expect(mockFlatChargeModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            organizationId: 1,
            projectId: projectTenantA.uuid,
          }),
        }),
      );
    });
  });
});

