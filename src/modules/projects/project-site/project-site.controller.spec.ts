import { Test, TestingModule } from '@nestjs/testing';
import { ProjectSiteController } from './project-site.controller';
import { ProjectSiteService } from './project-site.service';

describe('ProjectSiteController', () => {
  let controller: ProjectSiteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectSiteController],
      providers: [ProjectSiteService],
    }).compile();

    controller = module.get<ProjectSiteController>(ProjectSiteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
