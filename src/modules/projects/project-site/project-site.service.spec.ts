import { Test, TestingModule } from '@nestjs/testing';
import { ProjectSiteService } from './project-site.service';

describe('ProjectSiteService', () => {
  let service: ProjectSiteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectSiteService],
    }).compile();

    service = module.get<ProjectSiteService>(ProjectSiteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
