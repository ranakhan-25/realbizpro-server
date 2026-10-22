import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Site } from 'src/database/models/projects/project-site/pr_project_site.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { ProjectSiteController } from './project-site.controller';
import { ProjectSiteService } from './project-site.service';
import { ProjectShareAssignment } from 'src/database/models/projects/project-share-assignment/pr_project_share_assignment.model';
import { WorkOrder } from 'src/database/models/projects/billing/work-order/pr_work_order.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Site,
      Project,
      ProjectShareAssignment,
      WorkOrder,
    ]),
  ],
  controllers: [ProjectSiteController],
  providers: [ProjectSiteService],
  exports: [ProjectSiteService],
})
export class ProjectSiteModule {}
