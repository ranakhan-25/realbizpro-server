import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { getModelToken } from '@nestjs/sequelize';
import { InvItem } from 'src/database/models/inventory/inv_item.model';

describe('ReportsService', () => {
  let service: ReportsService;

  const mockInvItemModel = {
    // mock methods used in ReportsService if any
    findAll: jest.fn().mockResolvedValue([]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: getModelToken(InvItem),
          useValue: mockInvItemModel,
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
