import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { SupplierService } from './supplier.service';
import { InvSupplier } from 'src/database/models/inventory/inv_supplier.model';
import { InvPurchase } from 'src/database/models/inventory/inv_purchase.model';

describe('SupplierService', () => {
  let service: SupplierService;
  const mockModel = {
    findOne: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockImplementation((dto) => Promise.resolve({ id: 1, ...dto })),
    findAll: jest.fn().mockResolvedValue([]),
    findAndCountAll: jest.fn().mockResolvedValue({ count: 0, rows: [] }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupplierService,
        {
          provide: getModelToken(InvSupplier),
          useValue: mockModel,
        },
        {
          provide: getModelToken(InvPurchase),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<SupplierService>(SupplierService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
