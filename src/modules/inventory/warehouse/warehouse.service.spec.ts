import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { WarehouseService } from './warehouse.service';
import { InvWarehouse } from '../../../database/models/inventory/warehouse.model';

describe('WarehouseService', () => {
  let service: WarehouseService;
  const mockWarehouseModel = {
    create: jest.fn().mockImplementation((dto) => Promise.resolve({ id: 1, uuid: 'wh-123', ...dto })),
    findAll: jest.fn().mockResolvedValue([{ id: 1, uuid: 'wh-123', name: 'Central Warehouse' }]),
    findOne: jest.fn().mockImplementation(({ where }) => {
      if (where.id === 1 || where.uuid === 'wh-123') {
        return Promise.resolve({
          id: 1,
          uuid: 'wh-123',
          name: 'Central Warehouse',
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
        WarehouseService,
        {
          provide: getModelToken(InvWarehouse),
          useValue: mockWarehouseModel,
        },
      ],
    }).compile();

    service = module.get<WarehouseService>(WarehouseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create warehouse record', async () => {
    const dto = {
      code: 'WH-01',
      name: 'Central Warehouse',
      location: 'Dhaka',
    };
    const res = await service.create(dto as any);
    expect(res).toBeDefined();
    expect(res.name).toBe('Central Warehouse');
  });

  it('should find warehouse by id or uuid', async () => {
    const res = await service.findOne('1');
    expect(res).toBeDefined();
    expect(res.name).toBe('Central Warehouse');
  });
});
