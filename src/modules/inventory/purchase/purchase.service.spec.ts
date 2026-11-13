import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { PurchaseService } from './purchase.service';
import { InvPurchase } from 'src/database/models/inventory/inv_purchase.model';
import { InvPurchaseItem } from 'src/database/models/inventory/inv_purchase_item.model';
import { InvSupplier } from 'src/database/models/inventory/inv_supplier.model';
import { InvItem } from 'src/database/models/inventory/inv_item.model';

describe('PurchaseService', () => {
  let service: PurchaseService;
  const mockModel = {
    findOne: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockImplementation((dto) => Promise.resolve({ id: 1, ...dto })),
    findAll: jest.fn().mockResolvedValue([]),
    findAndCountAll: jest.fn().mockResolvedValue({ count: 0, rows: [] }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PurchaseService,
        { provide: getModelToken(InvPurchase), useValue: mockModel },
        { provide: getModelToken(InvPurchaseItem), useValue: mockModel },
        { provide: getModelToken(InvSupplier), useValue: mockModel },
        { provide: getModelToken(InvItem), useValue: mockModel },
        {
          provide: Sequelize,
          useValue: { transaction: jest.fn().mockResolvedValue({ commit: jest.fn(), rollback: jest.fn() }) },
        },
      ],
    }).compile();

    service = module.get<PurchaseService>(PurchaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
