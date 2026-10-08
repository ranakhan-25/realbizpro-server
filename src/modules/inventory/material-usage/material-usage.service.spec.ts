import { Test, TestingModule } from '@nestjs/testing';
import { MaterialUsageService } from './material-usage.service';

describe('MaterialUsageService', () => {
  let service: MaterialUsageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MaterialUsageService],
    }).compile();

    service = module.get<MaterialUsageService>(MaterialUsageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
