import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { MaterialUsageService } from './material-usage.service';
import { InvMaterialUsage } from 'src/database/models/inventory/inv_material_usage.model';
import { InvMaterialUsageItem } from 'src/database/models/inventory/inv_material_usage_item.model';

describe('MaterialUsageService', () => {
  let service: MaterialUsageService;
  const mockModel = {
    findOne: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockImplementation((dto) => Promise.resolve({ id: 1, ...dto })),
    findAll: jest.fn().mockResolvedValue([]),
    findAndCountAll: jest.fn().mockResolvedValue({ count: 0, rows: [] }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MaterialUsageService,
        { provide: getModelToken(InvMaterialUsage), useValue: mockModel },
        { provide: getModelToken(InvMaterialUsageItem), useValue: mockModel },
        {
          provide: Sequelize,
          useValue: { transaction: jest.fn().mockResolvedValue({ commit: jest.fn(), rollback: jest.fn() }) },
        },
      ],
    }).compile();

    service = module.get<MaterialUsageService>(MaterialUsageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
