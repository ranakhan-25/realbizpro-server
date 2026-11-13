import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { ReportsService } from './reports.service';
import { InvItem } from 'src/database/models/inventory/inv_item.model';

describe('ReportsService', () => {
  let service: ReportsService;

  const mockInvItemModel = {
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
        {
          provide: Sequelize,
          useValue: { query: jest.fn().mockResolvedValue([[]]) },
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
