import { Test, TestingModule } from '@nestjs/testing';
import { StockTransferController } from './stock-transfer.controller';
import { StockTransferService } from './stock-transfer.service';

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
    }).compile();

    controller = module.get<StockTransferController>(StockTransferController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
