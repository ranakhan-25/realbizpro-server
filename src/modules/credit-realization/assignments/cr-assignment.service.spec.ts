import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { CrAssignmentService } from './cr-assignment.service';
import { CrOfficerAssignment } from '../../../database/models/credit-realization/cr_officer_assignment.model';
import { CrSaleAgreement } from '../../../database/models/credit-realization/cr_sale_agreement.model';
import { CrInstallmentPlan } from '../../../database/models/credit-realization/cr_installment_plan.model';
import { CrInstallmentPayment } from '../../../database/models/credit-realization/cr_installment_payment.model';

describe('CrAssignmentService', () => {
  let service: CrAssignmentService;

  const mockAssignmentModel = {
    create: jest.fn().mockImplementation((dto) => Promise.resolve({ id: 1, ...dto })),
    findAll: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue(null),
  };

  const mockAgreementModel = {
    findByPk: jest.fn().mockResolvedValue({ id: 1, org_id: 'org-test' }),
  };

  const mockPlanModel = {
    findAll: jest.fn().mockResolvedValue([]),
  };

  const mockPaymentModel = {
    findAll: jest.fn().mockResolvedValue([]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CrAssignmentService,
        {
          provide: getModelToken(CrOfficerAssignment),
          useValue: mockAssignmentModel,
        },
        {
          provide: getModelToken(CrSaleAgreement),
          useValue: mockAgreementModel,
        },
        {
          provide: getModelToken(CrInstallmentPlan),
          useValue: mockPlanModel,
        },
        {
          provide: getModelToken(CrInstallmentPayment),
          useValue: mockPaymentModel,
        },
      ],
    }).compile();

    service = module.get<CrAssignmentService>(CrAssignmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an officer assignment', async () => {
    const res = await service.create(
      {
        officer_id: 'OFF-1',
        officer_name: 'Test Officer',
        sale_agreement_id: 1,
        target_amount: 50000,
        due_date: '2026-12-31',
      },
      'org-test',
      'tester@realbiz.com'
    );
    expect(res).toBeDefined();
    expect(mockAssignmentModel.create).toHaveBeenCalled();
  });
});
