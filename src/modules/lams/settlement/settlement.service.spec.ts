import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { SettlementService } from './settlement.service';
import { LamsSettlement } from '../../../database/models/lams/settlement.model';

describe('SettlementService', () => {
  let service: SettlementService;
  const mockModel = {
    create: jest.fn().mockImplementation((dto) => Promise.resolve({ id: 1, uuid: 'set-1', ...dto })),
    findAll: jest.fn().mockResolvedValue([{ id: 1, uuid: 'set-1', agreed_amount: 15000000 }]),
    findOne: jest.fn().mockImplementation(({ where }) => {
      if (where.uuid === 'set-1') {
        return Promise.resolve({
          id: 1,
          uuid: 'set-1',
          agreed_amount: 15000000,
          update: jest.fn().mockImplementation((dto) => Promise.resolve(dto)),
          destroy: jest.fn().mockResolvedValue(true),
        });
      }
      return Promise.resolve(null);
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SettlementService,
        {
          provide: getModelToken(LamsSettlement),
          useValue: mockModel,
        },
        {
          provide: getModelToken(require('../../../database/models/lams/settlement-payment.model').LamsSettlementPayment),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<SettlementService>(SettlementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create settlement record', async () => {
    const res = await service.create({
      org_id: 'org-001',
      lead_id: 'lead-01',
      agreed_amount: 15000000,
      advance_amount: 3000000,
      paid_amount: 3000000,
      due_amount: 12000000,
      payment_mode: 'bank_transfer',
      status: 'pending',
    });
    expect(res).toBeDefined();
    expect(res.agreed_amount).toBe(15000000);
  });
});
