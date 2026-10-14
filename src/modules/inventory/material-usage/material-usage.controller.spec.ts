import { Test, TestingModule } from '@nestjs/testing';
import { MaterialUsageController } from './material-usage.controller';

describe('MaterialUsageController', () => {
  let controller: MaterialUsageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MaterialUsageController],
    }).compile();

    controller = module.get<MaterialUsageController>(MaterialUsageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
