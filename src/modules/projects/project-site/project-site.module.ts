import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Site } from 'src/database/models/projects/pr_site.model';
import { Project } from 'src/database/models/projects/pr_project_model';
import { ProjectSiteController } from './project-site.controller';
import { ProjectSiteService } from './project-site.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Site, Project]),
  ],
  controllers: [ProjectSiteController],
  providers: [ProjectSiteService],
  exports: [ProjectSiteService],
})
export class ProjectSiteModule {}
