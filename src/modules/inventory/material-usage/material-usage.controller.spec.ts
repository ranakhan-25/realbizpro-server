import { Test, TestingModule } from '@nestjs/testing';
import { MaterialUsageController } from './material-usage.controller';
import { MaterialUsageService } from './material-usage.service';

describe('MaterialUsageController', () => {
  let controller: MaterialUsageController;
  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MaterialUsageController],
      providers: [
        {
          provide: MaterialUsageService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<MaterialUsageController>(MaterialUsageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
