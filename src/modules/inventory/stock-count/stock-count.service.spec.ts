import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { StockCountService } from './stock-count.service';
import { InvStockCount } from '../../../database/models/inventory/stock-count.model';

describe('StockCountService', () => {
  let service: StockCountService;
  const mockModel = {
    create: jest.fn().mockImplementation((dto) => Promise.resolve({ id: 1, uuid: 'sc-1', ...dto })),
    findAll: jest.fn().mockResolvedValue([{ id: 1, uuid: 'sc-1', status: 'draft' }]),
    findOne: jest.fn().mockImplementation(({ where }) => {
      if (where.id === 1 || where.uuid === 'sc-1') {
        return Promise.resolve({
          id: 1,
          uuid: 'sc-1',
          status: 'draft',
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
        StockCountService,
        {
          provide: getModelToken(InvStockCount),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<StockCountService>(StockCountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create stock count record', async () => {
    const res = await service.create({
      warehouse_id: 1,
      status: 'draft',
      note: 'Routine monthly check',
    });
    expect(res).toBeDefined();
    expect(res.status).toBe('draft');
  });
});
