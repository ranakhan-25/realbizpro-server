import { Module } from '@nestjs/common';
import { ProjectSiteService } from './project-site.service';
import { ProjectSiteController } from './project-site.controller';

@Module({
  controllers: [ProjectSiteController],
  providers: [ProjectSiteService],
})
export class ProjectSiteModule {}
