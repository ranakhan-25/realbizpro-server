import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { getModelToken } from '@nestjs/sequelize';
import { InvItem } from 'src/database/models/inventory/inv_item.model';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';

describe('ReportsController', () => {
  let controller: ReportsController;

  const mockReportService = {
    getStockReport: jest.fn().mockResolvedValue({ status: true, data: [] }),
    getMaterialComparison: jest.fn().mockResolvedValue({ status: true, data: [] }),
  };

  const mockInvItemModel = {
    // mock any needed methods
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [
        { provide: ReportsService, useValue: mockReportService },
        { provide: getModelToken(InvItem), useValue: mockInvItemModel },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(PermissionsGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ReportsController>(ReportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
