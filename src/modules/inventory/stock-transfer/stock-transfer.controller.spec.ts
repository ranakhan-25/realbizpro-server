import { Test, TestingModule } from '@nestjs/testing';
import { StockTransferController } from './stock-transfer.controller';
import { StockTransferService } from './stock-transfer.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';

describe('StockTransferController', () => {
  let controller: StockTransferController;
  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockTransferController],
      providers: [
        {
          provide: StockTransferService,
          useValue: mockService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(PermissionsGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<StockTransferController>(StockTransferController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
