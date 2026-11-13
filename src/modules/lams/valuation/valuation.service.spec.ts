import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { ValuationService } from './valuation.service';
import { LamsValuation } from '../../../database/models/lams/valuation.model';

describe('ValuationService', () => {
  let service: ValuationService;
  const mockValuationModel = {
    create: jest.fn().mockImplementation((dto) => Promise.resolve({ id: 1, uuid: 'v-123', ...dto })),
    findAll: jest.fn().mockResolvedValue([{ id: 1, uuid: 'v-123', total_value: 5000000 }]),
    findOne: jest.fn().mockImplementation(({ where }) => {
      if (where.uuid === 'v-123') {
        return Promise.resolve({
          id: 1,
          uuid: 'v-123',
          total_value: 5000000,
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
        ValuationService,
        {
          provide: getModelToken(LamsValuation),
          useValue: mockValuationModel,
        },
      ],
    }).compile();

    service = module.get<ValuationService>(ValuationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create valuation record', async () => {
    const dto = {
      lead_id: 'lead-001',
      market_rate: 100000,
      govt_rate: 70000,
      total_value: 1000000,
      method: 'comparative',
    };
    const res = await service.create(dto as any);
    expect(res).toBeDefined();
    expect(res.uuid).toBe('v-123');
  });

  it('should find all valuation records', async () => {
    const list = await service.findAll();
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThan(0);
  });
});
