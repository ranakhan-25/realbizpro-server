import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { StockTransferService } from './stock-transfer.service';
import { InvStockTransfer } from 'src/database/models/inventory/inv_stock_transfer.model';
import { InvItem } from 'src/database/models/inventory/inv_item.model';

describe('StockTransferService', () => {
  let service: StockTransferService;
  const mockModel = {
    findOne: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockImplementation((dto) => Promise.resolve({ id: 1, ...dto })),
    findAll: jest.fn().mockResolvedValue([]),
    findAndCountAll: jest.fn().mockResolvedValue({ count: 0, rows: [] }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StockTransferService,
        { provide: getModelToken(InvStockTransfer), useValue: mockModel },
        { provide: getModelToken(InvItem), useValue: mockModel },
      ],
    }).compile();

    service = module.get<StockTransferService>(StockTransferService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
