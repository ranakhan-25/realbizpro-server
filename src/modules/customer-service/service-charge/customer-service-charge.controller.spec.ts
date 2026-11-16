import { Test, TestingModule } from '@nestjs/testing';
import { CustomerServiceChargeController } from './customer-service-charge.controller';
import { CustomerServiceChargeService } from './customer-service-charge.service';

describe('CustomerServiceChargeController Unit Tests', () => {
  let controller: CustomerServiceChargeController;
  let mockService: any;

  const mockUser = {
    id: 1,
    orgId: 1,
    isSuperUser: false,
  };

  beforeEach(async () => {
    mockService = {
      getProjectRate: jest.fn().mockResolvedValue({
        project_id: 'proj-1',
        rate_basis: 'PER_SQFT',
        rate_per_sqft: 5.0,
      }),
      upsertProjectRate: jest.fn().mockResolvedValue({
        project_id: 'proj-1',
        rate_basis: 'FIXED_PER_FLAT',
        fixed_rate_per_flat: 5000.0,
      }),
      generateMonthlyCharges: jest.fn().mockResolvedValue({
        message: 'Monthly charges processed for 2026-11',
        generated_count: 10,
      }),
      listFlatCharges: jest.fn().mockResolvedValue({
        items: [],
        meta: { total: 0, page: 1, limit: 25, total_pages: 0 },
        stats: { total_flats: 0, total_receivable: 0, total_collected: 0, total_due: 0 },
      }),
      createFlatCharge: jest.fn().mockResolvedValue({
        id: 1,
        flat_number: '5A',
        total_amount: 7500,
      }),
      collectChargePayment: jest.fn().mockResolvedValue({
        id: 1,
        paid_amount: 7500,
        payment_status: 'PAID',
      }),
      createBuildingIncome: jest.fn().mockResolvedValue({
        id: 1,
        income_type: 'COMMUNITY_HALL',
        amount: 15000,
      }),
      listBuildingIncomes: jest.fn().mockResolvedValue({
        items: [],
        meta: { total: 0, page: 1, limit: 25, total_pages: 0 },
        stats: { total_income: 0, by_category: {} },
      }),
      createBuildingExpense: jest.fn().mockResolvedValue({
        id: 1,
        expense_type: 'LIFT',
        amount: 12000,
      }),
      listBuildingExpenses: jest.fn().mockResolvedValue({
        items: [],
        meta: { total: 0, page: 1, limit: 25, total_pages: 0 },
        stats: { total_expense: 0, by_category: {} },
      }),
      getMonthlySummary: jest.fn().mockResolvedValue({
        project_id: 'proj-1',
        billing_month: '2026-11',
        summary: { total_gross_income: 100000, total_expenses: 40000, net_balance: 60000, financial_status: 'SURPLUS' },
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerServiceChargeController],
      providers: [
        {
          provide: CustomerServiceChargeService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<CustomerServiceChargeController>(
      CustomerServiceChargeController,
    );
  });

  it('getProjectRate calls service.getProjectRate with user and project_id', async () => {
    const res = await controller.getProjectRate(mockUser, 'proj-1');
    expect(res.project_id).toBe('proj-1');
    expect(mockService.getProjectRate).toHaveBeenCalledWith(mockUser, 'proj-1');
  });

  it('generateMonthlyCharges calls service.generateMonthlyCharges', async () => {
    const dto = { project_id: 'proj-1', billing_month: '2026-11' };
    const res = await controller.generateMonthlyCharges(mockUser, dto);
    expect(res.generated_count).toBe(10);
    expect(mockService.generateMonthlyCharges).toHaveBeenCalledWith(mockUser, dto);
  });

  it('collectChargePayment delegates to service.collectChargePayment', async () => {
    const dto = { paid_amount: 7500 };
    const res = await controller.collectChargePayment(mockUser, 'uuid-1', dto);
    expect(res.paid_amount).toBe(7500);
    expect(mockService.collectChargePayment).toHaveBeenCalledWith(mockUser, 'uuid-1', dto);
  });

  it('getMonthlySummary calls service.getMonthlySummary', async () => {
    const res = await controller.getMonthlySummary(mockUser, 'proj-1', '2026-11');
    expect(res.summary.financial_status).toBe('SURPLUS');
    expect(mockService.getMonthlySummary).toHaveBeenCalledWith(mockUser, 'proj-1', '2026-11');
  });
});

