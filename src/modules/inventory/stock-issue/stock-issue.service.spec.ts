import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { StockIssueService } from './stock-issue.service';
import { InvStockIssue } from '../../../database/models/inventory/stock-issue.model';

describe('StockIssueService', () => {
  let service: StockIssueService;
  const mockModel = {
    create: jest.fn().mockImplementation((dto) => Promise.resolve({ id: 1, uuid: 'iss-1', ...dto })),
    findAll: jest.fn().mockResolvedValue([{ id: 1, uuid: 'iss-1', quantity: 20 }]),
    findOne: jest.fn().mockImplementation(({ where }) => {
      if (where.id === 1 || where.uuid === 'iss-1') {
        return Promise.resolve({
          id: 1,
          uuid: 'iss-1',
          quantity: 20,
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
        StockIssueService,
        {
          provide: getModelToken(InvStockIssue),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<StockIssueService>(StockIssueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create stock issue record', async () => {
    const res = await service.create({
      issue_code: 'ISS-001',
      warehouse_id: 1,
      item_id: 'item-01',
      quantity: 20,
      issued_to: 'Foreman Rafiq',
    });
    expect(res).toBeDefined();
    expect(res.quantity).toBe(20);
  });
});
