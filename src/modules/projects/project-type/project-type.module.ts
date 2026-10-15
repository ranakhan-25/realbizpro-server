import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProjectType } from 'src/database/models/projects/project-type/pr_project_type.model';
import { ProjectTypeController } from './project-type.controller';
import { ProjectTypeService } from './project-type.service';
import { ProjectShareAssignment } from 'src/database/models/projects/project-share-assignment/pr_project_share_assignment.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ProjectType,
      ProjectShareAssignment,
    ]),
  ],
  controllers: [ProjectTypeController],
  providers: [ProjectTypeService],
  exports: [ProjectTypeService],
})
export class ProjectTypeModule {}
