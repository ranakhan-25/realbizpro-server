import { Test, TestingModule } from '@nestjs/testing';
import { MaterialUsageController } from './material-usage.controller';
import { MaterialUsageService } from './material-usage.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';

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
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(PermissionsGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<MaterialUsageController>(MaterialUsageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
